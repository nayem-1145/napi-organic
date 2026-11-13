import { site, type ProductBundle } from '../config/site';

export interface BundlePrice {
  /** What the customer pays, or null when no price is configured */
  price: number | null;
  /** packs × single-pack price — shown struck through when a discount applies */
  regular: number | null;
  /** Whole-number discount percentage; 0 when there is no discount */
  savePct: number;
  perPack: number | null;
}

/** All bundle numbers derive from config, so nothing on the page is hard-coded. */
export function bundlePrice(b: ProductBundle, unit: number | null = site.product.priceBdt): BundlePrice {
  const regular = unit !== null ? unit * b.packs : null;
  const price = b.priceBdt ?? regular;
  const savePct = price !== null && regular !== null && regular > price ? Math.round((1 - price / regular) * 100) : 0;
  return { price, regular, savePct, perPack: price !== null ? Math.round(price / b.packs) : null };
}
