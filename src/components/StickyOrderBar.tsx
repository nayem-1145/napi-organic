import { useEffect, useState } from 'react';
import { site } from '../config/site';
import { bundlePrice } from '../lib/pricing';
import { setStore } from '../lib/store';
import { asset, formatBdt, toBnDigits } from '../lib/utils';
import { goToOrder } from './Brand';
import { ShoppingCart } from './Icons';

/**
 * Mobile/tablet quick-order bar. Slides in after the first screen and steps aside
 * while the order form or footer is visible, so it never covers the form.
 */
export function StickyOrderBar() {
  const [pastHero, setPastHero] = useState(false);
  const [covered, setCovered] = useState(false);

  useEffect(() => {
    const onScroll = () => setPastHero(window.scrollY > window.innerHeight * 0.9);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });

    const targets = ['order', 'site-footer'].map((id) => document.getElementById(id)).filter(Boolean) as HTMLElement[];
    const visible = new Set<Element>();
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => (e.isIntersecting ? visible.add(e.target) : visible.delete(e.target)));
      setCovered(visible.size > 0);
    });
    targets.forEach((t) => io.observe(t));

    return () => {
      window.removeEventListener('scroll', onScroll);
      io.disconnect();
    };
  }, []);

  const show = pastHero && !covered;

  // floating buttons lift above the bar on small screens
  useEffect(() => {
    const mq = window.matchMedia('(max-width: 1023.98px)');
    const sync = () => setStore({ stickyBarVisible: show && mq.matches });
    sync();
    mq.addEventListener('change', sync);
    return () => mq.removeEventListener('change', sync);
  }, [show]);

  // lowest per-pack price across all bundles ("৳X থেকে")
  const perPack = site.bundles.map((b) => bundlePrice(b).perPack).filter((p): p is number => p !== null);
  const fromPrice = perPack.length ? Math.min(...perPack) : null;

  return (
    <div
      className={`fixed inset-x-0 bottom-0 z-40 px-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] transition-[transform,opacity] duration-500 ease-(--ease-premium) lg:hidden ${
        show ? 'translate-y-0 opacity-100' : 'pointer-events-none translate-y-[120%] opacity-0'
      }`}
      aria-hidden={!show}
    >
      <div className="glass mx-auto flex max-w-xl items-center gap-3 rounded-[1.4rem] p-2 pl-3">
        <img src={asset('images/pouch-front.webp')} alt="" className="h-12 w-auto shrink-0 drop-shadow-md" loading="lazy" />
        <div className="min-w-0 flex-1 leading-tight">
          <p className="truncate text-sm font-semibold text-forest">অর্গানিক ব্যানানা চিপস</p>
          <p className="truncate text-xs text-ink-soft">
            {fromPrice !== null ? `${formatBdt(fromPrice)} থেকে · ` : 'ভেজালমুক্ত · '}
            {toBnDigits(site.product.weightGrams)} গ্রাম
          </p>
        </div>
        <button
          type="button"
          onClick={() => goToOrder()}
          tabIndex={show ? 0 : -1}
          className="btn btn-primary !min-h-12 shrink-0 !px-5 !py-2 text-[0.95rem]"
        >
          <ShoppingCart size={18} strokeWidth={2} aria-hidden />
          অর্ডার করুন
        </button>
      </div>
    </div>
  );
}
