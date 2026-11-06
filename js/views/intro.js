import { getAll, markIntroSeen } from '../data.js';
import { esc } from '../util.js';

let root = null;
let onClick = null;

export async function render(el, params, user) {
  root = el;
  const cards = await getAll('intro');
  let index = 0;

  el.innerHTML = `<div class="view intro">
    <div>
      <p class="small-text upper tight" id="intro-step"></p>
      <div class="dots" id="intro-dots" aria-hidden="true">${cards.map(() => '<span></span>').join('')}</div>
    </div>
    <article class="no-elevate small-round stack intro-card" id="intro-card" aria-live="polite"></article>
    <div class="sticky-actions">
      <button type="button" class="transparent small-round skip" data-action="skip">Skip</button>
      <button type="button" class="small-round" data-action="next" id="intro-next"></button>
    </div>
  </div>`;

  const card = el.querySelector('#intro-card');
  const draw = () => {
    const c = cards[index];
    const last = index === cards.length - 1;
    card.innerHTML = `<span class="chip circle extra no-border primary-container" aria-hidden="true"><i>${esc(c.icon)}</i></span>
      <h1 class="h5 small tight" tabindex="-1">${esc(c.title)}</h1>
      <p class="tight">${esc(c.text)}</p>`;
    el.querySelector('#intro-step').textContent = `${index + 1} of ${cards.length}`;
    el.querySelectorAll('#intro-dots span').forEach((dot, i) => dot.classList.toggle('active', i === index));
    el.querySelector('#intro-next').textContent = last ? 'Start' : 'Next';
  };
  draw();

  const finish = () => {
    markIntroSeen(user.id);
    location.hash = '#/';
  };
  onClick = (event) => {
    const action = event.target.closest('[data-action]')?.dataset.action;
    if (action === 'skip') return finish();
    if (action !== 'next') return;
    if (index === cards.length - 1) return finish();
    index += 1;
    draw();
    card.querySelector('h1').focus({ preventScroll: true });
  };
  el.addEventListener('click', onClick);
}

export function destroy() {
  root?.removeEventListener('click', onClick);
  root = null;
}
