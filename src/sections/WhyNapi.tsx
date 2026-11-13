import { SectionHeading } from '../components/Brand';
import { Banana, Heart, Leaf, Sparkles } from '../components/Icons';
import { toBnDigits } from '../lib/utils';

const FEATURES = [
  { icon: Banana, title: 'বাছাই করা কলা', text: 'মানসম্মত কলা থেকে তৈরি আমাদের প্রতিটি চিপস।' },
  { icon: Sparkles, title: 'মুচমুচে স্বাদ', text: 'প্রতিটি কামড়ে উপভোগ করুন দারুণ ক্রাঞ্চ।' },
  { icon: Leaf, title: 'সহজ উপাদান', text: 'পরিচিত উপাদানে তৈরি সুস্বাদু স্ন্যাকস।' },
  { icon: Heart, title: 'যত্নসহকারে প্রস্তুত', text: 'প্রস্তুত থেকে প্যাকেজিং পর্যন্ত প্রতিটি ধাপে বিশেষ যত্ন।' },
];

export function WhyNapi() {
  return (
    <section id="why" className="relative bg-forest py-24 text-cream lg:py-36">
      <div className="mx-auto max-w-[1440px] px-5 sm:px-8 lg:px-12">
        <div className="grid gap-10 lg:grid-cols-12">
          <SectionHeading eyebrow="আমাদের প্রতিশ্রুতি" title="কেন Napi Organic?" light className="lg:col-span-5" />
          <p className="self-end text-lg text-cream/70 lg:col-span-4 lg:col-start-9" data-reveal>
            ছোট ছোট বিষয়ে যত্ন — সেখান থেকেই একটি ভালো স্ন্যাকসের শুরু।
          </p>
        </div>

        <ol className="mt-16 grid sm:grid-cols-2 lg:mt-24 lg:grid-cols-4">
          {FEATURES.map(({ icon: Icon, title, text }, i) => (
            <li
              key={title}
              className={`group relative border-t border-cream/15 py-10 sm:pr-8 lg:py-12 ${i % 2 === 1 ? 'lg:translate-y-16' : ''}`}
              data-reveal
            >
              <span className="absolute top-0 left-0 h-px w-full origin-left scale-x-0 bg-banana transition-transform duration-700 ease-(--ease-premium) group-hover:scale-x-100" />
              <div className="flex items-start justify-between">
                <span className="font-display text-5xl text-banana/90 lg:text-6xl">{toBnDigits(`0${i + 1}`)}</span>
                <span className="grid h-12 w-12 place-items-center rounded-full border border-cream/20 text-banana transition-colors duration-500 group-hover:bg-banana group-hover:text-forest">
                  <Icon size={22} strokeWidth={1.5} />
                </span>
              </div>
              <h3 className="display mt-10 text-2xl lg:text-[1.7rem]">{title}</h3>
              <p className="mt-3 max-w-[18rem] text-cream/70">{text}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
