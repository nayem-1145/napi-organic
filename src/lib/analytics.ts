import { site } from '../config/site';
import type { PlacedOrder } from './order';
import { SHEET_AREA } from './order';

declare global {
  interface Window {
    dataLayer?: Record<string, unknown>[];
  }
}

/**
 * Tells Google Tag Manager (index.html) that an order was placed.
 * Pushes the custom event `order_complete` with GA4-style ecommerce data, so in GTM:
 *   Trigger  → Custom Event, event name "order_complete"
 *   Tag      → Google Analytics: GA4 Event, event name "purchase",
 *              More settings → Ecommerce → "Send Ecommerce data" (source: Data Layer)
 * No personal data (name, phone, address) is sent — Google Analytics forbids it.
 */
export function trackOrderComplete(order: PlacedOrder) {
  try {
    const dl = (window.dataLayer = window.dataLayer || []);
    const bundle = site.bundles.find((b) => b.id === order.bundleId);
    dl.push({ ecommerce: null }); // clear any previous ecommerce object (GTM recommendation)
    dl.push({
      event: 'order_complete',
      order_id: order.orderId,
      shipping_location: SHEET_AREA[order.area],
      ecommerce: {
        transaction_id: order.orderId,
        currency: 'BDT',
        value: order.total ?? 0,
        shipping: order.delivery,
        items: [
          {
            item_id: bundle?.id ?? order.bundleId,
            item_name: bundle?.sheetName ?? order.bundleName,
            item_variant: `${order.packs} packets`,
            price: order.subtotal !== null ? order.subtotal / order.quantity : undefined,
            quantity: order.quantity,
          },
        ],
      },
    });
  } catch {
    // analytics must never break the order flow
  }
}
