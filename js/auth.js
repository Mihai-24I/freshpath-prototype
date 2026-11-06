// Fake auth (AGENTS.md): no hashing, no security. Users come from the `users` collection.
import { getAll, create, getSession, setSession, clearSession } from './data.js';

let returnTo = null; // route the user wanted before the guard sent them to Login

export function rememberReturn(hash) {
  returnTo = hash;
}

export function takeReturn() {
  const hash = returnTo;
  returnTo = null;
  return hash;
}

export const homeFor = (user) => (user?.role === 'Manager' ? '#/manager' : '#/');

export async function currentUser() {
  const id = getSession();
  if (!id) return null;
  return (await getAll('users')).find((u) => u.id === id) ?? null;
}

export async function login(email, password) {
  const wanted = email.trim().toLowerCase();
  const users = await getAll('users');
  const user = users.find((u) => u.email.toLowerCase() === wanted && u.password === password);
  if (!user) return null;
  setSession(user.id);
  return user;
}

export function logout() {
  clearSession();
  returnTo = null;
}

export async function signup({ name, email, password }) {
  if (!name?.trim() || !email?.trim() || !password) throw new Error('Fill in name, email and password.');
  const users = await getAll('users');
  if (users.some((u) => u.email.toLowerCase() === email.trim().toLowerCase())) {
    throw new Error('This email is already in use.');
  }
  const user = await create('users', {
    name: name.trim(),
    email: email.trim(),
    password,
    role: 'Employee',
    startedOn: new Date().toISOString().slice(0, 10),
    avatar: name.trim().split(/\s+/).map((w) => w[0]).slice(0, 2).join('').toUpperCase(),
    shift: '',
  });
  setSession(user.id);
  return user;
}
