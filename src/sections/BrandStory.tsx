import { Photo, SectionHeading } from '../components/Brand';
import { site } from '../config/site';
import { asset, toBnDigits } from '../lib/utils';

const STEPS = [
  {
    title: 'সবুজ বাগান থেকে',
    text: 'গল্পের শুরু কলাবাগানে — যেখানে রোদ, মাটি আর সময় মিলে বেড়ে ওঠে অর্গানিক কলা।',
    img: () => site.images.plantation,
    brief: 'কলাবাগান, ভোরের নরম আলো, সারি সারি গাছ (প্রশস্ত ফ্রেম)',
    tone: 'green' as const,
  },
  {
    title: 'বাছাই করা অর্গানিক কলা',
    text: 'মূল উপাদান অর্গানিক কলা — দেখে-শুনে বাছাই করা, যাতে প্রতিটি প্যাকেটে থাকে একই মান।',
    img: () => 'images/bananas.webp',
    brief: '',
    tone: 'warm' as const,
  },
  {
    title: 'ধীরে, যত্নে তৈরি',
    text: 'পাতলা করে কাটা, মসলায় ভেজানো আর ভ্যাকুয়ামে শুকানো — কোনো প্রিজারভেটিভ ছাড়াই।',
    img: () => site.images.preparation,
    brief: 'কলা পাতলা করে কাটা ও শুকানোর প্রক্রিয়া, ক্লোজ-আপ, প্রাকৃতিক আলো',
    tone: 'cream' as const,
  },
  {
    title: 'আপনার হাতে',
    text: 'রিসাইকেলযোগ্য জিপ-লক প্যাকে স্বাস্থ্যকর নাস্তা — যখন খুশি খুলুন, আবার আটকে রাখুন।',
    img: () => 'images/product-photo.webp',
    brief: '',
    tone: 'cream' as const,
  },
];

export function BrandStory() {
  return (
    <section id="story" className="relative py-24 lg:py-40">
      <div className="mx-auto max-w-[1440px] px-5 sm:px-8 lg:px-12">
        <SectionHeading eyebrow="আমাদের গল্প" title="অর্গানিক বাগান থেকে আপনার নাস্তার টেবিলে" className="max-w-4xl" />

        <div className="mt-16 space-y-20 lg:mt-28 lg:space-y-36">
          {STEPS.map((s, i) => {
            const flip = i % 2 === 1;
            return (
              <article key={s.title} className="grid items-center gap-8 lg:grid-cols-12 lg:gap-10">
                <div className={`lg:col-span-7 ${flip ? 'lg:order-2 lg:col-start-6' : ''}`} data-reveal>
                  <Photo
                    src={(() => {
                      const p = s.img();
                      return p && !p.startsWith('http') && !p.startsWith('data:') ? asset(p) : p;
                    })()}
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
