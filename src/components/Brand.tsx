import type { ReactNode } from 'react';
import { site } from '../config/site';
import { asset } from '../lib/utils';
import { whatsappOrderUrl } from '../lib/whatsapp';
import { ArrowRight, WhatsAppIcon } from './Icons';

/** The logo sits on a banana-yellow tab — the same device used on the package. */
export function LogoTab({ className = '', compact = false }: { className?: string; compact?: boolean }) {
  return (
    <span
      className={`inline-flex items-end justify-center bg-banana ${
        compact ? 'h-14 w-24 rounded-b-[1.4rem] px-3 pb-2' : 'h-20 w-32 rounded-b-[1.8rem] px-4 pb-3'
      } ${className}`}
    >
      <img src={asset('images/logo-wordmark.png')} alt={site.brand.name} className="h-auto w-full" width={439} height={270} />
    </span>
  );
}

export function OrderButton({
  quantity = 1,
  label = 'এখনই অর্ডার করুন',
  variant = 'primary',
  className = '',
}: {
  quantity?: number;
  label?: string;
  variant?: 'primary' | 'light';
  className?: string;
}) {
  return (
    <a
      href={whatsappOrderUrl(quantity)}
      target="_blank"
      rel="noopener noreferrer"
      className={`btn ${variant === 'light' ? 'btn-light' : 'btn-primary'} ${className}`}
      aria-label={`${label} — WhatsApp-এ অর্ডার`}
    >
      <WhatsAppIcon size={18} />
      <span>{label}</span>
      <ArrowRight size={18} strokeWidth={1.8} />
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
      <div className={`relative overflow-hidden ${className}`}>
        <img src={src} alt={alt} loading="lazy" decoding="async" className={`h-full w-full object-cover ${imgClassName}`} data-parallax />
        {children}
      </div>
    );
  }
  const bg =
    tone === 'green'
      ? 'from-[#2c5a3f] via-[#244b35] to-[#1a3726] text-cream/80'
      : tone === 'warm'
        ? 'from-[#f3d48d] via-[#e7b94d] to-[#c98f2f] text-ink/70'
        : 'from-cream-deep via-[#e9e1c9] to-[#ddd2b2] text-ink/60';
  return (
    <div
      className={`grain relative flex items-end overflow-hidden bg-gradient-to-br ${bg} ${className}`}
      role="img"
      aria-label={`${alt} (ফটো প্লেসহোল্ডার)`}
    >
      <div className="pointer-events-none absolute inset-4 border border-dashed border-current opacity-30" />
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
  className = '',
  light = false,
}: {
  eyebrow?: string;
  title: ReactNode;
  className?: string;
  light?: boolean;
}) {
  return (
    <div className={className}>
      {eyebrow && (
        <p className={`eyebrow mb-5 ${light ? '!text-banana' : ''}`} data-reveal>
          {eyebrow}
        </p>
      )}
      <h2
        className={`display text-[2.1rem] sm:text-5xl lg:text-[3.6rem] ${light ? 'text-cream' : 'text-forest'}`}
        data-reveal
      >
        {title}
      </h2>
    </div>
  );
}
