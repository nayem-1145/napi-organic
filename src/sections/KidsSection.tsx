import { OrderButton, SectionHeading } from '../components/Brand';
import { Check, FlaskConicalOff, Sprout, Vegan, WheatOff } from '../components/Icons';
import { site } from '../config/site';

/**
 * Parent-facing section: why this is a good tiffin snack for children.
 * Claims stay within what the package states — no medical or growth claims,
 * no "mild" spice claim (the flavour is chili lime; see FAQ).
 */
const CHECKLIST = [
  { icon: Sprout, title: 'মূল উপাদান অর্গানিক কলা', text: 'প্যাকেটের উপাদান তালিকায় প্রথমেই “Organic Bananas”।' },
  { icon: FlaskConicalOff, title: 'কোনো প্রিজারভেটিভ নেই', text: 'বাচ্চার টিফিনে যা দিচ্ছেন, তাতে প্রিজারভেটিভ যোগ করা হয়নি।' },
  { icon: WheatOff, title: 'গ্লুটেন-ফ্রি ও ভিগান', text: 'প্যাকেটে উল্লেখিত — উদ্ভিদভিত্তিক উপাদানে তৈরি।' },
  { icon: Check, title: 'পড়ে বোঝা যায় এমন উপাদান', text: 'কলা, নারকেল তেল, মসলা — অচেনা রাসায়নিক নামের লম্বা তালিকা নেই।' },
];

const MOMENTS = [
  { title: 'স্কুল টিফিন', text: 'জিপ-লক প্যাক থেকে অল্প করে টিফিন বক্সে', tint: 'from-banana to-amber', emoji: TiffinIcon },
  { title: 'বিকেলের নাস্তা', text: 'স্কুল থেকে ফিরে হালকা কিছু', tint: 'from-[#c5e3ae] to-leaf', emoji: SunIcon },
  { title: 'খেলার ফাঁকে', text: 'মাঠে, পার্কে বা কোচিংয়ের বিরতিতে', tint: 'from-[#ffd2b0] to-amber', emoji: BallIcon },
  { title: 'ভ্রমণে', text: 'ব্যাগে সহজে বহনযোগ্য, আবার আটকে রাখা যায়', tint: 'from-[#bfe3d6] to-[#7cc3a6]', emoji: BagIcon },
];

