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
  total: number | null;
}

export const AREA_LABEL: Record<DeliveryArea, string> = {
  inside: 'ঢাকার ভেতরে',
  outside: 'ঢাকার বাইরে',
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

export const isOrderFormConfigured = () => {
  const { endpoint, accessKey } = site.orderForm;
  return !!endpoint && (!endpoint.includes('web3forms') || !!accessKey);
};

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
    total: price !== null ? price * input.quantity : null,
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

  const { endpoint, accessKey, emailSubject } = site.orderForm;
  // Flat, human-readable fields: this is exactly what arrives in the order email.
  const payload: Record<string, string> = {
    ...(accessKey ? { access_key: accessKey } : {}),
    subject: `${emailSubject} — ${order.orderId}`,
    from_name: 'Napi Organic Website',
    botcheck: honeypot,
    'অর্ডার আইডি': order.orderId,
    'নাম': order.name,
    'মোবাইল': order.phone,
    'ঠিকানা': order.address,
    'এলাকা': AREA_LABEL[order.area],
    'প্যাকেজ': `${bundle.name} (${toBnDigits(bundle.packs)} প্যাক) × ${toBnDigits(order.quantity)}`,
    'মোট প্যাকেট': `${toBnDigits(order.packs)} × ${toBnDigits(site.product.weightGrams)} গ্রাম`,
    'মোট মূল্য': order.total !== null ? formatBdt(order.total) : 'মূল্য নির্ধারিত নয় — কল করে জানাতে হবে',
    'নোট': order.note || '—',
  };

  const res = await fetch(endpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    body: JSON.stringify(payload),
  });
  const body = (await res.json().catch(() => ({}))) as { success?: boolean; ok?: boolean };
  if (!res.ok || body.success === false) throw new Error(`Order submission failed (${res.status})`);
  return order;
}
