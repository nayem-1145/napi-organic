import { site, type ProductVariant } from '../config/site';
import { formatBdt, toBnDigits } from './utils';

/** Builds the prefilled Bengali order message. */
export function buildOrderMessage(product: ProductVariant, quantity: number): string {
  const lines = [
    'আসসালামু আলাইকুম, আমি অর্ডার করতে চাই।',
    '',
    `পণ্য: ${product.name} (${product.flavour})`,
    `ওজন: ${toBnDigits(product.weightGrams)} গ্রাম`,
    `পরিমাণ: ${toBnDigits(quantity)} প্যাকেট`,
  ];
  if (product.priceBdt !== null) {
    lines.push(`একক মূল্য: ${formatBdt(product.priceBdt)}`);
    lines.push(`মোট মূল্য: ${formatBdt(product.priceBdt * quantity)}`);
  }
  lines.push('', 'নাম:', 'ঠিকানা:', 'মোবাইল নম্বর:');
  return lines.join('\n');
}

/**
 * wa.me link. With a configured number it opens that chat directly;
 * without one, WhatsApp asks the visitor to choose a contact (message still prefilled).
 */
export function whatsappOrderUrl(quantity = 1, product: ProductVariant = site.product): string {
  const text = encodeURIComponent(buildOrderMessage(product, quantity));
  const number = site.contact.whatsapp.replace(/\D/g, '');
  if (!number && import.meta.env?.DEV) {
    console.warn('[Napi Organic] site.contact.whatsapp is empty — set it in src/config/site.ts');
  }
  return number ? `https://wa.me/${number}?text=${text}` : `https://wa.me/?text=${text}`;
}

export function openWhatsAppOrder(quantity = 1) {
  window.open(whatsappOrderUrl(quantity), '_blank', 'noopener,noreferrer');
}
