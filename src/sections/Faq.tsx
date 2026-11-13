import { useId, useState } from 'react';
import { SectionHeading } from '../components/Brand';
import { Plus } from '../components/Icons';
import { site } from '../config/site';
import { toBnDigits } from '../lib/utils';

export function Faq() {
  const [open, setOpen] = useState<number | null>(0);
  const uid = useId();
  return (
    <section id="faq" className="relative bg-cream-deep/50 py-24 lg:py-36">
      <div className="mx-auto grid max-w-[1440px] gap-12 px-5 sm:px-8 lg:grid-cols-12 lg:px-12">
        <div className="lg:col-span-4">
          <SectionHeading eyebrow="প্রশ্নোত্তর" title="জানতে চান?" />
          <p className="mt-6 text-lg text-ink-soft" data-reveal>
            সাধারণ কিছু প্রশ্নের উত্তর এখানে। আরও কিছু জানার থাকলে WhatsApp-এ লিখুন।
          </p>
        </div>
        <div className="lg:col-span-7 lg:col-start-6">
          {site.faq.map((f, i) => {
            const isOpen = open === i;
            const id = `${uid}-${i}`;
            return (
              <div
                key={f.q}
                className={`mb-3 rounded-[1.4rem] bg-white transition-shadow duration-500 ${
                  isOpen ? 'shadow-[0_0_0_1px_rgb(244_162_97/0.4),0_24px_40px_-28px_rgb(27_77_62/0.45)]' : 'shadow-[0_0_0_1px_rgb(27_77_62/0.08)] hover:shadow-[0_0_0_1px_rgb(244_162_97/0.35)]'
                }`}
                data-reveal
              >
                <h3>
                  <button
                    id={`${id}-q`}
                    aria-expanded={isOpen}
                    aria-controls={`${id}-a`}
                    onClick={() => setOpen(isOpen ? null : i)}
                    className="group flex w-full items-start gap-4 px-5 py-5 text-left sm:px-7 sm:py-6"
                  >
                    <span className="pt-1 text-sm font-semibold text-amber-deep tabular-nums">{toBnDigits(`0${i + 1}`)}</span>
                    <span className="flex-1 text-[1.05rem] font-semibold text-forest transition-colors group-hover:text-sage lg:text-lg">{f.q}</span>
                    <span
                      className={`mt-0.5 grid h-9 w-9 shrink-0 place-items-center rounded-full transition-all duration-500 ease-(--ease-premium) ${
                        isOpen ? 'rotate-45 bg-gradient-to-br from-banana to-amber text-forest-deep' : 'bg-banana-soft text-forest'
                      }`}
                    >
                      <Plus size={18} />
                    </span>
                  </button>
                </h3>
                <div id={`${id}-a`} role="region" aria-labelledby={`${id}-q`} className="accordion-panel" data-open={isOpen}>
                  <div>
                    <p className="max-w-2xl pr-6 pb-6 pl-12 text-ink-soft sm:pr-16 sm:pl-14">{f.a}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
