export const formatTime = (iso) => new Date(iso).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });

// "Tue 27 Oct" for a date, and "13:42" / "Mon 26 Oct, 18:20" for a moment. Today = the store's last sync day.
export const formatDay = (iso) => new Date(iso).toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short' }).replace(',', '');

export const formatWhen = (iso, todayIso) =>
  iso.slice(0, 10) === todayIso.slice(0, 10) ? formatTime(iso) : `${formatDay(iso)}, ${formatTime(iso)}`;

export const esc =(text) =>
  String(text).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);
