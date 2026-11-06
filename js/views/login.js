import { login, homeFor, needsIntro, takeReturn } from '../auth.js';
import { getAll } from '../data.js';

let onSubmit = null;
let onInput = null;
let root = null;

const esc = (text) => String(text).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);

export async function render(el) {
  root = el;
  const users = await getAll('users');
  const demo = users
    .map((u) => `<li><strong>${esc(u.name)}</strong> · ${esc(u.role)}<br><span class="small-text">${esc(u.email)} · ${esc(u.password)}</span></li>`)
    .join('');

  el.innerHTML = `
    <div class="login">
      <nav>
        <img src="assets/logo-symbol.svg" alt="" width="48" height="48">
        <h1 class="h5 small">FreshPath</h1>
      </nav>
      <p>Log in to start your shift.</p>
      <form novalidate>
        <div class="field label border small-round">
          <input id="email" type="email" name="email" autocomplete="username" required>
          <label for="email">Email</label>
          <output class="invalid" role="alert" id="email-error"></output>
        </div>
        <div class="field label border small-round">
          <input id="password" type="password" name="password" autocomplete="current-password" required>
          <label for="password">Password</label>
          <output class="invalid" role="alert" id="password-error"></output>
        </div>
        <button type="submit" class="small-round">Log in</button>
      </form>
      <article class="no-elevate small-round">
        <h2 class="h6 small">Demo accounts</h2>
        <ul class="list-plain">${demo}</ul>
      </article>
    </div>`;

  const form = el.querySelector('form');
  const fields = [...form.querySelectorAll('.field')];
  const setError = (field, message) => {
    field.classList.toggle('invalid', Boolean(message));
    field.querySelector('output').textContent = message;
    field.querySelector('input').setAttribute('aria-invalid', message ? 'true' : 'false');
  };

  onInput = (event) => {
    const field = event.target.closest('.field');
    if (field) setError(field, '');
  };
  onSubmit = async (event) => {
    event.preventDefault();
    const [emailField, passwordField] = fields;
    const email = form.email.value;
    const password = form.password.value;
    fields.forEach((f) => setError(f, ''));
    if (!email.trim()) return setError(emailField, 'Enter your email.');
    if (!form.email.checkValidity()) return setError(emailField, 'Enter a valid email address.');
    if (!password) return setError(passwordField, 'Enter your password.');
    const user = await login(email, password);
    if (!user) {
      setError(emailField, ' ');
      return setError(passwordField, 'Wrong email or password.');
    }
    const back = takeReturn();
    location.hash = needsIntro(user) ? '#/intro' : (back ?? homeFor(user));
  };
  form.addEventListener('submit', onSubmit);
  form.addEventListener('input', onInput);
}

export function destroy() {
  const form = root?.querySelector('form');
  form?.removeEventListener('submit', onSubmit);
  form?.removeEventListener('input', onInput);
  root = null;
}
