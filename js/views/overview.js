import { getAll, displayStatus } from '../data.js';
import { STATUS, STATUS_ORDER } from '../status.js';
import { esc } from '../util.js';
import { state } from '../app.js';
import '../components/app-store-map.js';

let root = null;
let onClick = null;
let onSelect = null;

const unitLabel = (unit) => (unit === 'pcs' ? 'pcs' : `${unit}s`);

function cardHtml(d, hint) {
  const s = STATUS[d.status];
  const needsRefill = d.status !== 'ok';
  const stock = `${d.onDisplay} of ${d.capacity} ${unitLabel(d.unit)} on display`;
  return `
    <div class="row">
      <div class="max">
        <span class="small-text upper">Display ${esc(d.label)}</span>
        <h2 class="h6 small tight">${esc(d.productName)}</h2>
      </div>
      <span class="chip no-round ${s.fill}"><i aria-hidden="true">${s.icon}</i><span>${s.word}</span></span>
    </div>
    <progress class="large ${s.bar}" value="${d.onDisplay}" max="${d.capacity}" aria-label="${esc(stock)}"></progress>
    <div class="row stock-row">
      <p class="tight max">${esc(stock)}</p>
      <a class="button transparent small-round" href="#/displays/${esc(d.id)}"><span>Open details</span><i aria-hidden="true">chevron_right</i></a>
    </div>
    ${d.promo ? `<p class="small-text tight">Promo: ${esc(d.promo)}</p>` : ''}
    ${hint ? `<p class="tight"><i aria-hidden="true">warehouse</i> ${esc(hint)}</p>` : ''}
    ${needsRefill
      ? `<nav class="tiny-space">
          <a class="button border small-round max" href="#/displays/${esc(d.id)}/change"><i aria-hidden="true">swap_horiz</i><span>Change product</span></a>
          <a class="button small-round max" href="#/displays/${esc(d.id)}/problem">Find alternatives</a>
        </nav>`
      : ''}`;
}

export async function render(el, params) {
  root = el;
  const [displays, products, [store]] = await Promise.all([getAll('displays'), getAll('products'), getAll('store')]);
  const productById = new Map(products.map((p) => [p.id, p]));
  const models = displays.map((d) => {
    const product = productById.get(d.productId);
    const status = displayStatus(d);
    return {
      ...d,
      status,
      unit: product.unit,
      productName: product.name,
      ariaLabel: `Display ${d.label}, ${product.shortName}, ${STATUS[status].word}, ${d.onDisplay} of ${d.capacity}`,
    };
  });
  const counts = Object.fromEntries(STATUS_ORDER.map((key) => [key, models.filter((d) => d.status === key).length]));
  const updated = new Date(store.lastSync).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });

  let selectedId = models.some((d) => d.id === params.displayId) ? params.displayId : null;
  let filter = null;

  el.innerHTML = `
    <h1 class="h5 small">Overview</h1>
    <p class="small-text tight">Updated ${esc(updated)}</p>
    <app-store-map></app-store-map>
    <div class="chip-row" role="group" aria-label="Filter displays by status">
      ${STATUS_ORDER.map(
        (key) => `<button type="button" class="chip small-round border" data-status="${key}" aria-pressed="false"${counts[key] ? '' : ' disabled'}>
          <i aria-hidden="true">${STATUS[key].icon}</i><span>${counts[key]} ${STATUS[key].word}</span></button>`,
      ).join('')}
    </div>
    ${counts.low + counts.empty === 0 ? '<article class="no-elevate small-round secondary-container"><p class="tight"><i aria-hidden="true">check_circle</i> All displays are full. Nice work.</p></article>' : ''}
    <article class="no-elevate small-round stack" id="display-card" aria-live="polite"></article>`;

  const map = el.querySelector('app-store-map');
  const card = el.querySelector('#display-card');
  map.displays = models;

  // "Suggest display" from Storage: say which product from storage fits the display it opened.
  const hintFor = (d) => {
    const s = state.suggest;
    if (!s || s.displayId !== d.id) return '';
    const name = productById.get(s.productId)?.shortName;
    return name ? `${name} from storage fit here` : '';
  };
  const showCard = () => {
    const d = models.find((m) => m.id === selectedId);
    card.innerHTML = d ? cardHtml(d, hintFor(d)) : '<p class="tight">Tap a display to see its stock.</p>';
  };
  const select = (id) => {
    if (state.suggest?.displayId !== id) state.suggest = null;
    selectedId = id;
    map.selected = id;
    showCard();
  };
  map.selected = selectedId;
  showCard();

  onSelect = (event) => select(event.detail.id);
  onClick = (event) => {
    const chip = event.target.closest('.chip-row [data-status]');
    if (!chip) return;
    filter = filter === chip.dataset.status ? null : chip.dataset.status;
    map.filter = filter;
    el.querySelectorAll('.chip-row [data-status]').forEach((c) => {
      const active = c.dataset.status === filter;
      c.classList.toggle('fill', active);
      c.setAttribute('aria-pressed', String(active));
    });
  };
  el.addEventListener('display-select', onSelect);
  el.addEventListener('click', onClick);
}

export function destroy() {
  root?.removeEventListener('display-select', onSelect);
  root?.removeEventListener('click', onClick);
  root = null;
  state.suggest = null;
}
