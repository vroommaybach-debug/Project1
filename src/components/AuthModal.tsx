import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Lock, Mail, User, Phone, KeyRound, Sparkles } from 'lucide-react';
import { useAuth } from '../lib/authContext';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose }) => {
  const [mode, setMode] = useState<'login' | 'signup' | 'reset'>('login');
  const { login, signup, resetPassword } = useAuth();

  // Form fields
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');

  // Statuses
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg(null);
    setSuccessMsg(null);

    try {
      if (mode === 'login') {
        const res = await login(email, password);
        if (res.success) {
          setSuccessMsg('Successfully authenticated! Closing portal...');
          setTimeout(() => {
            onClose();
            // Reset fields
            setEmail('');
            setPassword('');
          }, 1500);
        } else {
          setErrorMsg(res.error || 'Authentication rejected. Verify details.');
        }
      } else if (mode === 'signup') {
        const res = await signup(email, password, fullName, phoneNumber);
        if (res.success) {
          setSuccessMsg('Account registered successfully! Welcome.');
          setTimeout(() => {
            onClose();
            setEmail('');
            setPassword('');
            setFullName('');
            setPhoneNumber('');
          }, 1500);
        } else {
          setErrorMsg(res.error || 'Failed to complete registration.');
        }
      } else if (mode === 'reset') {
        const res = await resetPassword(email);
        if (res.success) {
          setSuccessMsg('Reset invitation dispatched! Check your mail vessel.');
          setEmail('');
        } else {
          setErrorMsg(res.error || 'Password reset request failed.');
        }
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'An unexpected operational failure occurred.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Frosted Glass Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-brand-charcoal/40 backdrop-blur-md"
          />

          {/* Frosted Modal Body */}
          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: 15 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 15 }}
            transition={{ type: 'spring', duration: 0.5, ease: 'easeOut' }}
            className="relative w-full max-w-md overflow-hidden rounded-2xl bg-brand-cream/95 border border-brand-charcoal/10 shadow-2xl p-6 md:p-8 select-none z-10"
          >
            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-2 hover:bg-brand-beige rounded-full transition-colors text-brand-charcoal"
              title="Close Portal"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Header */}
            <div className="text-center mb-8">
              <span className="font-mono text-[9px] uppercase tracking-[0.25em] text-brand-terracotta font-semibold">
                ★ SECURE AWENI LEDGER ★
              </span>
              <h3 className="text-2xl md:text-3xl font-serif text-brand-charcoal font-medium mt-1">
                {mode === 'login' ? 'Enter the Vault' : mode === 'signup' ? 'Join the Register' : 'Reset Vessel Key'}
              </h3>
              <p className="text-[11px] font-sans text-brand-charcoal/50 mt-1.5">
                {mode === 'login'
                  ? 'Access your purchase logs and fulfillment states.'
                  : mode === 'signup'
                  ? 'Gain invitations to restricted batch whip schedules.'
                  : 'Specify registered credentials to dispatch reset codes.'}
              </p>
            </div>

            {/* Error/Success Cards */}
            {errorMsg && (
              <div className="mb-4 p-3 rounded-lg bg-red-50 border border-red-200 text-xs text-red-600 font-mono">
                {errorMsg}
              </div>
            )}
            {successMsg && (
              <div className="mb-4 p-3 rounded-lg bg-green-50 border border-green-200 text-xs text-brand-olive font-mono">
                {successMsg}
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              {mode === 'signup' && (
                <>
                  {/* Full Name */}
                  <div className="flex flex-col gap-1">
                    <label className="font-mono text-[9px] uppercase tracking-wider text-brand-charcoal/50">
                      Full Name
                    </label>
                    <div className="relative">
                      <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-charcoal/40" />
                      <input
                        type="text"
                        required
                        value={fullName}
                        onChange={e => setFullName(e.target.value)}
                        placeholder="e.g. Adebayo June"
                        className="w-full bg-brand-beige/30 border border-brand-charcoal/10 rounded-xl pl-10 pr-4 py-3 text-xs focus:outline-none focus:border-brand-terracotta transition-colors text-brand-charcoal"
                      />
                    </div>
                  </div>

                  {/* Phone Number */}
                  <div className="flex flex-col gap-1">
                    <label className="font-mono text-[9px] uppercase tracking-wider text-brand-charcoal/50">
                      Phone Contact
                    </label>
                    <div className="relative">
                      <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-charcoal/40" />
                      <input
                        type="tel"
                        required
                        value={phoneNumber}
                        onChange={e => setPhoneNumber(e.target.value)}
                        placeholder="e.g. +234 803 123 4567"
                        className="w-full bg-brand-beige/30 border border-brand-charcoal/10 rounded-xl pl-10 pr-4 py-3 text-xs focus:outline-none focus:border-brand-terracotta transition-colors text-brand-charcoal"
                      />
                    </div>
                  </div>
                </>
              )}

              {/* Email Address */}
              <div className="flex flex-col gap-1">
                <label className="font-mono text-[9px] uppercase tracking-wider text-brand-charcoal/50">
                  Email Vessel
                </label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-charcoal/40" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="name@domain.com"
                    className="w-full bg-brand-beige/30 border border-brand-charcoal/10 rounded-xl pl-10 pr-4 py-3 text-xs focus:outline-none focus:border-brand-terracotta transition-colors text-brand-charcoal"
                  />
                </div>
              </div>

              {/* Password */}
              {mode !== 'reset' && (
                <div className="flex flex-col gap-1">
                  <div className="flex items-center justify-between">
                    <label className="font-mono text-[9px] uppercase tracking-wider text-brand-charcoal/50">
                      Secret Code (Password)
                    </label>
                    {mode === 'login' && (
                      <button
                        type="button"
                        onClick={() => setMode('reset')}
                        className="font-mono text-[9px] uppercase tracking-wider text-brand-terracotta hover:underline focus:outline-none"
                      >
                        Forgot Code?
                      </button>
                    )}
                  </div>
                  <div className="relative">
                    <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-charcoal/40" />
                    <input
                      type="password"
                      required
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                      placeholder="••••••••••••"
                      className="w-full bg-brand-beige/30 border border-brand-charcoal/10 rounded-xl pl-10 pr-4 py-3 text-xs focus:outline-none focus:border-brand-terracotta transition-colors text-brand-charcoal"
                    />
                  </div>
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full mt-2 py-3 bg-brand-charcoal hover:bg-brand-terracotta text-brand-cream text-xs font-mono uppercase tracking-widest rounded-xl transition-colors cursor-pointer shadow-md disabled:bg-brand-charcoal/40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {loading ? (
                  <span className="w-4 h-4 border-2 border-brand-cream border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <KeyRound className="w-3.5 h-3.5" />
                    <span>
                      {mode === 'login' ? 'Unlock Account' : mode === 'signup' ? 'Initiate Register' : 'Send Reset Code'}
                    </span>
                  </>
                )}
              </button>
            </form>

            {/* Quick Helper for Developers/Reviewers to see simulation */}
            <div className="mt-4 p-2 rounded bg-brand-beige/20 border border-dashed border-brand-charcoal/10 text-center">
              <p className="text-[9px] font-mono text-brand-charcoal/40 uppercase">
                Demo helper: password is <strong className="text-brand-terracotta font-bold">password123</strong> to simulate access.
              </p>
            </div>

            {/* Footer switches */}
            <div className="mt-6 pt-4 border-t border-brand-charcoal/5 flex justify-between text-[11px] font-mono text-brand-charcoal/40">
              {mode === 'login' ? (
                <>
                  <span>New to the register?</span>
                  <button
                    onClick={() => {
                      setMode('signup');
                      setErrorMsg(null);
                    }}
                    className="text-brand-terracotta hover:underline focus:outline-none uppercase text-[10px] tracking-wider"
                  >
                    Signup Port
                  </button>
                </>
              ) : mode === 'signup' ? (
                <>
                  <span>Already recorded?</span>
                  <button
                    onClick={() => {
                      setMode('login');
                      setErrorMsg(null);
                    }}
                    className="text-brand-terracotta hover:underline focus:outline-none uppercase text-[10px] tracking-wider"
                  >
                    Login Port
                  </button>
                </>
              ) : (
                <>
                  <span>Remember code?</span>
                  <button
                    onClick={() => {
                      setMode('login');
                      setErrorMsg(null);
                    }}
                    className="text-brand-terracotta hover:underline focus:outline-none uppercase text-[10px] tracking-wider"
                  >
                    Login Port
                  </button>
                </>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
