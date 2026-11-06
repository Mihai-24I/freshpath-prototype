// The only data access point. Seed = data/<collection>.json (read-only);
// the first write copies a collection into localStorage (`app:<collection>`),
// which is then the source of truth for it. Reads never write.
const PREFIX = 'app:';
const seedCache = new Map();

async function seed(collection) {
  if (!seedCache.has(collection)) {
    const url = new URL(`../data/${collection}.json`, import.meta.url);
    const res = await fetch(url);
    if (!res.ok) throw new Error(`Cannot load data/${collection}.json (${res.status})`);
    seedCache.set(collection, await res.json());
  }
  return seedCache.get(collection);
}

async function load(collection) {
  const stored = localStorage.getItem(PREFIX + collection);
  const items = stored ? JSON.parse(stored) : await seed(collection);
  return structuredClone(items);
}

function save(collection, items) {
  localStorage.setItem(PREFIX + collection, JSON.stringify(items));
}

export async function getAll(collection) {
  return load(collection);
}

export async function get(collection, id) {
  return (await load(collection)).find((item) => item.id === id);
}

export async function create(collection, item) {
  const items = await load(collection);
  const created = { ...item, id: item.id ?? crypto.randomUUID() };
  items.push(created);
  save(collection, items);
  return created;
}

export async function update(collection, id, changes) {
  const items = await load(collection);
  const index = items.findIndex((item) => item.id === id);
  if (index === -1) return undefined;
  items[index] = { ...items[index], ...changes };
  save(collection, items);
  return items[index];
}

export async function remove(collection, id) {
  const items = await load(collection);
  const next = items.filter((item) => item.id !== id);
  save(collection, next);
  return next.length !== items.length;
}

// Status rules (DESIGN 7.3): Empty = nothing left, Low = at most 25% of capacity.
export function displayStatus({ onDisplay, capacity }) {
  if (onDisplay <= 0) return 'empty';
  return onDisplay <= capacity * 0.25 ? 'low' : 'ok';
}

// A substitute is available only when its product's storageQty >= the suggested amount (DESIGN 7.3).
// Returns the display's available substitutes by rank, each with its `product`.
export async function availableSubstitutes(displayId) {
  const [displays, products, substitutes] = await Promise.all([getAll('displays'), getAll('products'), getAll('substitutes')]);
  const display = displays.find((d) => d.id === displayId);
  if (!display) return [];
  const productById = new Map(products.map((p) => [p.id, p]));
  return substitutes
    .filter((s) => s.forProductId === display.productId)
    .map((s) => ({ ...s, product: productById.get(s.productId) }))
    .filter((s) => s.product && s.product.storageQty >= s.amount)
    .sort((a, b) => a.rank - b.rank);
}

// "Suggest display" match: a product fits a Low/Empty display when it is an available substitute there.
// Returns Map(productId -> { displayId, label, promoFit }) with the display where the product ranks best
// (ties: the emptier display); promoFit = it fits at least one display that has a promo.
export async function displaySuggestions() {
  const displays = await getAll('displays');
  const best = new Map();
  for (const d of displays.filter((x) => displayStatus(x) !== 'ok')) {
    for (const s of await availableSubstitutes(d.id)) {
      const cur = best.get(s.productId);
      const better = !cur || s.rank < cur.rank || (s.rank === cur.rank && d.onDisplay < cur.onDisplay);
      const promoFit = Boolean(cur?.promoFit || d.promo);
      if (better) best.set(s.productId, { displayId: d.id, label: d.label, rank: s.rank, onDisplay: d.onDisplay, promoFit });
      else cur.promoFit = promoFit;
    }
  }
  return best;
}

// Confirming a refill (DESIGN 7.3): the display gets the new product and `amount` more on display (up to capacity),
// the product's storage goes down, the display's open refill tasks are done and the decision is saved for My decisions.
// Returns what undoRefill needs to put everything back.
export async function confirmRefill({ displayId, productId, amount, userId, problemId, note, reasonIds, ownChoice, ownReason, photo }) {
  const [displays, products, tasks, [store]] = await Promise.all([getAll('displays'), getAll('products'), getAll('tasks'), getAll('store')]);
  const display = displays.find((d) => d.id === displayId);
  const product = products.find((p) => p.id === productId);
  const placed = Math.max(0, Math.min(amount, display.capacity - display.onDisplay, product.storageQty));
  const before = { productId: display.productId, onDisplay: display.onDisplay };

  await update('displays', display.id, { productId: product.id, onDisplay: display.onDisplay + placed });
  await update('products', product.id, { storageQty: product.storageQty - placed });
  const taskIds = tasks.filter((t) => t.type === 'refill' && t.displayId === displayId && t.status === 'open').map((t) => t.id);
  for (const id of taskIds) await update('tasks', id, { status: 'done' });

  // Demo time: the store's day, at the real clock time but never before the last sync.
  const clock = new Date().toTimeString().slice(0, 8);
  const syncClock = store.lastSync.slice(11, 19);
  const decision = await create('decisions', {
    userId,
    displayId,
    fromProductId: before.productId,
    toProductId: product.id,
    amount: placed,
    problemId: problemId ?? null,
    note: note || null,
    reasonIds: reasonIds ?? [],
    ownChoice: Boolean(ownChoice),
    ownReason: ownReason || null,
    photo: Boolean(photo),
    createdAt: `${store.lastSync.slice(0, 10)}T${clock > syncClock ? clock : syncClock}`,
    feedback: null,
  });
  return { displayId, before, productId, storageBefore: product.storageQty, taskIds, decisionId: decision.id };
}

export async function undoRefill(undo) {
  await update('displays', undo.displayId, undo.before);
  await update('products', undo.productId, { storageQty: undo.storageBefore });
  for (const id of undo.taskIds) await update('tasks', id, { status: 'open' });
  await remove('decisions', undo.decisionId);
}

// Session = plain user id under `app:session` (AGENTS.md). Only auth.js uses these.
export const getSession = () => localStorage.getItem(PREFIX + 'session');
export const setSession = (userId) => localStorage.setItem(PREFIX + 'session', userId);
export const clearSession = () => localStorage.removeItem(PREFIX + 'session');

// Back to seed state: clears every `app:*` key except the session, so the
// demo user stays logged in after "Reset demo data".
export function reset() {
  Object.keys(localStorage)
    .filter((key) => key.startsWith(PREFIX) && key !== PREFIX + 'session')
    .forEach((key) => localStorage.removeItem(key));
}
