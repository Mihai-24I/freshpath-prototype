// Display status look (DESIGN 4.1): word + icon + beer.css colour helpers. Never colour alone.
export const STATUS = {
  ok: { word: 'OK', icon: 'check_circle', fill: 'secondary-container', bar: 'primary-text' },
  low: { word: 'Low', icon: 'warning', fill: 'tertiary', bar: 'tertiary-text' },
  empty: { word: 'Empty', icon: 'cancel', fill: 'error-container status-empty', bar: 'error-text' },
};

export const STATUS_ORDER = ['ok', 'low', 'empty'];
