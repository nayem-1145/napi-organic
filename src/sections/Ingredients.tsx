import type { ReactNode } from 'react';
import { SectionHeading } from '../components/Brand';
import { site } from '../config/site';
import { asset } from '../lib/utils';

/* Stylised "specimen" plates. The banana uses real photography from the package shoot;
   the others are drawn until dedicated ingredient photography is supplied. */
const Oil = () => (
  <svg viewBox="0 0 120 120" className="h-full w-full" aria-hidden>
    <defs>
      <radialGradient id="oil" cx="38%" cy="40%" r="70%">
        <stop offset="0" stopColor="#fff3c4" />
        <stop offset=".35" stopColor="#f2c65a" />
        <stop offset="1" stopColor="#b9801f" />
      </radialGradient>
    </defs>
    <path d="M60 18 C60 18 34 52 34 72 a26 26 0 0 0 52 0 C86 52 60 18 60 18Z" fill="url(#oil)" />
    <ellipse cx="50" cy="66" rx="5" ry="10" fill="#fff" opacity=".55" transform="rotate(18 50 66)" />
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
          fill={i % 3 ? '#f4efe6' : '#e2d6c8'}
          stroke="#cbbfae"
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
      const colors = ['#a8341a', '#7a4a1e', '#c9852b', '#5a3a1a', '#8c6a2a'];
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
          fill={['#b5672a', '#cf8a3d', '#9b5422', '#e0a35a'][i % 4]}
          opacity=".92"
        />
      );
    })}
  </svg>
);

const ITEMS: { name: string; note: string; visual: ReactNode }[] = [
  {
    name: 'কলা',
    note: 'মূল উপাদান',
    visual: <img src={asset('images/bananas.webp')} alt="পাকা কলা" className="h-full w-full object-cover" loading="lazy" />,
  },
  { name: 'উদ্ভিজ্জ তেল', note: 'ভাজার জন্য', visual: <Oil /> },
  { name: 'মিনারেল সল্ট ব্লেন্ড', note: 'স্বাদের ভারসাম্যে', visual: <Salt /> },
  { name: 'নির্বাচিত মসলা', note: 'চিলি লাইমের ঝাঁঝ', visual: <Spice /> },
  { name: 'চিনি', note: 'হালকা গ্লেজ', visual: <Sugar /> },
];

export function Ingredients() {
  return (
    <section id="ingredients" className="relative bg-cream-deep/50 py-24 lg:py-36">
      <div className="mx-auto max-w-[1440px] px-5 sm:px-8 lg:px-12">
        <div className="grid gap-8 lg:grid-cols-12">
          <SectionHeading eyebrow="উপাদান" title="স্বাদে যা যা থাকছে" className="lg:col-span-6" />
          <p className="self-end text-lg text-ink-soft lg:col-span-4 lg:col-start-9" data-reveal>
            পরিচিত, সহজ উপাদান — বাড়তি কিছু নয়। পূর্ণ তালিকা প্যাকেটের পেছনে দেওয়া আছে।
          </p>
        </div>

        <ul className="mt-16 grid grid-cols-2 gap-x-6 gap-y-12 sm:grid-cols-3 lg:mt-24 lg:grid-cols-5 lg:gap-x-10">
          {ITEMS.map((it, i) => (
            <li key={it.name} className={`group ${i === 0 ? 'col-span-2 sm:col-span-1' : ''}`} data-reveal>
              <div
                className={`relative mx-auto aspect-square overflow-hidden rounded-full bg-cream shadow-[inset_0_0_0_1px_rgb(37_42_36/0.06),0_30px_60px_-30px_rgb(36_75_53/0.35)] transition-transform duration-700 ease-(--ease-premium) group-hover:-translate-y-2 ${
                  i === 0 ? 'max-w-[15rem]' : 'max-w-[12rem] p-5'
                } ${i % 2 ? 'lg:mt-14' : ''}`}
              >
                {it.visual}
              </div>
              <div className="mt-6 text-center">
                <h3 className="display text-xl text-forest lg:text-2xl">{it.name}</h3>
                <p className="mt-1 text-sm text-ink-soft">{it.note}</p>
              </div>
            </li>
          ))}
        </ul>
        {site.showPlaceholderNotes && (
          <p className="mt-14 text-center text-xs text-ink-soft/80">
            কলার ছবিটি আসল প্রোডাক্ট শুট থেকে; বাকিগুলো প্রতীকী চিত্র — উপাদানের আসল ফটোগ্রাফি পেলে বদলে দেওয়া হবে।
          </p>
        )}
      </div>
    </section>
  );
}
