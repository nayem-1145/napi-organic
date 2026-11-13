import { useEffect, useRef, useState } from 'react';
import { useStore } from '../lib/store';
import { prefersReducedMotion } from '../lib/utils';
import { whatsappUrl } from '../lib/whatsapp';
import { WhatsAppIcon } from './Icons';

const RADIUS = 22;
const CIRC = 2 * Math.PI * RADIUS;

/**
 * Bottom-right stack: scroll-to-top (appears after scrolling, ring shows page progress)
 * above an always-available WhatsApp chat button. Lifts above the mobile sticky order bar.
 */
export function FloatingActions() {
  const [showTop, setShowTop] = useState(false);
  const ringRef = useRef<SVGCircleElement>(null);
  const barUp = useStore((s) => s.stickyBarVisible);
  // on small screens, step aside while the customer is typing in the order form
  const [typing, setTyping] = useState(false);

  useEffect(() => {
    const check = () => {
      const el = document.activeElement;
      setTyping(window.innerWidth < 1024 && !!el?.closest('#order form') && el.matches('input, textarea'));
    };
    // focusout fires before the next element is focused — re-check on the next tick
    const onOut = () => setTimeout(check, 0);
    document.addEventListener('focusin', check);
    document.addEventListener('focusout', onOut);
    return () => {
      document.removeEventListener('focusin', check);
      document.removeEventListener('focusout', onOut);
    };
  }, []);

  useEffect(() => {
    let raf = 0;
    const update = () => {
      raf = 0;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const p = max > 0 ? window.scrollY / max : 0;
      setShowTop(window.scrollY > 500);
      if (ringRef.current) ringRef.current.style.strokeDashoffset = String(CIRC * (1 - p));
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, []);

  const toTop = () => {
    const lenis = (window as unknown as { __lenis?: { scrollTo: (t: number, o?: object) => void } }).__lenis;
    if (lenis) lenis.scrollTo(0, { duration: 1.4 });
    else window.scrollTo({ top: 0, behavior: prefersReducedMotion() ? 'auto' : 'smooth' });
  };

  return (
    <div
      className={`fixed right-4 z-40 flex flex-col items-center gap-3 transition-[bottom,opacity,transform] duration-500 ease-(--ease-premium) sm:right-6 lg:right-8 lg:bottom-8 ${
        barUp ? 'bottom-[6.5rem]' : 'bottom-5'
      } ${typing ? 'pointer-events-none translate-y-4 opacity-0' : ''}`}
    >
      <button
        type="button"
        onClick={toTop}
        aria-label="উপরে ফিরে যান"
        tabIndex={showTop ? 0 : -1}
        aria-hidden={!showTop}
        className={`group relative grid h-12 w-12 place-items-center rounded-full bg-white text-forest shadow-[0_14px_30px_-12px_rgb(18_55_44/0.45)] transition-all duration-500 ease-(--ease-spring) hover:-translate-y-1 hover:bg-forest hover:text-banana ${
          showTop ? 'translate-y-0 scale-100 opacity-100' : 'pointer-events-none translate-y-6 scale-50 opacity-0'
        }`}
      >
        {/* scroll progress ring */}
        <svg viewBox="0 0 48 48" className="absolute inset-0 -rotate-90" aria-hidden>
          <circle cx="24" cy="24" r={RADIUS} fill="none" stroke="rgb(27 77 62 / 0.1)" strokeWidth="2.5" />
          <circle
            ref={ringRef}
            cx="24"
            cy="24"
            r={RADIUS}
            fill="none"
            stroke="#F4A261"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeDasharray={CIRC}
            strokeDashoffset={CIRC}
          />
        </svg>
        <svg viewBox="0 0 24 24" className="relative h-5 w-5 transition-transform duration-300 group-hover:-translate-y-0.5" fill="none" aria-hidden>
          <path d="M12 19V5M5.5 11.5 12 5l6.5 6.5" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      <a
        href={whatsappUrl()}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="WhatsApp-এ কথা বলুন"
        className="group relative grid h-14 w-14 place-items-center rounded-full bg-[#25d366] text-white shadow-[0_16px_32px_-12px_rgb(37_211_102/0.8)] transition-transform duration-300 ease-(--ease-spring) hover:scale-110"
      >
        <WhatsAppIcon size={28} />
        <span className="pointer-events-none absolute right-full mr-3 hidden rounded-full bg-forest-deep px-3 py-1.5 text-sm font-medium whitespace-nowrap text-cream opacity-0 transition-opacity duration-300 group-hover:opacity-100 lg:block">
          WhatsApp-এ কথা বলুন
        </span>
      </a>
    </div>
  );
}
