import { LogoTab, OrderButton } from '../components/Brand';
import { FacebookIcon, Globe, InstagramIcon, WhatsAppIcon } from '../components/Icons';
import { NAV_LINKS } from '../components/Nav';
import { site } from '../config/site';
import { scrollToId, toBnDigits } from '../lib/utils';
import { whatsappUrl } from '../lib/whatsapp';

export function Footer() {
  const c = site.contact;
  const year = new Date().getFullYear();
  return (
    // bottom padding on mobile leaves room for the sticky order bar
    <footer id="site-footer" className="relative bg-forest-deep pb-24 text-cream lg:pb-0">
      <div className="mx-auto max-w-[1440px] px-5 sm:px-8 lg:px-12">
        <LogoTab />
        <div className="grid gap-12 pt-12 pb-16 lg:grid-cols-12 lg:pt-16">
          <div className="lg:col-span-5">
            <p className="display max-w-md text-2xl text-cream lg:text-3xl">{site.brand.tagline}</p>
            <p className="mt-4 max-w-md text-cream/65">{site.brand.description}</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <OrderButton label="অর্ডার করুন" />
              <a href={whatsappUrl()} target="_blank" rel="noopener noreferrer" className="btn btn-whatsapp">
                <WhatsAppIcon /> WhatsApp
              </a>
            </div>
          </div>

          <nav className="lg:col-span-3 lg:col-start-7" aria-label="ফুটার মেনু">
            <h3 className="mb-5 text-sm font-semibold tracking-wider text-banana">মেনু</h3>
            <ul className="space-y-1">
              {NAV_LINKS.map((l) => (
                <li key={l.id}>
                  <button onClick={() => scrollToId(l.id)} className="py-1.5 text-cream/75 transition-colors hover:text-banana">
                    {l.label}
                  </button>
                </li>
              ))}
            </ul>
          </nav>

          <div className="lg:col-span-3">
            <h3 className="mb-5 text-sm font-semibold tracking-wider text-banana">যোগাযোগ</h3>
            <ul className="space-y-3 text-cream/75">
              {c.phoneDisplay && <li>ফোন: {c.phoneDisplay}</li>}
              {c.email && <li>{c.email}</li>}
              {c.address && <li>{c.address}</li>}
              <li>
                <a href={c.facebook} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-3 py-1 hover:text-banana">
                  <FacebookIcon /> facebook.com/napiorganic
                </a>
              </li>
              <li>
                <a href={c.instagram} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-3 py-1 hover:text-banana">
                  <InstagramIcon /> instagram.com/napiorganic
                </a>
              </li>
              <li>
                <a href={c.website} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-3 py-1 hover:text-banana">
                  <Globe size={18} strokeWidth={1.6} /> napiorganic.com
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div className="flex flex-col justify-between gap-3 border-t border-cream/10 py-8 text-sm text-cream/50 sm:flex-row">
          <p>
            © {toBnDigits(year)} {site.brand.legalName}। সর্বস্বত্ব সংরক্ষিত।
          </p>
          <p>বাংলাদেশের ব্র্যান্ড</p>
        </div>
        {site.photoCredits.length > 0 && (
          <p className="border-t border-cream/10 py-5 text-xs leading-relaxed text-cream/40">
            ছবি:{' '}
            {site.photoCredits.map((c, i) => (
              <span key={c.file}>
                {i > 0 && ' · '}
                <a href={c.url} target="_blank" rel="noopener noreferrer" className="underline decoration-cream/20 underline-offset-2 hover:text-banana">
                  “{c.title}”
                </a>{' '}
                — {c.author}, {c.license}
              </span>
            ))}{' '}
            (Wikimedia Commons, আকার পরিবর্তিত)
          </p>
        )}
      </div>
    </footer>
  );
}
