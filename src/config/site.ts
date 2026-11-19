/**
 * ─────────────────────────────────────────────────────────────
 *  NAPI ORGANIC — CENTRAL BUSINESS CONFIGURATION
 * ─────────────────────────────────────────────────────────────
 *  Every piece of business information lives here.
 *  Values marked `TODO` were NOT supplied and are intentionally
 *  left empty so nothing is invented. Fill them in before launch.
 * ─────────────────────────────────────────────────────────────
 */

export interface ProductVariant {
  id: string;
  /** Shown in the UI and in the WhatsApp message */
  name: string;
  flavour: string;
  /** Net weight in grams — 150 g is printed on the supplied package artwork */
  weightGrams: number;
  /** Price in BDT. `null` = not configured yet → UI shows "মূল্য জানতে যোগাযোগ করুন" */
  priceBdt: number | null;
  maxQuantity: number;
}

export interface ProductBundle {
  id: string;
  name: string;
  /** Name written to the Google Sheet (English) */
  sheetName: string;
  /** Short line under the name, e.g. who it is for */
  tagline: string;
  /** Number of packets in the bundle (each packet = product.weightGrams) */
  packs: number;
  /**
   * Bundle price in BDT. `null` = packs × `product.priceBdt` (no discount).
   * Set a lower number to offer a discount — the "% সাশ্রয়" badge and the
   * struck-through regular price are calculated automatically.
   */
  priceBdt: number | null;
  /** Visually highlights this card. Use for the bundle you want to push. */
  featured?: boolean;
  /** Ribbon text on the featured card */
  ribbon?: string;
  perks: string[];
}

export interface Testimonial {
  name: string;
  location: string;
  text: string;
  /** 1–5 stars. Only use the rating the customer actually gave. */
  rating: number;
}

