// Placeholder for screen 8 (built in plan.md step 8, "Amount and Placement"): shows what the
// previous screens passed on, so the hand-over from Own choice can be checked.
import { getAll } from '../data.js';
import { esc } from '../util.js';
import { state } from '../app.js';

export async function render(el) {
  const refill = state.refill;
  const [displays, products, substitutes] = await Promise.all([getAll('displays'), getAll('products'), getAll('substitutes')]);
  const d = displays.find((x) => x.id === refill?.displayId);
  const productId = refill?.own?.productId ?? substitutes.find((s) => s.id === refill?.substituteId)?.productId;
  const product = products.find((p) => p.id === productId);
  if (!d || !product) {
    location.replace(d ? `#/overview/${d.id}` : '#/');
    return;
  }
  const reason = refill.own?.reason?.trim();

  el.innerHTML = `<div class="view">
    <a class="button transparent small-round go-back" href="#/displays/${esc(d.id)}/alternatives"><i aria-hidden="true">arrow_back</i><span>Back</span></a>
    <h1 class="h5 small tight">Amount</h1>
    <p class="tight">${esc(product.shortName)} → display ${esc(d.label)}</p>
    ${reason ? `<p class="small-text tight">My reason: ${esc(reason)}</p>` : ''}
    <p class="small-text tight">Placeholder: the amount and placement screens come in the next build steps.</p>
  </div>`;
}
