// One snackbar for the whole app (DESIGN 6.8). Shown for 5 s, optional action (e.g. Undo).
let bar = null;
let timer = null;

export function showSnackbar(message, { action, onAction } = {}) {
  if (!bar) {
    bar = document.createElement('div');
    bar.className = 'snackbar';
    bar.setAttribute('role', 'status');
    document.body.append(bar);
  }
  clearTimeout(timer);
  bar.replaceChildren();
  const text = document.createElement('span');
  text.className = 'max';
  text.textContent = message;
  bar.append(text);
  if (action) {
    const button = document.createElement('button');
    button.className = 'transparent small-round inverse-link';
    button.textContent = action;
    button.addEventListener('click', (event) => {
      event.stopPropagation();
      hide();
      onAction?.();
    });
    bar.append(button);
  }
  bar.classList.add('active');
  timer = setTimeout(hide, 5000);
}

function hide() {
  clearTimeout(timer);
  bar?.classList.remove('active');
}
