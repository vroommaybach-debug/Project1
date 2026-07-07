import React from 'react';
import { Scale, ShieldAlert, Truck, ArrowLeft } from 'lucide-react';
import { motion } from 'motion/react';

interface ComplianceViewsProps {
  view: 'terms' | 'privacy' | 'returns';
  onBack: () => void;
  legalTexts: {
    terms: string[];
    privacy: string[];
    returns: string[];
  };
}

export const ComplianceViews: React.FC<ComplianceViewsProps> = ({
  view,
  onBack,
  legalTexts,
}) => {
  const titles = {
    terms: 'Terms of Service',
    privacy: 'Privacy & Data Policy',
    returns: 'Refund & Delivery Framework'
  };

  const icons = {
    terms: <Scale className="w-12 h-12 text-brand-terracotta" />,
    privacy: <ShieldAlert className="w-12 h-12 text-brand-olive" />,
    returns: <Truck className="w-12 h-12 text-brand-charcoal" />
  };

  const paragraphs = legalTexts[view];

  return (
    <section className="pt-28 pb-24 px-6 md:px-12 bg-brand-cream min-h-screen relative select-none">
      {/* Background design lines */}
      <div className="absolute top-0 bottom-0 left-12 w-[1px] bg-brand-charcoal/3 pointer-events-none" />
      <div className="absolute top-0 bottom-0 right-12 w-[1px] bg-brand-charcoal/3 pointer-events-none" />

      <div className="max-w-4xl mx-auto px-0 md:px-12 flex flex-col gap-8">
        {/* Back navigation */}
        <button
          onClick={onBack}
          className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-brand-charcoal hover:text-brand-terracotta transition-colors cursor-pointer group self-start"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          <span>Return to Showroom</span>
        </button>

        {/* Hero Section of Compliance Layer */}
        <div className="p-8 rounded-2xl bg-brand-beige/30 border border-brand-charcoal/10 flex flex-col md:flex-row items-start md:items-center gap-6 shadow-sm">
          <div className="p-4 rounded-xl bg-brand-cream border border-brand-charcoal/5 shadow-inner">
            {icons[view]}
          </div>
          <div>
            <span className="font-mono text-[9px] uppercase tracking-[0.25em] text-brand-terracotta font-semibold">
              ★ SYSTEM COMPLIANCE MATRIX ★
            </span>
            <h1 className="text-3xl md:text-4xl font-serif text-brand-charcoal font-medium mt-1">
              {titles[view]}
            </h1>
            <p className="text-xs text-brand-charcoal/50 mt-1">
              Last revised: July 2026 • Verified NAFDAC and Sovereign regulatory guidelines.
            </p>
          </div>
        </div>

        {/* Split-Text Inversion Color Masking Mock Visual or Container */}
        <div className="relative overflow-hidden rounded-2xl bg-brand-charcoal text-brand-cream p-8 md:p-12 border border-brand-cream/10">
          <div className="absolute top-0 right-0 w-64 h-64 bg-brand-terracotta/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-brand-olive/10 rounded-full blur-3xl pointer-events-none" />

          {/* Core Text content */}
          <div className="relative z-10 flex flex-col gap-6 max-w-2xl">
            {paragraphs.map((p, idx) => (
              <p
                key={idx}
                className="text-xs md:text-sm text-brand-cream/80 leading-relaxed font-sans font-light"
              >
                {p}
              </p>
            ))}

            {paragraphs.length === 0 && (
              <p className="text-xs font-serif italic text-brand-cream/40">
                No compliance parameters uploaded to active state tables.
              </p>
            )}
          </div>
        </div>

        {/* Subfooter info card */}
        <div className="p-6 rounded-2xl border border-dashed border-brand-charcoal/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono text-brand-charcoal/50">
          <span>Hygienically formulated and legal standard verified.</span>
          <span className="text-brand-terracotta uppercase font-semibold">Aweni Organics Legal Council</span>
        </div>

      </div>
    </section>
  );
};
