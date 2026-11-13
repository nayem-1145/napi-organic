import { OrderButton, SectionHeading } from '../components/Brand';
import { Check, FlaskConicalOff, Sprout, WheatOff } from '../components/Icons';
import { site } from '../config/site';
import { asset } from '../lib/utils';

/**
 * Children first, everyone welcome: why parents can trust it for their kids, and why
 * anyone who wants a pure, unadulterated snack can too. Claims stay within what the
 * package states — no medical or growth claims, no "mild" spice claim (see FAQ).
 */
const CHECKLIST = [
  { icon: Sprout, title: site.claims.organic, text: 'প্যাকেটের উপাদান তালিকায় প্রথমেই “Organic Bananas”।' },
  { icon: FlaskConicalOff, title: 'কোনো প্রিজারভেটিভ নেই', text: 'শিশুর মুখে যা তুলে দিচ্ছেন, তাতে প্রিজারভেটিভ যোগ করা হয়নি।' },
  { icon: Check, title: site.claims.pure, text: 'কলা, নারকেল তেল আর পরিচিত মসলা — এর বাইরে কিছু মেশানো নেই।' },
  { icon: WheatOff, title: 'গ্লুটেন-ফ্রি ও ভিগান', text: 'প্যাকেটে উল্লেখিত — উদ্ভিদভিত্তিক উপাদানে তৈরি।' },
];

const AGES = [
  { title: 'শিশুরা', text: 'স্কুল টিফিন বা বিকেলের নিশ্চিন্ত নাস্তা', tint: 'from-banana to-amber', Icon: ChildIcon },
  { title: 'কিশোর-কিশোরী', text: 'পড়ার ফাঁকে বা খেলার পরে', tint: 'from-[#c5e3ae] to-leaf', Icon: BookIcon },
  { title: 'বড়রা', text: 'অফিসে, ভ্রমণে, চায়ের সাথে', tint: 'from-[#ffd2b0] to-amber', Icon: CupIcon },
  { title: 'পুরো পরিবার', text: 'বিশুদ্ধ নাস্তা, সবাই মিলে', tint: 'from-[#bfe3d6] to-[#7cc3a6]', Icon: HomeIcon },
];

