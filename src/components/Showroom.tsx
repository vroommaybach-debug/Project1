import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Search, SlidersHorizontal, ArrowLeft, Plus, Star, Check, Sparkles, AlertCircle } from 'lucide-react';
import { Product, Review } from '../types';
import { ImageReveal } from './ImageReveal';
import { MagneticButton } from './MagneticButton';
import { CascadingText } from './CascadingText';

interface ShowroomProps {
  products: Product[];
  selectedCategory: string;
  onAddToCart: (p: Product) => void;
  selectedProductId: string | null;
  onSelectProduct: (id: string | null) => void;
}

// Static Review Seeding
const INITIAL_REVIEWS: Review[] = [
  {
    id: 'r1',
    product_id: '1a9b9c9d-8e7f-6a5b-4c3d-2e1f0a1b2c3d',
    user_name: 'Sophia O.',
    rating: 5,
    comment: 'Sublime texture! It literally melts into my skin. The sandalwood undertone is therapeutic.',
    created_at: new Date('2026-02-14').toISOString()
  },
  {
    id: 'r2',
    product_id: '1a9b9c9d-8e7f-6a5b-4c3d-2e1f0a1b2c3d',
    user_name: 'Kunle A.',
    rating: 5,
    comment: 'Hands down the finest whipped Shea I have purchased. Very luxurious feel without clogged pores.',
    created_at: new Date('2026-02-28').toISOString()
  },
  {
    id: 'r3',
    product_id: '2b9c9d9e-8f7a-6b5c-4d3e-2f1a0b1c2d3e',
    user_name: 'Isabella M.',
    rating: 5,
    comment: 'Luminous satiny glow that lasts all day. A true staple of my organic routine.',
    created_at: new Date('2026-03-01').toISOString()
  }
];