export const site = {
  brand: {
    name: 'Napi Organic',
    legalName: 'Napi Organic Ltd.', // as printed on the package ("Distributed by")
    tagline: 'শিশুর জন্য স্বাস্থ্যকর, সবার জন্য বিশুদ্ধ',
    description:
      '১০০% অর্গানিক কলা থেকে তৈরি, প্রিজারভেটিভ ও ভেজালমুক্ত ব্যানানা চিপস — শিশুদের জন্য নিশ্চিন্ত, আর বিশুদ্ধ নাস্তা যারা ভালোবাসেন সেই সব বয়সের মানুষের জন্য।',
  },

  /**
   * Headline claims used across the page — change them here once.
   * The package lists "Organic Bananas" (not every ingredient as organic), so the
   * organic claim names the bananas. If the whole product is certified organic,
   * change `organic` to '১০০% অর্গানিক'.
   */
  claims: {
    organic: '১০০% অর্গানিক কলা',
    pure: 'ভেজালমুক্ত ও বিশুদ্ধ',
  },

  product: {
    id: 'banana-chips-chili-lime-100',
    name: 'Napi Organic Banana Chips',
    flavour: 'চিলি লাইম গ্লেজড',
    weightGrams: 100,
    priceBdt: 100, // per packet (BDT)
    maxQuantity: 20,
  } as ProductVariant,

  /**
   * Package options shown in the "প্যাকেজ বেছে নিন" section.
   * Prices in BDT. Regular price = packets × product.priceBdt (১০০ টাকা);
   * a lower bundle price automatically shows the "সাশ্রয়" badge.
   */
  bundles: [
    {
      id: 'single',
      name: 'সিঙ্গেল প্যাক',
      sheetName: 'Single Pack',
      tagline: 'প্রথমবার চেখে দেখুন',
      packs: 4,
      priceBdt: 400, // 4 × ১০০ টাকা
      perks: ['৪টি ১০০ গ্রাম জিপ-লক প্যাকেট', 'শিশু বা নিজের জন্য — চেখে দেখার জন্য আদর্শ'],
    },
    {
      id: 'family',
      name: 'ফ্যামিলি প্যাক',
      sheetName: 'Family Pack',
      tagline: 'শিশু থেকে বড় — পরিবারের সবার জন্য',
      packs: 6,
      priceBdt: 580,
      featured: true,
      ribbon: 'প্রস্তাবিত',
      perks: ['৬টি ১০০ গ্রাম জিপ-লক প্যাকেট', 'শিশুদের নাস্তা আর বড়দের আড্ডায়', 'খোলার পর জিপ আটকে রাখা যায়'],
    },
    {
      id: 'value',
      name: 'বান্ডেল প্যাক',
      sheetName: 'Bundle Pack',
      tagline: 'বড় পরিবার বা উপহারের জন্য',
      packs: 9,
      priceBdt: 780,
      perks: ['৯টি ১০০ গ্রাম জিপ-লক প্যাকেট', 'সবচেয়ে কম দামে প্রতি প্যাকেট', 'যৌথ পরিবার বা প্রিয়জনকে উপহার'],
    },
  ] as ProductBundle[],

  /** Delivery charge in BDT, by delivery area (added to the order total). */
  delivery: {
    inside: 70, // ঢাকার ভেতরে
    outside: 120, // ঢাকার বাইরে
  },

  /**
   * ORDER FORM — GitHub Pages has no server, so orders are sent elsewhere.
   *
   * 1) Google Sheet (main order list): set `sheetUrl` to the Web app URL of the
   *    Apps Script in google-apps-script/Code.gs (setup steps are in that file).
   *    Every order becomes a new row with status "Pending Verification".
   *
   * 2) Optional e-mail copy via Web3Forms: paste an access key from
   *    https://web3forms.com into `accessKey`. Leave empty to skip e-mails.
   *
   * With neither set, the live site shows an error + WhatsApp option instead of
   * pretending the order went through (`npm run dev` simulates success so you can
   * preview the Thank You screen).
   */
  orderForm: {
    sheetUrl: 'https://script.google.com/macros/s/AKfycbxp4VvIJT5DPjf4iZLgg3-gF0xUpbASlEnydF-LVdDE_sxO0doNje5jNfBN7Il5OVd5/exec',
    endpoint: 'https://api.web3forms.com/submit',
    accessKey: '', // optional: Web3Forms access key for an e-mail copy of each order
    emailSubject: 'নতুন অর্ডার — Napi Organic Banana Chips',
  },

  contact: {
    /**
     * WhatsApp number in international format WITHOUT "+" or spaces, e.g. "8801XXXXXXXXX".
     */
    whatsapp: '8801608178233', // +880 1608-178233
    phoneDisplay: '', // TODO e.g. "০১XXX-XXXXXX"
    email: '', // TODO
    address: '', // TODO
    // The three links below are printed on the supplied package artwork.
    facebook: 'https://facebook.com/napiorganic',
    instagram: 'https://instagram.com/napiorganic',
    website: 'https://napiorganic.com',
  },

  /**
   * Photography. `null` = no photo supplied yet → an art-directed, clearly labelled
   * placeholder is shown. Drop files into /public/images and set the paths.
   */
  images: {
    plantation: 'images/banana-garden.webp' as string | null, // own photo: banana bunches hanging in the garden
    preparation: 'images/chips-bowl.webp' as string | null, // our own product photo
    ingredients: null as string | null, // optional flat-lay of all ingredients
    /** Kids section — own photo of a child with the product */
    kids: 'images/kid-snack.webp' as string | null,
  },

  /**
   * Stock photos from Wikimedia Commons. Their licences REQUIRE this credit,
   * which the footer shows. Remove an entry only when you replace that photo.
   */
  photoCredits: [] as { file: string; title: string; author: string; license: string; url: string }[],

  /** Shows small "placeholder" notes next to illustrated/placeholder visuals. Turn off for launch. */
  showPlaceholderNotes: true as boolean,

  /**
   * SAMPLE testimonials — clearly labelled as samples in the UI.
   * Replace with real, permission-granted customer feedback and set
   * `testimonialsAreSamples` to false.
   */
  testimonialsAreSamples: true as boolean,
  testimonials: [
    {
      name: 'নমুনা ক্রেতা ১',
      location: 'ঢাকা · ছয় বছরের মেয়ের মা',
      text: 'মেয়ের জন্য প্রিজারভেটিভ ছাড়া কিছু খুঁজছিলাম। উপাদান তালিকাটা পড়েই ভরসা পেয়েছি, এখন নিশ্চিন্তে দিই।',
      rating: 5,
    },
    {
      name: 'নমুনা ক্রেতা ২',
      location: 'চট্টগ্রাম · চাকরিজীবী',
      text: 'বাজারের নাস্তায় কী মেশানো থাকে বোঝা যায় না। এটা অর্গানিক কলা দিয়ে তৈরি, ভেজাল নেই — অফিসের ডেস্কে এখন এটাই রাখি।',
      rating: 5,
    },
    {
      name: 'নমুনা ক্রেতা ৩',
      location: 'সিলেট · যৌথ পরিবার',
      text: 'নাতি-নাতনি থেকে বাবা-মা, বাসার সবাই খায়। গ্লুটেন-ফ্রি আর বিশুদ্ধ, তাই সবার জন্য একসাথে নিই।',
      rating: 5,
    },
  ] as Testimonial[],

};

export type SiteConfig = typeof site;
