import { useEffect } from 'react';
import { Nav } from './components/Nav';
import { FloatingActions } from './components/FloatingActions';
import { StickyOrderBar } from './components/StickyOrderBar';
import { loadMotion, startSmoothScroll } from './lib/motion';
import { useStore } from './lib/store';
import { prefersReducedMotion } from './lib/utils';
import { BrandIntro } from './sections/BrandIntro';
import { BrandStory } from './sections/BrandStory';
import { Experience } from './sections/Experience';
import { Faq } from './sections/Faq';
import { OrderSection } from './sections/OrderSection';
import { Footer } from './sections/Footer';
import { Ingredients } from './sections/Ingredients';
import { KidsSection } from './sections/KidsSection';
import { Lifestyle } from './sections/Lifestyle';
import { ProductShowcase } from './sections/ProductShowcase';
import { Reviews } from './sections/Reviews';
import { TrustBadges } from './sections/TrustBadges';

export default function App() {
  const engine = useStore((s) => s.engine);

  // smooth scrolling + scroll-reveal choreography
  useEffect(() => {
    let stopScroll = () => {};
    let killReveals = () => {};
    let cancelled = false;
    startSmoothScroll().then((stop) => (cancelled ? stop() : (stopScroll = stop)));
    loadMotion().then((kit) => {
      if (!kit || cancelled || prefersReducedMotion()) return;
      const { gsap } = kit;
      document.documentElement.classList.add('motion-ready');
      // Reveal on actual visibility (IntersectionObserver), not precomputed scroll
      // positions — those go stale when the pinned 3D section or images resize,
      // which left elements hidden after fast scrolls on mobile.
      const io = new IntersectionObserver(
        (entries) => {
          const els = entries.filter((e) => e.isIntersecting).map((e) => e.target as HTMLElement);
          if (!els.length) return;
          els.forEach((el) => io.unobserve(el));
          gsap.to(els, {
            opacity: 1,
            y: 0,
            duration: 1.1,
            ease: 'expo.out',
            stagger: 0.09,
            overwrite: true,
            // hand control back to CSS so hover transforms on cards keep working
            onComplete: () =>
              els.forEach((el) => {
                el.setAttribute('data-revealed', '');
                gsap.set(el, { clearProps: 'transform,opacity' });
              }),
          });
        },
        { rootMargin: '0px 0px -12% 0px' },
      );
      document.querySelectorAll('[data-reveal]').forEach((el) => io.observe(el));
      const stopObserving = () => io.disconnect();

      const ctx = gsap.context(() => {
        gsap.utils.toArray<HTMLElement>('[data-parallax]').forEach((el) => {
          gsap.fromTo(
            el,
            { yPercent: -6 },
            { yPercent: 6, ease: 'none', scrollTrigger: { trigger: el.parentElement ?? el, scrub: true } },
          );
        });
      });
      killReveals = () => {
        stopObserving();
        ctx.revert();
      };
    });
    return () => {
      cancelled = true;
      stopScroll();
      killReveals();
      document.documentElement.classList.remove('motion-ready');
    };
  }, []);

  // the pinned story changes height once the 3D engine resolves → re-measure triggers
  useEffect(() => {
    loadMotion().then((kit) => kit?.ScrollTrigger.refresh());
  }, [engine]);

  return (
    <>
      <a href="#brand" className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[100] focus:bg-forest focus:px-4 focus:py-2 focus:text-cream">
        মূল বিষয়বস্তুতে যান
      </a>
      <Nav />
      <main>
        <Experience />
        <KidsSection />
        <TrustBadges />
        <BrandIntro />
        <ProductShowcase />
        <Ingredients />
        <Reviews />
        <BrandStory />
        <Lifestyle />
        <Faq />
        <OrderSection />
      </main>
      <Footer />
      <StickyOrderBar />
      <FloatingActions />
    </>
  );
}
