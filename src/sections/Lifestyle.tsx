import { site } from '../config/site';
import { useStore } from '../lib/store';
import { asset } from '../lib/utils';

/**
 * Full-bleed cinematic moment. Uses `site.images.lifestyle` when supplied (children
 * playing in a Bangladeshi village — text sits over the sky at the top); otherwise a
 * warm-light composition built from the real chips photography.
 */
export function Lifestyle() {
  const photo = site.images.lifestyle;
  // still rendered by the 3D engine: the opened package beside the filled stoneware bowl
  const shot = useStore((s) => s.finalShot);
  return (
    <section
      id="moments"
      className={`grain relative isolate flex min-h-[88svh] overflow-hidden bg-forest-deep text-cream lg:min-h-[100svh] ${
        photo ? 'items-start' : 'items-end'
      }`}
    >
      {photo ? (
        <div className="absolute inset-0 -z-10">
          <img
            src={asset(photo)}
            alt="বাংলাদেশের হাওর এলাকার গ্রামে সাইকেলের টায়ার নিয়ে দৌড়ে খেলছে একদল শিশু"
            className="h-full w-full scale-110 object-cover object-[50%_85%]"
            data-parallax
            loading="lazy"
            decoding="async"
          />
          {/* darken the sky so the headline reads, keep the children bright */}
          <div className="absolute inset-0 bg-gradient-to-b from-forest-deep/90 via-forest-deep/45 to-transparent" />
        </div>
      ) : (
        <div className="absolute inset-0 -z-10" aria-hidden>
          {/* sunlight through a window */}
          <div className="absolute -top-1/4 -right-1/4 h-[130%] w-[90%] rotate-12 bg-[radial-gradient(closest-side,rgb(255_214_140/0.55),transparent)] blur-2xl" />
          <div className="absolute inset-0 bg-[repeating-linear-gradient(100deg,transparent_0_9%,rgb(255_220_160/0.06)_9%_12%)]" />
          {/* wooden table */}
          <div className="absolute inset-x-0 bottom-0 h-[38%] bg-gradient-to-b from-[#6b4526] to-[#3e2614]" />
          <div className="absolute inset-x-0 bottom-0 h-[38%] opacity-30 [background:repeating-linear-gradient(178deg,transparent_0_14px,rgb(0_0_0/0.25)_14px_15px)]" />
          {shot ? (
            <img src={shot} alt="" className="absolute inset-0 h-full w-full object-cover object-[75%_50%] max-lg:object-[60%_50%]" />
          ) : (
            <img
              src={asset('images/chips-pile.webp')}
              alt=""
              className="absolute right-[4%] bottom-[18%] w-[min(70vw,780px)] [mask-image:radial-gradient(closest-side,#000_62%,transparent)]"
              data-parallax
              loading="lazy"
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-r from-forest-deep via-forest-deep/70 to-transparent" />
        </div>
      )}
      <div className={`relative mx-auto w-full max-w-[1440px] px-5 sm:px-8 lg:px-12 ${photo ? 'pt-28 lg:pt-36' : 'pb-20 lg:pb-28'}`}>
        <p className="eyebrow eyebrow-light mb-6" data-reveal>
          বাংলার মাটি থেকে
        </p>
        <h2 className="display max-w-4xl text-[2.3rem] text-balance sm:text-6xl lg:text-[4.6rem]" data-reveal>
          ছোটদের হাসিতে, বড়দের আড্ডায় — বিশুদ্ধ নাস্তা থাকুক সবসময়।
        </h2>
      </div>
    </section>
  );
}
