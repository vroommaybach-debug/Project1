import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, CreditCard, Landmark, CheckCircle, Copy, Check, ChevronRight, Lock, Calendar } from 'lucide-react';
import { useAuth } from '../lib/authContext';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  subtotal: number;
  shippingCost: number;
  onPlaceOrder: (method: 'card_quickseller' | 'bank_transfer', address: string) => Promise<void>;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  isOpen,
  onClose,
  subtotal,
  shippingCost,
  onPlaceOrder,
}) => {
  const [option, setOption] = useState<'card' | 'bank' | null>(null);
  const [address, setAddress] = useState('');
  
  // Card states
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvv, setCardCvv] = useState('');
  const [cardName, setCardName] = useState('');
  
  // Statuses
  const [isProcessing, setIsProcessing] = useState(false);
  const [step, setStep] = useState<'options' | 'address' | 'payment' | 'success'>('options');
  const [copied, setCopied] = useState(false);

  const total = subtotal + shippingCost;

  // Format Card Number (adds spaces every 4 digits)
  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, '');
    if (value.length > 16) value = value.slice(0, 16);
    const formatted = value.match(/.{1,4}/g)?.join(' ') || value;
    setCardNumber(formatted);
  };

  // Format Expiry Date (MM/YY)
  const handleExpiryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, '');
    if (value.length > 4) value = value.slice(0, 4);
    if (value.length > 2) {
      value = value.slice(0, 2) + '/' + value.slice(2);
    }
    setCardExpiry(value);
  };

  const handleCopyAccount = () => {
    navigator.clipboard.writeText('1013495832');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePlaceOrderClick = async () => {
    setIsProcessing(true);
    // Simulate gateway delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const method = option === 'card' ? 'card_quickseller' : 'bank_transfer';
    await onPlaceOrder(method, address || 'Lekki Phase 1, Lagos, Nigeria');
    
    setIsProcessing(false);
    setStep('success');
  };

  const handleChooseOption = (opt: 'card' | 'bank') => {
    setOption(opt);
    setStep('address');
  };

  const handleAddressSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStep('payment');
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-brand-charcoal/40 backdrop-blur-md"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: 15 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 15 }}
            className="relative w-full max-w-lg rounded-2xl bg-brand-cream border border-brand-charcoal/10 shadow-2xl overflow-hidden z-10 flex flex-col max-h-[90vh] select-none"
          >
            {/* Header */}
            <div className="p-6 border-b border-brand-charcoal/5 flex items-center justify-between">
              <div>
                <span className="font-mono text-[9px] uppercase tracking-[0.25em] text-brand-terracotta font-semibold">
                  ★ SECURE DEPOSIT CHANNELS ★
                </span>
                <h3 className="text-xl font-serif text-brand-charcoal">
                  Aweni Checkout Ledger
                </h3>
              </div>
              <button
                onClick={onClose}
                className="p-1.5 hover:bg-brand-beige rounded-full transition-colors text-brand-charcoal"
                title="Close"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Stepper Progress */}
            <div className="px-6 py-3.5 bg-brand-beige/30 border-b border-brand-charcoal/5 flex items-center justify-between text-[10px] font-mono uppercase tracking-wider text-brand-charcoal/40">
              <span className={step === 'options' ? 'text-brand-terracotta font-bold' : ''}>1. Gateway</span>
              <ChevronRight className="w-3.5 h-3.5" />
              <span className={step === 'address' ? 'text-brand-terracotta font-bold' : ''}>2. Dispatch</span>
              <ChevronRight className="w-3.5 h-3.5" />
              <span className={step === 'payment' ? 'text-brand-terracotta font-bold' : ''}>3. Deposit</span>
              <ChevronRight className="w-3.5 h-3.5" />
              <span className={step === 'success' ? 'text-brand-terracotta font-bold' : ''}>4. Complete</span>
            </div>

            {/* Content Body with slide animations */}
            <div className="flex-1 overflow-y-auto p-6">
              <AnimatePresence mode="wait">
                {step === 'options' && (
                  <motion.div
                    key="options"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="flex flex-col gap-6"
                  >
                    <p className="text-xs text-brand-charcoal/60 leading-relaxed text-center">
                      Please select your preferred secure premium checkout template below. All transactions are protected via industry-standard hashing protocols.
                    </p>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {/* Option A: QuickSeller Card Gateway */}
                      <button
                        onClick={() => handleChooseOption('card')}
                        className="p-6 rounded-2xl border border-brand-charcoal/10 hover:border-brand-terracotta bg-brand-cream hover:bg-brand-beige/20 text-left transition-all duration-300 flex flex-col gap-4 cursor-pointer group hover:shadow-md"
                      >
                        <div className="p-3 bg-brand-terracotta/10 rounded-xl text-brand-terracotta self-start group-hover:bg-brand-terracotta group-hover:text-brand-cream transition-colors">
                          <CreditCard className="w-6 h-6" />
                        </div>
                        <div>
                          <h4 className="font-serif font-semibold text-brand-charcoal">
                            Option A: QuickSeller Card
                          </h4>
                          <p className="text-[10px] font-mono uppercase tracking-wider text-brand-charcoal/40 mt-1">
                            Lagos Credit Gateways
                          </p>
                        </div>
                        <p className="text-[11px] text-brand-charcoal/60 mt-auto">
                          Accepts all local and international debit or credit cards instantly with secure verification codes.
                        </p>
                      </button>

                      {/* Option B: Bank Transfer Vault */}
                      <button
                        onClick={() => handleChooseOption('bank')}
                        className="p-6 rounded-2xl border border-brand-charcoal/10 hover:border-brand-olive bg-brand-cream hover:bg-brand-beige/20 text-left transition-all duration-300 flex flex-col gap-4 cursor-pointer group hover:shadow-md"
                      >
                        <div className="p-3 bg-brand-olive/10 rounded-xl text-brand-olive self-start group-hover:bg-brand-olive group-hover:text-brand-cream transition-colors">
                          <Landmark className="w-6 h-6" />
                        </div>
                        <div>
                          <h4 className="font-serif font-semibold text-brand-charcoal">
                            Option B: Bank Transfer
                          </h4>
                          <p className="text-[10px] font-mono uppercase tracking-wider text-brand-charcoal/40 mt-1">
                            Direct Sovereign Vault
                          </p>
                        </div>
                        <p className="text-[11px] text-brand-charcoal/60 mt-auto">
                          Generates instant unique destination details. Simply transfer and click confirm to complete dispatch.
                        </p>
                      </button>
                    </div>
                  </motion.div>
                )}

                {step === 'address' && (
                  <motion.div
                    key="address"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                  >
                    <form onSubmit={handleAddressSubmit} className="flex flex-col gap-4">
                      <h4 className="font-serif text-base font-semibold text-brand-charcoal mb-2">
                        Specify Dispatch Vessel Destination
                      </h4>
                      <p className="text-xs text-brand-charcoal/60">
                        Please input the sterile, physical destination details where our local couriers will transport your hand-whipped raw formulations.
                      </p>

                      <div className="flex flex-col gap-1.5 mt-2">
                        <label className="font-mono text-[9px] uppercase tracking-wider text-brand-charcoal/50">
                          Physical Shipping Address
                        </label>
                        <textarea
                          required
                          rows={4}
                          value={address}
                          onChange={(e) => setAddress(e.target.value)}
                          placeholder="e.g. House 14, Admiralty Way, Lekki Phase 1, Lagos, Nigeria."
                          className="w-full bg-brand-beige/30 border border-brand-charcoal/10 rounded-xl px-4 py-3 text-xs focus:outline-none focus:border-brand-terracotta transition-colors text-brand-charcoal resize-none"
                        />
                      </div>

                      <button
                        type="submit"
                        className="w-full mt-4 py-3 bg-brand-charcoal hover:bg-brand-terracotta text-brand-cream text-xs font-mono uppercase tracking-widest rounded-xl transition-colors cursor-pointer shadow-md flex items-center justify-center gap-2"
                      >
                        <span>Continue to Payment</span>
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </form>
                  </motion.div>
                )}

                {step === 'payment' && option === 'card' && (
                  <motion.div
                    key="card-gateway"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="flex flex-col gap-6"
                  >
                    {/* Visual Card Display */}
                    <div className="relative w-full h-44 rounded-2xl bg-gradient-to-br from-brand-charcoal to-brand-olive text-brand-cream p-5 shadow-lg flex flex-col justify-between overflow-hidden border border-brand-cream/10">
                      <div className="absolute top-0 right-0 w-32 h-32 bg-brand-terracotta/20 rounded-full blur-2xl pointer-events-none" />
                      <div className="flex justify-between items-start">
                        <span className="font-mono text-[9px] uppercase tracking-[0.2em] opacity-60">
                          QuickSeller Premium Gateway
                        </span>
                        <CreditCard className="w-7 h-7 text-brand-terracotta" />
                      </div>
                      
                      <div className="my-auto font-mono text-xl tracking-[0.15em]">
                        {cardNumber || '•••• •••• •••• ••••'}
                      </div>

                      <div className="flex justify-between items-end text-[10px] font-mono">
                        <div>
                          <span className="opacity-40 uppercase block text-[8px] tracking-wider">Card Holder</span>
                          <span className="uppercase tracking-widest">{cardName || 'ADEBAYO JUNE'}</span>
                        </div>
                        <div>
                          <span className="opacity-40 uppercase block text-[8px] tracking-wider">Expiry</span>
                          <span>{cardExpiry || 'MM/YY'}</span>
                        </div>
                      </div>
                    </div>

                    {/* Card formatting form with micro-animations */}
                    <div className="flex flex-col gap-4">
                      {/* Card Holder Name */}
                      <div className="flex flex-col gap-1">
                        <label className="font-mono text-[9px] uppercase tracking-wider text-brand-charcoal/50">
                          Card Holder Name
                        </label>
                        <input
                          type="text"
                          required
                          value={cardName}
                          onChange={(e) => setCardName(e.target.value)}
                          placeholder="e.g Adebayo June"
                          className="w-full bg-brand-beige/30 border border-brand-charcoal/10 rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:border-brand-terracotta transition-colors text-brand-charcoal"
                        />
                      </div>

                      {/* Card Number */}
                      <div className="flex flex-col gap-1">
                        <label className="font-mono text-[9px] uppercase tracking-wider text-brand-charcoal/50">
                          Card Number
                        </label>
                        <input
                          type="text"
                          required
                          value={cardNumber}
                          onChange={handleCardNumberChange}
                          placeholder="4000 1234 5678 9010"
                          className="w-full bg-brand-beige/30 border border-brand-charcoal/10 rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:border-brand-terracotta transition-colors text-brand-charcoal font-mono"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        {/* Expiry */}
                        <div className="flex flex-col gap-1">
                          <label className="font-mono text-[9px] uppercase tracking-wider text-brand-charcoal/50">
                            Expiry (MM/YY)
                          </label>
                          <input
                            type="text"
                            required
                            value={cardExpiry}
                            onChange={handleExpiryChange}
                            placeholder="12/28"
                            className="w-full bg-brand-beige/30 border border-brand-charcoal/10 rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:border-brand-terracotta transition-colors text-brand-charcoal font-mono"
                          />
                        </div>

                        {/* CVV */}
                        <div className="flex flex-col gap-1">
                          <label className="font-mono text-[9px] uppercase tracking-wider text-brand-charcoal/50">
                            CVV
                          </label>
                          <input
                            type="password"
                            required
                            maxLength={3}
                            value={cardCvv}
                            onChange={(e) => setCardCvv(e.target.value.replace(/\D/g, ''))}
                            placeholder="***"
                            className="w-full bg-brand-beige/30 border border-brand-charcoal/10 rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:border-brand-terracotta transition-colors text-brand-charcoal font-mono"
                          />
                        </div>
                      </div>

                      <button
                        onClick={handlePlaceOrderClick}
                        disabled={isProcessing || !cardName || !cardNumber || !cardExpiry || !cardCvv}
                        className="w-full mt-2 py-3.5 bg-brand-charcoal hover:bg-brand-terracotta text-brand-cream text-xs font-mono uppercase tracking-widest rounded-xl transition-colors cursor-pointer shadow-lg disabled:bg-brand-charcoal/30 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                      >
                        {isProcessing ? (
                          <span className="w-4 h-4 border-2 border-brand-cream border-t-transparent rounded-full animate-spin" />
                        ) : (
                          <>
                            <Lock className="w-3.5 h-3.5" />
                            <span>Authorize ₦{total.toLocaleString()}</span>
                          </>
                        )}
                      </button>
                    </div>
                  </motion.div>
                )}

                {step === 'payment' && option === 'bank' && (
                  <motion.div
                    key="bank-gateway"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="flex flex-col gap-4"
                  >
                    <p className="text-xs text-brand-charcoal/60 leading-relaxed text-center">
                      Please transfer the precise transaction total to the temporary sovereign settlement account below.
                    </p>

                    {/* Sovereign Vault Receipt */}
                    <div className="p-6 rounded-2xl bg-brand-beige/50 border border-brand-charcoal/10 flex flex-col gap-4">
                      {/* Bank Details list */}
                      <div className="flex flex-col gap-2 border-b border-brand-charcoal/10 pb-4">
                        <div className="flex justify-between items-center text-xs text-brand-charcoal/50">
                          <span>Settlement Bank:</span>
                          <span className="font-mono text-brand-charcoal font-semibold">Access Bank PLC</span>
                        </div>
                        <div className="flex justify-between items-center text-xs">
                          <span className="text-brand-charcoal/50">Account Number:</span>
                          <div className="flex items-center gap-1.5">
                            <span className="font-mono text-brand-charcoal font-bold tracking-wider">1013495832</span>
                            <button
                              onClick={handleCopyAccount}
                              className="p-1 hover:bg-brand-cream rounded text-brand-terracotta hover:text-brand-charcoal transition-colors cursor-pointer"
                              title="Copy account number"
                            >
                              {copied ? <Check className="w-3.5 h-3.5 text-brand-olive" /> : <Copy className="w-3.5 h-3.5" />}
                            </button>
                          </div>
                        </div>
                        <div className="flex justify-between items-center text-xs text-brand-charcoal/50">
                          <span>Account Name:</span>
                          <span className="font-mono text-brand-charcoal font-semibold uppercase">Aweni Organics Limited</span>
                        </div>
                      </div>

                      {/* Total details */}
                      <div className="flex justify-between items-center text-sm font-semibold text-brand-charcoal">
                        <span>Precise Total:</span>
                        <span className="font-mono text-brand-terracotta text-lg font-bold">₦{total.toLocaleString()}</span>
                      </div>
                    </div>

                    {copied && (
                      <p className="text-[10px] text-brand-olive font-mono text-center animate-bounce">
                        ✓ Account number captured to clipboard!
                      </p>
                    )}

                    <div className="p-4 rounded-xl border border-brand-olive/20 bg-brand-olive/5 text-[11px] text-brand-olive leading-relaxed font-sans mt-2">
                      <strong>* Immediate Verification:</strong> Once you successfully execute the bank transfer, our automated ledger will monitor and reconcile the transaction within 60 seconds. Please click the confirmation button below.
                    </div>

                    <button
                      onClick={handlePlaceOrderClick}
                      disabled={isProcessing}
                      className="w-full mt-2 py-3.5 bg-brand-charcoal hover:bg-brand-terracotta text-brand-cream text-xs font-mono uppercase tracking-widest rounded-xl transition-colors cursor-pointer shadow-lg disabled:bg-brand-charcoal/30 flex items-center justify-center gap-2"
                    >
                      {isProcessing ? (
                        <span className="w-4 h-4 border-2 border-brand-cream border-t-transparent rounded-full animate-spin" />
                      ) : (
                        <>
                          <CheckCircle className="w-3.5 h-3.5" />
                          <span>I Have Completed the Transfer</span>
                        </>
                      )}
                    </button>
                  </motion.div>
                )}

                {step === 'success' && (
                  <motion.div
                    key="success"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="flex flex-col items-center text-center py-6 gap-4"
                  >
                    <div className="w-16 h-16 rounded-full bg-brand-olive/10 text-brand-olive flex items-center justify-center shadow-inner animate-bounce">
                      <CheckCircle className="w-8 h-8" />
                    </div>

                    <div>
                      <span className="font-mono text-[9px] uppercase tracking-[0.25em] text-brand-olive font-bold">
                        ★ DISPATCH AUTHENTICATED ★
                      </span>
                      <h3 className="text-2xl font-serif text-brand-charcoal font-medium mt-1">
                        Sovereign Receipt Placed
                      </h3>
                      <p className="text-xs text-brand-charcoal/60 leading-relaxed mt-2 max-w-sm mx-auto">
                        Your purchase transaction has successfully synced into the Aweni Supabase registry. Our alchemists are already packaging and whipping your fresh formulations.
                      </p>
                    </div>

                    <div className="p-4 rounded-xl bg-brand-beige/40 border border-brand-charcoal/5 font-mono text-[10px] text-brand-charcoal/50 text-left w-full mt-4 flex flex-col gap-1.5">
                      <div className="flex justify-between">
                        <span>Fulfillment:</span>
                        <span className="text-brand-terracotta font-semibold uppercase">Pending Whip</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Delivery Range:</span>
                        <span>{shippingCost > 1500 ? 'Regional' : 'Lagos Standard'}</span>
                      </div>
                      <div className="flex justify-between border-t border-brand-charcoal/5 pt-1.5 mt-1">
                        <span>Synced Code:</span>
                        <span className="text-brand-charcoal truncate max-w-[180px]">#{Math.random().toString(36).substring(2, 10).toUpperCase()}</span>
                      </div>
                    </div>

                    <button
                      onClick={onClose}
                      className="w-full mt-4 py-3 bg-brand-charcoal hover:bg-brand-terracotta text-brand-cream text-xs font-mono uppercase tracking-widest rounded-xl transition-colors cursor-pointer shadow-md"
                    >
                      Return to Showroom
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
