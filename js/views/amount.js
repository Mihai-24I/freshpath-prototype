import { displayStatus } from '../data.js';
import { STATUS } from '../status.js';
import { loadRefill } from '../refill.js';
import { esc, formatTime } from '../util.js';
import { state } from '../app.js';

let root = null;
let onClick = null;

function afterState(d, unit, amount) {
  const onDisplay = d.onDisplay + amount;
  const status = displayStatus({ onDisplay, capacity: d.capacity });
  const s = STATUS[status];
  const percent = Math.round((onDisplay / d.capacity) * 100);
  return { onDisplay, s, percent, label: `${percent}% full, ${onDisplay} of ${d.capacity} on display` };
}

export async function render(el) {
  const r = await loadRefill();
  if (!r) {
    location.replace(state.refill?.displayId ? `#/overview/${state.refill.displayId}` : '#/');
    return;
  }
  root = el;
  const { display: d, product, sub, own, min, max, suggested } = r;
  const unit = product.unit;
  const back = own ? `#/displays/${d.id}/own` : `#/displays/${d.id}/alternatives/${sub.id}`;
  const first = afterState(d, unit, r.amount);

  const sales = sub
    ? `<article class="no-elevate small-round stack">
        <h2 class="h6 small tight">Today</h2>
        <dl class="facts two">
          <div><dt class="small-text upper">Expected sales</dt><dd>${sub.expectedSales} ${esc(unit)} <span class="small-text">rest of today</span></dd></div>
          <div><dt class="small-text upper">Next top-up</dt><dd>${esc(formatTime(sub.nextTopUp))}</dd></div>
        </dl>
      </article>`
    : '';

  el.innerHTML = `<div class="view">
    <a class="button transparent small-round go-back" href="${esc(back)}"><i aria-hidden="true">arrow_back</i><span>Back</span></a>
    <div>
      <span class="small-text upper">Display ${esc(d.label)}${d.promo ? ` · promo ${esc(d.promo)}` : ''}</span>
      <h1 class="h5 small tight">${esc(product.shortName)} → display ${esc(d.label)}</h1>
    </div>
    <article class="no-elevate small-round stack">
      <p class="tight">Suggested: place ${suggested} ${esc(unit)}</p>
      <div class="stepper">
        <button type="button" class="square border small-round" data-step="-1" aria-label="Place one less"><i aria-hidden="true">remove</i></button>
        <p class="amount tight" aria-live="polite"><span id="amount">${r.amount}</span> <span class="small-text">${esc(unit)}</span></p>
        <button type="button" class="square border small-round" data-step="1" aria-label="Place one more"><i aria-hidden="true">add</i></button>
      </div>
      <p class="small-text tight">You can place ${min}–${max} ${esc(unit)}: what fits on the display and is in storage.</p>
    </article>
    <article class="no-elevate small-round stack">
      <div class="row">
        <div class="max"><h2 class="h6 small tight">Display ${esc(d.label)} after placing</h2></div>
        <span class="chip no-round ${first.s.fill}" id="after-chip" aria-live="polite"><i aria-hidden="true">${first.s.icon}</i><span>${first.s.word} · ${first.percent}%</span></span>
      </div>
      <progress id="after-bar" class="large ${first.s.bar}" value="${first.onDisplay}" max="${d.capacity}" aria-label="${esc(first.label)}"></progress>
      <p class="small-text tight" id="after-text">${first.onDisplay} of ${d.capacity} ${esc(unit)} on display</p>
    </article>
    ${sales}
    <div class="sticky-actions">
      <a class="button small-round" href="#/refill/placement">Next: how to place</a>
    </div>
  </div>`;

  const amountEl = el.querySelector('#amount');
  const minus = el.querySelector('[data-step="-1"]');
  const plus = el.querySelector('[data-step="1"]');

  function update() {
    const a = state.refill.amount;
    const f = afterState(d, unit, a);
    amountEl.textContent = a;
    minus.disabled = a <= min;
    plus.disabled = a >= max;
    const chip = el.querySelector('#after-chip');
    chip.className = `chip no-round ${f.s.fill}`;
    chip.innerHTML = `<i aria-hidden="true">${f.s.icon}</i><span>${f.s.word} · ${f.percent}%</span>`;
    const bar = el.querySelector('#after-bar');
    bar.className = `large ${f.s.bar}`;
    bar.value = f.onDisplay;
    bar.setAttribute('aria-label', f.label);
    el.querySelector('#after-text').textContent = `${f.onDisplay} of ${d.capacity} ${unit} on display`;
  }
  update();

  onClick = (event) => {
    const button = event.target.closest('[data-step]');
    if (!button) return;
    state.refill.amount = Math.min(max, Math.max(min, state.refill.amount + Number(button.dataset.step)));
    update();
  };
  el.addEventListener('click', onClick);
}

export function destroy() {
  root?.removeEventListener('click', onClick);
  root = null;
}
