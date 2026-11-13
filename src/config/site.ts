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
      tagline: 'প্রথমবার চেখে দেখুন',
      packs: 1,
      priceBdt: null,
      perks: ['১টি ১৫০ গ্রাম জিপ-লক প্যাক', 'শিশু বা নিজের জন্য — চেখে দেখার জন্য আদর্শ'],
    },
    {
      id: 'family',
      name: 'ফ্যামিলি প্যাক',
      tagline: 'শিশু থেকে বড় — পরিবারের সবার জন্য',
      packs: 3,
      priceBdt: null, // TODO e.g. 3 × price minus a discount
      featured: true,
      ribbon: 'প্রস্তাবিত',
      perks: ['৩টি ১৫০ গ্রাম জিপ-লক প্যাক', 'শিশুদের নাস্তা আর বড়দের আড্ডায়', 'খোলার পর জিপ আটকে রাখা যায়'],
    },
    {
      id: 'value',
      name: 'ভ্যালু বান্ডেল',
      tagline: 'বড় পরিবার বা উপহারের জন্য',
      packs: 5,
      priceBdt: null, // TODO
      perks: ['৫টি ১৫০ গ্রাম জিপ-লক প্যাক', 'যৌথ পরিবার বা প্রিয়জনকে উপহার', 'বারবার অর্ডারের ঝামেলা নেই'],
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
    plantation: 'images/plantation-bd.webp' as string | null, // aerial banana plantation, Bangladesh
    preparation: 'images/chips-pile.webp' as string | null, // our own product photo
    lifestyle: 'images/kids-village.webp' as string | null, // full-width: children playing in a Bangladeshi haor village
    ingredients: null as string | null, // optional flat-lay of all ingredients
    /** Kids section — replace with your own shoot (children with the product, parental consent) when available */
    kids: 'images/village-football.webp' as string | null,
  },

  /**
   * Stock photos from Wikimedia Commons. Their licences REQUIRE this credit,
   * which the footer shows. Remove an entry only when you replace that photo.
   */
  photoCredits: [
    {
      file: 'plantation-bd.webp',
      title: 'Aerial view of a banana plantation in Bangladesh',
      author: 'The Roving Rokibul',
      license: 'CC BY-SA 4.0',
      url: 'https://commons.wikimedia.org/wiki/File:Aerial_view_of_a_banana_plantation_in_Bangladesh.jpg',
    },
    {
      file: 'kids-village.webp',
      title: 'Childhood Memories',
      author: 'Ashef Emran',
      license: 'CC BY-SA 4.0',
      url: 'https://commons.wikimedia.org/wiki/File:Childhood_Memories.jpg',
    },
    {
      file: 'village-football.webp',
      title: 'Football in the village of Bangladesh',
      author: 'Goutam',
      license: 'CC BY-SA 3.0',
      url: 'https://commons.wikimedia.org/wiki/File:Football_in_the_village_of_Bangladesh.jpg',
    },
  ],
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

  /** FAQ answers only use information printed on the package. Edit freely. */
  faq: [
    {
      q: 'শিশুদের জন্য Napi Organic কেন স্বাস্থ্যকর পছন্দ?',
      a: 'এটি ১০০% অর্গানিক কলা থেকে তৈরি, এতে কোনো প্রিজারভেটিভ নেই, এবং এটি ভিগান ও গ্লুটেন-ফ্রি — সবই প্যাকেটে উল্লেখিত। সম্পূর্ণ উপাদান তালিকা প্যাকেটের পেছনে ছাপা আছে, লুকানো কিছু নেই। সুষম খাদ্যাভ্যাসের অংশ হিসেবে পরিমিত পরিমাণে উপভোগ করুন।',
    },
    {
      q: 'এটা কি শুধু শিশুদের জন্য?',
      a: 'না। শিশুদের কথা ভেবে তৈরি হলেও, যেকোনো বয়সের মানুষ যারা বিশুদ্ধ, ভেজালমুক্ত নাস্তা পছন্দ করেন — সবার জন্যই উপযুক্ত। অফিসে, ভ্রমণে বা চায়ের সাথে পরিবারের সবাই উপভোগ করতে পারেন।',
    },
    {
      q: '“ভেজালমুক্ত” বলতে কী বোঝানো হচ্ছে?',
      a: 'এতে কোনো প্রিজারভেটিভ যোগ করা হয়নি, আর প্রতিটি উপাদান প্যাকেটে স্পষ্টভাবে লেখা আছে — অর্গানিক কলা, নারকেল তেল, লাল চিনি আর পরিচিত মসলা। এর বাইরে কিছু মেশানো হয় না।',
    },
    {
      q: 'কোন বয়সের শিশুদের দেওয়া যাবে?',
      // TODO: confirm the recommended age with your product team.
      a: 'যেসব শিশু স্বাচ্ছন্দ্যে শক্ত ও মুচমুচে খাবার চিবিয়ে খেতে পারে, তাদের জন্য। খুব ছোট শিশুদের মুচমুচে খাবার দেওয়ার সময় পাশে থেকে নজর রাখুন। খাবারে অ্যালার্জি থাকলে প্যাকেটের উপাদান তালিকা দেখে নিন।',
    },
    {
      q: 'এটা কি ঝাল? শিশুরা খেতে পারবে?',
      // TODO: describe the actual spice level once confirmed.
      a: 'এর ফ্লেভার চিলি লাইম গ্লেজড, তাই এতে মসলা আছে। প্রথমবার অল্প দিয়ে দেখে নিন আপনার শিশুর কেমন লাগে। প্রশ্ন থাকলে WhatsApp-এ জিজ্ঞেস করুন।',
    },
    {
      q: 'কলাগুলো কি অর্গানিক?',
      a: 'হ্যাঁ, ১০০% অর্গানিক কলা। প্যাকেটের উপাদান তালিকায় মূল উপাদান হিসেবে “Organic Bananas” উল্লেখ আছে।',
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
