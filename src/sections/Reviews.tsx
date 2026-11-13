import { useCallback, useEffect, useRef, useState } from 'react';
import { SectionHeading } from '../components/Brand';
import { ChevronLeft, ChevronRight } from '../components/Icons';
import { site } from '../config/site';
import { prefersReducedMotion, toBnDigits } from '../lib/utils';

export function Reviews() {
  const items = site.testimonials;
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const touchX = useRef<number | null>(null);
  const go = useCallback((d: number) => setIndex((i) => (i + d + items.length) % items.length), [items.length]);

  useEffect(() => {
    if (paused || prefersReducedMotion() || items.length < 2) return;
    const t = window.setInterval(() => go(1), 6500);
    return () => clearInterval(t);
  }, [paused, go, items.length]);

  if (!items.length) return null;

  return (
    <section id="reviews" className="relative overflow-hidden py-24 lg:py-36">
      <div className="mx-auto max-w-[1440px] px-5 sm:px-8 lg:px-12">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <SectionHeading eyebrow="মতামত" title="ক্রেতাদের ভালোবাসা" />
          {site.testimonialsAreSamples && (
            <span className="border border-dashed border-sage px-3 py-1.5 text-xs font-medium text-sage">
              নমুনা মতামত — আসল ক্রেতার রিভিউ দিয়ে বদলানো হবে
            </span>
          )}
        </div>

        <div
          className="relative mt-14 lg:mt-20"
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
          onFocusCapture={() => setPaused(true)}
          onBlurCapture={() => setPaused(false)}
          onTouchStart={(e) => (touchX.current = e.touches[0].clientX)}
          onTouchEnd={(e) => {
            if (touchX.current === null) return;
            const dx = e.changedTouches[0].clientX - touchX.current;
            if (Math.abs(dx) > 40) go(dx < 0 ? 1 : -1);
            touchX.current = null;
          }}
          aria-roledescription="carousel"
          aria-label="ক্রেতাদের মতামত"
        >
          <div className="grid lg:grid-cols-12">
            <span aria-hidden className="font-display text-[7rem] leading-none text-banana lg:col-span-2 lg:text-[10rem]">
              “
            </span>
            <div className="relative min-h-[15rem] lg:col-span-9 lg:min-h-[17rem]">
              {items.map((t, i) => (
                <figure
                  key={i}
                  className={`absolute inset-0 transition-[opacity,transform] duration-700 ease-(--ease-premium) ${
                    i === index ? 'opacity-100' : 'pointer-events-none translate-y-6 opacity-0'
                  }`}
                  aria-hidden={i !== index}
                  aria-roledescription="slide"
                  aria-label={`${toBnDigits(i + 1)} / ${toBnDigits(items.length)}`}
                >
                  <blockquote className="display text-[1.6rem] text-forest sm:text-4xl lg:text-[2.9rem]">{t.text}</blockquote>
                  <figcaption className="mt-8 flex items-center gap-4">
                    <span className="grid h-11 w-11 place-items-center rounded-full bg-forest text-sm font-semibold text-cream">
                      {t.name.slice(0, 1)}
                    </span>
                    <span>
                      <span className="block font-semibold">{t.name}</span>
                      <span className="text-sm text-ink-soft">{t.location}</span>
                    </span>
                  </figcaption>
                </figure>
              ))}
            </div>
          </div>

          <div className="mt-12 flex items-center justify-between lg:pl-[16.66%]">
            <div className="flex gap-2" role="tablist" aria-label="মতামত নির্বাচন">
              {items.map((_, i) => (
                <button
                  key={i}
                  role="tab"
                  aria-selected={i === index}
                  aria-label={`মতামত ${toBnDigits(i + 1)}`}
                  onClick={() => setIndex(i)}
                  className="group grid h-11 w-11 place-items-center"
                >
                  <span className={`h-1 rounded-full transition-all duration-500 ${i === index ? 'w-8 bg-forest' : 'w-3 bg-ink/20 group-hover:bg-ink/40'}`} />
                </button>
              ))}
            </div>
            <div className="flex gap-3">
              <button onClick={() => go(-1)} className="grid h-12 w-12 place-items-center rounded-full border border-ink/15 text-forest transition-colors hover:bg-forest hover:text-cream" aria-label="আগের মতামত">
                <ChevronLeft size={20} />
              </button>
              <button onClick={() => go(1)} className="grid h-12 w-12 place-items-center rounded-full border border-ink/15 text-forest transition-colors hover:bg-forest hover:text-cream" aria-label="পরের মতামত">
                <ChevronRight size={20} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
