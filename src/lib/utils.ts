const BASE: string =
  ((import.meta as unknown as { env?: { BASE_URL?: string } }).env?.BASE_URL ?? '/').replace(/\/?$/, '/');

/** Resolve a file in /public regardless of where the site is deployed. */
export const asset = (path: string) => BASE + path.replace(/^\//, '');

const BN_DIGITS = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];

/** 150 → "১৫০" */
export const toBnDigits = (value: number | string) =>
  String(value).replace(/[0-9]/g, (d) => BN_DIGITS[Number(d)]);

/** 1250 → "৳১,২৫০" */
export const formatBdt = (amount: number) =>
  '৳' + toBnDigits(new Intl.NumberFormat('en-IN', { maximumFractionDigits: 0 }).format(amount));

export const clamp = (v: number, min = 0, max = 1) => Math.min(max, Math.max(min, v));

export const prefersReducedMotion = () =>
  typeof window !== 'undefined' &&
  window.matchMedia?.('(prefers-reduced-motion: reduce)').matches === true;

export const scrollToId = (id: string) => {
  const el = document.getElementById(id);
  if (!el) return;
  const lenis = (window as unknown as { __lenis?: { scrollTo: (t: HTMLElement, o?: object) => void } }).__lenis;
  if (lenis) lenis.scrollTo(el, { offset: -8 });
  else el.scrollIntoView({ behavior: prefersReducedMotion() ? 'auto' : 'smooth' });
};
