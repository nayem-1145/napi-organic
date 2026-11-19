import { site } from '../config/site';
import { bundlePrice } from './pricing';
import { formatBdt, toBnDigits } from './utils';

export type DeliveryArea = 'inside' | 'outside';

export interface OrderInput {
  name: string;
  phone: string;
  address: string;
  area: DeliveryArea;
  bundleId: string;
  quantity: number;
  note: string;
}

export interface PlacedOrder extends OrderInput {
  orderId: string;
  bundleName: string;
  packs: number;
  /** product price (bundle × quantity) */
  subtotal: number | null;
  delivery: number;
  /** subtotal + delivery */
  total: number | null;
}

export const AREA_LABEL: Record<DeliveryArea, string> = {
  inside: 'ঢাকার ভেতরে',
  outside: 'ঢাকার বাইরে',
};

export const deliveryCharge = (area: DeliveryArea): number => site.delivery[area];

/** Exactly what goes into the sheet's "Shipping Location" column. */
export const SHEET_AREA: Record<DeliveryArea, string> = {
  inside: 'Dhakar Vitore',
  outside: 'Dhakar bahire',
};

const BN = '০১২৩৪৫৬৭৮৯';

/**
 * Bangladeshi mobile → "01XXXXXXXXX", or null if invalid.
 * Accepts Bengali digits, spaces/dashes and a +88 / 88 prefix.
 */
export function normalizePhone(raw: string): string | null {
  let d = raw.replace(/[০-৯]/g, (c) => String(BN.indexOf(c))).replace(/\D/g, '');
  if (d.startsWith('880')) d = d.slice(2);
  else if (d.startsWith('88') && d.length === 13) d = d.slice(2);
  return /^01[3-9]\d{8}$/.test(d) ? d : null;
}

/** Short, readable reference the customer can quote, e.g. NAPI-7K3Q9X */
function makeOrderId(): string {
  const alphabet = 'ABCDEFGHJKMNPQRSTUVWXYZ23456789';
  const bytes = new Uint8Array(6);
  crypto.getRandomValues(bytes);
  return 'NAPI-' + Array.from(bytes, (b) => alphabet[b % alphabet.length]).join('');
}

const emailConfigured = () => {
  const { endpoint, accessKey } = site.orderForm;
  return !!endpoint && (!endpoint.includes('web3forms') || !!accessKey);
};

export const isOrderFormConfigured = () => !!site.orderForm.sheetUrl || emailConfigured();

export class OrderNotConfiguredError extends Error {}

/** Sends the order to the configured form service (see `site.orderForm`). */
export async function submitOrder(input: OrderInput, honeypot = ''): Promise<PlacedOrder> {
  const bundle = site.bundles.find((b) => b.id === input.bundleId) ?? site.bundles[0];
  const { price } = bundlePrice(bundle);
  const order: PlacedOrder = {
    ...input,
    orderId: makeOrderId(),
    bundleName: bundle.name,
    packs: bundle.packs * input.quantity,
    subtotal: price !== null ? price * input.quantity : null,
    delivery: deliveryCharge(input.area),
    total: price !== null ? price * input.quantity + deliveryCharge(input.area) : null,
  };

  if (!isOrderFormConfigured()) {
    if (import.meta.env.DEV) {
      // Lets you preview the Thank You screen locally before the form service is set up.
      console.warn('[Napi Organic] site.orderForm is not configured — simulating a successful order (dev only).', order);
      await new Promise((r) => setTimeout(r, 900));
      return order;
    }
    throw new OrderNotConfiguredError('Order form endpoint is not configured');
  }

  if (honeypot) return order; // bot: pretend success, store nothing

  const { sheetUrl, endpoint, accessKey, emailSubject } = site.orderForm;

  // 1) Google Sheet — the order list. Column names must match the sheet's header row.
  if (sheetUrl) {
    const row = {
      'Order Status': 'Pending Verification',
      'Customer Name': order.name,
      'Phone Number': order.phone,
      'Selected Package': `${bundle.sheetName} (${bundle.packs} packets)`,
      'Box Quantity': order.quantity,
      'Total Price': order.total ?? '',
      'Shipping Location': SHEET_AREA[order.area],
      'Full Address': order.address,
      // Filled only if the sheet has these extra headers (optional):
      'Order ID': order.orderId,
      'Order Date': new Date().toISOString(),
      'Total Packets': order.packs,
      'Product Price': order.subtotal ?? '',
      'Delivery Charge': order.delivery,
      'Note': order.note,
    };
    // text/plain keeps this a "simple" request, so Apps Script needs no CORS preflight.
    const res = await fetch(sheetUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body: JSON.stringify(row),
    });
    const body = (await res.json().catch(() => ({}))) as { ok?: boolean; error?: string };
    if (!res.ok || !body.ok) throw new Error(`Sheet submission failed (${res.status}) ${body.error ?? ''}`);
  }

  // 2) Optional e-mail copy. If the sheet already has the order, an e-mail hiccup must not fail it.
  if (!emailConfigured()) return order;
  // Flat, human-readable fields: this is exactly what arrives in the order email.
  const payload: Record<string, string> = {
    ...(accessKey ? { access_key: accessKey } : {}),
    subject: `${emailSubject} — ${order.orderId}`,
    from_name: 'Napi Organic Website',
    'অর্ডার আইডি': order.orderId,
    'নাম': order.name,
    'মোবাইল': order.phone,
    'ঠিকানা': order.address,
    'এলাকা': AREA_LABEL[order.area],
    'প্যাকেজ': `${bundle.name} (${toBnDigits(bundle.packs)} প্যাক) × ${toBnDigits(order.quantity)}`,
    'মোট প্যাকেট': `${toBnDigits(order.packs)} × ${toBnDigits(site.product.weightGrams)} গ্রাম`,
    'পণ্যের মূল্য': order.subtotal !== null ? formatBdt(order.subtotal) : '—',
    'ডেলিভারি চার্জ': formatBdt(order.delivery),
    'সর্বমোট': order.total !== null ? formatBdt(order.total) : 'মূল্য নির্ধারিত নয় — কল করে জানাতে হবে',
    'নোট': order.note || '—',
  };

  try {
    const res = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify(payload),
    });
    const body = (await res.json().catch(() => ({}))) as { success?: boolean; ok?: boolean };
    if (!res.ok || body.success === false) throw new Error(`Order e-mail failed (${res.status})`);
  } catch (err) {
    if (!sheetUrl) throw err; // e-mail is the only channel → report the failure
    console.warn('[Napi Organic] order saved to the sheet, but the e-mail copy failed', err);
  }
  return order;
}
