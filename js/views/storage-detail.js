import { getAll, update } from '../data.js';
import { refresh } from '../router.js';
import { showSnackbar } from '../snackbar.js';
import { esc } from '../util.js';

let root = null;
let onClick = null;
let onInput = null;
let onSubmit = null;

export async function render(el, params) {
  const product = (await getAll('products')).find((p) => p.id === params.productId);
  if (!product) {
    location.replace('#/storage');
    return;
  }
  root = el;
  const before = product.storageQty;

  el.innerHTML = `<div class="view">
    <a class="button transparent small-round go-back" href="#/storage"><i aria-hidden="true">arrow_back</i><span>Back to storage</span></a>
    <div>
      <span class="small-text upper">Correct stock</span>
      <h1 class="h5 small tight">${esc(product.name)}</h1>
      <p class="small-text tight"><i aria-hidden="true">warehouse</i> ${esc(product.storageLocation)} · ${esc(product.rack)}</p>
    </div>
    <article class="no-elevate small-round stack">
      <p class="tight">In storage now: <b>${before} ${esc(product.unit)}</b></p>
      <form id="stock-form" novalidate>
        <div class="stepper">
          <button type="button" class="square border small-round" data-step="-1" aria-label="One less"><i aria-hidden="true">remove</i></button>
          <div class="field label border small-round qty-field">
            <input id="qty" name="qty" type="number" inputmode="numeric" min="0" step="1" value="${before}" required>
            <label for="qty">Counted (${esc(product.unit)})</label>
            <output class="invalid" role="alert" id="qty-error"></output>
          </div>
          <button type="button" class="square border small-round" data-step="1" aria-label="One more"><i aria-hidden="true">add</i></button>
        </div>
      </form>
      <p class="small-text tight">Suggestions only use products with enough in storage, so set what is really on the rack.</p>
    </article>
    <div class="sticky-actions">
      <button type="submit" form="stock-form" class="small-round">Save</button>
    </div>
  </div>`;

  const input = el.querySelector('#qty');
  const field = input.closest('.field');
  const setError = (message) => {
    field.classList.toggle('invalid', Boolean(message));
    el.querySelector('#qty-error').textContent = message;
    input.setAttribute('aria-invalid', message ? 'true' : 'false');
  };
  const read = () => (input.value.trim() !== '' && /^\d+$/.test(input.value.trim()) ? Number(input.value) : null);

  onClick = (event) => {
    const button = event.target.closest('[data-step]');
    if (!button) return;
    const now = read() ?? before;
    input.value = Math.max(0, now + Number(button.dataset.step));
    setError('');
  };
  onInput = () => setError('');
  onSubmit = async (event) => {
    event.preventDefault();
    const qty = read();
    if (qty === null) {
      setError('Enter a whole number, 0 or more.');
      input.focus();
      return;
    }
    await update('products', product.id, { storageQty: qty });
    location.hash = '#/storage';
    showSnackbar(`${product.shortName} stock set to ${qty}`, {
      action: 'Undo',
      onAction: async () => {
        await update('products', product.id, { storageQty: before });
        refresh();
      },
    });
  };
  el.addEventListener('click', onClick);
  el.addEventListener('input', onInput);
  el.addEventListener('submit', onSubmit);
}

export function destroy() {
  root?.removeEventListener('click', onClick);
  root?.removeEventListener('input', onInput);
  root?.removeEventListener('submit', onSubmit);
  root = null;
}
