// Hash router + auth guard. Route table: pattern, lazy view, tab to mark active.
// `auth: true` redirects to #/login without a session; `role` limits a route to Employee or Manager.
import { currentUser, homeFor, rememberReturn } from './auth.js';

const routes = [
  { pattern: '/login', view: () => import('./views/login.js'), shell: false },
  { pattern: '/', view: () => import('./views/overview.js'), tab: 'overview', auth: true },
  { pattern: '/overview/:displayId', view: () => import('./views/overview.js'), tab: 'overview', auth: true },
  { pattern: '/displays/:id', view: () => import('./views/display-detail.js'), tab: 'overview', auth: true },
  { pattern: '/displays/:id/problem', view: () => import('./views/problem.js'), tab: 'overview', auth: true },
  { pattern: '/displays/:id/alternatives', view: () => import('./views/alternatives.js'), tab: 'overview', auth: true },
  { pattern: '/displays/:id/alternatives/:substituteId', view: () => import('./views/why.js'), tab: 'overview', auth: true },
  { pattern: '/displays/:id/own', view: () => import('./views/own.js'), tab: 'overview', auth: true },
  { pattern: '/refill/amount', view: () => import('./views/amount.js'), tab: 'overview', auth: true },
  { pattern: '/refill/placement', view: () => import('./views/placement.js'), tab: 'overview', auth: true },
  { pattern: '/refill/confirm', view: () => import('./views/confirm.js'), tab: 'overview', auth: true },
  { pattern: '/tasks', view: () => import('./views/tasks.js'), tab: 'tasks', auth: true, role: 'Employee' },
  { pattern: '/decisions', view: () => import('./views/decisions.js'), tab: 'tasks', auth: true, role: 'Employee' },
  { pattern: '/storage', view: () => import('./views/storage.js'), tab: 'storage', auth: true },
  { pattern: '/storage/:productId', view: () => import('./views/storage-detail.js'), tab: 'storage', auth: true },
  { pattern: '/profile', view: () => import('./views/profile.js'), tab: 'profile', auth: true },
  { pattern: '/manager', view: () => import('./views/manager.js'), tab: 'team', auth: true, role: 'Manager' },
];

const outlet = document.getElementById('app');
const header = document.querySelector('header');
const secondTab = document.getElementById('tab-second');
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

// The manager's second tab reads "Team" and opens the manager home (plan.md).
function setShell(visible, user) {
  header.hidden = !visible;
  const manager = user?.role === 'Manager';
  secondTab.textContent = manager ? 'Team' : 'Tasks';
  secondTab.href = manager ? '#/manager' : '#/tasks';
  secondTab.dataset.tab = manager ? 'team' : 'tasks';
}

async function render() {
  const id = ++renderId;
  const path = location.hash.replace(/^#/, '') || '/';
  const found = match(path);
  if (!found) {
    location.replace('#/');
    return;
  }
  const { route } = found;
  const user = await currentUser();
  if (id !== renderId) return;

  if (route.auth && !user) {
    rememberReturn(location.hash);
    location.replace('#/login');
    return;
  }
  if (route.pattern === '/login' && user) {
    location.replace(homeFor(user));
    return;
  }
  if (route.role && user.role !== route.role) {
    location.replace(homeFor(user));
    return;
  }

  const module = await route.view();
  if (id !== renderId) return; // a newer navigation won
  if (current?.destroy) current.destroy();
  outlet.replaceChildren();
  setShell(route.shell !== false, user);
  await module.render(outlet, found.params, user);
  current = module;
  markTab(route.tab);

  const heading = outlet.querySelector('h1');
  document.title = heading ? `${heading.textContent} · FreshPath` : 'FreshPath';
  if (heading) {
    heading.tabIndex = -1;
    heading.focus({ preventScroll: true });
  }
}

// Re-render the current view, e.g. after Undo changed the data behind it.
export function refresh() {
  render();
}

export function start() {
  window.addEventListener('hashchange', render);
  render();
}
