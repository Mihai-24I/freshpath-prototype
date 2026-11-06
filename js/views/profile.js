import { logout } from '../auth.js';
import { getAll, reset } from '../data.js';
import { showSnackbar } from '../snackbar.js';

let root = null;
let onClick = null;

const esc = (text) => String(text).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);
const formatDate = (iso) =>
  new Date(`${iso}T12:00:00`).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });

export async function render(el, params, user) {
  root = el;
  const [store] = await getAll('store');
  el.innerHTML = `
    <h1 class="h5 small">Profile</h1>
    <article class="no-elevate small-round">
      <nav>
        <span class="chip circle extra no-border primary-container" aria-hidden="true"><b>${esc(user.avatar)}</b></span>
        <div class="max">
          <h2 class="h6 small no-margin">${esc(user.name)}</h2>
          <p class="small-text no-margin">${esc(user.role)}</p>
        </div>
      </nav>
      <hr>
      <dl>
        <dt class="small-text upper">Store</dt><dd>${esc(store.name)} · ${esc(store.department)}</dd>
        <dt class="small-text upper">Shift</dt><dd>${esc(user.shift)}</dd>
        <dt class="small-text upper">Started</dt><dd>${esc(formatDate(user.startedOn))}</dd>
      </dl>
    </article>
    <div class="profile-actions">
      <button class="border small-round" data-action="reset"><i>restart_alt</i><span>Reset demo data</span></button>
      <button class="transparent small-round" data-action="logout"><i>logout</i><span>Log out</span></button>
    </div>`;

  onClick = (event) => {
    const action = event.target.closest('[data-action]')?.dataset.action;
    if (action === 'reset') {
      reset();
      showSnackbar('Demo data reset');
    } else if (action === 'logout') {
      logout();
      location.hash = '#/login';
    }
  };
  el.addEventListener('click', onClick);
}

export function destroy() {
  root?.removeEventListener('click', onClick);
  root = null;
}
