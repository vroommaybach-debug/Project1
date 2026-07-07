import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ImageReveal } from './ImageReveal';

export const HeritageScroll: React.FC = () => {
  const [activeChapter, setActiveChapter] = useState(0);

  const chapters = [
    {
      num: '01',
      title: 'Wild Savanna Sourcing',
      highlight: 'Sustainably Co-Operative',
      desc: 'Our Shea and coconut kernels are hand-gathered in the West African woodland savannas by female-led farming cooperatives. We guarantee above-market fair-trade wages, empowering generations of rural agricultural stewards while securing the absolute finest raw harvests.',
      image: 'https://picsum.photos/seed/cooperative/800/600',
      tag: 'ETHICAL HARVEST'
    },
    {
      num: '02',
      title: 'Proprietary Cold Whipping',
      highlight: 'Molecular Retainment',
      desc: 'Raw Shea butter degrades under excessive heat. Our proprietary cold-whipping cycle maintains a constant 18°C environment. Aerating the lipid chain for 12 hours yields an incredibly fluffy soufflé texture that stays bio-available for cellular absorption.',
      image: 'https://picsum.photos/seed/whipping/800/600',
      tag: 'COLD PROCESS'
    },
    {
      num: '03',
      title: 'Hygienic Bio-Integrity',
      highlight: 'NAFDAC Certified Science',
      desc: 'We merge traditional African formulas with stringent clinical standards. Our state-of-the-art facilities ensure zero bacterial contamination. Each batch undergoes multi-stage sterile micro-filtering, guaranteeing standard NAFDAC compliance.',
      image: 'https://picsum.photos/seed/laboratory/800/600',
      tag: 'CLINICAL HYGIENE'
    }
  ];

  return (
    <section id="heritage" className="py-24 bg-brand-charcoal text-brand-cream border-t border-brand-charcoal/10 relative overflow-hidden select-none">
      {/* Background aesthetic grid lines */}
      <div className="absolute top-0 bottom-0 left-12 w-[1px] bg-brand-cream/5 pointer-events-none" />
      <div className="absolute top-0 bottom-0 right-12 w-[1px] bg-brand-cream/5 pointer-events-none" />

      {/* Ticker / Infinite Marquee - Brand values running silently in footer and mid-pages */}
      <div className="w-full overflow-hidden bg-brand-terracotta text-brand-cream py-3.5 border-y border-brand-cream/10 mb-16 select-none relative z-10">
        <div className="animate-marquee whitespace-nowrap flex gap-12 font-mono text-xs uppercase tracking-[0.25em] font-medium">
          {Array.from({ length: 6 }).map((_, idx) => (
            <span key={idx} className="flex items-center gap-2">
              <span>★</span> 100% RAW ORGANIC BIODIVERSITY
              <span>★</span> NAFDAC CERTIFIED LABS
              <span>★</span> FAIR-TRADE CO-OPERATIVE SOURCE
              <span>★</span> COLD-WHIPPED SOUFFLÉ FORMULAS
              <span>★</span> NO PARABENS OR SYNTHETICS
            </span>
          ))}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 md:px-12 grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
        {/* Left locked media column / Chapter selector */}
        <div className="lg:col-span-5 lg:sticky lg:top-28 flex flex-col gap-8 md:px-4">
          <div>
            <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-brand-terracotta block mb-3">
              [ 02 / The Heritage Scroll ]
            </span>
            <h2 className="text-3xl md:text-5xl font-serif text-brand-cream tracking-tight leading-tight">
              Honoring Our Roots, <br />
              Refining Our Craft
            </h2>
            <p className="mt-4 text-xs md:text-sm text-brand-cream/60 leading-relaxed font-sans max-w-md">
              Witness the seamless convergence of ancient West African skincare rituals with rigorous state-of-the-art laboratory safety standards.
            </p>
          </div>

          {/* Chapter Buttons */}
          <div className="flex flex-col gap-3 mt-4 border-l border-brand-cream/10 pl-6">
            {chapters.map((chap, idx) => (
              <button
                key={idx}
                onClick={() => setActiveChapter(idx)}
                className={`text-left transition-all duration-300 py-1.5 focus:outline-none flex items-center gap-4 group cursor-pointer`}
              >
                <span className={`font-mono text-xs tracking-wider ${activeChapter === idx ? 'text-brand-terracotta' : 'text-brand-cream/40'}`}>
                  [{chap.num}]
                </span>
                <span className={`font-serif text-lg md:text-xl ${activeChapter === idx ? 'text-brand-cream pl-2 font-medium' : 'text-brand-cream/50 group-hover:text-brand-cream/80'}`}>
                  {chap.title}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Right content column showing active chapter with micro-transitions */}
        <div className="lg:col-span-7 bg-brand-cream/5 backdrop-blur-md rounded-2xl p-6 md:p-10 border border-brand-cream/10 relative overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeChapter}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
              className="flex flex-col gap-6"
            >
              {/* Media Reveal */}
              <div className="rounded-xl overflow-hidden shadow-2xl">
                <ImageReveal
                  src={chapters[activeChapter].image}
                  alt={chapters[activeChapter].title}
                  aspectRatio="aspect-16/9"
                />
              </div>

              {/* Tag & Number */}
              <div className="flex items-center justify-between border-b border-brand-cream/10 pb-4 mt-2">
                <span className="font-mono text-[9px] uppercase tracking-[0.25em] text-brand-terracotta font-semibold">
                  {chapters[activeChapter].tag}
                </span>
                <span className="font-mono text-xs text-brand-cream/30">
                  CHAPTER {chapters[activeChapter].num} OF 03
                </span>
              </div>

              {/* Chapter Content */}
              <div>
                <h3 className="text-2xl md:text-3xl font-serif text-brand-cream tracking-tight mb-2">
                  {chapters[activeChapter].title}
                </h3>
                <h4 className="text-xs font-mono uppercase text-brand-terracotta tracking-widest mb-4">
                  — {chapters[activeChapter].highlight}
                </h4>
                <p className="text-xs md:text-sm text-brand-cream/85 leading-relaxed font-sans font-light">
                  {chapters[activeChapter].desc}
                </p>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
};
