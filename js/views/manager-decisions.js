import { getAll, update } from '../data.js';
import { decisionCardHtml, decisionContext } from '../decision-card.js';
import { refresh } from '../router.js';
import { showSnackbar } from '../snackbar.js';
import { esc } from '../util.js';

let root = null;
let onSubmit = null;
let onInput = null;

function formHtml(dec, name) {
  return `<form class="feedback-form" data-decision="${esc(dec.id)}" novalidate>
    <div class="field label border textarea small-round">
      <textarea id="fb-${esc(dec.id)}" name="text" rows="4" required></textarea>
      <label for="fb-${esc(dec.id)}">Feedback for ${esc(name)}</label>
      <output class="invalid" role="alert"></output>
    </div>
    <button type="submit" class="secondary-container small-round">Send feedback</button>
  </form>`;
}

export async function render(el, params, user) {
  root = el;
  const ctx = await decisionContext();
  const today = ctx.today.slice(0, 10);

  async function draw() {
    const decisions = (await getAll('decisions'))
      .filter((d) => d.createdAt.slice(0, 10) === today)
      .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
    el.innerHTML = `<div class="view">
      <a class="button transparent small-round go-back" href="#/manager"><i aria-hidden="true">arrow_back</i><span>Back to team</span></a>
      <h1 class="h5 small tight">Review decisions</h1>
      ${
        decisions.length
          ? decisions
              .map((d) => {
                const name = ctx.users.get(d.userId)?.name.split(' ')[0] ?? 'the employee';
                return decisionCardHtml(d, ctx, { employee: name, footer: d.feedback ? undefined : formHtml(d, name) });
              })
              .join('')
          : '<p class="tight"><i aria-hidden="true">info</i> No decisions to review yet today.</p>'
      }
    </div>`;
  }
  await draw();

  onInput = (event) => {
    const field = event.target.closest('.field');
    if (!field) return;
    field.classList.remove('invalid');
    field.querySelector('output').textContent = '';
  };
  onSubmit = async (event) => {
    const form = event.target.closest('[data-decision]');
    if (!form) return;
    event.preventDefault();
    const area = form.querySelector('textarea');
    const text = area.value.trim();
    if (!text) {
      form.querySelector('.field').classList.add('invalid');
      form.querySelector('output').textContent = 'Write some feedback first.';
      area.focus();
      return;
    }
    const id = form.dataset.decision;
    const dec = (await getAll('decisions')).find((d) => d.id === id);
    const [store] = await getAll('store');
    // Demo time: the store's day at the real clock time, never before the last sync (as in confirmRefill).
    const clock = new Date().toTimeString().slice(0, 8);
    const sync = store.lastSync.slice(11, 19);
    await update('decisions', id, { feedback: { by: user.id, text, at: `${today}T${clock > sync ? clock : sync}` } });
    await draw();
    const name = ctx.users.get(dec.userId)?.name.split(' ')[0] ?? 'the employee';
    showSnackbar(`Feedback sent to ${name}`, {
      action: 'Undo',
      onAction: async () => {
        await update('decisions', id, { feedback: dec.feedback ?? null });
        refresh();
      },
    });
  };
  el.addEventListener('submit', onSubmit);
  el.addEventListener('input', onInput);
}

export function destroy() {
  root?.removeEventListener('submit', onSubmit);
  root?.removeEventListener('input', onInput);
  root = null;
}
