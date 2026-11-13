import { toBnDigits } from '../lib/utils';

export {
  ArrowRight,
  ArrowUpRight,
  ArrowDown,
  Plus,
  Minus,
  ChevronLeft,
  ChevronRight,
  X,
  Menu,
  Leaf,
  Sparkles,
  Banana,
  Heart,
  Globe,
  ShoppingBag,
  ShoppingCart,
  Star,
  Check,
  Quote,
  Sprout,
  Vegan,
  WheatOff,
  FlaskConicalOff,
  Recycle,
  Citrus,
  Droplets,
  Flame,
  Wind,
} from 'lucide-react';

type P = { size?: number; className?: string };

/* Brand marks are not part of Lucide's set; minimal monochrome versions. */
export const FacebookIcon = ({ size = 18, className }: P) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
    <path d="M13.5 21v-7.5h2.6l.4-3h-3V8.6c0-.9.3-1.5 1.5-1.5h1.6V4.4c-.3 0-1.2-.1-2.3-.1-2.3 0-3.9 1.4-3.9 4v2.2H7.8v3h2.6V21h3.1Z" />
  </svg>
);

export const InstagramIcon = ({ size = 18, className }: P) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" className={className} aria-hidden="true">
    <rect x="3.5" y="3.5" width="17" height="17" rx="5" />
    <circle cx="12" cy="12" r="4" />
    <circle cx="17.3" cy="6.7" r="0.9" fill="currentColor" stroke="none" />
  </svg>
);

export const WhatsAppIcon = ({ size = 18, className }: P) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
    <path d="M12 2.2a9.7 9.7 0 0 0-8.4 14.6L2.3 21.7l5-1.3A9.7 9.7 0 1 0 12 2.2Zm0 17.7a8 8 0 0 1-4.1-1.1l-.3-.2-3 .8.8-2.9-.2-.3A8 8 0 1 1 12 19.9Zm4.4-6c-.2-.1-1.4-.7-1.7-.8-.2-.1-.4-.1-.5.1l-.8 1c-.1.2-.3.2-.5.1a6.6 6.6 0 0 1-3.3-2.9c-.2-.4.2-.4.7-1.3.1-.2 0-.3 0-.4l-.8-1.8c-.2-.5-.4-.4-.5-.4h-.5a.9.9 0 0 0-.6.3 2.7 2.7 0 0 0-.9 2c0 1.2.9 2.4 1 2.5.1.2 1.7 2.7 4.2 3.7 1.6.6 2.2.7 3 .6.5-.1 1.4-.6 1.6-1.2.2-.6.2-1 .1-1.2l-.5-.3Z" />
  </svg>
);

/** Row of rating stars; partially-filled values round to the nearest whole star. */
export const Stars = ({ value = 5, size = 16, className = '' }: { value?: number; size?: number; className?: string }) => (
  <span className={`inline-flex gap-0.5 ${className}`} role="img" aria-label={`৫-এর মধ্যে ${toBnDigits(value)} স্টার`}>
    {Array.from({ length: 5 }, (_, i) => (
      <svg key={i} width={size} height={size} viewBox="0 0 24 24" aria-hidden="true">
        <path
          d="m12 2.6 2.9 6 6.5.8-4.8 4.5 1.2 6.5L12 17.2l-5.8 3.2 1.2-6.5-4.8-4.5 6.5-.8L12 2.6Z"
          fill={i < Math.round(value) ? '#F4A261' : '#E8DFD0'}
        />
      </svg>
    ))}
  </span>
);
