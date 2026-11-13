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
  /** Short line under the name, e.g. who it is for */
  tagline: string;
  /** Number of 150 g packs in the bundle */
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

export interface FaqItem {
  q: string;
  a: string;
}

export const site = {
  brand: {
    name: 'Napi Organic',
    legalName: 'Napi Organic Ltd.', // as printed on the package ("Distributed by")
    tagline: 'বাচ্চার টিফিনের স্বাস্থ্যকর সঙ্গী',
    description:
      'অর্গানিক কলা থেকে তৈরি, প্রিজারভেটিভমুক্ত, ভিগান ও গ্লুটেন-ফ্রি ব্যানানা চিপস — বাচ্চার টিফিন আর পরিবারের নাস্তায় নিশ্চিন্ত পছন্দ।',
  },

  product: {
    id: 'banana-chips-chili-lime-150',
    name: 'Napi Organic Banana Chips',
    flavour: 'চিলি লাইম গ্লেজড',
    weightGrams: 150,
    priceBdt: null, // TODO: set the real price, e.g. 250
    maxQuantity: 20,
  } as ProductVariant,

  /**
   * Package options shown in the "প্যাকেজ বেছে নিন" section.
   * TODO: set real prices. While `product.priceBdt` and these are `null`,
   * the cards show "মূল্য জানতে যোগাযোগ করুন" instead of a number.
   */
  bundles: [
    {
      id: 'single',
      name: 'সিঙ্গেল প্যাক',
      tagline: 'বাচ্চার পছন্দ হয় কিনা দেখে নিন',
      packs: 1,
      priceBdt: null,
      perks: ['১টি ১৫০ গ্রাম জিপ-লক প্যাক', 'প্রথমবার চেখে দেখার জন্য আদর্শ'],
    },
    {
      id: 'family',
      name: 'স্কুল টিফিন প্যাক',
      tagline: 'বাচ্চার স্কুল টিফিনের জন্য',
      packs: 3,
      priceBdt: null, // TODO e.g. 3 × price minus a discount
      featured: true,
      ribbon: 'টিফিনের জন্য প্রস্তাবিত',
      perks: ['৩টি ১৫০ গ্রাম জিপ-লক প্যাক', 'টিফিন বক্সে অল্প করে দেওয়া যায়', 'বিকেলের নাস্তাতেও চলে'],
    },
    {
      id: 'value',
      name: 'ফ্যামিলি বান্ডেল',
      tagline: 'ভাই-বোন সবার জন্য, মাসের স্টক',
      packs: 5,
      priceBdt: null, // TODO
      perks: ['৫টি ১৫০ গ্রাম জিপ-লক প্যাক', 'একাধিক বাচ্চার টিফিনের জন্য', 'বারবার অর্ডারের ঝামেলা নেই'],
    },
  ] as ProductBundle[],

  /**
   * ORDER FORM — GitHub Pages has no server, so orders are sent to a form service
   * that emails them to you. Default: Web3Forms (free, 250 orders/month).
   *
   *  1. Go to https://web3forms.com, enter the email that should receive orders.
   *  2. Copy the Access Key they email you and paste it below.
   *
   * Until a key is set, the live site shows an error + WhatsApp option instead of
   * pretending the order went through (in `npm run dev` it simulates success so you
   * can preview the Thank You screen).
   *
   * Formspree also works: set `endpoint` to your https://formspree.io/f/xxxx URL and
   * leave `accessKey` empty.
   */
  orderForm: {
    endpoint: 'https://api.web3forms.com/submit',
    accessKey: '', // TODO: paste your Web3Forms access key
    emailSubject: 'নতুন অর্ডার — Napi Organic Banana Chips',
  },

  contact: {
    /**
     * WhatsApp number in international format WITHOUT "+" or spaces, e.g. "8801XXXXXXXXX".
     * TODO: add the real number. While empty, WhatsApp buttons open the contact
     * picker with the message prefilled.
     */
    whatsapp: '',
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
    plantation: null as string | null, // banana plantation, early light
    preparation: null as string | null, // slicing / drying in the kitchen
    lifestyle: null as string | null, // full-width: chips in a ceramic bowl on a wooden table, warm sunlight
    ingredients: null as string | null, // optional flat-lay of all ingredients
    /** Kids section: e.g. 'images/kids-tiffin.webp' — chips in a school tiffin box, child smiling (get parental consent) */
    kids: null as string | null,
  },
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
      name: 'নমুনা অভিভাবক ১',
      location: 'ঢাকা · ক্লাস থ্রির মা',
      text: 'প্রিজারভেটিভ নেই দেখে মেয়ের স্কুল টিফিনে নিশ্চিন্তে দিচ্ছি। উপাদান তালিকাটা পড়েই ভরসা পেয়েছি।',
      rating: 5,
    },
    {
      name: 'নমুনা অভিভাবক ২',
      location: 'চট্টগ্রাম · দুই বাচ্চার বাবা',
      text: 'বাচ্চারা স্কুল থেকে ফিরে কিছু একটা চায়। এখন বিকেলের নাস্তায় এটাই দিই — অর্গানিক কলা দিয়ে তৈরি, তাই মন থেকে দিতে পারি।',
      rating: 5,
    },
    {
      name: 'নমুনা অভিভাবক ৩',
      location: 'সিলেট · ক্লাস ফাইভের মা',
      text: 'জিপ-লক থাকায় এক প্যাকেট থেকে কয়েক দিনের টিফিন হয়ে যায়। ছেলের জন্য গ্লুটেন-ফ্রি স্ন্যাকস খুঁজছিলাম, পেয়ে গেছি।',
      rating: 5,
    },
  ] as Testimonial[],

  /** FAQ answers only use information printed on the package. Edit freely. */
  faq: [
    {
      q: 'বাচ্চার নাস্তায় Napi Organic কেন স্বাস্থ্যকর পছন্দ?',
      a: 'এটি অর্গানিক কলা থেকে তৈরি, এতে কোনো প্রিজারভেটিভ নেই, এবং এটি ভিগান ও গ্লুটেন-ফ্রি — সবই প্যাকেটে উল্লেখিত। সম্পূর্ণ উপাদান তালিকা প্যাকেটের পেছনে ছাপা আছে, লুকানো কিছু নেই। সুষম খাদ্যাভ্যাসের অংশ হিসেবে পরিমিত পরিমাণে উপভোগ করুন।',
    },
    {
      q: 'বাচ্চাদের টিফিনে দেওয়া যাবে?',
      a: 'হ্যাঁ। এটি অর্গানিক কলা থেকে তৈরি, কোনো প্রিজারভেটিভ নেই, এবং ভিগান ও গ্লুটেন-ফ্রি। জিপ-লক প্যাক থেকে অল্প করে টিফিন বক্সে দিন, বাকিটা আটকে রাখুন। যেকোনো নাস্তার মতোই পরিমিত পরিমাণে দেওয়াই ভালো।',
    },
    {
      q: 'কোন বয়সের বাচ্চাদের জন্য উপযুক্ত?',
      // TODO: confirm the recommended age with your product team.
      a: 'যেসব বাচ্চা স্বাচ্ছন্দ্যে শক্ত ও মুচমুচে খাবার চিবিয়ে খেতে পারে, তাদের জন্য। খুব ছোট বাচ্চাদের মুচমুচে খাবার দেওয়ার সময় পাশে থেকে নজর রাখুন। খাবারে অ্যালার্জি থাকলে প্যাকেটের উপাদান তালিকা দেখে নিন।',
    },
    {
      q: 'এটা কি ঝাল? বাচ্চারা খেতে পারবে?',
      // TODO: describe the actual spice level once confirmed.
      a: 'এর ফ্লেভার চিলি লাইম গ্লেজড, তাই এতে মসলা আছে। প্রথমবার অল্প দিয়ে দেখে নিন আপনার বাচ্চার কেমন লাগে। প্রশ্ন থাকলে WhatsApp-এ জিজ্ঞেস করুন।',
    },
    {
      q: 'কলাগুলো কি অর্গানিক?',
      a: 'হ্যাঁ। প্যাকেটের উপাদান তালিকায় মূল উপাদান হিসেবে “Organic Bananas” উল্লেখ আছে।',
    },
    {
      q: 'এতে কী কী উপাদান ব্যবহার করা হয়?',
      a: 'প্যাকেটে উল্লেখিত উপাদান: অর্গানিক কলা, নারকেল তেল, লাল চিনি, জিরা, ধনিয়া, শুকনো আমের গুঁড়া, গোলমরিচ, মিনারেল সল্ট ব্লেন্ড ও নির্বাচিত মসলা।',
    },
    {
      q: 'কীভাবে তৈরি করা হয়?',
      a: 'অর্গানিক কলা পাতলা করে কেটে মসলায় ভিজিয়ে (Spice Infused) ভ্যাকুয়াম পদ্ধতিতে শুকিয়ে (Vacuum Dried) তৈরি করা হয় — কোনো প্রিজারভেটিভ ছাড়াই।',
    },
    {
      q: 'কীভাবে সংরক্ষণ করতে হবে?',
      a: 'ঠান্ডা ও শুকনো জায়গায়, সরাসরি রোদ থেকে দূরে রাখুন। প্যাকেট খোলার পর জিপ ভালোভাবে আটকে রাখুন।',
    },
    {
      q: 'কত দিনের মধ্যে ডেলিভারি পাওয়া যাবে?',
      // TODO: replace with the real delivery policy.
      a: 'ডেলিভারির সময় আপনার এলাকার ওপর নির্ভর করে। অর্ডার নিশ্চিত করার সময় আমরা সঠিক সময় জানিয়ে দেব।',
    },
    {
      q: 'কীভাবে অর্ডার করতে পারব?',
      a: 'পেজের নিচের অর্ডার ফর্মে নাম, মোবাইল নম্বর ও ঠিকানা দিয়ে প্যাকেজ বেছে নিন, তারপর “অর্ডার নিশ্চিত করুন” চাপুন। কোনো প্রশ্ন থাকলে WhatsApp-এও আমাদের সাথে কথা বলতে পারেন।',
    },
  ] as FaqItem[],
};

export type SiteConfig = typeof site;
