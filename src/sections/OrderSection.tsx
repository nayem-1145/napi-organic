import { useCallback, useEffect, useId, useRef, useState, type FormEvent } from 'react';
import { createPortal } from 'react-dom';
import { WhatsAppButton } from '../components/Brand';
import { Check, Minus, Plus, ShoppingCart, WhatsAppIcon, X } from '../components/Icons';
import { site } from '../config/site';
import {
  AREA_LABEL,
  normalizePhone,
  OrderNotConfiguredError,
  submitOrder,
  type DeliveryArea,
  type PlacedOrder,
} from '../lib/order';
import { bundlePrice } from '../lib/pricing';
import { setStore, useStore } from '../lib/store';
import { asset, formatBdt, toBnDigits } from '../lib/utils';
import { WA_MESSAGES, whatsappUrl } from '../lib/whatsapp';

type Fields = { name: string; phone: string; address: string; note: string };
type Errors = Partial<Record<keyof Fields | 'area', string>>;

const EMPTY: Fields = { name: '', phone: '', address: '', note: '' };
const MAX_QTY = 10;

const HEALTH_POINTS = [site.claims.organic, 'ভেজালমুক্ত ও বিশুদ্ধ', 'কোনো প্রিজারভেটিভ নেই', 'ভিগান ও গ্লুটেন-ফ্রি'];

function validate(f: Fields, area: DeliveryArea | null): Errors {
  const e: Errors = {};
  if (f.name.trim().length < 2) e.name = 'অনুগ্রহ করে আপনার নাম লিখুন';
  if (!f.phone.trim()) e.phone = 'মোবাইল নম্বর দিন';
  else if (!normalizePhone(f.phone)) e.phone = 'সঠিক ১১ ডিজিটের মোবাইল নম্বর দিন (যেমন ০১৭XXXXXXXX)';
  if (!area) e.area = 'ডেলিভারি এলাকা বেছে নিন';
  if (f.address.trim().length < 10) e.address = 'বাসা/রোড, এলাকা ও জেলাসহ পূর্ণ ঠিকানা লিখুন';
  return e;
}

