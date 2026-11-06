import './app-display-tile.js';
import { esc } from '../util.js';

// The store map (DESIGN 6.5). Input: `displays` (view models), `selected` (id), `filter` (status or null).
// Output: `display-select` CustomEvent with { id }.
const ARROWS = {
  ArrowLeft: (dx) => (dx < -1 ? -dx : null),
  ArrowRight: (dx) => (dx > 1 ? dx : null),
  ArrowUp: (dx, dy) => (dy < -1 ? -dy : null),
  ArrowDown: (dx, dy) => (dy > 1 ? dy : null),
};

class AppStoreMap extends HTMLElement {
  #displays = [];
  #selected = null;
  #filter = null;

  set displays(value) {
    this.#displays = value;
    if (this.isConnected) this.#render();
  }

  set selected(id) {
    this.#selected = id;
    this.#sync();
  }

  set filter(status) {
    this.#filter = status;
    this.#sync();
  }

  connectedCallback() {
    this.setAttribute('role', 'group');
    this.setAttribute('aria-label', 'Store map');
    this.addEventListener('click', this.#onClick);
    this.addEventListener('keydown', this.#onKeydown);
    this.#render();
  }

  disconnectedCallback() {
    this.removeEventListener('click', this.#onClick);
    this.removeEventListener('keydown', this.#onKeydown);
  }

  // Tiles of one gondola touch: round only the outer corners.
  #joins() {
    const joins = new Map();
    const units = Map.groupBy(this.#displays.filter((d) => d.unit), (d) => d.unit);
    for (const group of units.values()) {
      group.sort((a, b) => a.map.x - b.map.x);
      group.forEach((d, i) => joins.set(d.id, i === 0 ? 'start' : i === group.length - 1 ? 'end' : 'middle'));
    }
    return joins;
  }

  #render() {
    const joins = this.#joins();
    this.innerHTML =
      this.#displays
        .map((d) => {
          const join = joins.get(d.id);
          return `<app-display-tile data-id="${esc(d.id)}" letter="${esc(d.label)}" status="${d.status}"
            label="${esc(d.ariaLabel)}" x="${d.map.x}" y="${d.map.y}" w="${d.map.w}" h="${d.map.h}"
            ${join ? `join="${join}"` : ''}></app-display-tile>`;
        })
        .join('') +
      '<span class="map-entrance small-text"><span>Entrance</span><i class="tiny" aria-hidden="true">arrow_downward</i></span>';
    this.#sync();
  }

  #tiles() {
    return [...this.querySelectorAll('app-display-tile')];
  }

  #sync() {
    const statusOf = new Map(this.#displays.map((d) => [d.id, d.status]));
    const tiles = this.#tiles();
    for (const tile of tiles) {
      const id = tile.dataset.id;
      tile.toggleAttribute('selected', id === this.#selected);
      tile.hidden = Boolean(this.#filter) && statusOf.get(id) !== this.#filter;
    }
    const visible = tiles.filter((t) => !t.hidden);
    this.#setTabStop(visible.find((t) => t.hasAttribute('selected')) ?? visible[0]);
  }

  // Roving tabindex: Tab enters the map once, arrow keys move between tiles.
  #setTabStop(target) {
    for (const tile of this.#tiles()) {
      tile.querySelector('button')?.setAttribute('tabindex', tile === target ? '0' : '-1');
    }
  }

  #onClick = (event) => {
    const tile = event.target.closest('app-display-tile');
    if (tile) this.dispatchEvent(new CustomEvent('display-select', { bubbles: true, detail: { id: tile.dataset.id } }));
  };

  #onKeydown = (event) => {
    const score = ARROWS[event.key];
    const from = event.target.closest('app-display-tile');
    if (!score || !from) return;
    const centre = (el) => {
      const r = el.getBoundingClientRect();
      return { x: r.left + r.width / 2, y: r.top + r.height / 2 };
    };
    const a = centre(from);
    const horizontal = event.key === 'ArrowLeft' || event.key === 'ArrowRight';
    let best = null;
    let bestScore = Infinity;
    for (const tile of this.#tiles()) {
      if (tile === from || tile.hidden) continue;
      const b = centre(tile);
      const dx = b.x - a.x;
      const dy = b.y - a.y;
      const along = score(dx, dy);
      if (along === null) continue;
      const total = along + 2 * Math.abs(horizontal ? dy : dx);
      if (total < bestScore) {
        best = tile;
        bestScore = total;
      }
    }
    if (!best) return;
    event.preventDefault();
    this.#setTabStop(best);
    best.querySelector('button').focus();
  };
}

customElements.define('app-store-map', AppStoreMap);
