import { getAll } from '../data.js';
import { decisionContext } from '../decision-card.js';
import { esc, formatDay, formatTime, formatWhen } from '../util.js';

const byDue = (a, b) => (a.due ?? '9').localeCompare(b.due ?? '9') || a.title.localeCompare(b.title);

function decisionHtml(dec, ctx) {
  const from = ctx.products.get(dec.fromProductId);
  const to = ctx.products.get(dec.toProductId);
  const label = ctx.displays.get(dec.displayId)?.label ?? '';
  const who = ctx.users.get(dec.userId)?.name.split(' ')[0] ?? '';
  const status = dec.feedback
    ? '<span class="chip no-round secondary-container"><i aria-hidden="true">check_circle</i><span>Feedback sent</span></span>'
    : '<span class="chip no-round border"><i aria-hidden="true">schedule</i><span>No feedback yet</span></span>';
  return `<article class="no-elevate small-round stack">
    <span class="small-text upper">Display ${esc(label)} · ${esc(formatWhen(dec.createdAt, ctx.today))} · ${esc(who)}</span>
    <h3 class="h6 small tight"><s>${esc(from?.shortName ?? '')}</s> → ${esc(to?.shortName ?? '')} · ${dec.amount} ${esc(to?.unit ?? '')}</h3>
    <div class="chip-row tag-row">${status}</div>
  </article>`;
}

function taskHtml(t) {
  const meta = [t.detail, t.due ? `by ${formatTime(t.due)}` : ''].filter(Boolean).join(' · ');
  const label = t.displayId ? t.displayId.replace('d-', '').toUpperCase() : '';
  return `<li class="task">
    <span class="task-text"><b class="task-title">${esc(t.title)}</b><span class="small-text">${esc(meta)}</span></span>
    ${t.displayId ? `<a class="button border small-round" href="#/overview/${esc(t.displayId)}" aria-label="Open display ${esc(label)}">Open</a>` : ''}
  </li>`;
}

function noteHtml(t) {
  return `<article class="no-elevate small-round stack">
    <h3 class="h6 small tight"><i aria-hidden="true">sticky_note_2</i> ${esc(t.title)}</h3>
    <p class="tight">${esc(t.detail)}</p>
  </article>`;
}

export async function render(el, params, user) {
  const [tasks, decisions, [store]] = await Promise.all([getAll('tasks'), getAll('decisions'), getAll('store')]);
  const ctx = await decisionContext();
  const today = store.lastSync.slice(0, 10);

  const todays = decisions.filter((d) => d.createdAt.slice(0, 10) === today).sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  const waiting = todays.filter((d) => !d.feedback).length;
  const open = tasks.filter((t) => t.userId === user.id && t.kind === 'task' && t.status === 'open' && t.date <= today).sort(byDue);
  const notes = tasks.filter((t) => t.kind === 'note' && t.date === today);

  el.innerHTML = `<div class="view">
    <div>
      <h1 class="h5 small tight">Team</h1>
      <p class="small-text tight">${esc(formatDay(store.lastSync))} · shift ${esc(user.shift ?? store.shift)}</p>
    </div>
    <section class="stack" aria-labelledby="dec-title">
      <h2 class="h6 small tight" id="dec-title">Decisions today</h2>
      <p class="small-text tight">${todays.length ? `${todays.length} ${todays.length === 1 ? 'decision' : 'decisions'} · ${waiting} waiting for feedback` : 'No decisions yet today.'}</p>
      ${todays.slice(0, 3).map((d) => decisionHtml(d, ctx)).join('')}
    </section>
    <section class="stack" aria-labelledby="open-title">
      <h2 class="h6 small tight" id="open-title">Open tasks</h2>
      ${open.length ? `<ul class="list-plain tasks">${open.map(taskHtml).join('')}</ul>` : '<p class="tight"><i aria-hidden="true">check_circle</i> Nothing open. Nice work.</p>'}
    </section>
    <section class="stack" aria-labelledby="notes-title">
      <h2 class="h6 small tight" id="notes-title">Notes for today</h2>
      ${notes.length ? notes.map(noteHtml).join('') : '<p class="tight"><i aria-hidden="true">info</i> No notes for today.</p>'}
    </section>
    <div class="sticky-actions">
      <a class="button border small-round" href="#/manager/decisions">Review decisions</a>
      <a class="button small-round" href="#/manager/new">New note or task</a>
    </div>
  </div>`;
}
