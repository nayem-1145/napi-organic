import { site } from '../config/site';
import { useStore } from '../lib/store';
import { asset } from '../lib/utils';

/**
 * Full-bleed cinematic moment. Uses `site.images.lifestyle` when supplied;
 * until then a warm-light composition built from the real chips photography.
 */
export function Lifestyle() {
  const photo = site.images.lifestyle;
  // still rendered by the 3D engine: the opened package beside the filled stoneware bowl
  const shot = useStore((s) => s.finalShot);
  return (
    <section className="grain relative isolate flex min-h-[88svh] items-end overflow-hidden bg-forest-deep text-cream lg:min-h-[100svh]">
      {photo ? (
        <img src={photo} alt="কাঠের টেবিলে সিরামিক বাটিতে সোনালি ব্যানানা চিপস" className="absolute inset-0 -z-10 h-full w-full object-cover" data-parallax loading="lazy" />
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
      <div className="relative mx-auto w-full max-w-[1440px] px-5 pb-20 sm:px-8 lg:px-12 lg:pb-28">
        <p className="eyebrow mb-6 !text-banana" data-reveal>
          প্রতিদিনের মুহূর্ত
        </p>
        <h2 className="display max-w-4xl text-[2.3rem] sm:text-6xl lg:text-[4.8rem]" data-reveal>
          আড্ডা হোক কিংবা অবসর, মুচমুচে স্বাদ থাকুক পাশে।
        </h2>
        {!photo && site.showPlaceholderNotes && (
          <p className="mt-8 text-xs text-cream/50">
            ফটো প্লেসহোল্ডার: কাঠের টেবিলে সিরামিক বাটিতে সোনালি চিপস, জানালা দিয়ে আসা উষ্ণ রোদ।
          </p>
        )}
      </div>
    </section>
  );
}
