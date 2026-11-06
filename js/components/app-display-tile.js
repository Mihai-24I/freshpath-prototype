import { STATUS } from '../status.js';
import { esc } from '../util.js';

// One promo display on the store map (DESIGN 6.4). Attributes in, no data access:
// letter, status, label (aria), x/y/w/h (% of the map), join (start|middle|end in a gondola), selected.
const MARKS = `<span class="marks" aria-hidden="true">
  <span class="mark mark-tl"></span><span class="mark mark-tr"></span>
  <span class="mark mark-bl"></span><span class="mark mark-br"></span>
</span>`;

class AppDisplayTile extends HTMLElement {
  static observedAttributes = ['selected'];

  connectedCallback() {
    for (const key of ['x', 'y', 'w', 'h']) this.style.setProperty(`--${key}`, this.getAttribute(key));
    const status = STATUS[this.getAttribute('status')];
    this.innerHTML = `
      <button type="button" class="small-round no-elevate tile ${status.fill}" aria-label="${esc(this.getAttribute('label'))}">
        <span class="tile-top"><span class="display-letter">${esc(this.getAttribute('letter'))}</span><i class="tiny" aria-hidden="true">${status.icon}</i></span>
        <span class="small-text">${status.word}</span>
      </button>`;
    this.#sync();
  }

  attributeChangedCallback() {
    if (this.querySelector('button')) this.#sync();
  }

  // Re-creating the marks restarts their 3-pulse animation (one @keyframes in app.css).
  #sync() {
    const selected = this.hasAttribute('selected');
    this.querySelector('button').setAttribute('aria-pressed', String(selected));
    this.querySelector('.marks')?.remove();
    if (selected) this.insertAdjacentHTML('beforeend', MARKS);
  }
}

customElements.define('app-display-tile', AppDisplayTile);
