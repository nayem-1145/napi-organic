/**
 * Lazily loads GSAP + ScrollTrigger (+ Lenis) exactly once.
 * Everything that animates goes through here so the page still works
 * (fully visible, natively scrolling) if these libraries fail to load.
 */
import type { gsap as GsapType } from 'gsap';
import type { ScrollTrigger as ScrollTriggerType } from 'gsap/ScrollTrigger';
import { prefersReducedMotion } from './utils';

export interface MotionKit {
  gsap: typeof GsapType;
  ScrollTrigger: typeof ScrollTriggerType;
}

let kitPromise: Promise<MotionKit | null> | null = null;

export function loadMotion(): Promise<MotionKit | null> {
  if (!kitPromise) {
    kitPromise = Promise.all([import('gsap'), import('gsap/ScrollTrigger')])
      .then(([g, st]) => {
        const gsap = (g.gsap ?? g.default) as typeof GsapType;
        const ScrollTrigger = (st.ScrollTrigger ?? st.default) as typeof ScrollTriggerType;
        gsap.registerPlugin(ScrollTrigger);
        return { gsap, ScrollTrigger };
      })
      .catch((err) => {
        console.warn('[Napi Organic] GSAP failed to load — animations disabled.', err);
        return null;
      });
  }
  return kitPromise;
}

/** Lenis smooth scrolling, synced to GSAP's ticker so ScrollTrigger stays in lock-step. */
export async function startSmoothScroll(): Promise<() => void> {
  if (prefersReducedMotion()) return () => {};
  const kit = await loadMotion();
  try {
    const { default: Lenis } = await import('lenis');
    const lenis = new Lenis({ duration: 1.15, smoothWheel: true, wheelMultiplier: 0.9 });
    (window as unknown as { __lenis?: unknown }).__lenis = lenis;
    let raf = 0;
    let tick: ((time: number) => void) | null = null;
    if (kit) {
      lenis.on('scroll', kit.ScrollTrigger.update);
      tick = (time: number) => lenis.raf(time * 1000);
      kit.gsap.ticker.add(tick);
      kit.gsap.ticker.lagSmoothing(0);
    } else {
      const loop = (t: number) => {
        lenis.raf(t);
        raf = requestAnimationFrame(loop);
      };
      raf = requestAnimationFrame(loop);
    }
    return () => {
      if (kit && tick) kit.gsap.ticker.remove(tick);
      cancelAnimationFrame(raf);
      lenis.destroy();
      delete (window as unknown as { __lenis?: unknown }).__lenis;
    };
  } catch (err) {
    console.warn('[Napi Organic] Lenis unavailable — using native scrolling.', err);
    return () => {};
  }
}
