// Placeholder for screen 10 (built in plan.md step 9, "Confirm, snackbar, undo"): shows what the
// Amount and Placement screens passed on. Nothing is saved yet.
import { loadRefill } from '../refill.js';
import { esc } from '../util.js';
import { state } from '../app.js';

export async function render(el) {
  const r = await loadRefill();
  if (!r) {
    location.replace(state.refill?.displayId ? `#/overview/${state.refill.displayId}` : '#/');
    return;
  }
  const { display: d, product } = r;
  el.innerHTML = `<div class="view">
    <a class="button transparent small-round go-back" href="#/refill/placement"><i aria-hidden="true">arrow_back</i><span>Back</span></a>
    <h1 class="h5 small tight">Confirm</h1>
    <p class="tight">${state.refill.amount} ${esc(product.unit)} ${esc(product.shortName.toLowerCase())} → display ${esc(d.label)}</p>
    <p class="small-text tight">Placeholder: the confirm screen comes in the next build step.</p>
  </div>`;
}
