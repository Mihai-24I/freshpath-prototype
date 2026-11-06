import { getAll } from '../data.js';
import { decisionCardHtml, decisionContext } from '../decision-card.js';

export async function render(el, params, user) {
  const [decisions, ctx] = await Promise.all([getAll('decisions'), decisionContext()]);
  const mine = decisions.filter((d) => d.userId === user.id).sort((a, b) => b.createdAt.localeCompare(a.createdAt));

  el.innerHTML = `<div class="view">
    <a class="button transparent small-round go-back" href="#/tasks"><i aria-hidden="true">arrow_back</i><span>Back to tasks</span></a>
    <h1 class="h5 small tight">My decisions</h1>
    ${
      mine.length
        ? mine.map((d) => decisionCardHtml(d, ctx)).join('')
        : '<p class="tight"><i aria-hidden="true">info</i> No decisions yet. They show up here after you confirm a refill.</p>'
    }
  </div>`;
}
