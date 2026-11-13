import { site } from '../config/site';

export const WA_MESSAGES = {
  enquiry: 'আসসালামু আলাইকুম, Napi Organic Banana Chips সম্পর্কে জানতে চাই।',
  bulk: 'আসসালামু আলাইকুম, Napi Organic Banana Chips বেশি পরিমাণে / পাইকারি অর্ডার করতে চাই।',
  order: (orderId: string) => `আসসালামু আলাইকুম, আমি ওয়েবসাইট থেকে অর্ডার করেছি। অর্ডার আইডি: ${orderId}`,
};

/**
 * wa.me chat link. With a configured number it opens that chat directly;
 * without one, WhatsApp asks the visitor to choose a contact (message still prefilled).
 */
export function whatsappUrl(message: string = WA_MESSAGES.enquiry): string {
  const text = encodeURIComponent(message);
  const number = site.contact.whatsapp.replace(/\D/g, '');
  if (!number && import.meta.env?.DEV) {
    console.warn('[Napi Organic] site.contact.whatsapp is empty — set it in src/config/site.ts');
  }
  return number ? `https://wa.me/${number}?text=${text}` : `https://wa.me/?text=${text}`;
}
