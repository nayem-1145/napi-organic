import { OrderButton } from '../components/Brand';
import { useStore } from '../lib/store';
import { asset } from '../lib/utils';

export function FinalCta() {
  const shot = useStore((s) => s.finalShot);
  return (
    <section id="order" className="relative isolate overflow-hidden bg-banana py-24 lg:py-0">
      <div className="mx-auto grid max-w-[1440px] items-center gap-10 px-5 sm:px-8 lg:min-h-[86svh] lg:grid-cols-12 lg:px-12">
        <div className="relative z-10 lg:col-span-6">
          <h2 className="display text-[2.3rem] text-forest-deep sm:text-6xl lg:text-[4.4rem]" data-reveal>
            মুচমুচে স্বাদের আনন্দ ছড়িয়ে পড়ুক প্রতিটি মুহূর্তে।
          </h2>
          <p className="mt-6 max-w-md text-lg text-ink/75" data-reveal>
            আজই অর্ডার করুন আপনার পছন্দের Napi Organic Banana Chips।
          </p>
          <div className="mt-9" data-reveal>
            <OrderButton />
          </div>
        </div>
        <div className="relative lg:col-span-6 lg:h-full" data-reveal>
          {shot ? (
            // Rendered from the 3D scene: opened package beside the filled bowl
            <img
              src={shot}
              alt="খোলা Napi Organic প্যাকেট ও চিপসে ভরা বাটি"
              className="w-full scale-[1.35] object-contain lg:absolute lg:inset-y-0 lg:right-[-20%] lg:h-full lg:w-[140%] lg:max-w-none lg:scale-100 lg:object-cover lg:object-[85%_50%]"
            />
          ) : (
            <img
              src={asset('images/product-photo.webp')}
              alt="Napi Organic প্যাকেট, কলা ও ব্যানানা চিপস"
              className="w-full object-cover mix-blend-multiply"
              loading="lazy"
            />
          )}
        </div>
      </div>
    </section>
  );
}
