import { getAll, displaySuggestions } from '../data.js';
import { esc, formatTime } from '../util.js';
import { state } from '../app.js';

let root = null;
let onClick = null;

const SORTS = [
  { id: 'sellby', label: 'Sell by' },
  { id: 'quantity', label: 'Quantity' },
  { id: 'promo', label: 'Promo' },
];

// Sell today (1 day or less) in error colours, 2 days in the accent colour, longer plain. Never colour alone.
function tagHtml(days) {
  if (days <= 1) return '<span class="chip no-round error-container"><i aria-hidden="true">cancel</i><span>Sell today</span></span>';
  if (days === 2) return '<span class="chip no-round tertiary"><i aria-hidden="true">warning</i><span>Sell within 2 days</span></span>';
  return `<span class="chip no-round border"><i aria-hidden="true">schedule</i><span>Sell within ${days} days</span></span>`;
}

function sorted(products, sort, suggestions) {
  const bySellBy = (a, b) => a.sellWithinDays - b.sellWithinDays || a.name.localeCompare(b.name);
  const fitsPromo = (p) => (suggestions.get(p.id)?.promoFit ? 0 : 1);
  const compare = {
    sellby: bySellBy,
    quantity: (a, b) => b.storageQty - a.storageQty || bySellBy(a, b),
    promo: (a, b) => fitsPromo(a) - fitsPromo(b) || bySellBy(a, b),
  }[sort];
  return [...products].sort(compare);
}

function cardHtml(p, suggestion) {
  return `<article class="no-elevate small-round stack">
    <a class="card-link product-link" href="#/storage/${esc(p.id)}" aria-label="${esc(`${p.name}, ${p.storageQty} ${p.unit} in storage. Correct stock`)}">
      <div class="row">
        <div class="max">
          <h2 class="h6 small tight">${esc(p.name)}</h2>
          <p class="small-text tight">${p.storageQty} ${esc(p.unit)} · ${esc(p.storageLocation)}</p>
        </div>
        <i aria-hidden="true">chevron_right</i>
      </div>
    </a>
    <div class="chip-row tag-row">${tagHtml(p.sellWithinDays)}</div>
    ${suggestion ? `<button type="button" class="border small-round" data-suggest="${esc(p.id)}"><i aria-hidden="true">swap_horiz</i><span>Suggest display</span></button>` : ''}
  </article>`;
}

export async function render(el) {
  root = el;
  const [products, [store], suggestions] = await Promise.all([getAll('products'), getAll('store'), displaySuggestions()]);
  const inStorage = products.filter((p) => p.storageQty > 0);
  let sort = 'sellby';

  el.innerHTML = `<div class="view">
    <div>
      <h1 class="h5 small tight">Storage</h1>
      <p class="small-text tight">Updated ${esc(formatTime(store.lastSync))}</p>
    </div>
    <div class="chip-row sort-row" role="group" aria-label="Sort storage by">
      ${SORTS.map((s) => `<button type="button" class="chip small-round border" data-sort="${s.id}" aria-pressed="false">${s.label}</button>`).join('')}
    </div>
    <div class="stack" id="storage-list" aria-live="polite"></div>
  </div>`;

  const list = el.querySelector('#storage-list');
  function draw() {
    el.querySelectorAll('[data-sort]').forEach((c) => {
      const active = c.dataset.sort === sort;
      c.classList.toggle('fill', active);
      c.setAttribute('aria-pressed', String(active));
    });
    list.innerHTML = inStorage.length
      ? sorted(inStorage, sort, suggestions).map((p) => cardHtml(p, suggestions.get(p.id))).join('')
      : '<p class="tight"><i aria-hidden="true">info</i> Nothing in storage.</p>';
  }
  draw();

  onClick = (event) => {
    const chip = event.target.closest('[data-sort]');
    if (chip) {
      sort = chip.dataset.sort;
      draw();
      return;
    }
    const suggest = event.target.closest('[data-suggest]');
    if (!suggest) return;
    const target = suggestions.get(suggest.dataset.suggest);
    state.suggest = { displayId: target.displayId, productId: suggest.dataset.suggest };
    location.hash = `#/overview/${target.displayId}`;
  };
  el.addEventListener('click', onClick);
}

export function destroy() {
  root?.removeEventListener('click', onClick);
  root = null;
}
