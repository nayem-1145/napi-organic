import { useEffect, useRef, useState } from 'react';
import { SectionHeading } from '../components/Brand';
import { ChevronLeft, ChevronRight, Quote, Stars } from '../components/Icons';
import { site } from '../config/site';
import { toBnDigits } from '../lib/utils';

const AVATAR_TINTS = [
  'from-banana to-amber text-forest-deep',
  'from-forest to-sage text-cream',
  'from-amber to-[#e76f51] text-cream',
  'from-leaf to-forest text-cream',
];

export function Reviews() {
  const items = site.testimonials;
  const trackRef = useRef<HTMLUListElement>(null);
  const [active, setActive] = useState(0);

  // track which card is centred in the mobile slider (for the dots)
  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    const io = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => {
          if (e.isIntersecting) setActive(Number((e.target as HTMLElement).dataset.index));
        }),
      { root: track, threshold: 0.6 },
    );
    Array.from(track.children).forEach((c) => io.observe(c));
    return () => io.disconnect();
  }, [items.length]);

  const scrollTo = (i: number) => {
    const card = trackRef.current?.children[Math.max(0, Math.min(items.length - 1, i))] as HTMLElement | undefined;
    card?.scrollIntoView({ behavior: 'smooth', inline: 'start', block: 'nearest' });
  };

  if (!items.length) return null;

  return (
    <section id="reviews" className="relative overflow-hidden bg-cream py-24 lg:py-32">
      <div aria-hidden className="pointer-events-none absolute top-10 -right-32 h-80 w-80 rounded-full bg-banana/25 blur-3xl" />
      <div className="relative mx-auto max-w-[1440px] px-5 sm:px-8 lg:px-12">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <SectionHeading eyebrow="ক্রেতাদের মতামত" title="সবাই যা বলছেন" />
          {site.testimonialsAreSamples && (
            <span className="rounded-full border border-dashed border-sage px-3.5 py-1.5 text-xs font-medium text-sage">
              নমুনা মতামত — আসল ক্রেতার রিভিউ দিয়ে বদলানো হবে
            </span>
          )}
        </div>
      </div>

      {/* Mobile: swipeable scroll-snap slider · Desktop: grid */}
      <ul
        ref={trackRef}
        className="no-scrollbar relative mx-auto mt-12 flex max-w-[1440px] snap-x snap-mandatory gap-4 overflow-x-auto scroll-px-5 px-5 pb-6 sm:scroll-px-8 sm:px-8 lg:mt-16 lg:grid lg:grid-cols-3 lg:gap-6 lg:overflow-visible lg:px-12"
        aria-label="ক্রেতাদের মতামত"
      >
        {items.map((t, i) => (
          <li
            key={i}
            data-index={i}
            className="group card card-hover w-[85%] shrink-0 snap-start sm:w-[60%] lg:w-auto"
          >
            <figure className="flex h-full flex-col p-7 sm:p-8">
            <div className="flex items-center justify-between">
              <Stars value={t.rating} size={18} />
              <span className="grid h-11 w-11 place-items-center rounded-full bg-banana-soft text-amber-deep transition-transform duration-500 ease-(--ease-spring) group-hover:-rotate-12 group-hover:scale-110">
                <Quote size={20} strokeWidth={2} aria-hidden />
              </span>
            </div>
            <blockquote className="mt-5 flex-1 text-[1.05rem] leading-relaxed text-ink lg:text-lg">“{t.text}”</blockquote>
            <figcaption className="mt-7 flex items-center gap-3.5 border-t border-ink/10 pt-5">
              <span
                className={`grid h-12 w-12 shrink-0 place-items-center rounded-full bg-gradient-to-br text-base font-bold ${
                  AVATAR_TINTS[i % AVATAR_TINTS.length]
                }`}
                aria-hidden
              >
                {t.name.slice(0, 1)}
              </span>
              <span>
                <span className="block font-semibold text-forest">{t.name}</span>
                <span className="text-sm text-ink-soft">{t.location}</span>
              </span>
            </figcaption>
            </figure>
          </li>
        ))}
      </ul>

      {items.length > 1 && (
        <div className="mt-4 flex items-center justify-between px-5 sm:px-8 lg:hidden">
          <div className="flex gap-1.5">
            {items.map((_, i) => (
              <button
                key={i}
                onClick={() => scrollTo(i)}
                aria-label={`মতামত ${toBnDigits(i + 1)}`}
                aria-current={i === active}
                className="grid h-11 w-8 place-items-center"
              >
                <span className={`h-1.5 rounded-full transition-all duration-500 ${i === active ? 'w-7 bg-amber' : 'w-2 bg-ink/20'}`} />
              </button>
            ))}
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => scrollTo(active - 1)}
              disabled={active === 0}
              className="grid h-11 w-11 place-items-center rounded-full bg-white text-forest shadow-sm ring-1 ring-ink/10 transition-colors hover:bg-forest hover:text-cream disabled:opacity-40"
              aria-label="আগের মতামত"
            >
              <ChevronLeft size={20} />
            </button>
            <button
              onClick={() => scrollTo(active + 1)}
              disabled={active === items.length - 1}
              className="grid h-11 w-11 place-items-center rounded-full bg-white text-forest shadow-sm ring-1 ring-ink/10 transition-colors hover:bg-forest hover:text-cream disabled:opacity-40"
              aria-label="পরের মতামত"
            >
              <ChevronRight size={20} />
            </button>
          </div>
        </div>
      )}
    </section>
  );
}
