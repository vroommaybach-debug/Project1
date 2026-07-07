import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Plus, Minus, MessageSquare, Send } from 'lucide-react';
import { FAQS } from '../data';

export const FAQBlock: React.FC = () => {
  const [openIdx, setOpenIdx] = useState<number | null>(null);
  
  // Quick Custom Support form state
  const [supportName, setSupportName] = useState('');
  const [supportMsg, setSupportMsg] = useState('');
  const [isSent, setIsSent] = useState(false);

  const toggleFAQ = (idx: number) => {
    setOpenIdx(openIdx === idx ? null : idx);
  };

  const handleSendSupport = (e: React.FormEvent) => {
    e.preventDefault();
    if (!supportName || !supportMsg) return;

    // Send via custom WhatsApp API redirect!
    const phone = '2348031234567'; // sample WhatsApp business number
    const text = encodeURIComponent(
      `Hello Aweni Organics team, this is ${supportName}. I am inquiring about: ${supportMsg}`
    );
    window.open(`https://wa.me/${phone}?text=${text}`, '_blank');
    
    setIsSent(true);
    setSupportName('');
    setSupportMsg('');
    setTimeout(() => setIsSent(false), 3000);
  };

  return (
    <section id="faq" className="py-24 px-6 md:px-12 bg-brand-cream border-t border-brand-charcoal/5 relative select-none">
      {/* Background aesthetic grid lines */}
      <div className="absolute top-0 bottom-0 left-12 w-[1px] bg-brand-charcoal/3 pointer-events-none" />
      <div className="absolute top-0 bottom-0 right-12 w-[1px] bg-brand-charcoal/3 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-0 md:px-12 grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
        
        {/* Left Column: Title & Floating Support Portal */}
        <div className="lg:col-span-5 flex flex-col gap-8 sticky lg:top-28">
          <div>
            <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-brand-terracotta block mb-3">
              [ 03 / Information & Transparency ]
            </span>
            <h2 className="text-3xl md:text-5xl font-serif text-brand-charcoal tracking-tight leading-tight">
              An Open Ledger <br />
              of Dermal Inquiry
            </h2>
            <p className="mt-4 text-xs md:text-sm text-brand-charcoal/60 leading-relaxed font-sans max-w-sm">
              We operate with pure authenticity. Below are answered parameters regarding organic chemical safety, NAFDAC registrations, and cooperative fair-wage logistics.
            </p>
          </div>

          {/* Unified Support & Chat /connect block */}
          <div className="p-6 rounded-2xl bg-brand-beige/40 border border-brand-charcoal/5 flex flex-col gap-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-full bg-brand-terracotta text-brand-cream shadow-sm">
                <MessageSquare className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-sm font-serif font-semibold text-brand-charcoal">
                  Direct WhatsApp Support
                </h4>
                <p className="text-[10px] font-mono uppercase text-brand-charcoal/40 tracking-wider">
                  Typically responds in under 15 minutes
                </p>
              </div>
            </div>

            <form onSubmit={handleSendSupport} className="flex flex-col gap-2.5 mt-2">
              <input
                type="text"
                placeholder="Your Name"
                value={supportName}
                onChange={e => setSupportName(e.target.value)}
                required
                className="w-full px-3 py-2 text-xs font-sans rounded-lg bg-brand-cream border border-brand-charcoal/10 focus:border-brand-terracotta focus:outline-none transition-colors"
              />
              <textarea
                placeholder="What can our alchemists assist you with?"
                value={supportMsg}
                rows={3}
                onChange={e => setSupportMsg(e.target.value)}
                required
                className="w-full px-3 py-2 text-xs font-sans rounded-lg bg-brand-cream border border-brand-charcoal/10 focus:border-brand-terracotta focus:outline-none transition-colors resize-none"
              />
              <button
                type="submit"
                className="w-full py-2.5 rounded-full bg-brand-charcoal text-brand-cream hover:bg-brand-terracotta transition-colors font-mono text-[10px] uppercase tracking-wider flex items-center justify-center gap-1.5 cursor-pointer shadow-sm"
              >
                <span>Initiate Direct Chat</span>
                <Send className="w-3 h-3" />
              </button>

              {isSent && (
                <p className="text-[10px] text-brand-olive font-mono text-center animate-bounce mt-1">
                  ✓ Message packed! Opening secure link...
                </p>
              )}
            </form>
          </div>
        </div>

        {/* Right Column: Spring Accordion Arrays */}
        <div className="lg:col-span-7 flex flex-col gap-4">
          {FAQS.map((faq, idx) => {
            const isOpen = openIdx === idx;
            return (
              <div
                key={idx}
                className="border-b border-brand-charcoal/10 pb-5"
              >
                <button
                  onClick={() => toggleFAQ(idx)}
                  className="w-full text-left flex items-center justify-between py-4 focus:outline-none group cursor-pointer"
                >
                  <span className="text-base md:text-lg font-serif font-medium text-brand-charcoal group-hover:text-brand-terracotta transition-colors pr-6">
                    {faq.question}
                  </span>
                  <div className="p-1.5 rounded-full border border-brand-charcoal/10 text-brand-charcoal group-hover:text-brand-terracotta group-hover:border-brand-terracotta transition-colors">
                    {isOpen ? <Minus className="w-3.5 h-3.5" /> : <Plus className="w-3.5 h-3.5" />}
                  </div>
                </button>

                {/* Spring-physics height expansion utilizing AnimatePresence */}
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ 
                        height: 'auto', 
                        opacity: 1,
                        transition: {
                          height: {
                            type: 'spring',
                            stiffness: 180,
                            damping: 25,
                            restSpeed: 0.5
                          },
                          opacity: { duration: 0.25 }
                        }
                      }}
                      exit={{ 
                        height: 0, 
                        opacity: 0,
                        transition: {
                          height: { duration: 0.3, ease: 'easeOut' },
                          opacity: { duration: 0.15 }
                        }
                      }}
                      className="overflow-hidden"
                    >
                      <p className="text-xs md:text-sm text-brand-charcoal/70 leading-relaxed font-sans pr-6 pb-2 pl-1 font-light">
                        {faq.answer}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
