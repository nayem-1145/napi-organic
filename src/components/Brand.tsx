import type { ReactNode } from 'react';
import { site } from '../config/site';
import { setStore } from '../lib/store';
import { asset, scrollToId } from '../lib/utils';
import { whatsappUrl } from '../lib/whatsapp';
import { ArrowRight, ShoppingCart, WhatsAppIcon } from './Icons';

/** The logo sits on a banana-yellow tab — the same device used on the package. */
export function LogoTab({ className = '', compact = false }: { className?: string; compact?: boolean }) {
  return (
    <span
      className={`inline-flex items-end justify-center bg-banana shadow-[0_10px_24px_-12px_rgb(233_134_63/0.7)] ${
        compact ? 'h-14 w-24 rounded-b-[1.4rem] px-3 pb-2' : 'h-20 w-32 rounded-b-[1.8rem] px-4 pb-3'
      } ${className}`}
    >
      <img src={asset('images/logo-wordmark.png')} alt={site.brand.name} className="h-auto w-full" width={439} height={270} />
    </span>
  );
}

type ButtonVariant = 'primary' | 'forest' | 'light';
const VARIANT: Record<ButtonVariant, string> = {
  primary: 'btn-primary',
  forest: 'btn-forest',
  light: 'btn-light',
};

/** Scrolls to the order form, optionally preselecting a bundle. */
export function goToOrder(bundleId?: string) {
  if (bundleId) setStore({ selectedBundle: bundleId });
  scrollToId('order');
}

export function OrderButton({
  bundleId,
  label = 'এখনই অর্ডার করুন',
  variant = 'primary',
  className = '',
}: {
  /** Preselects this bundle in the order form */
  bundleId?: string;
  label?: string;
  variant?: ButtonVariant;
  className?: string;
}) {
  return (
    <button type="button" onClick={() => goToOrder(bundleId)} className={`btn ${VARIANT[variant]} ${className}`}>
      <ShoppingCart size={19} strokeWidth={2} aria-hidden />
      <span>{label}</span>
      <ArrowRight size={18} strokeWidth={2} className="btn-arrow" aria-hidden />
    </button>
  );
}

/** Opens a WhatsApp chat — for questions, not the primary order path. */
export function WhatsAppButton({
  message,
  label = 'WhatsApp-এ কথা বলুন',
  className = '',
}: {
  message?: string;
  label?: string;
  className?: string;
}) {
  return (
    <a href={whatsappUrl(message)} target="_blank" rel="noopener noreferrer" className={`btn btn-whatsapp ${className}`}>
      <WhatsAppIcon size={19} />
      <span>{label}</span>
    </a>
  );
}

/**
 * Art-directed photo slot. Shows the real image when provided; otherwise a clearly
 * labelled placeholder describing the photograph that should be shot.
 */
export function Photo({
  src,
  alt,
  brief,
  className = '',
  imgClassName = '',
  tone = 'cream',
  children,
}: {
  src?: string | null;
  alt: string;
  brief: string;
  className?: string;
  imgClassName?: string;
  tone?: 'cream' | 'green' | 'warm';
  children?: ReactNode;
}) {
  if (src) {
    return (
      <div className={`relative overflow-hidden rounded-[1.75rem] ${className}`}>
        <img src={src} alt={alt} loading="lazy" decoding="async" className={`h-full w-full object-cover ${imgClassName}`} data-parallax />
        {children}
      </div>
    );
  }
  const bg =
    tone === 'green'
      ? 'from-[#2a6b55] via-[#1b4d3e] to-[#12372c] text-cream/80'
      : tone === 'warm'
        ? 'from-[#ffe39a] via-[#ffd166] to-[#f4a261] text-ink/70'
        : 'from-cream-deep via-[#f4e6c9] to-[#f1d3ae] text-ink/60';
  return (
    <div
      className={`grain relative flex items-end overflow-hidden rounded-[1.75rem] bg-gradient-to-br ${bg} ${className}`}
      role="img"
      aria-label={`${alt} (ফটো প্লেসহোল্ডার)`}
    >
      <div className="pointer-events-none absolute inset-4 rounded-[1.25rem] border border-dashed border-current opacity-30" />
      <div className="relative z-10 p-6 text-sm leading-relaxed">
        <span className="mb-1 block text-[0.7rem] font-semibold tracking-[0.18em] uppercase opacity-70">ফটো প্লেসহোল্ডার</span>
        {brief}
      </div>
      {children}
    </div>
  );
}

export function SectionHeading({
  eyebrow,
  title,
  subtitle,
  className = '',
  light = false,
  center = false,
}: {
  eyebrow?: string;
  title: ReactNode;
  subtitle?: ReactNode;
  className?: string;
  light?: boolean;
  center?: boolean;
}) {
  return (
    <div className={`${center ? 'mx-auto text-center' : ''} ${className}`}>
      {eyebrow && (
        <p className={`eyebrow mb-5 ${light ? 'eyebrow-light' : ''}`} data-reveal>
          {eyebrow}
        </p>
      )}
      <h2
        className={`display text-[2.1rem] text-balance sm:text-5xl lg:text-[3.5rem] ${light ? 'text-cream' : 'text-forest'}`}
        data-reveal
      >
        {title}
      </h2>
      {subtitle && (
        <p
          className={`mt-5 text-[1.05rem] lg:text-lg ${light ? 'text-cream/75' : 'text-ink-soft'} ${center ? 'mx-auto max-w-2xl' : 'max-w-xl'}`}
          data-reveal
        >
          {subtitle}
        </p>
      )}
    </div>
  );
}
