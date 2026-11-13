import { Photo, SectionHeading } from '../components/Brand';
import { site } from '../config/site';
import { asset, toBnDigits } from '../lib/utils';

const STEPS = [
  {
    title: 'সবুজ বাগান থেকে',
    text: 'গল্পের শুরু কলাবাগানে — যেখানে রোদ, মাটি আর সময় মিলে তৈরি হয় স্বাদ।',
    img: () => site.images.plantation,
    brief: 'কলাবাগান, ভোরের নরম আলো, সারি সারি গাছ (প্রশস্ত ফ্রেম)',
    tone: 'green' as const,
  },
  {
    title: 'বাছাই করা কলা',
    text: 'প্রতিটি কলা দেখে-শুনে বাছাই করা হয়, যাতে প্রতিটি চিপসে থাকে একই মান।',
    img: () => asset('images/bananas.webp'),
    brief: '',
    tone: 'warm' as const,
  },
  {
    title: 'ধীরে, যত্নে তৈরি',
    text: 'পাতলা করে কাটা, মসলায় ভেজানো আর ভ্যাকুয়ামে শুকানো — তাড়াহুড়ো ছাড়া।',
    img: () => site.images.preparation,
    brief: 'কলা পাতলা করে কাটা ও শুকানোর প্রক্রিয়া, ক্লোজ-আপ, প্রাকৃতিক আলো',
    tone: 'cream' as const,
  },
  {
    title: 'আপনার হাতে',
    text: 'জিপ-লক প্যাকেটে বন্দি মুচমুচে স্বাদ — যখন খুশি খুলুন, আবার আটকে রাখুন।',
    img: () => asset('images/product-photo.webp'),
    brief: '',
    tone: 'cream' as const,
  },
];

export function BrandStory() {
  return (
    <section id="story" className="relative py-24 lg:py-40">
      <div className="mx-auto max-w-[1440px] px-5 sm:px-8 lg:px-12">
        <SectionHeading eyebrow="আমাদের গল্প" title="প্রকৃতির কাছাকাছি, স্বাদের আরও কাছে" className="max-w-4xl" />

        <div className="mt-16 space-y-20 lg:mt-28 lg:space-y-36">
          {STEPS.map((s, i) => {
            const flip = i % 2 === 1;
            return (
              <article key={s.title} className="grid items-center gap-8 lg:grid-cols-12 lg:gap-10">
                <div className={`lg:col-span-7 ${flip ? 'lg:order-2 lg:col-start-6' : ''}`} data-reveal>
                  <Photo
                    src={s.img()}
                    alt={s.title}
                    brief={s.brief}
                    tone={s.tone}
                    className={`w-full ${i === 0 ? 'aspect-[16/10]' : 'aspect-[4/3]'}`}
                    imgClassName={i === 3 ? 'object-[30%_50%]' : ''}
                  />
                </div>
                <div className={`lg:col-span-4 ${flip ? 'lg:order-1 lg:col-start-1' : 'lg:col-start-9'}`} data-reveal>
                  <span className="font-display text-6xl text-banana lg:text-7xl">{toBnDigits(`0${i + 1}`)}</span>
                  <h3 className="display mt-4 text-3xl text-forest lg:text-4xl">{s.title}</h3>
                  <p className="mt-4 text-lg text-ink-soft">{s.text}</p>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
