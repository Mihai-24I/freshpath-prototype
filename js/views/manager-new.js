import { getAll, create, remove } from '../data.js';
import { refresh } from '../router.js';
import { showSnackbar } from '../snackbar.js';
import { esc, formatDay } from '../util.js';

let root = null;
let onClick = null;
let onInput = null;
let onSubmit = null;

const chip = (attr, value, label, active) =>
  `<button type="button" class="chip small-round border${active ? ' fill' : ''}" data-${attr}="${esc(value)}" aria-pressed="${active}">${esc(label)}</button>`;

export async function render(el, params, user) {
  root = el;
  const [users, [store]] = await Promise.all([getAll('users'), getAll('store')]);
  const today = store.lastSync.slice(0, 10);
  const staff = users.filter((u) => u.role === 'Employee');
  let kind = 'note';
  let target = 'all';

  el.innerHTML = `<div class="view">
    <a class="button transparent small-round go-back" href="#/manager"><i aria-hidden="true">arrow_back</i><span>Back to team</span></a>
    <h1 class="h5 small tight">New note or task</h1>
    <form id="new-form" class="stack" novalidate>
      <div>
        <span class="small-text upper" id="type-label">Type</span>
        <div class="chip-row tag-row" role="group" aria-labelledby="type-label" id="kind-row"></div>
      </div>
      <div class="field label border small-round">
        <input id="date" type="date" min="${esc(today)}" value="${esc(today)}" required>
        <label for="date">Date</label>
        <output class="invalid" role="alert" id="date-error"></output>
      </div>
      <div>
        <span class="small-text upper" id="for-label">For</span>
        <div class="chip-row tag-row" role="group" aria-labelledby="for-label" id="target-row"></div>
      </div>
      <div class="field label border textarea small-round">
        <textarea id="text" rows="4" required></textarea>
        <label for="text" id="text-label">Note</label>
        <output class="invalid" role="alert" id="text-error"></output>
      </div>
    </form>
    <div class="sticky-actions">
      <button type="submit" form="new-form" class="small-round">Save</button>
    </div>
  </div>`;

  const kindRow = el.querySelector('#kind-row');
  const targetRow = el.querySelector('#target-row');
  const text = el.querySelector('#text');
  const date = el.querySelector('#date');
  const drawChips = () => {
    kindRow.innerHTML = chip('kind', 'note', 'Note', kind === 'note') + chip('kind', 'task', 'Task', kind === 'task');
    targetRow.innerHTML = staff.map((u) => chip('target', u.id, u.name.split(' ')[0], target === u.id)).join('') + chip('target', 'all', 'Everyone', target === 'all');
    el.querySelector('#text-label').textContent = kind === 'note' ? 'Note' : 'Task';
  };
  const setError = (field, message) => {
    const input = el.querySelector(`#${field}`);
    input.closest('.field').classList.toggle('invalid', Boolean(message));
    el.querySelector(`#${field}-error`).textContent = message;
    input.setAttribute('aria-invalid', message ? 'true' : 'false');
  };
  drawChips();

  onClick = (event) => {
    const k = event.target.closest('[data-kind]');
    const t = event.target.closest('[data-target]');
    if (k) kind = k.dataset.kind;
    else if (t) target = t.dataset.target;
    else return;
    drawChips();
    el.querySelector(k ? `[data-kind="${kind}"]` : `[data-target="${CSS.escape(target)}"]`).focus();
  };
  onInput = (event) => {
    if (event.target === text) setError('text', '');
    if (event.target === date) setError('date', '');
  };
  onSubmit = async (event) => {
    event.preventDefault();
    const body = text.value.trim();
    const when = date.value;
    const dateOk = /^\d{4}-\d{2}-\d{2}$/.test(when) && when >= today;
    setError('date', dateOk ? '' : `Pick today or a later date.`);
    setError('text', body ? '' : kind === 'note' ? 'Write the note.' : 'Describe the task.');
    if (!dateOk) return date.focus();
    if (!body) return text.focus();

    const first = user.name.split(' ')[0];
    const created = await create('tasks', {
      userId: target,
      type: kind === 'note' ? 'note' : 'check',
      displayId: null,
      title: kind === 'note' ? `Note from ${first}` : body,
      detail: kind === 'note' ? body : '',
      status: 'open',
      due: null,
      createdBy: user.id,
      kind,
      date: when,
    });
    location.hash = '#/manager';
    showSnackbar(`${kind === 'note' ? 'Note' : 'Task'} saved for ${formatDay(when)}`, {
      action: 'Undo',
      onAction: async () => {
        await remove('tasks', created.id);
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
