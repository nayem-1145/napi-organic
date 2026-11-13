import { useEffect } from 'react';
import { Nav } from './components/Nav';
import { loadMotion, startSmoothScroll } from './lib/motion';
import { useStore } from './lib/store';
import { prefersReducedMotion } from './lib/utils';
import { BrandIntro } from './sections/BrandIntro';
import { BrandStory } from './sections/BrandStory';
import { Experience } from './sections/Experience';
import { Faq } from './sections/Faq';
import { FinalCta } from './sections/FinalCta';
import { Footer } from './sections/Footer';
import { Ingredients } from './sections/Ingredients';
import { Lifestyle } from './sections/Lifestyle';
import { ProductShowcase } from './sections/ProductShowcase';
import { Reviews } from './sections/Reviews';
import { WhyNapi } from './sections/WhyNapi';

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
      const { gsap, ScrollTrigger } = kit;
      document.documentElement.classList.add('motion-ready');
      const ctx = gsap.context(() => {
        ScrollTrigger.batch('[data-reveal]', {
          start: 'top 88%',
          once: true,
          onEnter: (els) =>
            gsap.to(els, { opacity: 1, y: 0, duration: 1.1, ease: 'expo.out', stagger: 0.09, overwrite: true }),
        });
        gsap.utils.toArray<HTMLElement>('[data-parallax]').forEach((el) => {
          gsap.fromTo(
            el,
            { yPercent: -6 },
            { yPercent: 6, ease: 'none', scrollTrigger: { trigger: el.parentElement ?? el, scrub: true } },
          );
        });
      });
      killReveals = () => ctx.revert();
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
        <BrandIntro />
        <WhyNapi />
        <ProductShowcase />
        <Ingredients />
        <BrandStory />
        <Lifestyle />
        <Reviews />
        <Faq />
        <FinalCta />
      </main>
      <Footer />
    </>
  );
}
