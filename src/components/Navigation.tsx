import React, { useState } from 'react';
import { Menu, X, ShoppingBag, User, Settings, LogOut } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useAuth } from '../lib/authContext';

interface NavigationProps {
  onOpenCart: () => void;
  onOpenAuth: () => void;
  cartCount: number;
  onNavigate: (view: 'home' | 'shop' | 'admin' | 'terms' | 'privacy' | 'returns') => void;
  currentView: string;
}

export const Navigation: React.FC<NavigationProps> = ({
  onOpenCart,
  onOpenAuth,
  cartCount,
  onNavigate,
  currentView,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const { user, isAdmin, logout, toggleAdminMode } = useAuth();

  const menuItems = [
    { label: 'Shop Showroom', view: 'shop' as const },
    { label: 'Our Heritage', view: 'home' as const, anchor: 'heritage' },
    { label: 'Interactive FAQ', view: 'home' as const, anchor: 'faq' },
    { label: 'Terms of Service', view: 'terms' as const },
    { label: 'Privacy & Data Policy', view: 'privacy' as const },
    { label: 'Refunds & Returns', view: 'returns' as const },
  ];

  const handleItemClick = (item: typeof menuItems[number]) => {
    setIsOpen(false);
    onNavigate(item.view);
    if (item.anchor) {
      setTimeout(() => {
        const el = document.getElementById(item.anchor!);
        if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);
    }
  };

  return (
    <>
      <header className="fixed top-0 left-0 w-full z-40 bg-brand-cream/80 backdrop-blur-md border-b border-brand-charcoal/5 px-6 py-4 flex items-center justify-between">
        {/* Brand Logo */}
        <button
          onClick={() => onNavigate('home')}
          className="text-xl md:text-2xl font-serif font-semibold tracking-[0.25em] text-brand-charcoal hover:opacity-85 transition-opacity cursor-pointer"
        >
          AWENI
        </button>

        {/* Action Controls */}
        <div className="flex items-center gap-4">
          {/* Quick Admin Toggle Helper for Demo/Review */}
          <button
            onClick={toggleAdminMode}
            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-mono uppercase tracking-wider bg-brand-olive/10 text-brand-olive hover:bg-brand-olive/20 transition-colors"
            title="Developer Quick Admin Bypass"
          >
            <Settings className="w-3 h-3" />
            {isAdmin ? 'Admin View On' : 'Set Admin'}
          </button>

          {/* User Sign In / Profile */}
          {user ? (
            <div className="flex items-center gap-2">
              <span className="hidden md:inline-block font-mono text-xs text-brand-charcoal/60">
                Hi, {user.fullName?.split(' ')[0]}
              </span>
              {isAdmin && (
                <button
                  onClick={() => onNavigate('admin')}
                  className={`p-2 hover:bg-brand-beige rounded-full transition-colors ${currentView === 'admin' ? 'text-brand-terracotta bg-brand-beige' : 'text-brand-charcoal'}`}
                  title="Admin Dashboard"
                >
                  <Settings className="w-4 h-4" />
                </button>
              )}
              <button
                onClick={logout}
                className="p-2 hover:bg-brand-beige rounded-full transition-colors text-brand-charcoal"
                title="Log Out"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <button
              onClick={onOpenAuth}
              className="p-2 hover:bg-brand-beige rounded-full transition-colors text-brand-charcoal"
              title="Sign In"
            >
              <User className="w-4.5 h-4.5" />
            </button>
          )}

          {/* Cart Icon */}
          <button
            onClick={onOpenCart}
            className="p-2 hover:bg-brand-beige rounded-full transition-colors text-brand-charcoal relative"
            title="View Cart"
          >
            <ShoppingBag className="w-4.5 h-4.5" />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-brand-terracotta text-brand-cream text-[9px] font-mono font-bold flex items-center justify-center rounded-full animate-pulse">
                {cartCount}
              </span>
            )}
          </button>

          {/* Menu Button */}
          <button
            onClick={() => setIsOpen(true)}
            className="p-2 hover:bg-brand-beige rounded-full transition-colors text-brand-charcoal"
            title="Open Menu"
          >
            <Menu className="w-5 h-5" />
          </button>
        </div>
      </header>

      {/* Slide Drawer utilizing Cubic Bezier (0.16, 1, 0.3, 1) */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-brand-charcoal/40 backdrop-blur-sm z-50"
            />

            {/* Slide Drawer */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }} // fluid drawer translate curve
              className="fixed top-0 right-0 h-full w-full max-w-md bg-brand-cream shadow-2xl z-50 flex flex-col p-8 border-l border-brand-charcoal/10"
            >
              {/* Close Button */}
              <div className="flex items-center justify-between mb-12">
                <span className="font-serif italic font-medium tracking-wide text-brand-charcoal/40 text-sm">
                  Aweni Organics — Navigation
                </span>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-2 hover:bg-brand-beige rounded-full transition-colors text-brand-charcoal"
                  title="Close Menu"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Navigation Links */}
              <nav className="flex flex-col gap-6 my-auto">
                {menuItems.map((item, index) => (
                  <button
                    key={index}
                    onClick={() => handleItemClick(item)}
                    className="group text-left py-2 flex items-center justify-between border-b border-brand-charcoal/5 hover:border-brand-terracotta transition-colors duration-300"
                  >
                    <span className="text-xl md:text-2xl font-serif text-brand-charcoal group-hover:text-brand-terracotta transition-colors">
                      {item.label}
                    </span>
                    <span className="font-mono text-[10px] text-brand-charcoal/40 group-hover:text-brand-terracotta group-hover:translate-x-1 transition-all">
                      [ 0{index + 1} ]
                    </span>
                  </button>
                ))}

                {isAdmin && (
                  <button
                    onClick={() => {
                      setIsOpen(false);
                      onNavigate('admin');
                    }}
                    className="group text-left py-2 flex items-center justify-between border-b border-brand-charcoal/5 text-brand-olive hover:border-brand-olive transition-colors duration-300"
                  >
                    <span className="text-xl md:text-2xl font-mono uppercase tracking-wider group-hover:text-brand-olive">
                      Administrative Control
                    </span>
                    <span className="font-mono text-[10px] text-brand-olive/50">[ CONTROL ]</span>
                  </button>
                )}
              </nav>

              {/* Drawer Footer info */}
              <div className="mt-auto pt-8 border-t border-brand-charcoal/5 text-center sm:text-left">
                <p className="font-serif italic text-brand-charcoal/50 text-xs mb-2">
                  Traditional Sourcing. Modern Alchemy.
                </p>
                <div className="flex flex-col sm:flex-row items-center justify-between gap-2">
                  <span className="font-mono text-[9px] uppercase text-brand-charcoal/40 tracking-wider">
                    NAFDAC Certified • Organic Luxury
                  </span>
                  <span className="font-mono text-[9px] text-brand-terracotta font-semibold uppercase tracking-wider">
                    June Studio Design
                  </span>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};
