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
