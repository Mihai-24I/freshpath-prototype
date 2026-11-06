import { getAll } from '../data.js';
import { esc, formatWhen } from '../util.js';

function cardHtml(dec, ctx) {
  const { products, displays, reasons, problems, users, today } = ctx;
  const from = products.get(dec.fromProductId);
  const to = products.get(dec.toProductId);
  const label = displays.get(dec.displayId)?.label ?? '';
  const problem = problems.get(dec.problemId);
  const why = dec.ownChoice
    ? `<p class="tight"><i aria-hidden="true">lightbulb</i> My reason: ${esc(dec.ownReason ?? '')}</p>`
    : dec.reasonIds.length
      ? `<ul class="list-plain reasons">${dec.reasonIds.map((id) => `<li><i aria-hidden="true">check_circle</i><span>${esc(reasons.get(id)?.label ?? id)}</span></li>`).join('')}</ul>`
      : '';
  const feedback = dec.feedback
    ? `<div class="feedback"><span class="small-text upper">Feedback from ${esc(users.get(dec.feedback.by)?.name ?? 'your manager')} · ${esc(formatWhen(dec.feedback.at, today))}</span>
        <p class="tight">${esc(dec.feedback.text)}</p></div>`
    : '<p class="small-text tight"><i aria-hidden="true">schedule</i> No feedback yet</p>';
  return `<article class="no-elevate small-round stack">
    <span class="small-text upper">Display ${esc(label)} · ${esc(formatWhen(dec.createdAt, today))}</span>
    <h2 class="h6 small tight"><s>${esc(from?.shortName ?? '')}</s> → ${esc(to?.shortName ?? '')}</h2>
    <p class="tight">${dec.amount} ${esc(to?.unit ?? '')}</p>
    ${problem ? `<p class="small-text tight">Problem: ${esc(problem.label)}</p>` : ''}
    ${why}
    ${dec.note ? `<p class="small-text tight">My note: ${esc(dec.note)}</p>` : ''}
    ${dec.photo ? '<p class="tight"><span class="chip no-round secondary-container"><i aria-hidden="true">photo_camera</i><span>Photo added</span></span></p>' : ''}
    ${feedback}
  </article>`;
}

export async function render(el, params, user) {
  const [decisions, products, displays, reasons, problems, users, [store]] = await Promise.all(
    ['decisions', 'products', 'displays', 'reasons', 'problems', 'users', 'store'].map(getAll),
  );
  const byId = (list) => new Map(list.map((x) => [x.id, x]));
  const ctx = {
    products: byId(products),
    displays: byId(displays),
    reasons: byId(reasons),
    problems: byId(problems),
    users: byId(users),
    today: store.lastSync,
  };
  const mine = decisions.filter((d) => d.userId === user.id).sort((a, b) => b.createdAt.localeCompare(a.createdAt));

  el.innerHTML = `<div class="view">
    <a class="button transparent small-round go-back" href="#/tasks"><i aria-hidden="true">arrow_back</i><span>Back to tasks</span></a>
    <h1 class="h5 small tight">My decisions</h1>
    ${
      mine.length
        ? mine.map((d) => cardHtml(d, ctx)).join('')
        : '<p class="tight"><i aria-hidden="true">info</i> No decisions yet. They show up here after you confirm a refill.</p>'
    }
  </div>`;
}
