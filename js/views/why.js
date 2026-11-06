import { getAll, availableSubstitutes } from '../data.js';
import { esc } from '../util.js';
import { state } from '../app.js';

const RATING = {
  good: { icon: 'check_circle', word: 'Good', fill: 'secondary-container' },
  risk: { icon: 'warning', word: 'Risk', fill: 'tertiary' },
};

export async function render(el, params) {
  const [displays, reasons] = await Promise.all([getAll('displays'), getAll('reasons')]);
  const d = displays.find((x) => x.id === params.id);
  const list = d ? await availableSubstitutes(d.id) : [];
  const index = list.findIndex((s) => s.id === params.substituteId);
  if (!d || index === -1) {
    location.replace(d ? `#/displays/${d.id}/alternatives` : '#/');
    return;
  }
  const s = list[index];
  const reasonById = new Map(reasons.map((r) => [r.id, r]));
  const name = s.product.shortName.toLowerCase();
  const place = index === 0 ? 'Best match' : `#${index + 1}`;

  if (state.refill?.displayId !== d.id) state.refill = { displayId: d.id, problemId: null, note: '' };
  state.refill.substituteId = s.id;

  el.innerHTML = `<div class="view">
    <a class="button transparent small-round go-back" href="#/displays/${esc(d.id)}/alternatives"><i aria-hidden="true">arrow_back</i><span>Back</span></a>
    <div>
      <span class="small-text upper">${esc(place)} for display ${esc(d.label)}</span>
      <h1 class="h5 small tight">Why ${esc(name)}?</h1>
    </div>
    <article class="no-elevate small-round secondary-container"><p class="tight">${esc(s.summary)}</p></article>
    <div class="factors">
      ${s.factors
        .map((f) => {
          const r = RATING[f.rating];
          const reason = reasonById.get(f.reasonId);
          return `<details class="factor">
            <summary>
              <span class="factor-text">
                <b>${esc(reason?.label ?? f.reasonId)}</b><br>
                <span class="small-text">${esc(f.text)}</span>
              </span>
              <span class="chip no-round ${r.fill}"><i aria-hidden="true">${r.icon}</i><span>${r.word}</span></span>
              <i aria-hidden="true" class="chevron">expand_more</i>
            </summary>
            <p class="small-text"><i aria-hidden="true">lightbulb</i> <b>Why does this matter?</b> ${esc(reason?.explanation ?? '')}</p>
          </details>`;
        })
        .join('')}
    </div>
    <div class="sticky-actions">
      <a class="button transparent small-round" href="#/displays/${esc(d.id)}/alternatives">See other options</a>
      <a class="button small-round" href="#/refill/amount">Use ${esc(name)}</a>
    </div>
  </div>`;
}