export function KidsSection() {
  const photo = site.images.kids;
  return (
    <section id="kids" className="relative overflow-hidden bg-[#fff6e3] py-24 lg:py-32">
      <Doodles />

      <div className="relative mx-auto max-w-[1440px] px-5 sm:px-8 lg:px-12">
        <div className="grid items-center gap-12 lg:grid-cols-12 lg:gap-14">
          {/* visual */}
          <div className="lg:col-span-5" data-reveal>
            <div className="relative mx-auto max-w-md lg:max-w-none">
              <div aria-hidden className="absolute -inset-3 -rotate-2 rounded-[2.5rem] bg-gradient-to-br from-banana to-amber sm:-inset-4" />
              {photo ? (
                <img
                  src={asset(photo)}
                  alt="বাংলাদেশের গ্রামে কলাগাছ আর ধানক্ষেতের পাশে খেলায় মেতে থাকা শিশুরা"
                  className="relative aspect-[4/3] w-full rounded-[2rem] object-cover lg:aspect-[5/6]"
                  loading="lazy"
                  decoding="async"
                />
              ) : (
                <div className="relative grid aspect-[4/3] w-full place-items-center rounded-[2rem] bg-white p-8 lg:aspect-[5/6]">
                  <Sprout size={96} strokeWidth={1.2} className="text-leaf" aria-hidden />
                </div>
              )}
              <span className="absolute -top-4 -right-2 rotate-6 rounded-full bg-forest px-4 py-2 text-sm font-bold text-banana shadow-lg">
                {site.claims.organic}
              </span>
              <span className="absolute -bottom-4 -left-2 -rotate-3 rounded-2xl bg-white px-4 py-2.5 text-sm font-semibold text-forest shadow-lg">
                ভেজালমুক্ত · প্রিজারভেটিভ নেই
              </span>
            </div>
          </div>

          {/* copy */}
          <div className="lg:col-span-7">
            <SectionHeading
              eyebrow="শিশুদের জন্য"
              title={
                <>
                  ছোট্ট শরীরের জন্য <span className="text-amber-deep">বিশুদ্ধ</span> নাস্তা
                </>
              }
              subtitle="শিশুর মুখে খাবার তুলে দেওয়ার আগে প্রতিটি বাবা-মা জানতে চান — এতে কী আছে? Napi Organic তৈরি ১০০% অর্গানিক কলা থেকে, কোনো প্রিজারভেটিভ বা ভেজাল ছাড়া। তাই নিশ্চিন্তে দিতে পারেন।"
            />

            <p className="mt-9 text-sm font-semibold tracking-wide text-forest" data-reveal>
              বাবা-মায়ের চেকলিস্ট
            </p>
            <ul className="mt-4 grid gap-3 sm:grid-cols-2">
              {CHECKLIST.map(({ icon: Icon, title, text }) => (
                <li key={title} className="group card card-hover flex gap-4 p-5" data-reveal>
                  <span className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-forest text-banana transition-transform duration-500 ease-(--ease-spring) group-hover:scale-110 group-hover:-rotate-6">
                    <Icon size={20} strokeWidth={2.2} aria-hidden />
                  </span>
                  <span>
                    <span className="flex items-center gap-2 font-semibold text-forest">
                      {title}
                      <Check size={16} strokeWidth={3} className="text-sage" aria-label="হ্যাঁ" />
                    </span>
                    <span className="mt-1 block text-sm leading-relaxed text-ink-soft">{text}</span>
                  </span>
                </li>
              ))}
            </ul>

            <div className="mt-9" data-reveal>
              <OrderButton bundleId="family" label="শিশুর জন্য অর্ডার করুন" />
            </div>
          </div>
        </div>

        {/* every age */}
        <div className="mt-20 text-center lg:mt-24" data-reveal>
          <p className="display text-2xl text-forest sm:text-3xl">ছোট থেকে বড় — বিশুদ্ধ নাস্তা যারা ভালোবাসেন, সবার জন্য</p>
          <p className="mx-auto mt-3 max-w-2xl text-ink-soft">শিশুদের কথা ভেবে তৈরি, কিন্তু ভেজালমুক্ত নাস্তা যিনি খোঁজেন — যেকোনো বয়সের মানুষের জন্যই উপযুক্ত।</p>
        </div>
        <ul className="mt-10 grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-4">
          {AGES.map(({ title, text, tint, Icon }) => (
            <li key={title} className="group card card-hover overflow-hidden p-5 text-center sm:p-7" data-reveal>
              <span
                className={`mx-auto grid h-16 w-16 place-items-center rounded-full bg-gradient-to-br text-forest-deep transition-transform duration-500 ease-(--ease-spring) group-hover:-translate-y-1 group-hover:rotate-6 ${tint}`}
              >
                <Icon />
              </span>
              <h3 className="display mt-4 text-lg text-forest sm:text-xl">{title}</h3>
              <p className="mt-1 text-[0.85rem] leading-relaxed text-ink-soft sm:text-sm">{text}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

function Doodles() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0">
      <svg className="absolute top-10 left-[6%] h-10 w-10 text-amber" viewBox="0 0 24 24" fill="currentColor">
        <path d="m12 2 2.6 6.6L21 9.3l-5 4.6 1.4 6.8L12 17.3l-5.4 3.4L8 13.9 3 9.3l6.4-.7Z" />
      </svg>
      <svg className="absolute top-24 right-[8%] h-8 w-24 text-leaf" viewBox="0 0 96 24" fill="none">
        <path d="M2 12c8-10 16-10 24 0s16 10 24 0 16-10 24 0 16 10 20 4" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
      </svg>
      <span className="absolute bottom-16 left-[3%] h-6 w-6 rounded-full bg-banana" />
      <span className="absolute right-[4%] bottom-40 h-4 w-4 rounded-full bg-forest/30" />
      <div className="absolute -top-24 right-1/3 h-72 w-72 rounded-full bg-banana/30 blur-3xl" />
    </div>
  );
}

const svgProps = {
  viewBox: '0 0 24 24',
  className: 'h-8 w-8',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.8,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
  'aria-hidden': true,
};
function ChildIcon() {
  return (
    <svg {...svgProps}>
      <circle cx="12" cy="6" r="3" />
      <path d="M12 9v7M8 12l4-2 4 2M9.5 21l2.5-5 2.5 5" />
    </svg>
  );
}
function BookIcon() {
  return (
    <svg {...svgProps}>
      <path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H20v15H6.5A2.5 2.5 0 0 0 4 20.5v-15Z" />
      <path d="M4 20.5A2.5 2.5 0 0 1 6.5 18H20v3H6.5" />
    </svg>
  );
}
function CupIcon() {
  return (
    <svg {...svgProps}>
      <path d="M4 9h12v5a5 5 0 0 1-5 5H9a5 5 0 0 1-5-5V9Z" />
      <path d="M16 11h1.5a2.5 2.5 0 0 1 0 5H16M8 3v3M12 3v3" />
    </svg>
  );
}
function HomeIcon() {
  return (
    <svg {...svgProps}>
      <path d="M3 11 12 4l9 7" />
      <path d="M5 10v10h14V10M10 20v-5h4v5" />
    </svg>
  );
}
