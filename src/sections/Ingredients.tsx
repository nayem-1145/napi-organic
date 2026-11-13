import type { ReactNode } from 'react';
import { FlaskConicalOff, Sparkles, Vegan, WheatOff } from '../components/Icons';
import { site } from '../config/site';
import { asset } from '../lib/utils';

/* Stylised "specimen" plates. The banana uses real photography from the package shoot;
   the others are drawn until dedicated ingredient photography is supplied. */
const Oil = () => (
  <svg viewBox="0 0 120 120" className="h-full w-full" aria-hidden>
    <defs>
      <radialGradient id="oil" cx="38%" cy="40%" r="70%">
        <stop offset="0" stopColor="#fffbe8" />
        <stop offset=".4" stopColor="#f6e2a4" />
        <stop offset="1" stopColor="#d9b25a" />
      </radialGradient>
    </defs>
    <path d="M60 18 C60 18 34 52 34 72 a26 26 0 0 0 52 0 C86 52 60 18 60 18Z" fill="url(#oil)" />
    <ellipse cx="50" cy="66" rx="5" ry="10" fill="#fff" opacity=".6" transform="rotate(18 50 66)" />
  </svg>
);
const Salt = () => (
  <svg viewBox="0 0 120 120" className="h-full w-full" aria-hidden>
    {Array.from({ length: 34 }, (_, i) => {
      const a = i * 2.39996;
      const r = 6 + Math.sqrt(i) * 7.2;
      const s = 5 + ((i * 7) % 5);
      return (
        <rect
          key={i}
          x={60 + Math.cos(a) * r - s / 2}
          y={62 + Math.sin(a) * r * 0.8 - s / 2}
          width={s}
          height={s}
          rx="1"
          fill={i % 3 ? '#fbf7ef' : '#efd9cf'}
          stroke="#d4c3b1"
          strokeWidth=".6"
          transform={`rotate(${(i * 37) % 90} ${60 + Math.cos(a) * r} ${62 + Math.sin(a) * r * 0.8})`}
        />
      );
    })}
  </svg>
);
const Spice = () => (
  <svg viewBox="0 0 120 120" className="h-full w-full" aria-hidden>
    {Array.from({ length: 46 }, (_, i) => {
      const a = i * 2.39996;
      const r = 4 + Math.sqrt(i) * 6.4;
      const colors = ['#a8341a', '#7a4a1e', '#c9852b', '#3d2a17', '#8c6a2a'];
      const cumin = i % 4 === 0;
      return (
        <ellipse
          key={i}
          cx={60 + Math.cos(a) * r}
          cy={62 + Math.sin(a) * r * 0.85}
          rx={cumin ? 4.5 : 1.6 + (i % 3)}
          ry={cumin ? 1.4 : 1.6 + (i % 3)}
          fill={colors[i % colors.length]}
          transform={`rotate(${(i * 53) % 180} ${60 + Math.cos(a) * r} ${62 + Math.sin(a) * r * 0.85})`}
        />
      );
    })}
  </svg>
);
const Sugar = () => (
  <svg viewBox="0 0 120 120" className="h-full w-full" aria-hidden>
    {Array.from({ length: 40 }, (_, i) => {
      const a = i * 2.39996;
      const r = 5 + Math.sqrt(i) * 6.8;
      const x = 60 + Math.cos(a) * r;
      const y = 62 + Math.sin(a) * r * 0.82;
      const s = 3 + (i % 4);
      return (
        <polygon
          key={i}
          points={`${x},${y - s} ${x + s},${y} ${x},${y + s} ${x - s},${y}`}
          fill={['#a5482a', '#c2643a', '#8a3a20', '#d8834f'][i % 4]}
          opacity=".92"
        />
      );
    })}
  </svg>
);
const Mango = () => (
  <svg viewBox="0 0 120 120" className="h-full w-full" aria-hidden>
    <defs>
      <radialGradient id="mango" cx="45%" cy="30%" r="75%">
        <stop offset="0" stopColor="#fff0b8" />
        <stop offset=".55" stopColor="#f2c25a" />
        <stop offset="1" stopColor="#d1923a" />
      </radialGradient>
    </defs>
    <path d="M22 86 C30 60 46 46 60 46 C74 46 90 60 98 86 Z" fill="url(#mango)" />
    {Array.from({ length: 26 }, (_, i) => {
      const a = i * 2.39996;
      const r = 8 + Math.sqrt(i) * 7;
      return <circle key={i} cx={60 + Math.cos(a) * r * 1.3} cy={90 + Math.sin(a) * 4} r={0.9 + (i % 3) * 0.5} fill="#e2a948" opacity=".8" />;
    })}
  </svg>
);

