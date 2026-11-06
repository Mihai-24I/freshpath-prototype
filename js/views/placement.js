import { loadRefill } from '../refill.js';
import { esc } from '../util.js';
import { state } from '../app.js';

let root = null;
let onChange = null;

export async function render(el) {
  const r = await loadRefill();
  if (!r) {
    location.replace(state.refill?.displayId ? `#/overview/${state.refill.displayId}` : '#/');
    return;
  }
  root = el;
  const { display: d, product, sub, own, store } = r;
  // An own choice sets its amount on the Change product screen, so Back goes there instead of to Amount.
  const back = own ? (state.refill.ownBack ?? `#/displays/${d.id}/own`) : '#/refill/amount';
  const unit = product.unit;
  // A suggestion brings its own steps and pick-up spot; an own choice uses the store defaults and the product's storage spot.
  const steps = sub ? sub.placementSteps : store.defaultPlacementSteps;
  const from = sub
    ? sub.getFrom
    : { location: product.storageLocation, rack: product.rack, note: 'Oldest date first' };
  const done = new Set(state.refill.stepsDone ?? []);

  el.innerHTML = `<div class="view">
    <a class="button transparent small-round go-back" href="${esc(back)}"><i aria-hidden="true">arrow_back</i><span>Back</span></a>
    <div>
      <span class="small-text upper">Display ${esc(d.label)}</span>
      <h1 class="h5 small tight">How to place ${esc(product.shortName.toLowerCase())}</h1>
    </div>
    <article class="no-elevate small-round stack">
      <h2 class="h6 small tight"><i aria-hidden="true">warehouse</i> Get it from</h2>
      <dl class="facts">
        <div><dt class="small-text upper">Storage</dt><dd>${esc(from.location)}</dd></div>
        <div><dt class="small-text upper">Rack</dt><dd>${esc(from.rack)}</dd></div>
        <div><dt class="small-text upper">Amount</dt><dd>${state.refill.amount} ${esc(unit)}</dd></div>
      </dl>
      <p class="small-text tight">${esc(from.note)}</p>
    </article>
    <article class="no-elevate small-round stack">
      <h2 class="h6 small tight"><i aria-hidden="true">location_on</i> Place it</h2>
      <p class="small-text tight">Tick the steps as you go. You can continue without ticking.</p>
      <ul class="list-plain steps">
        ${steps
          .map(
            (text, i) => `<li><label class="checkbox"><input type="checkbox" data-step="${i}"${done.has(i) ? ' checked' : ''}><span>${esc(text)}</span></label></li>`,
          )
          .join('')}
      </ul>
    </article>
    ${
      d.promo
        ? `<article class="no-elevate small-round tertiary-container"><p class="tight"><i aria-hidden="true">sell</i> Display ${esc(d.label)} has a promo: ${esc(d.promo)}. Check that the sign and price label match.</p></article>`
        : ''
    }
    <div class="sticky-actions">
      <a class="button small-round" href="#/refill/confirm">All placed</a>
    </div>
  </div>`;

  onChange = (event) => {
    const box = event.target.closest('[data-step]');
    if (!box) return;
    const ticked = new Set(state.refill.stepsDone ?? []);
    if (box.checked) ticked.add(Number(box.dataset.step));
    else ticked.delete(Number(box.dataset.step));
    state.refill.stepsDone = [...ticked];
  };
  el.addEventListener('change', onChange);
}

export function destroy() {
  root?.removeEventListener('change', onChange);
  root = null;
}