export function KidsSection() {
  const photo = site.images.kids;
  return (
    <section id="kids" className="relative overflow-hidden bg-[#fff6e3] py-24 lg:py-32">
      {/* playful doodles */}
      <Doodles />

      <div className="relative mx-auto max-w-[1440px] px-5 sm:px-8 lg:px-12">
        <div className="grid items-center gap-12 lg:grid-cols-12 lg:gap-14">
          {/* visual */}
          <div className="lg:col-span-5" data-reveal>
            <div className="relative mx-auto max-w-md">
              <div aria-hidden className="absolute -inset-4 -rotate-3 rounded-[2.5rem] bg-gradient-to-br from-banana to-amber" />
              {photo ? (
                <img
                  src={photo}
                  alt="স্কুলের টিফিন বক্সে Napi Organic ব্যানানা চিপস"
                  className="relative aspect-[5/4] w-full rounded-[2rem] object-cover sm:aspect-[4/5]"
                  loading="lazy"
                />
              ) : (
                <div className="relative grid aspect-[5/4] w-full place-items-center rounded-[2rem] bg-white p-8 pt-12 sm:aspect-[4/5]">
                  <LunchboxIllustration />
                  {site.showPlaceholderNotes && (
                    <p className="absolute inset-x-8 top-7 text-center text-xs text-ink-soft/80 sm:top-8">
                      ফটো প্লেসহোল্ডার: স্কুল ব্যাগের পাশে টিফিন বক্সে চিপস, হাসিমুখে বাচ্চা
                    </p>
                  )}
                </div>
              )}
              <span className="absolute -top-5 -right-3 rotate-6 rounded-full bg-forest px-4 py-2 text-sm font-bold text-banana shadow-lg">
                টিফিন-বান্ধব
              </span>
              <span className="absolute -bottom-4 -left-3 -rotate-3 rounded-2xl bg-white px-4 py-2.5 text-sm font-semibold text-forest shadow-lg">
                প্রিজারভেটিভ নেই
              </span>
            </div>
          </div>

          {/* copy */}
          <div className="lg:col-span-7">
            <SectionHeading
              eyebrow="বাচ্চাদের জন্য"
              title={
                <>
                  বাচ্চার টিফিনে দিন <span className="text-amber-deep">নিশ্চিন্তে</span>
                </>
              }
              subtitle="বাচ্চার টিফিন বক্সে কী দিচ্ছেন — এই প্রশ্নটা প্রতিদিনের। Napi Organic ব্যানানা চিপস তৈরি অর্গানিক কলা থেকে, কোনো প্রিজারভেটিভ ছাড়া। তাই প্যাকেট খুলে নিশ্চিন্তে দিতে পারেন।"
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

            <div className="mt-9 flex flex-wrap items-center gap-4" data-reveal>
              <OrderButton bundleId="family" label="বাচ্চার জন্য অর্ডার করুন" />
              <span className="text-sm text-ink-soft">
                <Vegan size={16} className="mr-1 inline text-sage" aria-hidden />
                পুরো পরিবার একসাথে খেতে পারে
              </span>
            </div>
          </div>
        </div>

        {/* everyday moments */}
        <ul className="mt-20 grid grid-cols-2 gap-3 sm:gap-5 lg:mt-24 lg:grid-cols-4">
          {MOMENTS.map(({ title, text, tint, emoji: Icon }) => (
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

/* ── Illustrations (simple, brand-coloured, replaceable by real photography) ── */

function LunchboxIllustration() {
  return (
    <svg viewBox="0 0 320 340" className="h-full max-h-full w-auto max-w-[19rem]" role="img" aria-label="টিফিন বক্সে ব্যানানা চিপস ও একটি কলা">
      {/* lid */}
      <rect x="40" y="38" width="240" height="70" rx="22" fill="#1B4D3E" transform="rotate(-8 160 73)" />
      <rect x="128" y="22" width="64" height="22" rx="11" fill="#12372C" transform="rotate(-8 160 33)" />
      <circle cx="96" cy="76" r="8" fill="#FFD166" transform="rotate(-8 160 73)" />
      <circle cx="224" cy="58" r="8" fill="#F4A261" />
      {/* box */}
      <rect x="30" y="130" width="260" height="170" rx="30" fill="#2A6B55" />
      <rect x="44" y="144" width="232" height="142" rx="22" fill="#FFF3CF" />
      <line x1="170" y1="150" x2="170" y2="280" stroke="#F4A261" strokeWidth="4" strokeLinecap="round" opacity=".6" />
      {/* chips */}
      {[
        [78, 196, 24],
        [112, 186, 22],
        [92, 228, 23],
        [128, 222, 21],
        [80, 262, 19],
        [140, 258, 20],
        [110, 252, 18],
      ].map(([cx, cy, r], i) => (
        <g key={i}>
          <circle cx={cx} cy={cy} r={r} fill="#F2C25A" stroke="#D99A35" strokeWidth="2.5" />
          <circle cx={cx} cy={cy} r={r * 0.45} fill="none" stroke="#D99A35" strokeWidth="1.5" strokeDasharray="2 4" />
        </g>
      ))}
      {/* banana */}
      <path d="M190 252 C 205 200, 240 175, 262 172 C 268 182, 262 186, 256 188 C 236 196, 214 222, 206 258 Z" fill="#FFD166" stroke="#E9A93A" strokeWidth="3" strokeLinejoin="round" />
      <path d="M258 172 l8 -10" stroke="#7A5A22" strokeWidth="5" strokeLinecap="round" />
      {/* smile on box */}
      <path d="M140 312 q20 14 40 0" stroke="#FFD166" strokeWidth="5" fill="none" strokeLinecap="round" />
      {/* sparkles */}
      <path d="M288 120 l4 10 10 4 -10 4 -4 10 -4 -10 -10 -4 10 -4z" fill="#F4A261" />
      <path d="M22 110 l3 7 7 3 -7 3 -3 7 -3 -7 -7 -3 7 -3z" fill="#7FB069" />
    </svg>
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

function TiffinIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-8 w-8" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden>
      <rect x="3" y="9" width="18" height="11" rx="3" />
      <path d="M3 13h18M9 6h6M12 6v3" />
    </svg>
  );
}
function SunIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-8 w-8" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden>
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
    </svg>
  );
}
function BallIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-8 w-8" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden>
      <circle cx="12" cy="12" r="9" />
      <path d="M3.5 9.5c5 1 12 1 17 0M3.5 14.5c5-1 12-1 17 0M12 3c-3 5-3 13 0 18M12 3c3 5 3 13 0 18" />
    </svg>
  );
}
function BagIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-8 w-8" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M6 8h12l-1 12H7L6 8Z" />
      <path d="M9 8V6a3 3 0 0 1 6 0v2" />
    </svg>
  );
}
