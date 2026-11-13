import type { CSSProperties } from 'react';
import { OrderButton, SectionHeading } from '../components/Brand';
import { ArrowRight, Check } from '../components/Icons';
import { site, type ProductBundle } from '../config/site';
import { bundlePrice } from '../lib/pricing';
import { asset, formatBdt, toBnDigits } from '../lib/utils';
import { WA_MESSAGES, whatsappUrl } from '../lib/whatsapp';

/** Pouch offsets for 1, 2 or 3+ visible packs (centre pack sits in front). */
const FAN: Record<number, number[]> = { 1: [0], 2: [-0.6, 0.6], 3: [-1, 1, 0] };

function PouchStack({ packs }: { packs: number }) {
  const offsets = FAN[Math.min(packs, 3)];
  return (
    <div className="relative mx-auto h-40 w-full sm:h-44" aria-hidden>
      <div className="absolute inset-x-[14%] bottom-1 h-6 rounded-[50%] bg-forest-deep/20 blur-md" />
      {offsets.map((o, i) => (
        <img
          key={i}
          src={asset('images/pouch-front.webp')}
          alt=""
          className="pouch-fan"
          style={{ '--o': o, zIndex: o === 0 ? 3 : i, clipPath: 'inset(0 round 6% 6% 8% 8%)' } as CSSProperties}
          loading="lazy"
          decoding="async"
        />
      ))}
    </div>
  );
}

function BundleCard({ b }: { b: ProductBundle }) {
  const { price, regular, savePct, perPack } = bundlePrice(b);
  const f = !!b.featured;
  return (
    <li
      className={`group relative flex flex-col rounded-[2rem] p-6 transition-[transform,box-shadow] duration-500 ease-(--ease-premium) sm:p-8 ${
        f
          ? 'bg-forest text-cream shadow-[0_40px_80px_-40px_rgb(18_55_44/0.9)] hover:-translate-y-2 lg:-my-5 lg:py-12'
          : 'card card-hover'
      }`}
      data-reveal
    >
      {b.ribbon && (
        <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 rounded-full bg-gradient-to-r from-banana to-amber px-4 py-1 text-xs font-bold whitespace-nowrap text-forest-deep shadow-[0_8px_18px_-8px_rgb(233_134_63/0.9)]">
          {b.ribbon}
        </span>
      )}

      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className={`display text-2xl ${f ? 'text-cream' : 'text-forest'}`}>{b.name}</h3>
          <p className={`mt-0.5 text-sm ${f ? 'text-cream/70' : 'text-ink-soft'}`}>{b.tagline}</p>
        </div>
        {savePct > 0 && (
          <span className="shrink-0 rounded-full bg-amber px-3 py-1 text-xs font-bold text-forest-deep">
            {toBnDigits(savePct)}% সাশ্রয়
          </span>
        )}
      </div>

      {/* visual */}
      <div
        className={`relative mt-6 overflow-hidden rounded-[1.5rem] px-4 pt-6 pb-3 ${
          f ? 'bg-gradient-to-br from-banana/90 to-amber/90' : 'bg-gradient-to-br from-banana-soft to-[#ffe3c4]'
        }`}
      >
        <PouchStack packs={b.packs} />
        <span
          className={`absolute top-3 right-3 grid h-11 min-w-11 place-items-center rounded-full px-2 text-sm font-bold ${
            f ? 'bg-forest-deep text-banana' : 'bg-white text-forest shadow-sm'
          }`}
        >
          ×{toBnDigits(b.packs)}
        </span>
      </div>
      <p className={`mt-4 text-center text-sm font-medium ${f ? 'text-cream/75' : 'text-ink-soft'}`}>
        {toBnDigits(b.packs)} × {toBnDigits(site.product.weightGrams)} গ্রাম · {site.product.flavour}
      </p>

      {/* price */}
      <div className={`mt-6 border-t pt-6 ${f ? 'border-cream/15' : 'border-ink/10'}`}>
        {price !== null ? (
          <>
            <div className="flex items-baseline gap-3">
              <span className={`display text-[2.4rem] leading-none ${f ? 'text-banana' : 'text-forest'}`}>{formatBdt(price)}</span>
              {savePct > 0 && regular !== null && (
                <s className={`text-base ${f ? 'text-cream/50' : 'text-ink-soft/70'}`}>{formatBdt(regular)}</s>
              )}
            </div>
            {b.packs > 1 && perPack !== null && (
              <p className={`mt-2 text-sm ${f ? 'text-cream/70' : 'text-ink-soft'}`}>প্রতি প্যাক {formatBdt(perPack)}</p>
            )}
          </>
        ) : (
          <>
            <p className={`display text-xl ${f ? 'text-banana' : 'text-forest'}`}>মূল্য জানতে যোগাযোগ করুন</p>
            <p className={`mt-1 text-sm ${f ? 'text-cream/70' : 'text-ink-soft'}`}>WhatsApp-এ সঙ্গে সঙ্গে জানিয়ে দেওয়া হবে</p>
          </>
        )}
      </div>

      <ul className="mt-6 mb-8 space-y-2.5">
        {b.perks.map((p) => (
          <li key={p} className={`flex items-start gap-2.5 text-[0.95rem] ${f ? 'text-cream/90' : 'text-ink'}`}>
            <span className={`mt-1 grid h-5 w-5 shrink-0 place-items-center rounded-full ${f ? 'bg-banana text-forest-deep' : 'bg-banana-soft text-forest'}`}>
              <Check size={13} strokeWidth={3} aria-hidden />
            </span>
            {p}
          </li>
        ))}
      </ul>

      <OrderButton
        bundleId={b.id}
        label="এই প্যাকেজ নিন"
        variant={f ? 'primary' : 'forest'}
        className="mt-auto w-full"
      />
    </li>
  );
}