export const Showroom: React.FC<ShowroomProps> = ({
  products,
  selectedCategory,
  onAddToCart,
  selectedProductId,
  onSelectProduct,
}) => {
  // Navigation & Search/Filter States
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [activeSkinType, setActiveSkinType] = useState('All');
  const [activeScent, setActiveScent] = useState('All');
  const [showFilters, setShowFilters] = useState(false);

  // Reviews Local state
  const [reviews, setReviews] = useState<Review[]>(INITIAL_REVIEWS);
  const [reviewName, setReviewName] = useState('');
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');
  const [reviewSuccess, setReviewSuccess] = useState(false);

  // Unpack Accordion active index
  const [openIngredientIdx, setOpenIngredientIdx] = useState<number | null>(null);

  // Infinite Scroll state - simulated
  const [visibleCount, setVisibleCount] = useState(4);
  const [isInfiniteLoading, setIsInfiniteLoading] = useState(false);

  useEffect(() => {
    if (selectedCategory) {
      setActiveCategory(selectedCategory);
    }
  }, [selectedCategory]);

  // Load reviews from localStorage
  useEffect(() => {
    const savedReviews = localStorage.getItem('aweni_product_reviews');
    if (savedReviews) {
      try {
        setReviews(JSON.parse(savedReviews));
      } catch (e) {
        console.error(e);
      }
    } else {
      localStorage.setItem('aweni_product_reviews', JSON.stringify(INITIAL_REVIEWS));
    }
  }, []);

  const saveReviews = (updatedReviews: Review[]) => {
    setReviews(updatedReviews);
    localStorage.setItem('aweni_product_reviews', JSON.stringify(updatedReviews));
  };

  // Filter products based on search index & categories
  const filteredProducts = products.filter(p => {
    const matchesSearch = p.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          p.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          p.ingredients.some(i => i.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesCategory = activeCategory === 'All' || p.category === activeCategory;
    
    // Skin type logic helper
    let matchesSkin = true;
    if (activeSkinType === 'Sensitive') {
      matchesSkin = p.category === 'Shea' || p.category === 'Coconut';
    } else if (activeSkinType === 'Oily') {
      matchesSkin = p.category === 'Black Soap';
    } else if (activeSkinType === 'Dry') {
      matchesSkin = p.category === 'Shea';
    }

    // Scent matching helper
    let matchesScent = true;
    if (activeScent !== 'All') {
      matchesScent = p.description.toLowerCase().includes(activeScent.toLowerCase()) || 
                     p.ingredients.some(i => i.toLowerCase().includes(activeScent.toLowerCase()));
    }

    return matchesSearch && matchesCategory && matchesSkin && matchesScent;
  });

  const handleSimulatedInfiniteScroll = () => {
    if (visibleCount >= filteredProducts.length) return;
    setIsInfiniteLoading(true);
    setTimeout(() => {
      setVisibleCount(prev => Math.min(prev + 2, filteredProducts.length));
      setIsInfiniteLoading(false);
    }, 1200);
  };

  const handleReviewSubmit = (e: React.FormEvent, productId: string) => {
    e.preventDefault();
    if (!reviewName || !reviewComment) return;

    const newReview: Review = {
      id: 'rev-' + Math.random().toString(36).substring(2, 9),
      product_id: productId,
      user_name: reviewName,
      rating: reviewRating,
      comment: reviewComment,
      created_at: new Date().toISOString()
    };

    const updated = [newReview, ...reviews];
    saveReviews(updated);

    setReviewName('');
    setReviewComment('');
    setReviewRating(5);
    setReviewSuccess(true);
    setTimeout(() => setReviewSuccess(false), 3000);
  };

  const activeProduct = products.find(p => p.id === selectedProductId);

  // Ingredient properties database for unpacking
  const getIngredientDetails = (ing: string) => {
    const details: Record<string, string> = {
      'Grade-A Raw Shea Butter': 'Sourced in its purest raw state. Contains organic high-potency Vitamin A, E, and cinnamic acid, protecting cells against UV stress while stimulating repair.',
      'Cold-Pressed Sweet Almond Oil': 'Extremely light carrier rich in omega-3 fatty acids. Penetrates dry tissue layers to deliver long-lasting hydration without clogging delicate pores.',
      'Saponified Raw Shea Butter': 'Saponified by pure alkaline cocoa ashes. Maintains raw conditioning properties while safely removing dead dermal matter.',
      'Cocoa Pod Ash': 'An ancient West African alkalizer. Offers mild exfoliating minerals and high potassium concentrations to clear skin tissue safely.',
      'Activated Bamboo Charcoal': 'Medical-grade microporous carbon nodes. Functions as an absolute micro-vacuum, pulling out heavy environmental metals and excess lipids from skin crevices.',
      'Olive-Derived Squalane': 'A stable biocompatible lipid mimic. Keeps skins surface texture soft and highly reflective without a greasy residue.',
      'Organic Coconut Nectar Extract': 'Rich in essential minerals and amino acids. Re-energizes sluggish dermal cells, restoring a radiant pearl-like complexion.'
    };
    return details[ing] || 'Steam-extracted botanical oil rich in lipids and antioxidants, supporting structural barrier integrity and calming sensitive tissue.';
  };

  return (
    <div className="bg-brand-cream min-h-screen select-none">
      <AnimatePresence mode="wait">
        
        {/* VIEW A: DEEP PRODUCT MATRIX VIEW (Splitted) */}
        {activeProduct ? (
          <motion.section
            key="product-detail"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
            className="pt-28 pb-24 px-6 md:px-12 relative"
          >
            {/* Background design lines */}
            <div className="absolute top-0 bottom-0 left-12 w-[1px] bg-brand-charcoal/3 pointer-events-none" />
            <div className="absolute top-0 bottom-0 right-12 w-[1px] bg-brand-charcoal/3 pointer-events-none" />

            <div className="max-w-7xl mx-auto px-0 md:px-12 flex flex-col gap-12">
              
              {/* Back Button */}
              <button
                onClick={() => onSelectProduct(null)}
                className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-brand-charcoal hover:text-brand-terracotta transition-colors self-start cursor-pointer group"
              >
                <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                <span>Return to Showroom</span>
              </button>

              {/* Split Screen Matrix */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
                
                {/* Left locked media column (Pins on scroll in desktop) */}
                <div className="lg:col-span-5 lg:sticky lg:top-28 rounded-2xl overflow-hidden shadow-2xl bg-brand-beige">
                  <ImageReveal
                    src={activeProduct.images[0]}
                    alt={activeProduct.title}
                    aspectRatio="aspect-square"
                  />
                </div>

                {/* Right scrollable details column */}
                <div className="lg:col-span-7 flex flex-col gap-8">
                  {/* Category and Title */}
                  <div>
                    <span className="font-mono text-[9px] uppercase tracking-[0.25em] text-brand-terracotta font-semibold">
                      ★ AWENI PRESTIGE RAW SELECTION ★
                    </span>
                    <h2 className="text-3xl md:text-5xl font-serif text-brand-charcoal tracking-tight mt-1.5 mb-2">
                      {activeProduct.title}
                    </h2>
                    <div className="flex items-center gap-3">
                      <span className="px-3 py-1 bg-brand-olive/10 text-brand-olive font-mono text-[9px] uppercase tracking-wider rounded-full">
                        {activeProduct.category} Pillar
                      </span>
                      <span className="font-mono text-sm text-brand-charcoal/40">
                        [ Stock: {activeProduct.stock_count} units ]
                      </span>
                    </div>
                  </div>

                  {/* Price and Add to Cart CTA */}
                  <div className="p-5 rounded-2xl bg-brand-beige/35 border border-brand-charcoal/5 flex flex-col sm:flex-row items-center justify-between gap-6">
                    <div>
                      <span className="font-mono text-[10px] uppercase text-brand-charcoal/40 block">Vessel Price (₦)</span>
                      <span className="font-mono text-2xl font-bold text-brand-terracotta">
                        ₦{activeProduct.price.toLocaleString()}
                      </span>
                    </div>

                    <MagneticButton
                      onClick={() => onAddToCart(activeProduct)}
                      className="w-full sm:w-auto px-8 py-3.5 bg-brand-charcoal hover:bg-brand-terracotta text-brand-cream text-xs font-mono uppercase tracking-widest rounded-full transition-colors flex items-center justify-center gap-2 group cursor-pointer shadow-md"
                    >
                      <Plus className="w-4 h-4 group-hover:rotate-90 transition-transform" />
                      <span>Select This Vessel</span>
                    </MagneticButton>
                  </div>

                  {/* Formulation Description */}
                  <div className="flex flex-col gap-2.5">
                    <span className="font-mono text-[9px] uppercase tracking-[0.15em] text-brand-charcoal/50">
                      // Biological Formulation Narrative
                    </span>
                    <p className="text-sm text-brand-charcoal/80 leading-relaxed font-sans font-light">
                      {activeProduct.description}
                    </p>
                  </div>

                  {/* Spring-physics Ingredient Unpack sequence */}
                  <div className="flex flex-col gap-3">
                    <span className="font-mono text-[9px] uppercase tracking-[0.15em] text-brand-charcoal/50">
                      // Interactive Ingredient Unpack (Spring Expansion)
                    </span>
                    
                    <div className="flex flex-col border border-brand-charcoal/10 rounded-2xl bg-brand-cream overflow-hidden divide-y divide-brand-charcoal/10">
                      {activeProduct.ingredients.map((ing, idx) => {
                        const isOpen = openIngredientIdx === idx;
                        return (
                          <div key={idx} className="overflow-hidden">
                            <button
                              onClick={() => setOpenIngredientIdx(isOpen ? null : idx)}
                              className="w-full text-left py-3 px-4 flex items-center justify-between focus:outline-none hover:bg-brand-beige/25 transition-colors cursor-pointer text-xs"
                            >
                              <span className="font-mono font-medium text-brand-charcoal uppercase tracking-wider">{ing}</span>
                              <span className="text-brand-terracotta font-mono">{isOpen ? '[-]' : '[+]'}</span>
                            </button>

                            <AnimatePresence initial={false}>
                              {isOpen && (
                                <motion.div
                                  initial={{ height: 0, opacity: 0 }}
                                  animate={{ 
                                    height: 'auto', 
                                    opacity: 1,
                                    transition: {
                                      height: { type: 'spring', stiffness: 220, damping: 24 },
                                      opacity: { duration: 0.2 }
                                    }
                                  }}
                                  exit={{ 
                                    height: 0, 
                                    opacity: 0,
                                    transition: {
                                      height: { duration: 0.25, ease: 'easeOut' },
                                      opacity: { duration: 0.15 }
                                    }
                                  }}
                                  className="overflow-hidden bg-brand-beige/10 border-t border-brand-charcoal/5"
                                >
                                  <p className="p-4 text-[11px] text-brand-charcoal/70 leading-relaxed font-sans font-light">
                                    {getIngredientDetails(ing)}
                                  </p>
                                </motion.div>
                              )}
                            </AnimatePresence>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Reviews Ledger */}
                  <div className="flex flex-col gap-4 border-t border-brand-charcoal/10 pt-8 mt-4">
                    <h3 className="font-serif text-lg font-bold text-brand-charcoal">
                      Vessel Review Ledger
                    </h3>

                    {/* Review Form */}
                    <form
                      onSubmit={(e) => handleReviewSubmit(e, activeProduct.id)}
                      className="p-4 rounded-xl bg-brand-beige/30 border border-brand-charcoal/5 flex flex-col gap-3"
                    >
                      <h4 className="font-mono text-[9px] uppercase tracking-wider text-brand-charcoal/50">
                        Record Your Authentic Feedback
                      </h4>
                      <div className="grid grid-cols-2 gap-3">
                        <input
                          type="text"
                          placeholder="Your Identifier"
                          required
                          value={reviewName}
                          onChange={e => setReviewName(e.target.value)}
                          className="px-3 py-2 bg-brand-cream border border-brand-charcoal/10 rounded-lg text-xs"
                        />
                        <select
                          value={reviewRating}
                          onChange={e => setReviewRating(Number(e.target.value))}
                          className="px-3 py-2 bg-brand-cream border border-brand-charcoal/10 rounded-lg text-xs"
                        >
                          <option value="5">★★★★★ Excellent (5)</option>
                          <option value="4">★★★★ Very Good (4)</option>
                          <option value="3">★★★ Average (3)</option>
                        </select>
                      </div>
                      <textarea
                        placeholder="Detail your dermatological observations..."
                        required
                        rows={2}
                        value={reviewComment}
                        onChange={e => setReviewComment(e.target.value)}
                        className="px-3 py-2 bg-brand-cream border border-brand-charcoal/10 rounded-lg text-xs resize-none"
                      />
                      <button
                        type="submit"
                        className="py-2 rounded-full bg-brand-charcoal text-brand-cream hover:bg-brand-terracotta text-[10px] font-mono uppercase tracking-widest transition-colors cursor-pointer"
                      >
                        Publish Feedback Log
                      </button>

                      {reviewSuccess && (
                        <p className="text-[9px] text-brand-olive font-mono uppercase tracking-widest text-center animate-bounce">
                          ✓ Review committed into offline cache ledger!
                        </p>
                      )}
                    </form>

                    {/* Active Reviews List */}
                    <div className="flex flex-col gap-3">
                      {reviews
                        .filter(r => r.product_id === activeProduct.id)
                        .map((rev) => (
                          <div key={rev.id} className="p-4 rounded-xl bg-brand-cream border border-brand-charcoal/5 flex flex-col gap-1 shadow-sm">
                            <div className="flex justify-between items-center text-[10px] font-mono">
                              <span className="font-bold text-brand-charcoal">{rev.user_name}</span>
                              <div className="flex text-brand-gold">
                                {Array.from({ length: rev.rating }).map((_, i) => (
                                  <Star key={i} className="w-2.5 h-2.5 fill-current" />
                                ))}
                              </div>
                            </div>
                            <p className="text-xs text-brand-charcoal/70 leading-relaxed font-sans font-light mt-1">
                              "{rev.comment}"
                            </p>
                            <span className="text-[8px] font-mono text-brand-charcoal/30 uppercase mt-1">
                              Submitted: {new Date(rev.created_at).toLocaleDateString()}
                            </span>
                          </div>
                        ))}
                      {reviews.filter(r => r.product_id === activeProduct.id).length === 0 && (
                        <p className="text-xs font-serif italic text-brand-charcoal/40 text-center py-4">
                          Be the first to record observations for this whipped formula.
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Cross-Sell Block */}
                  <div className="border-t border-brand-charcoal/10 pt-8 mt-4 flex flex-col gap-4">
                    <span className="font-mono text-[9px] uppercase tracking-[0.25em] text-brand-terracotta font-semibold">
                      ★ DISCOVER COMPLEMENTARY ALCHEMY ★
                    </span>
                    <div className="grid grid-cols-2 gap-4">
                      {products
                        .filter(p => p.id !== activeProduct.id)
                        .slice(0, 2)
                        .map(p => (
                          <div
                            key={p.id}
                            onClick={() => {
                              onSelectProduct(p.id);
                              setOpenIngredientIdx(null);
                            }}
                            className="p-3 rounded-xl border border-brand-charcoal/5 hover:border-brand-terracotta bg-brand-cream cursor-pointer transition-colors group flex flex-col gap-2"
                          >
                            <img
                              src={p.images[0]}
                              alt={p.title}
                              className="w-full h-24 object-cover rounded-lg border border-brand-charcoal/5"
                              referrerPolicy="no-referrer"
                            />
                            <h4 className="font-serif font-bold text-xs text-brand-charcoal group-hover:text-brand-terracotta truncate">
                              {p.title}
                            </h4>
                            <span className="font-mono text-[10px] text-brand-terracotta">₦{p.price.toLocaleString()}</span>
                          </div>
                        ))}
                    </div>
                  </div>

                </div>

              </div>

            </div>
          </motion.section>
        ) : (
          
          // VIEW B: PRODUCT LIST MATRIX & SIDEBAR FILTER CANVAS
          <motion.section
            key="showroom-matrix"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="pt-28 pb-24 px-6 md:px-12 relative"
          >
            {/* Background design lines */}
            <div className="absolute top-0 bottom-0 left-12 w-[1px] bg-brand-charcoal/3 pointer-events-none" />
            <div className="absolute top-0 bottom-0 right-12 w-[1px] bg-brand-charcoal/3 pointer-events-none" />

            <div className="max-w-7xl mx-auto px-0 md:px-12 flex flex-col gap-8">
              
              {/* Header Title */}
              <div className="text-center md:text-left">
                <span className="font-mono text-[9px] uppercase tracking-[0.25em] text-brand-terracotta font-semibold">
                  [ COLLECTION SHOWCASE ]
                </span>
                <h1 className="text-4xl md:text-6xl font-serif text-brand-charcoal mt-1 tracking-tight">
                  The Premium Showroom
                </h1>
                <p className="text-xs md:text-sm text-brand-charcoal/50 font-sans max-w-xl mt-1.5 leading-relaxed">
                  Uncover highly bio-available Whipped Shea Butter, Fractionated Coconut Elixirs, and traditional African Black Soap purifiers.
                </p>
              </div>

              {/* SEARCH & FILTERS MATRIX CONTROLLER */}
              <div className="flex flex-col md:flex-row gap-4 items-center justify-between border-y border-brand-charcoal/10 py-4 mt-2">
                {/* Search Index Input */}
                <div className="relative w-full md:max-w-xs">
                  <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-charcoal/40" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    placeholder="Search titles, botanical ingredients..."
                    className="w-full bg-brand-cream border border-brand-charcoal/15 focus:border-brand-terracotta rounded-full pl-10 pr-4 py-2.5 text-xs focus:outline-none transition-colors"
                  />
                </div>

                {/* Filter Collapsible triggers */}
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className={`px-4 py-2.5 rounded-full border border-brand-charcoal/15 font-mono text-[10px] uppercase tracking-widest flex items-center gap-1.5 hover:bg-brand-beige cursor-pointer transition-colors w-full md:w-auto justify-center ${showFilters ? 'bg-brand-beige border-brand-terracotta text-brand-terracotta' : ''}`}
                >
                  <SlidersHorizontal className="w-3.5 h-3.5" />
                  <span>{showFilters ? 'Conceal Advanced Filters' : 'Reveal Micro-Filtering'}</span>
                </button>
              </div>

              {/* Advanced Filters Drawer */}
              <AnimatePresence>
                {showFilters && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="p-5 rounded-2xl bg-brand-beige/40 border border-brand-charcoal/5 flex flex-col sm:flex-row gap-8 overflow-hidden select-none"
                  >
                    {/* Category Filter */}
                    <div className="flex flex-col gap-2 flex-1">
                      <span className="font-mono text-[9px] uppercase tracking-wider text-brand-charcoal/50">Pillar Category</span>
                      <div className="flex flex-wrap gap-1.5">
                        {['All', 'Shea', 'Coconut', 'Black Soap'].map((cat) => (
                          <button
                            key={cat}
                            onClick={() => setActiveCategory(cat)}
                            className={`px-3 py-1.5 rounded-full font-mono text-[10px] uppercase tracking-wider border cursor-pointer transition-all ${activeCategory === cat ? 'bg-brand-charcoal border-brand-charcoal text-brand-cream' : 'border-brand-charcoal/10 hover:bg-brand-cream'}`}
                          >
                            {cat}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Skin Type Filter */}
                    <div className="flex flex-col gap-2 flex-1">
                      <span className="font-mono text-[9px] uppercase tracking-wider text-brand-charcoal/50">Skin Prescription</span>
                      <div className="flex flex-wrap gap-1.5">
                        {['All', 'Sensitive', 'Dry', 'Oily'].map((skin) => (
                          <button
                            key={skin}
                            onClick={() => setActiveSkinType(skin)}
                            className={`px-3 py-1.5 rounded-full font-mono text-[10px] uppercase tracking-wider border cursor-pointer transition-all ${activeSkinType === skin ? 'bg-brand-charcoal border-brand-charcoal text-brand-cream' : 'border-brand-charcoal/10 hover:bg-brand-cream'}`}
                          >
                            {skin}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Scent Profile Filter */}
                    <div className="flex flex-col gap-2 flex-1">
                      <span className="font-mono text-[9px] uppercase tracking-wider text-brand-charcoal/50">Scent Profile</span>
                      <div className="flex flex-wrap gap-1.5">
                        {['All', 'Cinnamon', 'Lemongrass', 'Vanilla', 'Sandalwood'].map((scent) => (
                          <button
                            key={scent}
                            onClick={() => setActiveScent(scent)}
                            className={`px-3 py-1.5 rounded-full font-mono text-[10px] uppercase tracking-wider border cursor-pointer transition-all ${activeScent === scent ? 'bg-brand-charcoal border-brand-charcoal text-brand-cream' : 'border-brand-charcoal/10 hover:bg-brand-cream'}`}
                          >
                            {scent}
                          </button>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Responsive Showroom Product Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                {filteredProducts.slice(0, visibleCount).map((product) => (
                  <motion.div
                    key={product.id}
                    layout
                    className="flex flex-col rounded-2xl border border-brand-charcoal/5 p-4 bg-brand-cream hover:border-brand-terracotta/20 transition-colors relative group"
                  >
                    {/* Image reveal on viewport entry with progressive unclip */}
                    <div
                      onClick={() => onSelectProduct(product.id)}
                      className="mb-4 rounded-xl overflow-hidden cursor-pointer"
                    >
                      <ImageReveal
                        src={product.images[0]}
                        alt={product.title}
                        aspectRatio="aspect-square"
                      />
                    </div>

                    {/* Header tags */}
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-mono text-[9px] uppercase tracking-widest text-brand-charcoal/40">
                        {product.category}
                      </span>
                      {product.stock_count < 10 ? (
                        <span className="font-mono text-[8px] uppercase tracking-widest bg-brand-terracotta/10 text-brand-terracotta px-1.5 py-0.5 rounded-md animate-pulse">
                          Low Stock
                        </span>
                      ) : (
                        <span className="font-mono text-[8px] uppercase tracking-widest bg-brand-olive/10 text-brand-olive px-1.5 py-0.5 rounded-md">
                          Available
                        </span>
                      )}
                    </div>

                    {/* Title */}
                    <h3
                      onClick={() => onSelectProduct(product.id)}
                      className="text-lg font-serif font-semibold text-brand-charcoal hover:text-brand-terracotta cursor-pointer transition-colors mb-1 truncate"
                    >
                      {product.title}
                    </h3>

                    {/* Short Description */}
                    <p className="text-[11px] text-brand-charcoal/60 line-clamp-2 leading-relaxed mb-4">
                      {product.description}
                    </p>

                    {/* Price and Cart Buttons */}
                    <div className="flex items-center justify-between border-t border-brand-charcoal/5 pt-3 mt-auto">
                      <span className="font-mono font-bold text-sm text-brand-charcoal">
                        ₦{product.price.toLocaleString()}
                      </span>

                      {/* Custom Magnetic Add-to-cart Action button */}
                      <MagneticButton
                        onClick={() => onAddToCart(product)}
                        className="p-2.5 rounded-full bg-brand-charcoal hover:bg-brand-terracotta text-brand-cream shadow hover:shadow-lg cursor-pointer transition-colors"
                        title="Add to selection"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </MagneticButton>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* No items found container */}
              {filteredProducts.length === 0 && (
                <div className="text-center py-20 border border-dashed border-brand-charcoal/10 rounded-2xl p-6">
                  <AlertCircle className="w-12 h-12 stroke-1 text-brand-charcoal/30 mx-auto mb-3" />
                  <p className="font-serif italic text-sm text-brand-charcoal/50">
                    No active skincare vessels match these search metrics.
                  </p>
                  <button
                    onClick={() => {
                      setSearchQuery('');
                      setActiveCategory('All');
                      setActiveSkinType('All');
                      setActiveScent('All');
                    }}
                    className="mt-3 font-mono text-[9px] uppercase tracking-widest text-brand-terracotta font-semibold"
                  >
                    Clear Filter Metrics
                  </button>
                </div>
              )}

              {/* Infinite Scroll trigger area */}
              {visibleCount < filteredProducts.length && (
                <div className="text-center mt-12">
                  <button
                    onClick={handleSimulatedInfiniteScroll}
                    disabled={isInfiniteLoading}
                    className="px-8 py-3 rounded-full border border-brand-charcoal/20 hover:border-brand-terracotta text-brand-charcoal hover:text-brand-terracotta font-mono text-[10px] uppercase tracking-widest transition-all cursor-pointer disabled:opacity-50 flex items-center gap-2 mx-auto"
                  >
                    {isInfiniteLoading ? (
                      <>
                        <span className="w-3 h-3 border border-brand-charcoal border-t-transparent rounded-full animate-spin" />
                        <span>Surveying Storage Vaults...</span>
                      </>
                    ) : (
                      <span>Unroll Showroom Infinite Ledger</span>
                    )}
                  </button>
                </div>
              )}

            </div>
          </motion.section>
        )}

      </AnimatePresence>
    </div>
  );
};
