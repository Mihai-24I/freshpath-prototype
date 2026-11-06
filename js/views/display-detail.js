import { getAll, displayStatus } from '../data.js';
import { STATUS } from '../status.js';
import { esc } from '../util.js';

const time = (iso) => new Date(iso).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });

// "09:15" for today's refills, "Mon 26 Oct, 18:20" for earlier ones. Today = the store's last sync day.
function formatRefill(iso, todayIso) {
  if (iso.slice(0, 10) === todayIso.slice(0, 10)) return time(iso);
  const day = new Date(iso).toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short' });
  return `${day}, ${time(iso)}`;
}

export async function render(el, params) {
  const [displays, products, [store]] = await Promise.all([getAll('displays'), getAll('products'), getAll('store')]);
  const d = displays.find((x) => x.id === params.id);
  if (!d) {
    location.replace('#/');
    return;
  }
  const product = products.find((p) => p.id === d.productId);
  const status = displayStatus(d);
  const s = STATUS[status];
  const percent = Math.round((d.onDisplay / d.capacity) * 100);
  const type = d.type === 'gondola' ? 'gondola' : 'promo table';

  el.innerHTML = `<div class="view">
    <a class="button transparent small-round go-back" href="#/overview/${esc(d.id)}"><i aria-hidden="true">arrow_back</i><span>Back to overview</span></a>
    <div>
      <span class="small-text upper">Display ${esc(d.label)} · ${esc(type)}</span>
      <h1 class="h5 small tight">${esc(product.name)}</h1>
      ${d.promo ? `<p class="promo-line"><span class="chip no-round tertiary-container"><i aria-hidden="true">sell</i><span>Promo: ${esc(d.promo)}</span></span></p>` : ''}
    </div>
    <article class="no-elevate small-round stack">
      <div class="row">
        <div class="max"><h2 class="h6 small tight">Stock</h2></div>
        <span class="chip no-round ${s.fill}"><i aria-hidden="true">${s.icon}</i><span>${s.word} · ${percent}%</span></span>
      </div>
      <progress class="large ${s.bar}" value="${d.onDisplay}" max="${d.capacity}" aria-label="${esc(`${percent}% full, ${d.onDisplay} of ${d.capacity} on display`)}"></progress>
      <dl class="facts">
        <div><dt class="small-text upper">On display</dt><dd>${d.onDisplay} ${esc(product.unit)}</dd></div>
        <div><dt class="small-text upper">In storage</dt><dd>${product.storageQty} ${esc(product.unit)}<br><span class="small-text">${esc(product.storageLocation)}</span></dd></div>
        <div><dt class="small-text upper">Capacity</dt><dd>${d.capacity} ${esc(product.unit)}</dd></div>
      </dl>
    </article>
    <article class="no-elevate small-round stack">
      <h2 class="h6 small tight">Today</h2>
      <dl class="facts two">
        <div><dt class="small-text upper">Expected sales</dt><dd>${d.expectedSales} ${esc(product.unit)} <span class="small-text">rest of today</span></dd></div>
        <div><dt class="small-text upper">Last refill</dt><dd>${esc(formatRefill(d.lastRefill.time, store.lastSync))}<br><span class="small-text">${esc(d.lastRefill.by)}</span></dd></div>
      </dl>
      ${d.note ? `<p class="tight"><i aria-hidden="true">info</i> ${esc(d.note)}</p>` : ''}
    </article>
    ${status !== 'ok' ? `<a class="button small-round" href="#/displays/${esc(d.id)}/problem">Find alternatives</a>` : ''}
    </div>`;
}
