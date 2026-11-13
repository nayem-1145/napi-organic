import { useState } from 'react';
import { OrderButton, SectionHeading } from '../components/Brand';
import { Minus, Plus } from '../components/Icons';
import { site } from '../config/site';
import { asset, formatBdt, toBnDigits } from '../lib/utils';

export function ProductShowcase() {
  const p = site.product;
  const [qty, setQty] = useState(1);
  const [face, setFace] = useState<'front' | 'back'>('front');
  const set = (n: number) => setQty(Math.min(p.maxQuantity, Math.max(1, n)));

  return (
    <section id="product" className="relative overflow-hidden py-24 lg:py-36">
      <div className="mx-auto max-w-[1440px] px-5 sm:px-8 lg:px-12">
        <SectionHeading eyebrow="আমাদের পণ্য" title="আপনার স্ন্যাকসের নতুন পছন্দ" className="max-w-3xl" />

        <div className="mt-14 grid items-center gap-14 lg:mt-20 lg:grid-cols-12 lg:gap-10">
          {/* visual */}
          <div className="relative lg:col-span-7" data-reveal>
            <div className="relative mx-auto aspect-[4/5] max-w-[560px] sm:aspect-square">
              <div className="absolute inset-x-[8%] top-[6%] bottom-0 rounded-t-full bg-cream-deep" />
              <div className="absolute inset-x-[8%] bottom-0 h-1/3 bg-gradient-to-t from-banana/25 to-transparent" />
              {(['front', 'back'] as const).map((f) => (
                <img
                  key={f}
                  src={asset(`images/pouch-${f}.webp`)}
                  alt={f === 'front' ? 'প্যাকেটের সামনের দিক' : 'প্যাকেটের পেছনের দিক — উপাদান তালিকা'}
                  className={`absolute bottom-[7%] left-1/2 h-[82%] w-auto -translate-x-1/2 drop-shadow-[0_35px_35px_rgb(36_75_53/0.3)] transition-[opacity,transform] duration-700 ease-(--ease-premium) ${
                    face === f ? 'opacity-100' : 'pointer-events-none opacity-0 [transform:rotateY(70deg)]'
                  }`}
                  style={{ clipPath: 'inset(0 round 4% 4% 6% 6%)' }}
                  loading="lazy"
                />
              ))}
              <img
                src={asset('images/chips-pile.webp')}
                alt=""
                aria-hidden
                className="absolute -bottom-2 -left-2 w-[48%] mix-blend-multiply sm:-left-8"
                style={{ maskImage: 'radial-gradient(closest-side, #000 60%, transparent)' }}
                loading="lazy"
              />
            </div>
            <div className="mt-6 flex justify-center gap-2" role="tablist" aria-label="প্যাকেটের দিক">
              {(['front', 'back'] as const).map((f) => (
                <button
                  key={f}
                  role="tab"
                  aria-selected={face === f}
                  onClick={() => setFace(f)}
                  className={`min-h-11 rounded-full px-5 text-sm font-medium transition-colors ${
                    face === f ? 'bg-forest text-cream' : 'text-ink-soft hover:text-forest'
                  }`}
                >
                  {f === 'front' ? 'সামনের দিক' : 'পেছনের দিক'}
                </button>
              ))}
            </div>
          </div>

          {/* details */}
          <div className="lg:col-span-5" data-reveal>
            <p className="text-sm font-semibold tracking-[0.18em] text-sage uppercase">Crispy Banana Chips</p>
            <h3 className="display mt-3 text-3xl text-forest lg:text-[2.6rem]">{p.name}</h3>
            <p className="mt-2 text-lg text-ink-soft">{p.flavour} · Spice Infused, Vacuum Dried</p>

            <div className="hairline my-8" />

            <dl className="grid grid-cols-2 gap-6">
              <div>
                <dt className="text-sm text-ink-soft">নেট ওজন</dt>
                <dd className="mt-1 inline-flex border border-forest px-4 py-1.5 font-semibold text-forest">
                  {toBnDigits(p.weightGrams)} গ্রাম
                </dd>
              </div>
              <div>
                <dt className="text-sm text-ink-soft">মূল্য</dt>
                <dd className="display mt-1 text-2xl text-forest">
                  {p.priceBdt !== null ? formatBdt(p.priceBdt) : <span className="font-sans text-base font-medium text-ink-soft">মূল্য জানতে যোগাযোগ করুন</span>}
                </dd>
              </div>
            </dl>

            <div className="mt-8 flex flex-wrap items-center gap-5">
              <div className="flex items-center rounded-full border border-ink/15" aria-label="পরিমাণ নির্বাচন">
                <button
                  className="grid h-12 w-12 place-items-center rounded-full text-forest transition-colors hover:bg-cream-deep disabled:opacity-30"
                  onClick={() => set(qty - 1)}
                  disabled={qty <= 1}
                  aria-label="পরিমাণ কমান"
                >
                  <Minus size={18} />
                </button>
                <output className="w-10 text-center text-lg font-semibold tabular-nums" aria-live="polite">
                  {toBnDigits(qty)}
                </output>
                <button
                  className="grid h-12 w-12 place-items-center rounded-full text-forest transition-colors hover:bg-cream-deep disabled:opacity-30"
                  onClick={() => set(qty + 1)}
                  disabled={qty >= p.maxQuantity}
                  aria-label="পরিমাণ বাড়ান"
                >
                  <Plus size={18} />
                </button>
              </div>
              {p.priceBdt !== null && (
                <p className="text-ink-soft">
                  মোট: <span className="font-semibold text-forest">{formatBdt(p.priceBdt * qty)}</span>
                </p>
              )}
            </div>

            <OrderButton quantity={qty} className="mt-8 w-full sm:w-auto" />
            <p className="mt-4 text-sm text-ink-soft">বোতাম চাপলে অর্ডারের বিবরণসহ WhatsApp বার্তা তৈরি হবে।</p>
          </div>
        </div>
      </div>
    </section>
  );
}
