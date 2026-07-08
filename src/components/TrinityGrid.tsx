import React from 'react';
import { TiltCard } from './TiltCard';
import { ImageReveal } from './ImageReveal';
import { ArrowUpRight } from 'lucide-react';

interface TrinityGridProps {
  onPillarClick: (category: string) => void;
}

export const TrinityGrid: React.FC<TrinityGridProps> = ({ onPillarClick }) => {
  const pillars = [
    {
      title: 'Raw Shea Butter',
      subtitle: 'Whipped Soufflé & Cold Creams',
      desc: 'Formulated using premium, raw wild-harvested Shea butter from local Nigerian cooperatives. Aerated to high-fluff soufflé states that dissolve instantly on contact, supporting cell renewal.',
      image: '/assets/images/shea_butter_jar_1783418086221.jpg',
      category: 'Shea',
      accent: 'border-brand-terracotta text-brand-terracotta',
      bg: 'bg-brand-terracotta/5'
    },
    {
      title: 'Coconut Nectar',
      subtitle: 'Satin Facials & Skin Lipids',
      desc: 'Formulated with organic, cold-pressed fractionated coconut lipids and pure squalane. Deep cellular moisture without heavy grease, leaving a luminous pearl finish.',
      image: '/assets/images/coconut_oil_bottle_1783418099199.jpg',
      category: 'Coconut',
      accent: 'border-brand-olive text-brand-olive',
      bg: 'bg-brand-olive/5'
    },
    {
      title: 'Traditional Soap',
      subtitle: 'Activated Charcoal Purifiers',
      desc: 'Crafted using age-old cocoa pod ash, saponified Shea butter, and bamboo activated carbon. Draws out environmental pollutants and sebum safely while soothing skin tissue.',
      image: '/assets/images/black_soap_bar_1783418111695.jpg',
      category: 'Black Soap',
      accent: 'border-brand-charcoal text-brand-charcoal',
      bg: 'bg-brand-beige/20'
    }
  ];

  return (
    <section className="py-24 px-6 md:px-12 bg-brand-cream border-t border-brand-charcoal/5 select-none relative">
      {/* Decorative background grid line */}
      <div className="absolute top-0 bottom-0 left-12 w-[1px] bg-brand-charcoal/3 pointer-events-none" />
      <div className="absolute top-0 bottom-0 right-12 w-[1px] bg-brand-charcoal/3 pointer-events-none" />

      <div className="max-w-7xl mx-auto">
        {/* Editorial Heading */}
        <div className="text-center md:text-left mb-16 max-w-2xl ml-0 md:ml-12">
          <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-brand-terracotta block mb-3">
            [ 01 / Three Pillar Foundations ]
          </span>
          <h2 className="text-3xl md:text-5xl font-serif text-brand-charcoal tracking-tight">
            The Botanical Trinity
          </h2>
          <p className="mt-4 text-sm text-brand-charcoal/60 leading-relaxed font-sans">
            We center our entire collection around three core wild-harvested pillars, processed hygienically under temperature-controlled cycles to safeguard active micro-nutrients.
          </p>
        </div>

        {/* 3-Column Interactive 3D Tilt Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 px-0 md:px-12">
          {pillars.map((pillar, idx) => (
            <TiltCard key={idx} className="h-full">
              <div 
                onClick={() => onPillarClick(pillar.category)}
                className={`flex flex-col h-full rounded-2xl p-6 md:p-8 border border-brand-charcoal/5 hover:border-brand-charcoal/10 transition-colors bg-brand-cream shadow-sm relative group`}
              >
                {/* Image Reveal with Intersection clip-path mask */}
                <div className="mb-6 rounded-xl overflow-hidden shadow-inner">
                  <ImageReveal
                    src={pillar.image}
                    alt={pillar.title}
                    aspectRatio="aspect-4/3"
                  />
                </div>

                {/* Categories */}
                <div className="flex items-center justify-between mb-4">
                  <span className="font-mono text-[9px] uppercase tracking-widest text-brand-charcoal/40">
                    Pillar 0{idx + 1} • {pillar.category}
                  </span>
                  <div className="p-1.5 rounded-full border border-brand-charcoal/10 group-hover:bg-brand-charcoal group-hover:text-brand-cream transition-colors duration-300">
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </div>
                </div>

                {/* Heading */}
                <h3 className="text-2xl font-serif text-brand-charcoal tracking-tight mb-1">
                  {pillar.title}
                </h3>
                <h4 className="text-xs font-serif italic text-brand-terracotta mb-4">
                  {pillar.subtitle}
                </h4>

                {/* Description */}
                <p className="text-xs text-brand-charcoal/70 leading-relaxed mb-6 font-sans">
                  {pillar.desc}
                </p>

                {/* CTA Link */}
                <div className="mt-auto pt-4 border-t border-brand-charcoal/5">
                  <span className="inline-flex items-center gap-1 font-mono text-[10px] uppercase tracking-widest text-brand-charcoal group-hover:text-brand-terracotta transition-colors">
                    Explore Raw {pillar.category}
                  </span>
                </div>
              </div>
            </TiltCard>
          ))}
        </div>
      </div>
    </section>
  );
};
