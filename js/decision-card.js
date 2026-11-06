// Decision card shared by My decisions (employee) and Review decisions (manager).
import { getAll } from './data.js';
import { esc, formatWhen } from './util.js';

const byId = (list) => new Map(list.map((x) => [x.id, x]));

export async function decisionContext() {
  const [products, displays, reasons, problems, users, [store]] = await Promise.all(
    ['products', 'displays', 'reasons', 'problems', 'users', 'store'].map(getAll),
  );
  return {
    products: byId(products),
    displays: byId(displays),
    reasons: byId(reasons),
    problems: byId(problems),
    users: byId(users),
    today: store.lastSync,
  };
}

export function feedbackHtml(dec, ctx) {
  return `<div class="feedback"><span class="small-text upper">Feedback from ${esc(ctx.users.get(dec.feedback.by)?.name ?? 'your manager')} · ${esc(formatWhen(dec.feedback.at, ctx.today))}</span>
    <p class="tight">${esc(dec.feedback.text)}</p></div>`;
}

// `employee` (a first name) switches the wording to the manager's view; `footer` replaces the feedback block.
export function decisionCardHtml(dec, ctx, { employee, footer } = {}) {
  const from = ctx.products.get(dec.fromProductId);
  const to = ctx.products.get(dec.toProductId);
  const label = ctx.displays.get(dec.displayId)?.label ?? '';
  const problem = ctx.problems.get(dec.problemId);
  const owner = employee ? `${employee}'s` : 'My';
  const why = dec.ownChoice
    ? `<p class="tight"><i aria-hidden="true">lightbulb</i> ${owner} reason: ${esc(dec.ownReason ?? '')}</p>`
    : dec.reasonIds.length
      ? `<ul class="list-plain reasons">${dec.reasonIds.map((id) => `<li><i aria-hidden="true">check_circle</i><span>${esc(ctx.reasons.get(id)?.label ?? id)}</span></li>`).join('')}</ul>`
      : '';
  const feedback = footer ?? (dec.feedback ? feedbackHtml(dec, ctx) : '<p class="small-text tight"><i aria-hidden="true">schedule</i> No feedback yet</p>');
  return `<article class="no-elevate small-round stack">
    <span class="small-text upper">Display ${esc(label)} · ${esc(formatWhen(dec.createdAt, ctx.today))}${employee ? ` · ${esc(employee)}` : ''}</span>
    <h2 class="h6 small tight"><s>${esc(from?.shortName ?? '')}</s> → ${esc(to?.shortName ?? '')}</h2>
    <p class="tight">${dec.amount} ${esc(to?.unit ?? '')}</p>
    ${problem ? `<p class="small-text tight">Problem: ${esc(problem.label)}</p>` : ''}
    ${why}
    ${dec.note ? `<p class="small-text tight">${owner} note: ${esc(dec.note)}</p>` : ''}
    ${dec.photo ? '<p class="tight"><span class="chip no-round secondary-container"><i aria-hidden="true">photo_camera</i><span>Photo added</span></span></p>' : ''}
    ${feedback}
  </article>`;
}
