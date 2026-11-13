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

export interface Testimonial {
  name: string;
  location: string;
  text: string;
}

export interface FaqItem {
  q: string;
  a: string;
}

export const site = {
  brand: {
    name: 'Napi Organic',
    legalName: 'Napi Organic Ltd.', // as printed on the package ("Distributed by")
    tagline: 'প্রকৃতির স্বাদ, প্রতিটি কামড়ে',
    description:
      'বাছাই করা কলা থেকে তৈরি মুচমুচে ব্যানানা চিপস। প্রকৃতির সহজ স্বাদ, যত্নে প্যাকেটবন্দি।',
  },

  product: {
    id: 'banana-chips-chili-lime-150',
    name: 'Napi Organic Banana Chips',
    flavour: 'চিলি লাইম গ্লেজড',
    weightGrams: 150,
    priceBdt: null, // TODO: set the real price, e.g. 250
    maxQuantity: 20,
  } as ProductVariant,

  contact: {
    /**
     * WhatsApp number in international format WITHOUT "+" or spaces, e.g. "8801XXXXXXXXX".
     * TODO: add the real number. While empty, the order button opens WhatsApp's
     * contact picker with the message prefilled, so ordering still works.
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
      name: 'নমুনা ক্রেতা ১',
      location: 'ঢাকা',
      text: 'বিকেলের চায়ের সাথে একদম মানানসই। মুচমুচে ভাবটা শেষ কামড় পর্যন্ত থাকে।',
    },
    {
      name: 'নমুনা ক্রেতা ২',
      location: 'চট্টগ্রাম',
      text: 'চিলি লাইমের হালকা ঝাল আর টকের ব্যালান্সটা দারুণ। প্যাকেটটাও দেখতে সুন্দর।',
    },
    {
      name: 'নমুনা ক্রেতা ৩',
      location: 'সিলেট',
      text: 'বাচ্চাদের টিফিনে দিচ্ছি। জিপ-লক থাকায় খোলার পরও রাখতে সুবিধা।',
    },
  ] as Testimonial[],

  /** FAQ answers only use information printed on the package. Edit freely. */
  faq: [
    {
      q: 'Napi Organic Banana Chips কীভাবে তৈরি করা হয়?',
      a: 'বাছাই করা কলা পাতলা করে কেটে মসলায় ভিজিয়ে (Spice Infused) ভ্যাকুয়াম পদ্ধতিতে শুকিয়ে (Vacuum Dried) তৈরি করা হয়, যাতে প্রতিটি চিপস থাকে হালকা আর মুচমুচে।',
    },
    {
      q: 'এতে কী কী উপাদান ব্যবহার করা হয়?',
      a: 'প্যাকেটে উল্লেখিত উপাদান: কলা, নারকেল তেল, লাল চিনি, জিরা, ধনিয়া, শুকনো আমের গুঁড়া, গোলমরিচ, মিনারেল সল্ট ব্লেন্ড ও নির্বাচিত মসলা।',
    },
    {
      q: 'কীভাবে সংরক্ষণ করতে হবে?',
      a: 'ঠান্ডা ও শুকনো জায়গায়, সরাসরি রোদ থেকে দূরে রাখুন। প্যাকেট খোলার পর জিপ ভালোভাবে আটকে রাখলে মুচমুচে ভাব বজায় থাকে।',
    },
    {
      q: 'কত দিনের মধ্যে ডেলিভারি পাওয়া যাবে?',
      // TODO: replace with the real delivery policy.
      a: 'ডেলিভারির সময় আপনার এলাকার ওপর নির্ভর করে। অর্ডার নিশ্চিত করার সময় আমরা সঠিক সময় জানিয়ে দেব।',
    },
    {
      q: 'কীভাবে অর্ডার করতে পারব?',
      a: 'পরিমাণ বেছে নিয়ে “এখনই অর্ডার করুন” চাপুন। আপনার অর্ডারের বিবরণসহ একটি WhatsApp বার্তা তৈরি হয়ে যাবে — শুধু পাঠিয়ে দিন।',
    },
  ] as FaqItem[],
};

export type SiteConfig = typeof site;
