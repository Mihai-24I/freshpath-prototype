import { getAll } from '../data.js';
import { esc } from '../util.js';
import { state } from '../app.js';
import { loadRefill, afterPlacing } from '../refill.js';

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
  // Reached from the display card (/change) or from Alternatives (/own); Back and Placement's Back follow that.
  const fromCard = location.hash.endsWith('/change');
  state.refill.ownBack = fromCard ? `#/displays/${d.id}/change` : `#/displays/${d.id}/own`;
  const back = fromCard ? `#/overview/${d.id}` : `#/displays/${d.id}/alternatives`;
  const productById = new Map(products.map((p) => [p.id, p]));

  // In storage only, products that fit first, then by name.
  const list = products
    .filter((p) => p.storageQty > 0 && p.id !== d.productId)
    .sort((a, b) => warningsFor(a, d).length - warningsFor(b, d).length || a.name.localeCompare(b.name));
  const climate = d.climate === 'cooled' ? 'cooled' : 'ambient';
  const room = d.capacity - d.onDisplay;

  el.innerHTML = `<div class="view">
    <a class="button transparent small-round go-back" href="${esc(back)}"><i aria-hidden="true">arrow_back</i><span>Back</span></a>
    <div>
      <span class="small-text upper">Display ${esc(d.label)}</span>
      <h1 class="h5 small tight">Change product</h1>
    </div>
    <p class="small-text tight">${esc(d.label)} is ${climate}, ${d.promo ? `promo ${esc(d.promo)}` : 'no promo'}, ${room} free spaces. Products that fit come first.</p>
    <div class="field label prefix border small-round">
      <i aria-hidden="true">search</i>
      <input type="search" id="search" autocomplete="off">
      <label for="search">Search products</label>
    </div>
    <fieldset class="product-list" aria-label="Products in storage">
      ${list.map((p) => rowHtml(p, d)).join('')}
      <div class="choice-detail stack" hidden>
        <ul class="list-plain warnings"></ul>
        <div class="row amount-row">
          <div class="max">
            <p class="tight"><b>How many?</b></p>
            <p class="small-text tight" id="after-text" aria-live="polite"></p>
          </div>
          <div class="stepper">
            <button type="button" class="square border small-round" data-step="-1" aria-label="Place one less"><i aria-hidden="true">remove</i></button>
            <p class="amount-inline tight" aria-live="polite"><span id="amount"></span> <span class="small-text" id="amount-unit"></span></p>
            <button type="button" class="square border small-round" data-step="1" aria-label="Place one more"><i aria-hidden="true">add</i></button>
          </div>
        </div>
        <button type="button" class="transparent small-round reason-toggle" data-action="reason" aria-controls="reason-field" aria-expanded="false"><i aria-hidden="true">edit_note</i><span>Add a reason for the manager (optional)</span></button>
        <div class="field textarea label border small-round" id="reason-field" hidden>
          <textarea id="reason" name="reason" rows="2"></textarea>
          <label for="reason">My reason (short, for the manager, optional)</label>
        </div>
      </div>
    </fieldset>
    <p class="tight" id="no-match" hidden><i aria-hidden="true">search_off</i> No product matches your search.</p>
    <div class="sticky-actions">
      <button type="button" class="small-round" data-action="next" disabled>Next: how to place</button>
    </div>
  </div>`;

  const detail = el.querySelector('.choice-detail');
  const warnings = el.querySelector('.warnings');
  const reason = el.querySelector('#reason');
  const reasonField = el.querySelector('#reason-field');
  const reasonToggle = el.querySelector('[data-action="reason"]');
  const nextButton = el.querySelector('[data-action="next"]');
  const minus = el.querySelector('[data-step="-1"]');
  const plus = el.querySelector('[data-step="1"]');
  let limits = { min: 0, max: 0 };

  function showAmount() {
    const a = state.refill.amount;
    const f = afterPlacing(d, a);
    el.querySelector('#amount').textContent = a;
    minus.disabled = a <= limits.min;
    plus.disabled = a >= limits.max;
    el.querySelector('#after-text').textContent = `After placing: ${f.onDisplay} of ${d.capacity} on display, ${f.s.word}`;
  }

  function showReason(open) {
    reasonField.hidden = !open;
    reasonToggle.hidden = open;
    reasonToggle.setAttribute('aria-expanded', String(open));
  }

  async function select(productId) {
    const radio = el.querySelector(`input[value="${CSS.escape(productId)}"]`);
    if (!radio) return;
    radio.checked = true;
    const p = productById.get(productId);
    warnings.innerHTML = warningsFor(p, d)
      .map((w) => `<li><i aria-hidden="true">warning</i><span>${esc(w.text)}</span></li>`)
      .join('');
    const row = radio.closest('.product-option');
    row.after(detail); // warning, amount and reason sit right under the chosen product
    const prev = state.refill.own;
    state.refill.own = { productId, reason: prev?.productId === productId ? prev.reason : '' };
    state.refill.substituteId = null;
    reason.value = state.refill.own.reason;
    showReason(Boolean(reason.value));
    // loadRefill sets the suggested amount for a new product and keeps it when the product stays the same.
    const r = await loadRefill();
    if (!r || state.refill.own?.productId !== productId) return;
    limits = { min: r.min, max: r.max };
    el.querySelector('#amount-unit').textContent = p.unit;
    showAmount();
    detail.hidden = row.hidden;
    nextButton.disabled = false;
  }

  function filter(query) {
    const q = query.trim().toLowerCase();
    let shown = 0;
    el.querySelectorAll('.product-option').forEach((row) => {
      const match = !q || row.dataset.search.includes(q);
      row.hidden = !match;
      if (match) shown++;
    });
    // The amount block hides with its product; the choice itself stays.
    const chosen = el.querySelector('.product-option:has(input:checked)');
    if (chosen) detail.hidden = chosen.hidden;
    el.querySelector('#no-match').hidden = shown > 0;
  }

  // Coming back from Placement keeps the choice, the amount and the reason.
  if (state.refill.own) await select(state.refill.own.productId);

  onChange = (event) => {
    if (event.target.name === 'product') select(event.target.value);
  };
  onInput = (event) => {
    if (event.target.id === 'search') filter(event.target.value);
    if (event.target.id === 'reason' && state.refill.own) state.refill.own.reason = event.target.value;
  };
  onClick = (event) => {
    const step = event.target.closest('[data-step]');
    if (step) {
      state.refill.amount = Math.min(limits.max, Math.max(limits.min, state.refill.amount + Number(step.dataset.step)));
      showAmount();
      return;
    }
    if (event.target.closest('[data-action="reason"]')) {
      showReason(true);
      reason.focus();
      return;
    }
    if (event.target.closest('[data-action="next"]') && state.refill.own) location.hash = '#/refill/placement';
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
