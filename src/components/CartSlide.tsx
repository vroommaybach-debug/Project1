import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Trash2, ShoppingBag, Truck, Info } from 'lucide-react';
import { CartItem } from '../types';

interface CartSlideProps {
  isOpen: boolean;
  onClose: () => void;
  cart: CartItem[];
  onUpdateQty: (productId: string, qty: number) => void;
  onRemoveItem: (productId: string) => void;
  onCheckout: (shippingCost: number) => void;
}

export const CartSlide: React.FC<CartSlideProps> = ({
  isOpen,
  onClose,
  cart,
  onUpdateQty,
  onRemoveItem,
  onCheckout,
}) => {
  // Shipping slider state - distance in kilometers (or miles)
  const [distance, setDistance] = useState<number>(10); // Standard distance default

  // Base fee per km = ₦350 or $1 depending on pricing, let's use standard rates
  const getShippingCost = () => {
    if (cart.length === 0) return 0;
    // Standard flat rate ₦1500 + ₦250 per km!
    return 1500 + distance * 250;
  };

  const getSubtotal = () => {
    return cart.reduce((acc, item) => acc + item.product.price * item.quantity, 0);
  };

  const shippingCost = getShippingCost();
  const subtotal = getSubtotal();
  const total = subtotal + shippingCost;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex justify-end">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-brand-charcoal/40 backdrop-blur-sm"
          />

          {/* Sliding Fly-out utilizing Cubic Bezier (0.16, 1, 0.3, 1) */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="relative w-full max-w-md h-full bg-brand-cream border-l border-brand-charcoal/10 shadow-2xl z-10 flex flex-col p-6 select-none"
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-brand-charcoal/10 pb-4 mb-6">
              <div className="flex items-center gap-2">
                <ShoppingBag className="w-5 h-5 text-brand-terracotta" />
                <h3 className="text-xl font-serif font-semibold text-brand-charcoal">
                  Your Selection Vessels
                </h3>
              </div>
              <button
                onClick={onClose}
                className="p-1.5 hover:bg-brand-beige rounded-full transition-colors text-brand-charcoal"
                title="Close Cart"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Cart Items Area with interactive Exit Animations */}
            <div className="flex-1 overflow-y-auto pr-2 flex flex-col gap-4">
              {cart.length === 0 ? (
                <div className="my-auto text-center flex flex-col items-center gap-4 text-brand-charcoal/40">
                  <ShoppingBag className="w-12 h-12 stroke-1" />
                  <p className="font-serif italic text-sm">
                    No active vessels selected.
                  </p>
                  <button
                    onClick={onClose}
                    className="font-mono text-[10px] uppercase tracking-widest text-brand-terracotta border-b border-brand-terracotta/20 hover:border-brand-terracotta pb-1"
                  >
                    Return to Showroom
                  </button>
                </div>
              ) : (
                <AnimatePresence mode="popLayout">
                  {cart.map((item) => (
                    <motion.div
                      key={item.product.id}
                      layout
                      initial={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ 
                        opacity: 0, 
                        scale: 0.9, 
                        x: 50, 
                        transition: { duration: 0.35, ease: 'easeInOut' } 
                      }} // interactive exit animation
                      className="flex items-center gap-4 bg-brand-beige/35 border border-brand-charcoal/5 p-3.5 rounded-xl relative overflow-hidden group"
                    >
                      {/* Product Image */}
                      <img
                        src={item.product.images[0] || 'https://picsum.photos/100'}
                        alt={item.product.title}
                        className="w-16 h-16 object-cover rounded-lg border border-brand-charcoal/5"
                        referrerPolicy="no-referrer"
                      />

                      {/* Product Details */}
                      <div className="flex-1 min-w-0">
                        <h4 className="font-serif text-sm font-semibold text-brand-charcoal truncate">
                          {item.product.title}
                        </h4>
                        <p className="font-mono text-[10px] text-brand-charcoal/40 uppercase mb-1.5">
                          {item.product.category}
                        </p>
                        
                        {/* Price & Quantity Adjuster */}
                        <div className="flex items-center justify-between">
                          <span className="font-mono text-xs font-semibold text-brand-terracotta">
                            ₦{item.product.price.toLocaleString()}
                          </span>

                          <div className="flex items-center gap-2 border border-brand-charcoal/10 rounded-full px-2 py-0.5 bg-brand-cream">
                            <button
                              onClick={() => onUpdateQty(item.product.id, item.quantity - 1)}
                              disabled={item.quantity <= 1}
                              className="text-xs px-1 text-brand-charcoal/50 hover:text-brand-charcoal disabled:opacity-30"
                            >
                              -
                            </button>
                            <span className="font-mono text-xs text-brand-charcoal font-semibold w-4 text-center">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => onUpdateQty(item.product.id, item.quantity + 1)}
                              disabled={item.quantity >= item.product.stock_count}
                              className="text-xs px-1 text-brand-charcoal/50 hover:text-brand-charcoal disabled:opacity-30"
                            >
                              +
                            </button>
                          </div>
                        </div>
                      </div>

                      {/* Delete Action with smooth transition */}
                      <button
                        onClick={() => onRemoveItem(item.product.id)}
                        className="p-2 text-brand-charcoal/40 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors cursor-pointer self-start"
                        title="Remove Vessel"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </motion.div>
                  ))}
                </AnimatePresence>
              )}
            </div>

            {/* Calculations and Interactive Sliders */}
            {cart.length > 0 && (
              <div className="border-t border-brand-charcoal/10 pt-4 mt-6 flex flex-col gap-4">
                {/* Real-time Shipping rate Slider */}
                <div className="p-4 rounded-xl bg-brand-beige/40 border border-brand-charcoal/5 flex flex-col gap-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-mono uppercase tracking-wider text-brand-charcoal/60 flex items-center gap-1.5">
                      <Truck className="w-3.5 h-3.5 text-brand-terracotta" />
                      <span>Delivery Range:</span>
                    </span>
                    <span className="font-mono font-semibold text-brand-charcoal">
                      {distance} km
                    </span>
                  </div>

                  {/* Input range slider */}
                  <input
                    type="range"
                    min="1"
                    max="100"
                    value={distance}
                    onChange={(e) => setDistance(Number(e.target.value))}
                    className="w-full h-1 bg-brand-charcoal/10 rounded-lg appearance-none cursor-pointer accent-brand-terracotta focus:outline-none"
                  />

                  {/* Shipping info readout */}
                  <div className="flex items-center justify-between text-[10px] font-mono text-brand-charcoal/50 border-t border-brand-charcoal/5 pt-2">
                    <span>Base Fare: ₦1,500</span>
                    <span className="text-right text-brand-olive font-semibold">
                      Fare Rate: ₦{shippingCost.toLocaleString()}
                    </span>
                  </div>
                </div>

                {/* Subtotal, Shipping, Total list */}
                <div className="flex flex-col gap-1.5 px-1">
                  <div className="flex items-center justify-between text-xs text-brand-charcoal/60 font-sans">
                    <span>Selected Vessels:</span>
                    <span className="font-mono font-semibold">₦{subtotal.toLocaleString()}</span>
                  </div>
                  <div className="flex items-center justify-between text-xs text-brand-charcoal/60 font-sans">
                    <span>Cougared Shipping:</span>
                    <span className="font-mono font-semibold">₦{shippingCost.toLocaleString()}</span>
                  </div>
                  <div className="flex items-center justify-between text-base font-serif font-bold text-brand-charcoal border-t border-brand-charcoal/5 pt-2.5 mt-1">
                    <span>Total Sum:</span>
                    <span className="font-mono text-brand-terracotta">₦{total.toLocaleString()}</span>
                  </div>
                </div>

                {/* Checkout Trigger */}
                <button
                  onClick={() => onCheckout(shippingCost)}
                  className="w-full py-4 bg-brand-charcoal hover:bg-brand-terracotta text-brand-cream text-xs font-mono uppercase tracking-widest rounded-xl transition-colors cursor-pointer shadow-lg mt-2 flex items-center justify-center gap-2 group"
                >
                  <span>Dispatch Secure Checkout</span>
                  <X className="w-3.5 h-3.5 rotate-45 group-hover:translate-x-1 transition-transform" />
                </button>

                <div className="flex items-center gap-1.5 justify-center text-[9px] font-mono text-brand-charcoal/40 uppercase tracking-wider text-center mt-1">
                  <Info className="w-3 h-3 text-brand-terracotta" />
                  <span>NAFDAC and HACCP safe handling certified.</span>
                </div>
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
