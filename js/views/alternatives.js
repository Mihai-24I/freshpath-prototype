// Placeholder until step 6 (Alternatives and Why this suggestion).
import { getAll } from '../data.js';
import { esc } from '../util.js';

export async function render(el, params) {
  const displays = await getAll('displays');
  const d = displays.find((x) => x.id === params.id);
  if (!d) {
    location.replace('#/');
    return;
  }
  el.innerHTML = `<div class="view">
    <a class="button transparent small-round go-back" href="#/displays/${esc(d.id)}/problem"><i aria-hidden="true">arrow_back</i><span>Back</span></a>
    <h1 class="h5 small">Alternatives for ${esc(d.label)}</h1>
    <p>The ranked substitutes arrive in the next build step.</p>
    </div>`;
}
