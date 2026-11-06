// Resolves the refill in progress (state.refill, set by the Why / Own choice screens) into
// display, product and the numbers the Amount, Placement and Confirm screens share.
import { getAll, displayStatus } from './data.js';
import { STATUS } from './status.js';
import { state } from './app.js';

// How the display looks once `amount` is placed; shared by the Amount and Change product screens.
export function afterPlacing(display, amount) {
  const onDisplay = display.onDisplay + amount;
  const s = STATUS[displayStatus({ onDisplay, capacity: display.capacity })];
  const percent = Math.round((onDisplay / display.capacity) * 100);
  return { onDisplay, s, percent, label: `${percent}% full, ${onDisplay} of ${display.capacity} on display` };
}

export async function loadRefill() {
  const r = state.refill;
  if (!r?.displayId) return null;
  const [displays, products, substitutes, [store]] = await Promise.all([
    getAll('displays'),
    getAll('products'),
    getAll('substitutes'),
    getAll('store'),
  ]);
  const display = displays.find((d) => d.id === r.displayId);
  const own = r.own ?? null;
  const sub = own ? null : (substitutes.find((s) => s.id === r.substituteId) ?? null);
  const product = products.find((p) => p.id === (own ? own.productId : sub?.productId));
  if (!display || !product) return null;

  // Most that fits on the display, is in storage, and (for a suggestion) is sensible for this product.
  const room = display.capacity - display.onDisplay;
  const max = Math.max(0, Math.min(room, product.storageQty, sub?.amountMax ?? Infinity));
  const min = Math.min(1, max);
  // A suggestion brings its own amount; an own choice gets the display's expected sales, so it isn't over-filled.
  const suggested = Math.max(min, Math.min(sub ? sub.amount : display.expectedSales, max));

  // Keep the chosen amount while the product stays the same (back and forth between screens).
  if (r.amountFor !== product.id) {
    r.amountFor = product.id;
    r.amount = suggested;
    r.stepsDone = [];
  }
  r.amount = Math.min(max, Math.max(min, r.amount));

  const oldProduct = products.find((p) => p.id === display.productId);
  return { display, product, oldProduct, sub, own, store, max, min, suggested, amount: r.amount };
}
