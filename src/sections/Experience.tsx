/**
 * Hero + signature scroll story share ONE pinned WebGL stage, so the package
 * you meet in the hero is the very same object that turns, tears open and
 * pours into the bowl. Scroll → GSAP ScrollTrigger (scrub) → progress → engine.
 */
import { useEffect, useRef, useState } from 'react';
import { OrderButton } from '../components/Brand';
import { site } from '../config/site';
import { loadMotion } from '../lib/motion';
import { setStore, useStore } from '../lib/store';
import { Check } from '../components/Icons';
import { asset, clamp, prefersReducedMotion, scrollToId, toBnDigits } from '../lib/utils';
import type { NapiExperience } from '../three/Engine';

/** Fraction of the pinned scroll used by the hero before the story begins. */
const HERO_SPAN = 0.06;

interface Chapter {
  from: number;
  to: number;
  label: string;
  title: string;
  body: string;
}

const CHAPTERS: Chapter[] = [
  {
    from: 0.025,
    to: 0.25,
    label: 'স্বচ্ছতা',
    title: 'লুকানো কিছু নেই',
    body: 'সামনে, পাশে, পেছনে — ঘুরে দেখুন। প্যাকেটের পেছনেই ছাপা আছে প্রতিটি উপাদান।',
  },
  {
    from: 0.285,
    to: 0.5,
    label: 'প্রিজারভেটিভমুক্ত',
    title: 'খুলুন নিশ্চিন্তে',
    body: 'কোনো প্রিজারভেটিভ নেই — ভেতরে শুধু অর্গানিক কলা আর পরিচিত মসলা।',
  },
  {
    from: 0.6,
    to: 0.74,
    label: 'যত্নের প্রক্রিয়া',
    title: 'অর্গানিক কলা, ভ্যাকুয়ামে শুকানো',
    body: 'পাতলা করে কাটা অর্গানিক কলা মসলায় ভিজিয়ে ভ্যাকুয়াম পদ্ধতিতে শুকানো হয়।',
  },
  {
    from: 0.75,
    to: 0.885,
    label: 'টিফিনের সময়',
    title: 'বাচ্চার টিফিনে, পরিবারের নাস্তায়',
    body: 'স্কুলের টিফিন বক্সে, বিকেলের নাস্তায় কিংবা ভ্রমণে — নিশ্চিন্তে দিন।',
  },
];
const FINAL_FROM = 0.915;

const hasWebGL = () => {
  try {
    const c = document.createElement('canvas');
    return !!(c.getContext('webgl2') || c.getContext('webgl'));
  } catch {
    return false;
  }
};

/** opacity for a window with soft edges */
const windowAlpha = (s: number, from: number, to: number, edge = 0.025) =>
  clamp(Math.min((s - from) / edge, (to - s) / edge));

