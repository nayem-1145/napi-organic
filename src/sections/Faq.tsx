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
              <div key={f.q} className="border-b border-ink/12 first:border-t" data-reveal>
                <h3>
                  <button
                    id={`${id}-q`}
                    aria-expanded={isOpen}
                    aria-controls={`${id}-a`}
                    onClick={() => setOpen(isOpen ? null : i)}
                    className="group flex w-full items-start gap-5 py-7 text-left"
                  >
                    <span className="pt-1 text-sm text-sage tabular-nums">{toBnDigits(`0${i + 1}`)}</span>
                    <span className="flex-1 text-lg font-semibold text-forest transition-colors group-hover:text-sage lg:text-xl">{f.q}</span>
                    <span
                      className={`mt-0.5 grid h-9 w-9 shrink-0 place-items-center rounded-full border transition-all duration-500 ease-(--ease-premium) ${
                        isOpen ? 'rotate-45 border-forest bg-forest text-cream' : 'border-ink/15 text-forest'
                      }`}
                    >
                      <Plus size={18} />
                    </span>
                  </button>
                </h3>
                <div id={`${id}-a`} role="region" aria-labelledby={`${id}-q`} className="accordion-panel" data-open={isOpen}>
                  <div>
                    <p className="max-w-2xl pr-14 pb-8 pl-10 text-ink-soft">{f.a}</p>
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
