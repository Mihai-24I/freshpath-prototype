import { getAll } from '../data.js';
import { esc } from '../util.js';
import { state } from '../app.js';

let root = null;
let onClick = null;
let onInput = null;

export async function render(el, params) {
  root = el;
  const [displays, products, problems] = await Promise.all([getAll('displays'), getAll('products'), getAll('problems')]);
  const d = displays.find((x) => x.id === params.id);
  if (!d) {
    location.replace('#/');
    return;
  }
  const product = products.find((p) => p.id === d.productId);

  // Start a fresh refill for this display; the choices below are all optional.
  state.refill = { displayId: d.id, problemId: null, note: '' };

  el.innerHTML = `<div class="view">
    <a class="button transparent small-round go-back" href="#/displays/${esc(d.id)}"><i aria-hidden="true">arrow_back</i><span>Back</span></a>
    <h1 class="h5 small tight">What's wrong at ${esc(d.label)}?</h1>
    <p class="tight">${esc(product.shortName)} · ${d.onDisplay} of ${d.capacity} on display</p>
    <section class="stack" aria-labelledby="reason-title">
      <h2 class="h6 small tight" id="reason-title">Reason <span class="small-text">(optional)</span></h2>
      <div class="chip-row" role="group" aria-labelledby="reason-title">
        ${problems
          .map(
            (p) => `<button type="button" class="chip small-round border" data-problem="${esc(p.id)}" data-icon="${esc(p.icon)}" aria-pressed="false">
              <i aria-hidden="true">${esc(p.icon)}</i><span>${esc(p.label)}</span></button>`,
          )
          .join('')}
      </div>
    </section>
    <div class="field textarea label border small-round">
      <textarea id="note" name="note" rows="3"></textarea>
      <label for="note">Note (optional)</label>
    </div>
    <a class="button small-round" href="#/displays/${esc(d.id)}/alternatives">Find replacement</a>
    </div>`;

  onClick = (event) => {
    const chip = event.target.closest('[data-problem]');
    if (!chip) return;
    const selected = state.refill.problemId === chip.dataset.problem ? null : chip.dataset.problem;
    state.refill.problemId = selected;
    el.querySelectorAll('[data-problem]').forEach((c) => {
      const active = c.dataset.problem === selected;
      c.classList.toggle('secondary-container', active);
      c.querySelector('i').textContent = active ? 'check' : c.dataset.icon;
      c.setAttribute('aria-pressed', String(active));
    });
  };
  onInput = (event) => {
    if (event.target.id === 'note') state.refill.note = event.target.value;
  };
  el.addEventListener('click', onClick);
  el.addEventListener('input', onInput);
}

export function destroy() {
  root?.removeEventListener('click', onClick);
  root?.removeEventListener('input', onInput);
  root = null;
}