const ITEMS: { name: string; note: string; tint: string; visual: ReactNode; photo?: boolean }[] = [
  {
    name: 'অর্গানিক কলা',
    note: 'মূল উপাদান — প্রকৃতি থেকে সরাসরি',
    tint: 'from-banana-soft to-banana',
    photo: true,
    visual: <img src={asset('images/bananas.webp')} alt="পাকা কলা" className="h-full w-full object-cover" loading="lazy" />,
  },
  { name: 'নারকেল তেল', note: 'হালকা সুবাস আর সোনালি রং', tint: 'from-[#fffaf0] to-[#f6e7c4]', visual: <Oil /> },
  { name: 'লাল চিনি', note: 'মিষ্টি-ঝাল গ্লেজের ভারসাম্য', tint: 'from-[#fff1e6] to-[#ffd2b0]', visual: <Sugar /> },
  { name: 'শুকনো আমের গুঁড়া', note: 'লাইমের মতো টক ঝাঁঝ', tint: 'from-[#fff6d6] to-[#ffe08a]', visual: <Mango /> },
  { name: 'জিরা, ধনিয়া ও গোলমরিচ', note: 'চিলি লাইমের মসলাদার উষ্ণতা', tint: 'from-[#fdeee2] to-[#f7c9a1]', visual: <Spice /> },
  { name: 'মিনারেল সল্ট ব্লেন্ড', note: 'স্বাদকে করে পূর্ণ', tint: 'from-[#f4f7f2] to-[#dbe9d3]', visual: <Salt /> },
];

const BENEFITS = [
  { icon: Vegan, label: 'ভিগান' },
  { icon: WheatOff, label: 'গ্লুটেন-ফ্রি' },
  { icon: FlaskConicalOff, label: 'প্রিজারভেটিভ নেই' },
  { icon: Sparkles, label: 'ভ্যাকুয়াম ড্রায়েড' },
];

export function Ingredients() {
  return (
    <section id="ingredients" className="bg-tropical relative py-24 lg:py-32">
      <div className="mx-auto grid max-w-[1440px] gap-8 px-5 sm:px-8 lg:grid-cols-12 lg:gap-10 lg:px-12">
        {/* Transparency card — mirrors the back of the pack */}
        <div className="lg:col-span-5">
          <div className="relative overflow-hidden rounded-[2rem] bg-forest p-7 text-cream sm:p-10 lg:sticky lg:top-28" data-reveal>
            <div aria-hidden className="pointer-events-none absolute -top-24 -right-24 h-64 w-64 rounded-full bg-banana/25 blur-3xl" />
            <p className="eyebrow eyebrow-light">উপাদান ও উপকারিতা</p>
            <h2 className="display mt-5 text-[2rem] sm:text-[2.6rem]">যা খাচ্ছেন, তা জানুন</h2>
            <p className="mt-4 text-cream/75">
              অর্গানিক কলা আর পরিচিত, সহজ উপাদান — কোনো প্রিজারভেটিভ নয়। নিচের তালিকা হুবহু প্যাকেটের পেছন থেকে নেওয়া।
            </p>

            <ul className="mt-7 grid grid-cols-2 gap-2.5">
              {BENEFITS.map(({ icon: Icon, label }) => (
                <li
                  key={label}
                  className="flex items-center gap-2.5 rounded-2xl bg-white/[0.07] px-3.5 py-3 text-sm font-semibold ring-1 ring-white/10 transition-colors duration-300 hover:bg-white/[0.12]"
                >
                  <span className="grid h-8 w-8 shrink-0 place-items-center rounded-xl bg-banana text-forest-deep">
                    <Icon size={17} strokeWidth={2} aria-hidden />
                  </span>
                  {label}
                </li>
              ))}
            </ul>

            <figure className="mt-7 rounded-2xl bg-forest-deep/60 p-5 ring-1 ring-white/10">
              <figcaption className="text-xs font-semibold tracking-[0.14em] text-banana uppercase">Ingredients — প্যাকেট থেকে</figcaption>
              <p className="mt-2 text-sm leading-relaxed text-cream/85" lang="en">
                Organic Bananas, Coconut Oil, Red Sugar, Cumin, Coriander, Dried Mango Powder, Black Pepper, Mineral Salt Blend and
                Selected Spices.
              </p>
            </figure>
          </div>
        </div>

        {/* Ingredient cards */}
        <ul className="grid grid-cols-2 gap-3 sm:gap-5 lg:col-span-7 lg:grid-cols-3 lg:gap-6">
          {ITEMS.map((it) => (
            <li key={it.name} className="group card card-hover flex flex-col items-center p-4 text-center sm:p-6" data-reveal>
              <div
                className={`relative aspect-square w-full max-w-[9rem] overflow-hidden rounded-full bg-gradient-to-br shadow-[inset_0_0_0_1px_rgb(31_42_36/0.06)] transition-transform duration-700 ease-(--ease-spring) group-hover:scale-[1.06] group-hover:rotate-3 ${it.tint} ${
                  it.photo ? '' : 'p-4'
                }`}
              >
                {it.visual}
              </div>
              <h3 className="display mt-5 text-[1.05rem] leading-snug text-forest sm:text-xl">{it.name}</h3>
              <p className="mt-1 text-[0.8rem] text-ink-soft sm:text-sm">{it.note}</p>
            </li>
          ))}
          {site.showPlaceholderNotes && (
            <li className="col-span-full text-center text-xs text-ink-soft/80">
              কলার ছবিটি আসল প্রোডাক্ট শুট থেকে; বাকিগুলো প্রতীকী চিত্র — উপাদানের আসল ফটোগ্রাফি পেলে বদলে দেওয়া হবে।
            </li>
          )}
        </ul>
      </div>
    </section>
  );
}
