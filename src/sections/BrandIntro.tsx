import { Photo } from '../components/Brand';
import { site } from '../config/site';
import { asset, toBnDigits } from '../lib/utils';

export function BrandIntro() {
  return (
    <section id="brand" className="relative overflow-hidden py-24 lg:py-40">
      <div className="mx-auto max-w-[1440px] px-5 sm:px-8 lg:px-12">
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-10">
          <div className="lg:col-span-7">
            <p className="eyebrow mb-6" data-reveal>
              Napi Organic
            </p>
            <h2 className="display text-[2.4rem] text-forest sm:text-6xl lg:text-[5.2rem]" data-reveal>
              ভালো থাকার অভ্যাস,
              <br />
              <span className="text-sage">প্রকৃতির উপাদানে</span>
            </h2>
          </div>
          <div className="flex flex-col justify-end lg:col-span-4 lg:col-start-9">
            <p className="text-lg text-ink-soft lg:text-xl" data-reveal>
              Napi Organic-এর লক্ষ্য সহজ — শিশুদের হাতে নিশ্চিন্তে তুলে দেওয়ার মতো একটি বিশুদ্ধ নাস্তা, যা পরিবারের সবাই উপভোগ করবে। ১০০% অর্গানিক কলা, প্রিজারভেটিভ ও ভেজাল ছাড়া।
            </p>
          </div>
        </div>

        <div className="mt-16 grid gap-6 lg:mt-24 lg:grid-cols-12 lg:gap-10">
          <figure className="lg:col-span-8" data-reveal>
            <Photo
              src={asset('images/product-photo.webp')}
              alt="Napi Organic ব্যানানা চিপসের প্যাকেটের সামনে ও পেছনের দিক, পাশে পাকা কলা ও চিপস"
              brief=""
              className="aspect-[16/10] w-full lg:aspect-[16/9]"
              imgClassName="scale-110"
            />
            <figcaption className="mt-4 flex justify-between text-sm text-ink-soft">
              <span>অর্গানিক ব্যানানা চিপস — {site.product.flavour}</span>
              <span>{toBnDigits(site.product.weightGrams)} গ্রাম</span>
            </figcaption>
          </figure>
          <div className="flex flex-col justify-between gap-10 lg:col-span-4">
            <Photo
              src={asset('images/chips-pile.webp')}
              alt="সোনালি মুচমুচে ব্যানানা চিপস"
              brief=""
              className="aspect-[5/2] w-full"
            />
            <blockquote className="border-l-2 border-banana pl-6" data-reveal>
              <p className="display text-2xl text-forest lg:text-[1.9rem]">“১০০% অর্গানিক কলা · ভেজালমুক্ত · প্রিজারভেটিভ নেই”</p>
              <cite className="mt-3 block text-sm text-ink-soft not-italic">— Napi Organic প্যাকেট থেকে</cite>
            </blockquote>
          </div>
        </div>
      </div>
    </section>
  );
}
