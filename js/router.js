// Hash router. Route table: pattern, lazy view, tab to mark active.
// `auth: true` routes get their guard in step 3 (login).
const routes = [
  { pattern: '/', view: () => import('./views/overview.js'), tab: 'overview' },
  { pattern: '/tasks', view: () => import('./views/tasks.js'), tab: 'tasks' },
  { pattern: '/storage', view: () => import('./views/storage.js'), tab: 'storage' },
  { pattern: '/profile', view: () => import('./views/profile.js'), tab: 'profile' },
];

const outlet = document.getElementById('app');
let current = null;
let renderId = 0;

function match(path) {
  const parts = path.split('/').filter(Boolean);
  for (const route of routes) {
    const patternParts = route.pattern.split('/').filter(Boolean);
    if (patternParts.length !== parts.length) continue;
    const params = {};
    const ok = patternParts.every((p, i) => {
      if (p.startsWith(':')) {
        params[p.slice(1)] = decodeURIComponent(parts[i]);
        return true;
      }
      return p === parts[i];
    });
    if (ok) return { route, params };
  }
  return null;
}

function markTab(tab) {
  document.querySelectorAll('.tabs a').forEach((a) => {
    const active = a.dataset.tab === tab;
    a.classList.toggle('active', active);
    if (active) a.setAttribute('aria-current', 'page');
    else a.removeAttribute('aria-current');
  });
}

async function render() {
  const id = ++renderId;
  const path = location.hash.replace(/^#/, '') || '/';
  const found = match(path);
  if (!found) {
    location.replace('#/');
    return;
  }
  const module = await found.route.view();
  if (id !== renderId) return; // a newer navigation won
  if (current?.destroy) current.destroy();
  outlet.replaceChildren();
  await module.render(outlet, found.params);
  current = module;
  markTab(found.route.tab);

  const heading = outlet.querySelector('h1');
  document.title = heading ? `${heading.textContent} · FreshPath` : 'FreshPath';
  if (heading) {
    heading.tabIndex = -1;
    heading.focus({ preventScroll: true });
  }
}

export function start() {
  window.addEventListener('hashchange', render);
  render();
}