export function ProductShowcase() {
  return (
    <section id="product" className="relative overflow-hidden bg-cream-deep/60 py-24 lg:py-32">
      <div aria-hidden className="pointer-events-none absolute -top-40 -left-40 h-[28rem] w-[28rem] rounded-full bg-banana/30 blur-3xl" />
      <div aria-hidden className="pointer-events-none absolute -right-40 -bottom-40 h-[28rem] w-[28rem] rounded-full bg-amber/20 blur-3xl" />

      <div className="relative mx-auto max-w-[1440px] px-5 sm:px-8 lg:px-12">
        <SectionHeading
          center
          eyebrow="প্যাকেজ বেছে নিন"
          title="আপনার জন্য সঠিক প্যাক"
          subtitle={`শিশুর জন্য হোক বা পুরো পরিবারের — প্রতিটি ${toBnDigits(site.product.weightGrams)} গ্রাম প্যাকে ১০০% অর্গানিক কলা থেকে তৈরি, ভেজালমুক্ত স্বাস্থ্যকর নাস্তা।`}
        />

        <ul className="mx-auto mt-16 grid max-w-6xl items-stretch gap-6 md:grid-cols-3 lg:mt-20 lg:gap-8">
          {site.bundles.map((b) => (
            <BundleCard key={b.id} b={b} />
          ))}
        </ul>

        <p className="mt-12 text-center text-ink-soft" data-reveal>
          আরও বেশি পরিমাণে বা পাইকারি অর্ডার করতে চান?{' '}
          <a
            href={whatsappUrl(WA_MESSAGES.bulk)}
            target="_blank"
            rel="noopener noreferrer"
            className="group inline-flex items-center gap-1 font-semibold text-forest underline decoration-amber decoration-2 underline-offset-4 hover:text-forest-deep"
          >
            WhatsApp-এ জানান
            <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" aria-hidden />
          </a>
        </p>
      </div>
    </section>
  );
}
