import React, { useState } from 'react';
import { Mail, ArrowRight } from 'lucide-react';
import { MagneticButton } from './MagneticButton';

interface FooterProps {
  onNavigate: (view: 'home' | 'shop' | 'admin' | 'terms' | 'privacy' | 'returns') => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setSubscribed(true);
    setEmail('');
    setTimeout(() => setSubscribed(false), 4000);
  };

  return (
    <footer className="bg-brand-charcoal text-brand-cream py-16 px-6 md:px-12 border-t border-brand-cream/10 select-none relative z-10">
      {/* Background design lines */}
      <div className="absolute top-0 bottom-0 left-12 w-[1px] bg-brand-cream/5 pointer-events-none" />
      <div className="absolute top-0 bottom-0 right-12 w-[1px] bg-brand-cream/5 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-0 md:px-12 grid grid-cols-1 md:grid-cols-12 gap-12">
        {/* Left Side: Brand Columns */}
        <div className="md:col-span-4 flex flex-col gap-6">
          <h3 className="text-2xl font-serif font-bold tracking-[0.25em] text-brand-cream">
            AWENI
          </h3>
          <p className="text-xs text-brand-cream/50 leading-relaxed font-sans max-w-xs">
            An premium African editorial showroom. Crafting luxury skincare from the highest quality raw wild botanicals, optimized for true dermal bioavailability.
          </p>
          <div className="flex flex-col gap-1 text-[10px] font-mono uppercase tracking-widest text-brand-cream/30 mt-2">
            <span>[ NAFDAC / CO-03102 ]</span>
            <span>LAGOS • COLOGNE • LONDON</span>
          </div>
        </div>

        {/* Center: Columns Links */}
        <div className="md:col-span-4 grid grid-cols-2 gap-8">
          {/* Showroom Links */}
          <div className="flex flex-col gap-3">
            <span className="font-mono text-[9px] uppercase tracking-[0.2em] text-brand-terracotta font-semibold">
              // DISCOVER
            </span>
            <button
              onClick={() => onNavigate('shop')}
              className="text-left text-xs text-brand-cream/60 hover:text-brand-cream transition-colors font-sans py-0.5 cursor-pointer"
            >
              The Showroom
            </button>
            <a
              href="#heritage"
              className="text-left text-xs text-brand-cream/60 hover:text-brand-cream transition-colors font-sans py-0.5"
            >
              The Heritage Scroll
            </a>
            <a
              href="#faq"
              className="text-left text-xs text-brand-cream/60 hover:text-brand-cream transition-colors font-sans py-0.5"
            >
              Interactive FAQs
            </a>
          </div>

          {/* Legal Links */}
          <div className="flex flex-col gap-3">
            <span className="font-mono text-[9px] uppercase tracking-[0.2em] text-brand-terracotta font-semibold">
              // FRAMEWORK
            </span>
            <button
              onClick={() => onNavigate('terms')}
              className="text-left text-xs text-brand-cream/60 hover:text-brand-cream transition-colors font-sans py-0.5 cursor-pointer"
            >
              Terms of Service
            </button>
            <button
              onClick={() => onNavigate('privacy')}
              className="text-left text-xs text-brand-cream/60 hover:text-brand-cream transition-colors font-sans py-0.5 cursor-pointer"
            >
              Privacy Policy
            </button>
            <button
              onClick={() => onNavigate('returns')}
              className="text-left text-xs text-brand-cream/60 hover:text-brand-cream transition-colors font-sans py-0.5 cursor-pointer"
            >
              Refunds & Shipping
            </button>
          </div>
        </div>

        {/* Right Side: Newsletter Subscription */}
        <div className="md:col-span-4 flex flex-col gap-4">
          <span className="font-mono text-[9px] uppercase tracking-[0.2em] text-brand-terracotta font-semibold">
            // JOIN THE REGISTER
          </span>
          <p className="text-xs text-brand-cream/50 leading-relaxed font-sans max-w-sm">
            Receive exclusive invitations to small-batch whipped Soufflé releases, raw harvest schedules, and botanical skin insights.
          </p>

          <form onSubmit={handleSubscribe} className="flex gap-2.5 mt-2 max-w-md w-full">
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="vessel@domain.com"
              required
              className="flex-1 bg-brand-cream/5 border border-brand-cream/10 rounded-full px-5 py-3 text-xs font-sans text-brand-cream placeholder-brand-cream/25 focus:outline-none focus:border-brand-terracotta transition-colors"
            />
            {/* Magnetic subscription submit button */}
            <MagneticButton
              type="submit"
              className="p-3.5 bg-brand-terracotta text-brand-cream hover:bg-brand-cream hover:text-brand-charcoal transition-all duration-300 rounded-full shadow-lg cursor-pointer"
            >
              <ArrowRight className="w-4 h-4" />
            </MagneticButton>
          </form>

          {subscribed && (
            <p className="text-[10px] text-brand-terracotta font-mono uppercase tracking-widest animate-pulse mt-1">
              ✓ Registered successfully into Aweni ledger.
            </p>
          )}
        </div>
      </div>

      {/* Footer base bottom row: Imagined by June Studio anchor tagged perfectly */}
      <div className="max-w-7xl mx-auto px-0 md:px-12 mt-16 pt-8 border-t border-brand-cream/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-[10px] font-mono text-brand-cream/30 uppercase tracking-widest">
        <span>© 2026 Aweni Organics. All rights preserved.</span>
        
        {/* Imagined by June Studio branding anchor tagged to the bottom right */}
        <span className="flex items-center gap-1.5 text-right font-semibold">
          <span>Imagined by</span>
          <a
            href="https://ai.studio/build"
            target="_blank"
            rel="noreferrer"
            className="text-brand-terracotta hover:text-brand-cream transition-colors tracking-[0.2em] underline decoration-brand-terracotta decoration-2 underline-offset-4"
          >
            June Studio
          </a>
        </span>
      </div>
    </footer>
  );
};
