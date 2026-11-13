import { useEffect, useState } from 'react';
import { scrollToId, toBnDigits } from '../lib/utils';
import { goToOrder, LogoTab } from './Brand';
import { Menu, ShoppingCart, X } from './Icons';

export const NAV_LINKS = [
  { id: 'kids', label: 'বাচ্চাদের জন্য' },
  { id: 'why', label: 'কেন Napi' },
  { id: 'product', label: 'প্যাকেজ' },
  { id: 'ingredients', label: 'উপাদান' },
  { id: 'reviews', label: 'মতামত' },
  { id: 'faq', label: 'প্রশ্নোত্তর' },
];

export function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    document.documentElement.style.overflow = open ? 'hidden' : '';
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false);
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open]);

  const go = (id: string) => {
    setOpen(false);
    requestAnimationFrame(() => scrollToId(id));
  };

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-50 transition-[background-color,box-shadow,backdrop-filter] duration-500 ${
          scrolled ? 'bg-cream/85 shadow-[0_1px_0_rgb(31_42_36/0.08),0_12px_30px_-20px_rgb(27_77_62/0.35)] backdrop-blur-xl' : ''
        }`}
      >
        <div className="mx-auto flex h-16 max-w-[1440px] items-start justify-between px-5 sm:px-8 lg:h-20 lg:px-12">
          <button onClick={() => go('top')} className="-mt-px" aria-label="Napi Organic — শুরুতে ফিরুন">
            <LogoTab compact className={`origin-top transition-transform duration-500 ${scrolled ? 'scale-[0.82]' : ''}`} />
          </button>
          <nav className="hidden h-full items-center gap-9 lg:flex" aria-label="প্রধান মেনু">
            {NAV_LINKS.map((l) => (
              <button
                key={l.id}
                onClick={() => go(l.id)}
                className="group relative py-2 text-[0.95rem] font-medium text-ink/80 transition-colors hover:text-forest"
              >
                {l.label}
                <span className="absolute inset-x-0 bottom-1 h-0.5 origin-left scale-x-0 rounded-full bg-amber transition-transform duration-500 ease-(--ease-premium) group-hover:scale-x-100" />
              </button>
            ))}
          </nav>
          <div className="flex h-full items-center gap-3">
            <button
              type="button"
              onClick={() => goToOrder()}
              className="btn btn-primary !min-h-11 !px-5 !py-2 text-sm max-sm:hidden"
            >
              <ShoppingCart size={17} strokeWidth={2} aria-hidden />
              অর্ডার করুন
            </button>
            <button
              className="grid h-11 w-11 place-items-center rounded-full text-forest lg:hidden"
              onClick={() => setOpen(true)}
              aria-label="মেনু খুলুন"
              aria-expanded={open}
            >
              <Menu size={24} strokeWidth={1.6} />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile menu */}
      <div
        className={`fixed inset-0 z-[60] flex flex-col bg-forest text-cream transition-[opacity,visibility] duration-500 lg:hidden ${
          open ? 'visible opacity-100' : 'invisible opacity-0'
        }`}
        role="dialog"
        aria-modal="true"
        aria-label="মেনু"
      >
        <div className="flex h-16 items-start justify-between px-5">
          <LogoTab compact />
          <button className="mt-2.5 grid h-11 w-11 place-items-center" onClick={() => setOpen(false)} aria-label="মেনু বন্ধ করুন">
            <X size={26} strokeWidth={1.6} />
          </button>
        </div>
        <nav className="flex flex-1 flex-col justify-center gap-2 px-8">
          {NAV_LINKS.map((l, i) => (
            <button
              key={l.id}
              onClick={() => go(l.id)}
              className="display flex items-baseline gap-4 py-2 text-left text-4xl transition-transform duration-700"
              style={{ transform: open ? 'none' : 'translateY(20px)', transitionDelay: `${80 + i * 50}ms` }}
            >
              <span className="font-sans text-sm text-banana">{toBnDigits(`0${i + 1}`)}</span>
              {l.label}
            </button>
          ))}
        </nav>
        <div className="px-8 pb-10">
          <button type="button" onClick={() => go('order')} className="btn btn-primary w-full">
            <ShoppingCart size={19} strokeWidth={2} aria-hidden />
            এখনই অর্ডার করুন
          </button>
        </div>
      </div>
    </>
  );
}
