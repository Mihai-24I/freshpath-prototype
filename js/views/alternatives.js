import { getAll, create, remove, availableSubstitutes } from '../data.js';
import { esc } from '../util.js';
import { state } from '../app.js';
import { showSnackbar } from '../snackbar.js';

let root = null;
let onClick = null;

// Risks shown as tags (waste, promo, cooling) are left out of the reason lines to avoid saying them twice.
const TAGGED = new Set(['waste-risk', 'promo-rules', 'cooling']);

function reasonLines(s) {
  const good = s.reasonText.map((text) => ({ icon: 'check_circle', text }));
  const risks = s.factors.filter((f) => f.rating === 'risk' && !TAGGED.has(f.reasonId)).map((f) => ({ icon: 'warning', text: f.text }));
  return [...good, ...risks].slice(0, 3);
}

function tagsHtml(s) {
  const tags = [];
  if (s.wasteRisk) tags.push(s.wasteRisk.note);
  if (s.tags.includes('cooling')) tags.push('Needs cooling');
  if (s.tags.includes('promo')) tags.push('Not in promo');
  return tags
    .map((t) => `<span class="chip no-round tertiary"><i aria-hidden="true">warning</i><span>${esc(t)}</span></span>`)
    .join('');
}

function cardHtml(s, index, displayId) {
  const tags = tagsHtml(s);
  return `
    <a class="card-link" href="#/displays/${esc(displayId)}/alternatives/${esc(s.id)}">
      <article class="no-elevate small-round stack">
        <div class="row">
          <h2 class="h6 small tight max">${esc(s.product.name)}</h2>
          ${index === 0 ? '<span class="chip no-round secondary-container"><span>Best match</span></span>' : ''}
        </div>
        <ul class="list-plain reasons">
          ${reasonLines(s)
            .map((l) => `<li><i aria-hidden="true">${l.icon}</i><span>${esc(l.text)}</span></li>`)
            .join('')}
        </ul>
        ${tags ? `<div class="chip-row tag-row">${tags}</div>` : ''}
        <p class="small-text tight">${s.product.storageQty} in storage · place ${s.amount} ${esc(s.product.unit)}</p>
      </article>
    </a>`;
}

export async function render(el, params, user) {
  root = el;
  const [displays, products, [store]] = await Promise.all([getAll('displays'), getAll('products'), getAll('store')]);
  const d = displays.find((x) => x.id === params.id);
  if (!d) {
    location.replace('#/');
    return;
  }
  if (state.refill?.displayId !== d.id) state.refill = { displayId: d.id, problemId: null, note: '' };
  const product = products.find((p) => p.id === d.productId);
  const list = await availableSubstitutes(d.id);
  const room = d.capacity - d.onDisplay;

  const own = `<a class="button border small-round" href="#/displays/${esc(d.id)}/own">Choose my own product</a>`;
  const body = list.length
    ? `<p class="small-text tight">Ranked for this afternoon · room for ${room} ${esc(product.unit)}</p>
       ${list.map((s, i) => cardHtml(s, i, d.id)).join('')}
       ${own}`
    : `<article class="no-elevate small-round stack">
         <p class="tight"><i aria-hidden="true">warehouse</i> No substitute in stock right now.</p>
         <p class="small-text tight">Display ${esc(d.label)} stays ${d.onDisplay === 0 ? 'Empty' : 'Low'} until a delivery arrives or your manager decides.</p>
       </article>
       <button type="button" class="small-round" data-action="report">Report to manager</button>
       ${own}`;

  el.innerHTML = `<div class="view">
    <a class="button transparent small-round go-back" href="#/displays/${esc(d.id)}/problem"><i aria-hidden="true">arrow_back</i><span>Back</span></a>
    <h1 class="h5 small">Alternatives for ${esc(d.label)}</h1>
    ${body}
  </div>`;

  onClick = async (event) => {
    if (!event.target.closest('[data-action="report"]')) return;
    const existing = (await getAll('tasks')).find((t) => t.type === 'report' && t.displayId === d.id && t.status === 'open');
    const task =
      existing ??
      (await create('tasks', {
        userId: 'u2',
        type: 'report',
        displayId: d.id,
        title: `Display ${d.label} needs a decision`,
        detail: `${product.shortName} ${d.onDisplay === 0 ? 'is empty' : 'is low'} and no substitute is in stock. Reported by ${user.name}.`,
        status: 'open',
        due: null,
        createdBy: user.id,
        kind: 'task',
        date: store.lastSync.slice(0, 10),
      }));
    location.hash = `#/overview/${d.id}`;
    showSnackbar('Reported to manager', {
      action: existing ? undefined : 'Undo',
      onAction: () => remove('tasks', task.id),
    });
  };
  el.addEventListener('click', onClick);
}

export function destroy() {
  root?.removeEventListener('click', onClick);
  root = null;
}
