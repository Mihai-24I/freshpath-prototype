import { getAll, update } from '../data.js';
import { refresh } from '../router.js';
import { showSnackbar } from '../snackbar.js';
import { esc, formatDay, formatTime } from '../util.js';

let root = null;
let onChange = null;

const byDue = (a, b) => (a.due ?? '9').localeCompare(b.due ?? '9') || a.title.localeCompare(b.title);

function taskHtml(t) {
  const done = t.status === 'done';
  const meta = [t.detail, t.due && !done ? `by ${formatTime(t.due)}` : ''].filter(Boolean).join(' · ');
  const open = t.type === 'refill' && t.displayId && !done;
  const label = t.displayId ? t.displayId.replace('d-', '').toUpperCase() : '';
  return `<li class="task${done ? ' done' : ''}">
    <label class="checkbox"><input type="checkbox" data-task="${esc(t.id)}"${done ? ' checked' : ''}>
      <span><span class="task-text"><b class="task-title">${esc(t.title)}</b><span class="small-text">${esc(meta)}</span></span></span></label>
    ${open ? `<a class="button border small-round" href="#/overview/${esc(t.displayId)}" aria-label="Open display ${esc(label)}">Open</a>` : ''}
  </li>`;
}

function noteHtml(t) {
  return `<li class="note">
    <h3 class="h6 small tight"><i aria-hidden="true">sticky_note_2</i> ${esc(t.title)}</h3>
    <p class="tight">${esc(t.detail)}</p>
  </li>`;
}

function comingHtml(t) {
  const icon = t.kind === 'note' ? 'sticky_note_2' : 'event';
  return `<li class="coming"><i aria-hidden="true">${icon}</i>
    <span><b>${esc(t.title)}</b><br><span class="small-text">${esc([formatDay(t.date), t.detail].filter(Boolean).join(' · '))}</span></span></li>`;
}

export async function render(el, params, user) {
  root = el;

  async function draw(focusId) {
    const [tasks, [store]] = await Promise.all([getAll('tasks'), getAll('store')]);
    const today = store.lastSync.slice(0, 10);
    const mine = tasks.filter((t) => t.userId === user.id || t.userId === 'all');
    const notes = mine.filter((t) => t.kind === 'note' && t.date === today);
    const todays = mine.filter((t) => t.kind === 'task' && t.date === today);
    const list = [...todays.filter((t) => t.status === 'open').sort(byDue), ...todays.filter((t) => t.status === 'done').sort(byDue)];
    const later = mine.filter((t) => t.date > today).sort((a, b) => a.date.localeCompare(b.date) || byDue(a, b));

    el.innerHTML = `<div class="view">
      <div>
        <h1 class="h5 small tight">Tasks</h1>
        <p class="small-text tight">${esc(formatDay(store.lastSync))} · shift ${esc(user.shift ?? store.shift)}</p>
      </div>
      ${notes.length ? `<article class="no-elevate small-round stack" aria-labelledby="notes-title"><h2 class="h6 small tight" id="notes-title">Manager notes for today</h2><ul class="list-plain list-divided">${notes.map(noteHtml).join('')}</ul></article>` : ''}
      <article class="no-elevate small-round stack" aria-labelledby="today-title">
        <h2 class="h6 small tight" id="today-title">Today's tasks</h2>
        ${list.length ? `<ul class="list-plain list-divided tasks">${list.map(taskHtml).join('')}</ul>` : '<p class="tight"><i aria-hidden="true">check_circle</i> Nothing to do. Nice work.</p>'}
      </article>
      ${later.length ? `<section class="stack" aria-labelledby="coming-title"><h2 class="h6 small tight" id="coming-title">Coming up</h2><ul class="list-plain">${later.map(comingHtml).join('')}</ul></section>` : ''}
      <a class="button border small-round" href="#/decisions">My decisions</a>
    </div>`;
    if (focusId) el.querySelector(`[data-task="${CSS.escape(focusId)}"]`)?.focus();
  }
  await draw();

  onChange = async (event) => {
    const box = event.target.closest('[data-task]');
    if (!box) return;
    const id = box.dataset.task;
    const done = box.checked;
    const task = (await getAll('tasks')).find((t) => t.id === id);
    await update('tasks', id, { status: done ? 'done' : 'open' });
    await draw(id);
    showSnackbar(done ? 'Task done' : 'Task reopened', {
      action: 'Undo',
      onAction: async () => {
        await update('tasks', id, { status: task.status });
        refresh();
      },
    });
  };
  el.addEventListener('change', onChange);
}

export function destroy() {
  root?.removeEventListener('change', onChange);
  root = null;
}
