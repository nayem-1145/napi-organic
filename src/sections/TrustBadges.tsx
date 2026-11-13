import { SectionHeading } from '../components/Brand';
import { FlaskConicalOff, Recycle, ShieldCheck, Sprout, Vegan } from '../components/Icons';
import { toBnDigits } from '../lib/utils';
import { site } from '../config/site';

/**
 * Every badge here is printed on the package (front: "Spice Infused, Vacuum Dried";
 * back: "Organic Bananas", "Vegan", "Gluten-Free", "No Preservatives", "Recyclable Packaging").
 * Do not add claims that are not on the pack.
 */
const BADGES = [
  {
    icon: Sprout,
    title: site.claims.organic,
    text: 'মূল উপাদান অর্গানিক কলা — প্রকৃতি থেকে সরাসরি।',
    tint: 'from-[#e3f1d6] to-[#c5e3ae] text-forest',
  },
  {
    icon: ShieldCheck,
    title: site.claims.pure,
    text: 'প্যাকেটে লেখা উপাদানের বাইরে কিছু মেশানো নেই।',
    tint: 'from-[#ffe2c9] to-amber text-forest-deep',
  },
  {
    icon: FlaskConicalOff,
    title: 'প্রিজারভেটিভ নেই',
    text: 'কোনো প্রিজারভেটিভ যোগ করা হয়নি — শিশুকে নিশ্চিন্তে দিন।',
    tint: 'from-banana-soft to-banana text-forest-deep',
  },
  {
    icon: Vegan,
    title: 'ভিগান ও গ্লুটেন-ফ্রি',
    text: 'উদ্ভিদভিত্তিক উপাদানে তৈরি, গ্লুটেন-মুক্ত।',
    tint: 'from-[#d9eee6] to-[#9fd1bd] text-forest',
  },
];

export function TrustBadges() {
  return (
    <section id="why" className="bg-tropical relative overflow-hidden py-20 lg:py-28">
      <div className="mx-auto max-w-[1440px] px-5 sm:px-8 lg:px-12">
        <SectionHeading
          center
          eyebrow="কেন Napi Organic"
          title="১০০% বিশুদ্ধ, কোনো ভেজাল নেই"
          subtitle="শিশু হোক বা বড় — যা খাচ্ছেন, তা জানার অধিকার সবার। তাই প্রতিটি দাবি আমাদের প্যাকেটেই ছাপা আছে।"
        />

        <ul className="mt-12 grid grid-cols-2 gap-3 sm:gap-5 lg:mt-16 lg:grid-cols-4 lg:gap-6">
          {BADGES.map(({ icon: Icon, title, text, tint }) => (
            <li key={title} className="group card card-hover p-5 sm:p-7" data-reveal>
              <span
                className={`grid h-14 w-14 place-items-center rounded-2xl bg-gradient-to-br shadow-[0_12px_24px_-14px_rgb(233_134_63/0.8)] transition-transform duration-500 ease-(--ease-spring) group-hover:-rotate-6 group-hover:scale-110 sm:h-16 sm:w-16 ${tint}`}
              >
                <Icon size={28} strokeWidth={1.8} aria-hidden />
              </span>
              <h3 className="display mt-5 text-lg text-forest sm:text-[1.35rem]">{title}</h3>
              <p className="mt-1.5 text-sm leading-relaxed text-ink-soft sm:text-[0.95rem]">{text}</p>
            </li>
          ))}
        </ul>

        <p className="mt-8 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-sm font-medium text-ink-soft" data-reveal>
          <span className="inline-flex items-center gap-2">
            <Recycle size={16} className="text-sage" aria-hidden /> রিসাইকেলযোগ্য প্যাকেজিং
          </span>
          <span aria-hidden className="h-1 w-1 rounded-full bg-amber" />
          <span>ভ্যাকুয়াম ড্রায়েড</span>
          <span aria-hidden className="h-1 w-1 rounded-full bg-amber" />
          <span>জিপ-লক প্যাক</span>
          <span aria-hidden className="h-1 w-1 rounded-full bg-amber" />
          <span>নেট ওজন {toBnDigits(site.product.weightGrams)} গ্রাম</span>
        </p>
      </div>
    </section>
  );
}
