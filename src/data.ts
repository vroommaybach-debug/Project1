import { Product } from './types';

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: '1a9b9c9d-8e7f-6a5b-4c3d-2e1f0a1b2c3d',
    title: 'Shea Whipped Soufflé',
    slug: 'shea-whipped-souffle',
    description: 'A decadent, cloud-like moisturizer crafted with Grade-A raw Shea butter, cold-pressed almond oil, and premium botanicals. Hand-whipped to pristine perfection for instant cellular absorption and deep, long-lasting dermal hydration.',
    price: 18500,
    stock_count: 42,
    images: ['/assets/images/shea_butter_jar_1783418086221.jpg'],
    category: 'Shea',
    ingredients: ['Grade-A Raw Shea Butter', 'Cold-Pressed Sweet Almond Oil', 'Organic Jojoba Seed Oil', 'Vitamin E (Tocopherol)', 'Sandalwood & Vanilla Essential Oils'],
    created_at: new Date('2026-01-01').toISOString()
  },
  {
    id: '2b9c9d9e-8f7a-6b5c-4d3e-2f1a0b1c2d3e',
    title: 'Coconut Nectar Oil',
    slug: 'coconut-nectar-oil',
    description: 'A premium, ultra-light facial and body oil infused with raw coconut nectar, fractionated coconut lipids, and active squalane. Restores the skins protective lipid barrier while imparting a sublime, non-greasy satin finish.',
    price: 15000,
    stock_count: 28,
    images: ['/assets/images/coconut_oil_bottle_1783418099199.jpg'],
    category: 'Coconut',
    ingredients: ['Fractionated Coconut Oil', 'Organic Coconut Nectar Extract', 'Olive-Derived Squalane', 'Rosehip Seed Oil', 'Neroli Blossom Essential Oil'],
    created_at: new Date('2026-01-02').toISOString()
  },
  {
    id: '3c9d9e9f-8a7b-6c5d-4e3f-2a1b0c1d2e3f',
    title: 'Activated Charcoal Black Soap',
    slug: 'activated-charcoal-black-soap',
    description: 'A high-performance purifying bar combining traditional African black soap with medical-grade activated charcoal. Gently draws out deep dermal impurities, regulates sebum production, and calms compromised skin barriers.',
    price: 12000,
    stock_count: 55,
    images: ['/assets/images/black_soap_bar_1783418111695.jpg'],
    category: 'Black Soap',
    ingredients: ['Saponified Raw Shea Butter', 'Cocoa Pod Ash', 'Activated Bamboo Charcoal', 'Organic Aloe Vera Leaf Juice', 'Tea Tree & Eucalyptus Leaf Essential Oils'],
    created_at: new Date('2026-01-03').toISOString()
  },
  {
    id: '4d9e9f9a-8b7c-6d5e-4f3a-2b1c0d1e2f3a',
    title: 'Cinnamon Infused Elixir',
    slug: 'cinnamon-infused-elixir',
    description: 'A warm, stimulating botanical oil formulated to boost local micro-circulation and cellular turnover. High-potency cinnamon bark infusions blended with organic argan oil deliver rich antioxidants for a radiant, plump complexion.',
    price: 16500,
    stock_count: 15,
    images: ['https://picsum.photos/seed/cinnamon/600/450'],
    category: 'Shea',
    ingredients: ['Organic Argan Kernel Oil', 'Cinnamon Bark Extract', 'Pure Golden Jojoba Oil', 'Sweet Orange Essential Oil', 'Clove Bud Infusion'],
    created_at: new Date('2026-01-04').toISOString()
  },
  {
    id: '5e9f9a9b-8c7d-6e5f-4a3b-2c1d0e1f2a3b',
    title: 'Lemongrass Fresh Mist',
    slug: 'lemongrass-fresh-mist',
    description: 'An invigorating, skin-clarifying facial hydrosol. Steam-distilled lemongrass works in perfect synergy with witch hazel and rose water to minimize the appearance of pores, refresh skin midday, and balance pH levels.',
    price: 9500,
    stock_count: 34,
    images: ['https://picsum.photos/seed/lemongrass/600/450'],
    category: 'Coconut',
    ingredients: ['Steam-Distilled Lemongrass Hydrosol', 'Organic Witch Hazel Extract', 'Bulgarian Rose Water', 'Vegetable Glycerin', 'Lactobacillus Ferment (Natural Preservative)'],
    created_at: new Date('2026-01-05').toISOString()
  }
];

export const FAQS = [
  {
    question: 'How do your products maintain organic integrity without synthetic preservatives?',
    answer: 'We utilize natural preservation strategies, including oil-soluble antioxidants like Vitamin E (Tocopherol), antibacterial essential oils (such as Tea Tree and Rosemary), and skin-safe probiotic ferment filtrates. These ingredients extend our products shelf life to 12-18 months while maintaining 100% organic, non-toxic purity.'
  },
  {
    question: 'Are Aweni Organics products suitable for sensitive or acne-prone skin?',
    answer: 'Absolutely. Our formulations are crafted with non-comedogenic oils (such as jojoba and squalane) and anti-inflammatory botanicals. For example, our Activated Charcoal Black Soap is formulated specifically to draw out sebum and impurities without stripping raw lipid layers, making it highly effective for oily and acne-prone skin.'
  },
  {
    question: 'What is the significance of NAFDAC compliance for your formulations?',
    answer: 'NAFDAC (National Agency for Food and Drug Administration and Control) certification guarantees that our manufacturing facilities, ingredient sourcing, and hygienic protocols adhere strictly to the highest international safety and quality standards. Every batch is thoroughly tested to be 100% free of heavy metals, hydroquinone, and harmful chemical adulterants.'
  },
  {
    question: 'How does your whipped Shea Butter differ from standard raw Shea butter?',
    answer: 'Traditional raw Shea butter can be dense, hard to spread, and slow to absorb. Our Shea Whipped Soufflé undergoes a proprietary cold-whipping cycle where it is aerated and blended with light, nutrient-dense carrier oils. This results in a luscious, fluffy soufflé texture that melts upon skin contact and absorbs instantly without a heavy, greasy residue.'
  },
  {
    question: 'Can I track my order after fulfillment?',
    answer: 'Yes. Once our fulfillment team transitions your order from "Processing" to "Shipped" in our operational backend, you will receive an automatic confirmation with a tracking number and courier redirection. You can also view your real-time fulfillment status inside your customer profile portal.'
  }
];