export function OrderSection() {
  const uid = useId();
  const bundleId = useStore((s) => s.selectedBundle);
  const shot = useStore((s) => s.finalShot);
  const [qty, setQty] = useState(1);
  const [area, setArea] = useState<DeliveryArea | null>(null);
  const [fields, setFields] = useState<Fields>(EMPTY);
  const [errors, setErrors] = useState<Errors>({});
  const [touched, setTouched] = useState(false);
  const [status, setStatus] = useState<'idle' | 'sending' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('');
  const [placed, setPlaced] = useState<PlacedOrder | null>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const honeypotRef = useRef<HTMLInputElement>(null);
  const closeThankYou = useCallback(() => setPlaced(null), []);

  const bundle = site.bundles.find((b) => b.id === bundleId) ?? site.bundles[0];
  const { price } = bundlePrice(bundle);
  const total = price !== null ? price * qty : null;

  const set = (k: keyof Fields) => (v: string) => {
    const next = { ...fields, [k]: v };
    setFields(next);
    if (touched) setErrors(validate(next, area));
  };

  const onSubmit = async (ev: FormEvent) => {
    ev.preventDefault();
    if (status === 'sending') return;
    setTouched(true);
    const errs = validate(fields, area);
    setErrors(errs);
    if (Object.keys(errs).length) {
      const first = Object.keys(errs)[0];
      formRef.current?.querySelector<HTMLElement>(`[data-field="${first}"]`)?.focus();
      return;
    }
    setStatus('sending');
    setErrorMsg('');
    try {
      const order = await submitOrder(
        {
          name: fields.name.trim(),
          phone: normalizePhone(fields.phone)!,
          address: fields.address.trim(),
          area: area!,
          bundleId: bundle.id,
          quantity: qty,
          note: fields.note.trim(),
        },
        honeypotRef.current?.value ?? '',
      );
      setPlaced(order);
      setStatus('idle');
      setFields(EMPTY);
      setArea(null);
      setQty(1);
      setTouched(false);
      setErrors({});
    } catch (err) {
      console.error('[Napi Organic] order failed', err);
      setStatus('error');
      setErrorMsg(
        err instanceof OrderNotConfiguredError
          ? 'দুঃখিত, অনলাইন অর্ডার এই মুহূর্তে চালু নেই। অনুগ্রহ করে WhatsApp-এ অর্ডার করুন।'
          : 'অর্ডারটি পাঠানো যায়নি। ইন্টারনেট সংযোগ দেখে আবার চেষ্টা করুন, অথবা WhatsApp-এ অর্ডার করুন।',
      );
    }
  };

  const err = (k: keyof Errors) =>
    errors[k] ? (
      <p id={`${uid}-${k}-err`} className="field-error">
        {errors[k]}
      </p>
    ) : null;
  const aria = (k: keyof Errors) => ({
    'aria-invalid': !!errors[k],
    'aria-describedby': errors[k] ? `${uid}-${k}-err` : undefined,
    'data-field': k,
  });

  return (
    <section id="order" className="relative isolate overflow-hidden bg-gradient-to-br from-banana via-[#ffc15a] to-amber py-20 lg:py-28">
      <div aria-hidden className="pointer-events-none absolute -top-32 -left-32 -z-10 h-96 w-96 rounded-full bg-white/35 blur-3xl" />
      <div aria-hidden className="pointer-events-none absolute -right-40 bottom-0 -z-10 h-[30rem] w-[30rem] rounded-full bg-[#e9863f]/30 blur-3xl" />

      <div className="mx-auto grid max-w-[1440px] gap-10 px-5 sm:px-8 lg:grid-cols-12 lg:gap-12 lg:px-12">
        {/* ── Pitch ───────────────────────────── */}
        <div className="lg:col-span-5 lg:pt-6">
          <p className="eyebrow !bg-white/60" data-reveal>
            অর্ডার করুন
          </p>
          <h2 className="display mt-5 text-[2.2rem] text-balance text-forest-deep sm:text-5xl lg:text-[3.4rem]" data-reveal>
            শিশু ও পরিবারের জন্য বিশুদ্ধ নাস্তা, আজই অর্ডার করুন
          </h2>
          <p className="mt-5 max-w-md text-lg text-forest-deep/80" data-reveal>
            ছোট্ট ফর্মটি পূরণ করুন — অর্ডার নিশ্চিত করতে আমরা আপনাকে কল করব। প্যাকেট পৌঁছে যাবে আপনার দরজায়।
          </p>
          <ul className="mt-7 grid grid-cols-2 gap-2.5 sm:max-w-md" data-reveal>
            {HEALTH_POINTS.map((p) => (
              <li key={p} className="flex items-center gap-2 text-[0.95rem] font-medium text-forest-deep">
                <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-forest text-banana">
                  <Check size={14} strokeWidth={3} aria-hidden />
                </span>
                {p}
              </li>
            ))}
          </ul>

          <img
            src={shot ?? asset('images/product-photo.webp')}
            alt="Napi Organic ব্যানানা চিপসের প্যাকেট"
            className={`mt-8 hidden w-full max-w-md lg:block ${shot ? 'scale-125 object-contain' : 'rounded-[1.75rem] object-cover mix-blend-multiply'}`}
            loading="lazy"
          />

          <div className="mt-8 rounded-[1.5rem] bg-white/55 p-5 ring-1 ring-white/70 backdrop-blur-sm sm:max-w-md" data-reveal>
            <p className="font-semibold text-forest-deep">প্রশ্ন আছে বা সরাসরি কথা বলতে চান?</p>
            <p className="mt-1 text-sm text-forest-deep/75">WhatsApp-এ নক করুন, আমরা উত্তর দেব।</p>
            <WhatsAppButton className="mt-4 w-full sm:w-auto" />
          </div>
        </div>

        {/* ── Form ────────────────────────────── */}
        <div className="lg:col-span-7">
          <form
            ref={formRef}
            onSubmit={onSubmit}
            noValidate
            className="rounded-[2rem] bg-white p-5 shadow-[0_50px_100px_-40px_rgb(18_55_44/0.55)] sm:p-9"
            aria-labelledby={`${uid}-title`}
          >
            <div className="flex items-center gap-3">
              <span className="grid h-11 w-11 place-items-center rounded-2xl bg-gradient-to-br from-banana to-amber text-forest-deep">
                <ShoppingCart size={20} strokeWidth={2} aria-hidden />
              </span>
              <div>
                <h3 id={`${uid}-title`} className="display text-2xl text-forest">
                  অর্ডার ফর্ম
                </h3>
                <p className="text-sm text-ink-soft">* চিহ্নিত ঘরগুলো পূরণ করা জরুরি</p>
              </div>
            </div>

            {/* package */}
            <fieldset className="mt-7">
              <legend className="field-label">প্যাকেজ বেছে নিন *</legend>
              <div className="grid gap-2.5 sm:grid-cols-3">
                {site.bundles.map((b) => {
                  const on = b.id === bundle.id;
                  const p = bundlePrice(b).price;
                  return (
                    <label
                      key={b.id}
                      className={`relative flex cursor-pointer items-center gap-3 rounded-2xl p-3.5 transition-all duration-300 sm:flex-col sm:items-start sm:gap-1 ${
                        on
                          ? 'bg-forest text-cream shadow-[0_14px_30px_-16px_rgb(18_55_44/0.9)]'
                          : 'bg-cream text-ink ring-1 ring-forest/12 hover:ring-amber'
                      }`}
                    >
                      <input
                        type="radio"
                        name="bundle"
                        value={b.id}
                        checked={on}
                        onChange={() => setStore({ selectedBundle: b.id })}
                        className="peer sr-only"
                      />
                      <span
                        className={`grid h-5 w-5 shrink-0 place-items-center rounded-full peer-focus-visible:ring-2 peer-focus-visible:ring-amber-deep peer-focus-visible:ring-offset-2 sm:absolute sm:top-3.5 sm:right-3.5 ${
                          on ? 'bg-banana text-forest-deep' : 'ring-2 ring-forest/25'
                        }`}
                      >
                        {on && <Check size={12} strokeWidth={3.5} aria-hidden />}
                      </span>
                      <span className="flex-1">
                        <span className="block font-semibold">{b.name}</span>
                        <span className={`text-sm ${on ? 'text-cream/75' : 'text-ink-soft'}`}>
                          {toBnDigits(b.packs)} প্যাক{p !== null ? ` · ${formatBdt(p)}` : ''}
                        </span>
                      </span>
                    </label>
                  );
                })}
              </div>
            </fieldset>

            {/* quantity */}
            <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
              <span className="field-label !mb-0" id={`${uid}-qty`}>
                পরিমাণ
              </span>
              <div className="flex items-center rounded-full bg-cream ring-1 ring-forest/12" role="group" aria-labelledby={`${uid}-qty`}>
                <button
                  type="button"
                  className="grid h-11 w-11 place-items-center rounded-full text-forest transition-colors hover:bg-banana-soft disabled:opacity-30"
                  onClick={() => setQty((q) => Math.max(1, q - 1))}
                  disabled={qty <= 1}
                  aria-label="পরিমাণ কমান"
                >
                  <Minus size={18} />
                </button>
                <output className="w-10 text-center text-lg font-semibold" aria-live="polite">
                  {toBnDigits(qty)}
                </output>
                <button
                  type="button"
                  className="grid h-11 w-11 place-items-center rounded-full text-forest transition-colors hover:bg-banana-soft disabled:opacity-30"
                  onClick={() => setQty((q) => Math.min(MAX_QTY, q + 1))}
                  disabled={qty >= MAX_QTY}
                  aria-label="পরিমাণ বাড়ান"
                >
                  <Plus size={18} />
                </button>
              </div>
            </div>

            <div className="hairline my-7" />

            {/* customer */}
            <div className="grid gap-5 sm:grid-cols-2">
              <div>
                <label htmlFor={`${uid}-name`} className="field-label">
                  আপনার নাম *
                </label>
                <input
                  id={`${uid}-name`}
                  className="field"
                  autoComplete="name"
                  placeholder="যেমন: রাফিয়া ইসলাম"
                  value={fields.name}
                  onChange={(e) => set('name')(e.target.value)}
                  {...aria('name')}
                />
                {err('name')}
              </div>
              <div>
                <label htmlFor={`${uid}-phone`} className="field-label">
                  মোবাইল নম্বর *
                </label>
                <input
                  id={`${uid}-phone`}
                  className="field"
                  type="tel"
                  inputMode="tel"
                  autoComplete="tel"
                  placeholder="০১XXXXXXXXX"
                  value={fields.phone}
                  onChange={(e) => set('phone')(e.target.value)}
                  {...aria('phone')}
                />
                {err('phone')}
              </div>
            </div>

            <fieldset className="mt-5">
              <legend className="field-label">ডেলিভারি এলাকা *</legend>
              <div className="grid grid-cols-2 gap-2.5" {...(errors.area ? { 'aria-describedby': `${uid}-area-err` } : {})}>
                {(Object.keys(AREA_LABEL) as DeliveryArea[]).map((a, i) => (
                  <label
                    key={a}
                    className={`flex min-h-12 cursor-pointer items-center justify-center gap-2 rounded-2xl px-3 text-[0.95rem] font-semibold transition-all duration-300 has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-amber-deep ${
                      area === a
                        ? 'bg-forest text-cream'
                        : `bg-cream text-forest ring-1 hover:ring-amber ${errors.area ? 'ring-[#d1495b]' : 'ring-forest/12'}`
                    }`}
                  >
                    <input
                      type="radio"
                      name="area"
                      value={a}
                      checked={area === a}
                      onChange={() => {
                        setArea(a);
                        if (touched) setErrors(validate(fields, a));
                      }}
                      className="sr-only"
                      {...(i === 0 ? { 'data-field': 'area' } : {})}
                    />
                    {area === a && <Check size={16} strokeWidth={3} aria-hidden />}
                    {AREA_LABEL[a]}
                  </label>
                ))}
              </div>
              {err('area')}
            </fieldset>

            <div className="mt-5">
              <label htmlFor={`${uid}-address`} className="field-label">
                পূর্ণ ঠিকানা *
              </label>
              <textarea
                id={`${uid}-address`}
                className="field min-h-24 resize-y"
                rows={3}
                autoComplete="street-address"
                placeholder="বাসা/রোড নম্বর, এলাকা, থানা, জেলা"
                value={fields.address}
                onChange={(e) => set('address')(e.target.value)}
                {...aria('address')}
              />
              {err('address')}
            </div>

            <div className="mt-5">
              <label htmlFor={`${uid}-note`} className="field-label">
                বিশেষ নির্দেশনা <span className="font-normal text-ink-soft">(ঐচ্ছিক)</span>
              </label>
              <input
                id={`${uid}-note`}
                className="field"
                placeholder="যেমন: বিকেলে ডেলিভারি দিলে ভালো হয়"
                value={fields.note}
                onChange={(e) => set('note')(e.target.value)}
              />
            </div>

            {/* spam trap — invisible to people, bots fill it in */}
            <input ref={honeypotRef} type="text" name="botcheck" tabIndex={-1} autoComplete="off" aria-hidden className="hidden" />

            {/* summary */}
            <div className="mt-7 rounded-2xl bg-banana-soft p-5 ring-1 ring-amber/30">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-sm text-ink-soft">অর্ডার সারাংশ</p>
                  <p className="mt-0.5 font-semibold text-forest">
                    {bundle.name} × {toBnDigits(qty)}{' '}
                    <span className="font-normal text-ink-soft">
                      ({toBnDigits(bundle.packs * qty)} × {toBnDigits(site.product.weightGrams)} গ্রাম)
                    </span>
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-ink-soft">মোট</p>
                  <p className="display text-2xl leading-tight text-forest">{total !== null ? formatBdt(total) : '—'}</p>
                </div>
              </div>
              {total === null && <p className="mt-2 text-sm text-ink-soft">মূল্য ও ডেলিভারি চার্জ কনফার্মেশন কলে জানিয়ে দেওয়া হবে।</p>}
            </div>

            {status === 'error' && (
              <div role="alert" className="animate-fade-in mt-5 rounded-2xl bg-[#fdecee] p-4 text-[0.95rem] text-[#8f1d2c] ring-1 ring-[#d1495b]/30">
                <p className="font-semibold">{errorMsg}</p>
                <a
                  href={whatsappUrl(WA_MESSAGES.enquiry)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-2 inline-flex items-center gap-2 font-semibold text-forest underline decoration-2 underline-offset-4"
                >
                  <WhatsAppIcon size={16} /> WhatsApp-এ অর্ডার করুন
                </a>
              </div>
            )}

            <button type="submit" disabled={status === 'sending'} className="btn btn-primary mt-6 w-full !min-h-14 text-[1.05rem] disabled:cursor-wait disabled:opacity-80">
              {status === 'sending' ? (
                <>
                  <span className="h-5 w-5 animate-spin rounded-full border-[2.5px] border-forest-deep/30 border-t-forest-deep" aria-hidden />
                  অর্ডার পাঠানো হচ্ছে…
                </>
              ) : (
                <>
                  <Check size={20} strokeWidth={2.6} aria-hidden />
                  অর্ডার নিশ্চিত করুন
                </>
              )}
            </button>
            <p className="mt-3 text-center text-sm text-ink-soft">অর্ডার করার পর আমাদের টিম কল করে অর্ডার নিশ্চিত করবে।</p>
          </form>
        </div>
      </div>

      {placed && createPortal(<ThankYou order={placed} onClose={closeThankYou} />, document.body)}
    </section>
  );
}

/** Full-screen confirmation shown after a successful submission. */
function ThankYou({ order, onClose }: { order: PlacedOrder; onClose: () => void }) {
  const closeRef = useRef<HTMLButtonElement>(null);
  const titleId = useId();

  useEffect(() => {
    const lenis = (window as unknown as { __lenis?: { stop: () => void; start: () => void } }).__lenis;
    const prevFocus = document.activeElement as HTMLElement | null;
    lenis?.stop();
    document.documentElement.style.overflow = 'hidden';
    closeRef.current?.focus();
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    return () => {
      window.removeEventListener('keydown', onKey);
      document.documentElement.style.overflow = '';
      lenis?.start();
      prevFocus?.focus?.({ preventScroll: true });
    };
  }, [onClose]);

  const rows: [string, string][] = [
    ['প্যাকেজ', `${order.bundleName} × ${toBnDigits(order.quantity)}`],
    ['মোট প্যাকেট', `${toBnDigits(order.packs)} × ${toBnDigits(site.product.weightGrams)} গ্রাম`],
    ['মোবাইল', toBnDigits(order.phone)],
    ['এলাকা', AREA_LABEL[order.area]],
  ];
  if (order.total !== null) rows.push(['মোট মূল্য', formatBdt(order.total)]);

  return (
    <div
      className="animate-fade-in fixed inset-0 z-[80] grid place-items-center overflow-y-auto bg-forest-deep/70 p-4 backdrop-blur-md"
      role="dialog"
      aria-modal="true"
      aria-labelledby={titleId}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="animate-pop-in relative w-full max-w-lg overflow-hidden rounded-[2rem] bg-white p-7 text-center shadow-2xl sm:p-10">
        <div aria-hidden className="pointer-events-none absolute inset-x-0 -top-24 h-48 bg-gradient-to-b from-banana/50 to-transparent blur-2xl" />
        <button
          ref={closeRef}
          onClick={onClose}
          className="absolute top-4 right-4 grid h-11 w-11 place-items-center rounded-full text-ink-soft transition-colors hover:bg-cream hover:text-forest"
          aria-label="বন্ধ করুন"
        >
          <X size={22} />
        </button>

        <div className="relative mx-auto grid h-24 w-24 place-items-center">
          <span aria-hidden className="animate-ring-pulse absolute inset-0 rounded-full bg-leaf/40" />
          <span className="relative grid h-24 w-24 place-items-center rounded-full bg-gradient-to-br from-forest to-sage shadow-[0_18px_36px_-14px_rgb(18_55_44/0.8)]">
            <svg viewBox="0 0 24 24" className="h-12 w-12 text-banana" fill="none" aria-hidden>
              <path d="M5 12.5l4.5 4.5L19 7.5" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" pathLength={1} className="animate-draw" />
            </svg>
          </span>
        </div>

        <h2 id={titleId} className="display relative mt-6 text-[2rem] text-forest sm:text-[2.4rem]">
          ধন্যবাদ, {order.name.split(' ')[0]}!
        </h2>
        <p className="relative mt-2 text-ink-soft">আপনার অর্ডারটি আমরা পেয়েছি। খুব শীঘ্রই আপনার নম্বরে কল করে অর্ডার নিশ্চিত করা হবে।</p>

        <div className="relative mt-6 inline-flex items-center gap-2 rounded-full bg-banana-soft px-4 py-2 ring-1 ring-amber/40">
          <span className="text-sm text-ink-soft">অর্ডার আইডি</span>
          <span className="font-mono font-bold tracking-wider text-forest">{order.orderId}</span>
        </div>

        <dl className="relative mt-6 divide-y divide-ink/8 rounded-2xl bg-cream px-5 text-left">
          {rows.map(([k, v]) => (
            <div key={k} className="flex items-center justify-between gap-4 py-3 text-[0.95rem]">
              <dt className="text-ink-soft">{k}</dt>
              <dd className="text-right font-semibold text-forest">{v}</dd>
            </div>
          ))}
        </dl>

        <div className="relative mt-7 flex flex-col gap-3 sm:flex-row">
          <button onClick={onClose} className="btn btn-forest flex-1">
            ঠিক আছে
          </button>
          <a href={whatsappUrl(WA_MESSAGES.order(order.orderId))} target="_blank" rel="noopener noreferrer" className="btn btn-whatsapp flex-1">
            <WhatsAppIcon size={18} /> WhatsApp-এ জানান
          </a>
        </div>
      </div>
    </div>
  );
}