export function Experience() {
  const wrapRef = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const heroRef = useRef<HTMLDivElement>(null);
  const cueRef = useRef<HTMLDivElement>(null);
  const chapterRefs = useRef<(HTMLDivElement | null)[]>([]);
  const finalRef = useRef<HTMLDivElement>(null);
  const railRef = useRef<HTMLDivElement>(null);
  const engineRef = useRef<NapiExperience | null>(null);
  const lastS = useRef(0);
  const status = useStore((s) => s.engine);
  const failedNow = status === 'failed';
  const [reduced] = useState(prefersReducedMotion);
  const [isMobile, setIsMobile] = useState(() => typeof window !== 'undefined' && window.innerWidth < 820);

  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth < 820);
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  // ── 3D engine: lazy-loaded after first paint so the hero is usable immediately
  useEffect(() => {
    if (!hasWebGL()) {
      setStore({ engine: 'failed' });
      return;
    }
    let cancelled = false;
    setStore({ engine: 'loading' });
    const timer = window.setTimeout(async () => {
      try {
        const { NapiExperience } = await import('../three/Engine');
        if (cancelled || !stageRef.current) return;
        const engine = new NapiExperience({
          container: stageRef.current,
          textures: { front: asset('textures/pouch-front.jpg'), back: asset('textures/pouch-back.jpg') },
          reducedMotion: reduced,
          onReady: () => {
            if (cancelled) return;
            setStore({ engine: 'ready', finalShot: engine.snapshot(1) });
          },
        });
        engineRef.current = engine;
        engine.setProgress(lastS.current);
        await engine.init();
      } catch (err) {
        console.warn('[Napi Organic] 3D experience unavailable, showing static visuals.', err);
        if (!cancelled) setStore({ engine: 'failed' });
      }
    }, 60);
    return () => {
      cancelled = true;
      clearTimeout(timer);
      engineRef.current?.dispose();
      engineRef.current = null;
    };
  }, [reduced]);

  // ── scroll → progress
  useEffect(() => {
    const wrap = wrapRef.current;
    if (!wrap || failedNow) return;
    let cleanup = () => {};
    let disposed = false;

    const apply = (P: number) => {
      let s = clamp((P - HERO_SPAN) / (1 - HERO_SPAN));
      if (reduced) s = s < 0.3 ? 0 : s < 0.62 ? 0.5 : 1; // calm, step-wise story
      lastS.current = s;
      engineRef.current?.setProgress(s);

      const hero = heroRef.current;
      if (hero) {
        const h = clamp(P / HERO_SPAN);
        hero.style.opacity = String(1 - h);
        hero.style.transform = `translate3d(0, ${-h * 60}px, 0)`;
        hero.style.visibility = h >= 1 ? 'hidden' : 'visible';
      }
      if (cueRef.current) cueRef.current.style.opacity = String(1 - clamp(P / 0.02));
      CHAPTERS.forEach((c, i) => {
        const el = chapterRefs.current[i];
        if (!el) return;
        const a = reduced ? (s === 0.5 && i === 1 ? 1 : 0) : windowAlpha(s, c.from, c.to);
        el.style.opacity = String(a);
        el.style.transform = `translate3d(0, ${(1 - a) * 24}px, 0)`;
        el.style.visibility = a > 0.001 ? 'visible' : 'hidden';
      });
      if (finalRef.current) {
        const a = clamp((s - FINAL_FROM) / 0.04);
        finalRef.current.style.opacity = String(a);
        finalRef.current.style.transform = `translate3d(0, ${(1 - a) * 30}px, 0)`;
        finalRef.current.style.visibility = a > 0.001 ? 'visible' : 'hidden';
      }
      if (railRef.current) railRef.current.style.transform = `scaleY(${s})`;
    };
    apply(0);

    loadMotion().then((kit) => {
      if (disposed) return;
      if (kit) {
        const state = { p: 0 };
        const tween = kit.gsap.to(state, {
          p: 1,
          ease: 'none',
          onUpdate: () => apply(state.p),
          scrollTrigger: {
            trigger: wrap,
            start: 'top top',
            end: 'bottom bottom',
            scrub: reduced ? true : 0.9,
            invalidateOnRefresh: true,
          },
        });
        cleanup = () => {
          tween.scrollTrigger?.kill();
          tween.kill();
        };
      } else {
        // native fallback (GSAP unavailable)
        const onScroll = () => {
          const r = wrap.getBoundingClientRect();
          apply(clamp(-r.top / Math.max(1, r.height - window.innerHeight)));
        };
        window.addEventListener('scroll', onScroll, { passive: true });
        onScroll();
        cleanup = () => window.removeEventListener('scroll', onScroll);
      }
    });
    return () => {
      disposed = true;
      cleanup();
    };
  }, [failedNow, reduced]);

  const failed = failedNow;
  const ready = status === 'ready';
  const height = failed ? '100svh' : reduced ? '320svh' : isMobile ? '560svh' : '760svh';

  return (
    <>
    <section id="top" ref={wrapRef} className="relative" style={{ height }} aria-label="Napi Organic — পরিচিতি">
      <div className="sticky top-0 h-[100svh] w-full overflow-hidden">
        {/* atmosphere */}
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              'radial-gradient(55% 60% at 72% 52%, rgb(255 209 102 / 0.55), transparent 68%), radial-gradient(35% 40% at 92% 92%, rgb(244 162 97 / 0.38), transparent 70%), radial-gradient(38% 42% at 8% 96%, rgb(127 176 105 / 0.26), transparent 70%), linear-gradient(180deg, #fffaf0 0%, #faf7f2 100%)',
          }}
        />
        {/* slow-moving colour blobs for a living, tropical backdrop */}
        <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className={`absolute top-[12%] right-[6%] h-[46vmin] w-[46vmin] rounded-full bg-banana/45 blur-3xl ${reduced ? '' : 'animate-blob'}`} />
          <div
            className={`absolute right-[24%] bottom-[8%] h-[30vmin] w-[30vmin] rounded-full bg-amber/30 blur-3xl ${reduced ? '' : 'animate-blob'}`}
            style={{ animationDelay: '-6s' }}
          />
        </div>
        <div
          aria-hidden
          className="display pointer-events-none absolute -bottom-[0.18em] left-1/2 -translate-x-1/2 text-[28vw] leading-none whitespace-nowrap text-forest/[0.045] select-none lg:text-[19vw]"
        >
          অর্গানিক
        </div>

        {/* WebGL stage */}
        <div ref={stageRef} className={`absolute inset-0 transition-opacity duration-1000 ${ready ? 'opacity-100' : 'opacity-0'}`} />

        {/* Poster: real package artwork while 3D loads, or permanently if WebGL is unavailable */}
        <div
          className={`pointer-events-none absolute transition-opacity duration-700 ${
            ready ? 'opacity-0' : 'opacity-100'
          } bottom-[9%] left-1/2 h-[36svh] -translate-x-1/2 lg:top-1/2 lg:bottom-auto lg:left-[66%] lg:h-[58vh] lg:-translate-y-1/2`}
        >
          <img
            src={asset('images/pouch-front.webp')}
            alt="Napi Organic Crispy Banana Chips প্যাকেট"
            className={`h-full w-auto drop-shadow-[0_40px_40px_rgb(36_75_53/0.28)] ${reduced ? '' : 'animate-float-soft'}`}
            style={{ clipPath: 'inset(0 round 4% 4% 6% 6%)' }}
            fetchPriority="high"
          />
          {status === 'loading' && (
            <span className="absolute -bottom-8 left-1/2 -translate-x-1/2 text-xs whitespace-nowrap text-ink-soft">
              ৩ডি অভিজ্ঞতা লোড হচ্ছে…
            </span>
          )}
        </div>

        {/* HERO COPY */}
        <div ref={heroRef} className="relative z-10 mx-auto flex h-full max-w-[1440px] px-5 sm:px-8 lg:items-center lg:px-12">
          <div className="max-w-[40rem] pt-24 lg:pt-0">
            <p className="eyebrow mb-5 lg:mb-7">{site.brand.tagline}</p>
            <h1 className="display text-[2.15rem] text-forest sm:text-5xl lg:text-[4.2rem] xl:text-[4.7rem]">
              বাচ্চার টিফিনে
              <br />
              <span className="relative inline-block text-forest-deep">
                <span className="relative z-10">অর্গানিক</span>
                <span aria-hidden className="absolute inset-x-[-0.12em] bottom-[0.08em] -z-0 h-[0.36em] -rotate-1 rounded-full bg-gradient-to-r from-banana to-amber" />
              </span>{' '}
              নাস্তা
            </h1>
            <p className="mt-5 max-w-[30rem] text-[0.98rem] text-ink-soft sm:text-lg lg:mt-7">
              অর্গানিক কলা থেকে তৈরি, প্রিজারভেটিভমুক্ত ব্যানানা চিপস। স্কুলের টিফিন বা বিকেলের নাস্তায় — বাবা-মায়ের নিশ্চিন্ত পছন্দ।
            </p>
            {/* claims printed on the package */}
            <ul className="mt-5 hidden flex-wrap gap-2 sm:flex lg:mt-6" aria-label="প্যাকেটে উল্লেখিত বৈশিষ্ট্য">
              {['অর্গানিক কলা', 'প্রিজারভেটিভ নেই', 'ভিগান ও গ্লুটেন-ফ্রি', 'টিফিন-বান্ধব জিপ-লক'].map((c) => (
                <li key={c} className="glass inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[0.8rem] font-semibold text-forest">
                  <Check size={14} strokeWidth={3} className="text-amber-deep" aria-hidden />
                  {c}
                </li>
              ))}
            </ul>
            <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-2 lg:mt-9">
              <OrderButton className="max-sm:w-full" />
              <button onClick={() => scrollToId('kids')} className="btn btn-ghost max-sm:hidden">
                বাচ্চাদের জন্য কেন?
                <span className="line" />
              </button>
            </div>
            <dl className="mt-12 hidden gap-10 text-sm lg:flex">
              {[
                ['মূল উপাদান', 'অর্গানিক কলা'],
                ['পদ্ধতি', 'ভ্যাকুয়াম ড্রায়েড'],
                ['নেট ওজন', `${toBnDigits(site.product.weightGrams)} গ্রাম`],
              ].map(([k, v]) => (
                <div key={k}>
                  <dt className="text-ink-soft">{k}</dt>
                  <dd className="font-semibold text-forest">{v}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>

        {!failed && (
          <>
            {/* scroll cue */}
            <div ref={cueRef} className="absolute bottom-6 left-1/2 z-10 hidden -translate-x-1/2 flex-col items-center gap-2 text-xs text-ink-soft lg:flex">
              স্ক্রল করে দেখুন
              <span className="relative h-10 w-px overflow-hidden bg-ink/15">
                <span className="animate-cue absolute inset-x-0 top-0 h-1/2 bg-forest" />
              </span>
            </div>

            {/* chapter captions */}
            {CHAPTERS.map((c, i) => (
              <div
                key={c.label}
                ref={(el) => {
                  chapterRefs.current[i] = el;
                }}
                className="invisible absolute inset-x-0 top-0 z-10 px-5 pt-20 opacity-0 sm:px-8 lg:top-1/2 lg:right-auto stage-col lg:max-w-[24rem] lg:-translate-y-1/2 lg:px-0 lg:pt-0"
              >
                <div className="bg-gradient-to-b from-cream via-cream/85 to-transparent pb-10 lg:bg-none lg:pb-0">
                  <p className="mb-3 flex items-center gap-3 text-sm font-medium text-sage">
                    <span className="font-display text-2xl text-banana lg:text-3xl">{toBnDigits(`0${i + 1}`)}</span>
                    <span className="h-px w-8 bg-sage/60" />
                    {c.label}
                  </p>
                  <h2 className="display text-[1.65rem] text-forest lg:text-[2.6rem]">{c.title}</h2>
                  <p className="mt-2 text-[0.95rem] text-ink-soft lg:mt-4 lg:text-lg">{c.body}</p>
                </div>
              </div>
            ))}

            {/* Scene 05: final composition */}
            <div
              ref={finalRef}
              className="invisible absolute inset-x-0 top-0 z-20 px-5 pt-24 opacity-0 sm:px-8 lg:top-1/2 lg:right-auto stage-col lg:max-w-[30rem] lg:-translate-y-1/2 lg:px-0 lg:pt-0"
            >
              <p className="eyebrow mb-4">{toBnDigits('05')} — ভালো থাকার শুরু</p>
              <h2 className="display text-[2.1rem] text-forest lg:text-[3.6rem]">বাচ্চার টিফিনে প্রকৃতির উপাদান।</h2>
              <div className="mt-6 lg:mt-8">
                <OrderButton />
              </div>
            </div>

            {/* progress rail */}
            <div className="absolute top-1/2 right-6 z-10 hidden h-48 w-px -translate-y-1/2 bg-ink/10 lg:block xl:right-10" aria-hidden>
              <div ref={railRef} className="absolute inset-0 origin-top scale-y-0 bg-forest" />
            </div>
          </>
        )}
      </div>
    </section>
    {failed && <StaticStory />}
    </>
  );
}

/** Shown only when WebGL is unavailable: the story's final frame as editorial layout. */
function StaticStory() {
  return (
    <section className="bg-cream-deep/60 py-20 lg:py-28">
      <div className="mx-auto grid max-w-[1440px] items-center gap-10 px-5 sm:px-8 lg:grid-cols-2 lg:px-12">
        <img
          src={asset('images/product-photo.webp')}
          alt="Napi Organic ব্যানানা চিপসের প্যাকেট, কলা ও চিপস"
          className="w-full object-cover"
          loading="lazy"
        />
        <div>
          <h2 className="display text-[2.1rem] text-forest lg:text-[3.4rem]">প্রকৃতির উপাদানে, ভালো থাকার অভ্যাস।</h2>
          <div className="mt-8">
            <OrderButton />
          </div>
        </div>
      </div>
    </section>
  );
}
