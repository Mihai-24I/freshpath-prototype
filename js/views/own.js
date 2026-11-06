import { getAll } from '../data.js';
import { esc } from '../util.js';
import { state } from '../app.js';

let root = null;
let onClick = null;
let onInput = null;
let onChange = null;
let onKeydown = null;

// Warnings for a product on this display. They explain, they never block (DESIGN 2, principle 4).
function warningsFor(p, d) {
  const w = [];
  if (p.needsCooling && d.climate === 'ambient') {
    w.push({ tag: 'Needs cooling', text: `Needs cooling, but display ${d.label} is ambient.` });
  }
  if (d.promo && !p.promoEligible) {
    w.push({ tag: 'Not in promo', text: `Not part of the promo (${d.promo}). Check the price tag.` });
  }
  return w;
}

function rowHtml(p, d) {
  const w = warningsFor(p, d);
  const tags = w.length
    ? w.map((x) => `<span class="chip no-round tertiary"><i aria-hidden="true">warning</i><span>${esc(x.tag)}</span></span>`).join('')
    : '<span class="chip no-round secondary-container"><i aria-hidden="true">check_circle</i><span>Fits</span></span>';
  return `<label class="product-option" data-search="${esc(`${p.name} ${p.shortName} ${p.category}`.toLowerCase())}">
    <input type="radio" name="product" value="${esc(p.id)}">
    <i aria-hidden="true" class="radio-off">radio_button_unchecked</i>
    <i aria-hidden="true" class="radio-on">check_circle</i>
    <span class="product-text">
      <b>${esc(p.name)}</b><br>
      <span class="small-text">${p.storageQty} ${esc(p.unit)} in storage · ${esc(p.storageLocation)}</span>
      <span class="chip-row tag-row">${tags}</span>
    </span>
  </label>`;
}

export async function render(el, params) {
  root = el;
  const [displays, products] = await Promise.all([getAll('displays'), getAll('products')]);
  const d = displays.find((x) => x.id === params.id);
  if (!d) {
    location.replace('#/');
    return;
  }
  if (state.refill?.displayId !== d.id) state.refill = { displayId: d.id, problemId: null, note: '' };
  const productById = new Map(products.map((p) => [p.id, p]));

  // In storage only, products that fit first, then by name.
  const list = products
    .filter((p) => p.storageQty > 0 && p.id !== d.productId)
    .sort((a, b) => warningsFor(a, d).length - warningsFor(b, d).length || a.name.localeCompare(b.name));
  const climate = d.climate === 'cooled' ? 'cooled' : 'ambient';

  el.innerHTML = `<div class="view">
    <a class="button transparent small-round go-back" href="#/displays/${esc(d.id)}/alternatives"><i aria-hidden="true">arrow_back</i><span>Back</span></a>
    <div>
      <span class="small-text upper">Display ${esc(d.label)}</span>
      <h1 class="h5 small tight">Pick any product</h1>
    </div>
    <p class="small-text tight">${esc(d.label)} is ${climate}${d.promo ? `, promo ${esc(d.promo)}` : ''}. Only products in storage are listed.</p>
    <div class="field label prefix border small-round">
      <i aria-hidden="true">search</i>
      <input type="search" id="search" autocomplete="off">
      <label for="search">Search products</label>
    </div>
    <fieldset class="product-list" aria-label="Products in storage">
      ${list.map((p) => rowHtml(p, d)).join('')}
      <div class="choice-detail stack" hidden>
        <ul class="list-plain warnings"></ul>
        <div class="field textarea label border small-round">
          <textarea id="reason" name="reason" rows="2"></textarea>
          <label for="reason">My reason (short, for the manager, optional)</label>
        </div>
      </div>
    </fieldset>
    <p class="tight" id="no-match" hidden><i aria-hidden="true">search_off</i> No product matches your search.</p>
    <div class="sticky-actions">
      <button type="button" class="small-round" data-action="use" disabled>Use this product</button>
    </div>
  </div>`;

  const detail = el.querySelector('.choice-detail');
  const warnings = el.querySelector('.warnings');
  const reason = el.querySelector('#reason');
  const useButton = el.querySelector('[data-action="use"]');

  function select(productId) {
    const radio = el.querySelector(`input[value="${CSS.escape(productId)}"]`);
    if (!radio) return;
    radio.checked = true;
    const p = productById.get(productId);
    warnings.innerHTML = warningsFor(p, d)
      .map((w) => `<li><i aria-hidden="true">warning</i><span>${esc(w.text)}</span></li>`)
      .join('');
    const row = radio.closest('.product-option');
    row.after(detail); // the warning and reason sit right under the chosen product
    detail.hidden = false;
    useButton.disabled = false;
    const prev = state.refill.own;
    state.refill.own = { productId, reason: prev?.productId === productId ? prev.reason : '' };
    state.refill.substituteId = null;
    reason.value = state.refill.own.reason;
  }

  function filter(query) {
    const q = query.trim().toLowerCase();
    let shown = 0;
    el.querySelectorAll('.product-option').forEach((row) => {
      const match = !q || row.dataset.search.includes(q);
      row.hidden = !match;
      if (match) shown++;
    });
    el.querySelector('#no-match').hidden = shown > 0;
  }

  // Coming back from Amount keeps the choice and the reason.
  if (state.refill.own) select(state.refill.own.productId);

  onChange = (event) => {
    if (event.target.name === 'product') select(event.target.value);
  };
  onInput = (event) => {
    if (event.target.id === 'search') filter(event.target.value);
    if (event.target.id === 'reason' && state.refill.own) state.refill.own.reason = event.target.value;
  };
  onClick = (event) => {
    if (!event.target.closest('[data-action="use"]') || !state.refill.own) return;
    location.hash = '#/refill/amount';
  };
  // Enter in the search field must not submit or jump anywhere.
  onKeydown = (event) => {
    if (event.key === 'Enter' && event.target.id === 'search') event.preventDefault();
  };
  el.addEventListener('change', onChange);
  el.addEventListener('input', onInput);
  el.addEventListener('click', onClick);
  el.addEventListener('keydown', onKeydown);
}

export function destroy() {
  root?.removeEventListener('change', onChange);
  root?.removeEventListener('input', onInput);
  root?.removeEventListener('click', onClick);
  root?.removeEventListener('keydown', onKeydown);
  root = null;
}
