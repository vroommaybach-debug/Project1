import React from 'react';
import { ArrowRight } from 'lucide-react';
import { FluidCanvas } from './FluidCanvas';
import { CascadingText } from './CascadingText';
import { MagneticButton } from './MagneticButton';

interface HeroProps {
  onExplore: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onExplore }) => {
  return (
    <section className="relative w-full min-h-screen flex items-center justify-center pt-24 pb-16 px-6 overflow-hidden bg-brand-cream select-none">
      {/* Background Interactive Fluid Canvas Simulation */}
      <FluidCanvas />

      {/* Hero content card wrapper with subtle editorial shadow & transparent frosted look */}
      <div className="relative z-10 max-w-4xl w-full text-center flex flex-col items-center">
        {/* Floating Tag */}
        <div className="mb-6 inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-brand-charcoal/10 bg-brand-cream/40 backdrop-blur-md">
          <span className="w-1.5 h-1.5 rounded-full bg-brand-terracotta animate-ping" />
          <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-brand-charcoal/70">
            Tradition Met by Modern Skin Alchemy
          </span>
        </div>

        {/* Dynamic Cascading Letter Stagger Title */}
        <div className="mb-6">
          <CascadingText
            text="Decadent Skin Nutrition"
            className="text-4xl sm:text-6xl md:text-8xl font-serif font-medium tracking-tight text-brand-charcoal leading-[1.1]"
            delay={0.1}
          />
          <br className="hidden sm:inline" />
          <CascadingText
            text="Raw Whipped Perfection"
            className="text-4xl sm:text-6xl md:text-8xl font-serif italic font-light tracking-tight text-brand-terracotta leading-[1.1] mt-2"
            delay={0.6}
          />
        </div>

        {/* Narrative Description */}
        <p className="max-w-xl mx-auto text-sm md:text-base text-brand-charcoal/70 font-sans tracking-wide leading-relaxed mb-10">
          Hand-harvested botanicals cold-whipped into pristine dermal elixirs. 
          Sourced ethically from Shea and Coconut plantations, crafted meticulously to nourish, clarify, and protect.
        </p>

        {/* CTAs with Magnetic Attraction */}
        <div className="flex flex-col sm:flex-row items-center gap-6">
          {/* Main Magnetic CTA */}
          <MagneticButton
            onClick={onExplore}
            className="px-8 py-4 bg-brand-charcoal text-brand-cream font-mono text-xs uppercase tracking-widest rounded-full hover:bg-brand-terracotta transition-colors shadow-lg cursor-pointer flex items-center gap-2 group"
          >
            <span>Explore the Showroom</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform" />
          </MagneticButton>

          {/* Secondary CTA */}
          <a
            href="#heritage"
            className="font-mono text-xs uppercase tracking-widest text-brand-charcoal hover:text-brand-terracotta transition-colors py-2 border-b border-brand-charcoal/20 hover:border-brand-terracotta"
          >
            Our Heritage Scroll
          </a>
        </div>
      </div>

      {/* Floating Indicators for fine layout style */}
      <div className="absolute bottom-8 left-6 hidden md:flex flex-col gap-1.5">
        <span className="font-mono text-[9px] uppercase tracking-wider text-brand-charcoal/40">
          [ NAFDAC / RE-03102 ]
        </span>
        <span className="font-mono text-[9px] uppercase tracking-wider text-brand-charcoal/40">
          Hygienic Cold Processing
        </span>
      </div>

      <div className="absolute bottom-8 right-6 hidden md:flex flex-col items-end gap-1.5">
        <span className="font-mono text-[9px] uppercase tracking-wider text-brand-charcoal/40">
          [ UTC 2026 ]
        </span>
        <span className="font-mono text-[9px] uppercase tracking-wider text-brand-terracotta font-semibold">
          100% Raw Bio-Availability
        </span>
      </div>

      {/* Aesthetic layout helper grid lines */}
      <div className="absolute top-0 bottom-0 left-12 w-[1px] bg-brand-charcoal/3 pointer-events-none" />
      <div className="absolute top-0 bottom-0 right-12 w-[1px] bg-brand-charcoal/3 pointer-events-none" />
    </section>
  );
};
