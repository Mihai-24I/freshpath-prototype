import { displayStatus, confirmRefill, undoRefill } from '../data.js';
import { STATUS } from '../status.js';
import { loadRefill } from '../refill.js';
import { refresh } from '../router.js';
import { showSnackbar } from '../snackbar.js';
import { esc } from '../util.js';
import { state } from '../app.js';

let root = null;
let onClick = null;
let onChange = null;

export async function render(el, params, user) {
  const r = await loadRefill();
  if (!r) {
    location.replace(state.refill?.displayId ? `#/overview/${state.refill.displayId}` : '#/');
    return;
  }
  root = el;
  const { display: d, product, sub, own } = r;
  const amount = state.refill.amount;
  const oldProduct = r.oldProduct;
  const onDisplay = d.onDisplay + amount;
  const s = STATUS[displayStatus({ onDisplay, capacity: d.capacity })];
  const percent = Math.round((onDisplay / d.capacity) * 100);
  const from = sub ? sub.getFrom : { location: product.storageLocation, rack: product.rack };
  const type = d.type === 'gondola' ? 'gondola' : 'promo table';

  el.innerHTML = `<div class="view">
    <a class="button transparent small-round go-back" href="#/refill/placement"><i aria-hidden="true">arrow_back</i><span>Back</span></a>
    <div>
      <span class="small-text upper">Display ${esc(d.label)} · ${esc(type)}</span>
      <h1 class="h5 small tight">Confirm refill</h1>
    </div>
    <article class="no-elevate small-round stack">
      <h2 class="h6 small tight"><s>${esc(oldProduct.shortName)}</s> → ${esc(product.shortName)}</h2>
      <dl class="facts two">
        <div><dt class="small-text upper">Amount</dt><dd>${amount} ${esc(product.unit)}</dd></div>
        <div><dt class="small-text upper">Display after</dt><dd><span class="chip no-round ${s.fill}"><i aria-hidden="true">${s.icon}</i><span>${s.word} · ${percent}%</span></span></dd></div>
        <div><dt class="small-text upper">From</dt><dd>${esc(from.location)}<br><span class="small-text">${esc(from.rack)}</span></dd></div>
        ${d.promo ? `<div><dt class="small-text upper">Promo</dt><dd>${esc(d.promo)}</dd></div>` : ''}
      </dl>
    </article>
    <article class="no-elevate small-round stack">
      <h2 class="h6 small tight">Photo <span class="small-text">(optional)</span></h2>
      <p class="small-text tight">Helps your manager see how the display looks.</p>
      <input type="file" accept="image/*" capture="environment" id="photo" hidden>
      <div class="photo-row">
        <button type="button" class="border small-round" id="photo-button" data-action="photo"><i aria-hidden="true">photo_camera</i><span>Add photo</span></button>
        <span class="chip no-round secondary-container" id="photo-added" hidden><i aria-hidden="true">check_circle</i><span>Photo added</span></span>
        <button type="button" class="transparent small-round" id="photo-remove" data-action="remove-photo" hidden>Remove</button>
      </div>
    </article>
    <div class="sticky-actions">
      <button type="button" class="small-round" data-action="confirm">Confirm</button>
    </div>
  </div>`;

  const photoAdded = el.querySelector('#photo-added');
  const photoRemove = el.querySelector('#photo-remove');
  const photoButton = el.querySelector('#photo-button');
  function showPhoto() {
    const has = Boolean(state.refill.photo);
    photoAdded.hidden = !has;
    photoRemove.hidden = !has;
    photoButton.querySelector('span').textContent = has ? 'Change photo' : 'Add photo';
  }
  showPhoto();

  onClick = async (event) => {
    const action = event.target.closest('[data-action]')?.dataset.action;
    if (action === 'photo') el.querySelector('#photo').click();
    if (action === 'remove-photo') {
      state.refill.photo = false;
      el.querySelector('#photo').value = '';
      showPhoto();
    }
    if (action === 'confirm') {
      event.target.closest('button').disabled = true; // no double save
      const undo = await confirmRefill({
        displayId: d.id,
        productId: product.id,
        amount,
        userId: user.id,
        problemId: state.refill.problemId,
        note: state.refill.note,
        reasonIds: sub?.reasonIds,
        ownChoice: Boolean(own),
        ownReason: own?.reason?.trim(),
        photo: state.refill.photo,
      });
      state.refill = null;
      location.hash = `#/overview/${d.id}`;
      showSnackbar(`Display ${d.label} updated`, {
        action: 'Undo',
        onAction: async () => {
          await undoRefill(undo);
          refresh();
        },
      });
    }
  };
  // Only "a photo was added" is kept; the file itself is not stored (prototype).
  onChange = (event) => {
    if (event.target.id !== 'photo') return;
    state.refill.photo = event.target.files.length > 0;
    showPhoto();
  };
  el.addEventListener('click', onClick);
  el.addEventListener('change', onChange);
}

export function destroy() {
  root?.removeEventListener('click', onClick);
  root?.removeEventListener('change', onChange);
  root = null;
}
