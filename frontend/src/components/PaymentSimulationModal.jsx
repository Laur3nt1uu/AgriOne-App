import { useState } from 'react';
import { motion as Motion, AnimatePresence } from 'framer-motion';
import { X, CreditCard, Lock, CheckCircle, Loader2, ShieldCheck } from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';

const PLAN_DETAILS = {
  PRO: {
    name: 'AgriOne Pro',
    price: '49',
    currency: 'RON',
    period: '/lună',
    features: [
      'Terenuri nelimitate',
      'Până la 50 de senzori',
      'Alerte SMS instant',
      'Export rapoarte PDF',
      'Integrare APIA',
      'Suport prioritar'
    ]
  },
  ENTERPRISE: {
    name: 'AgriOne Enterprise',
    price: '299',
    currency: 'RON',
    period: '/lună',
    features: [
      'Totul din Pro +',
      'Senzori nelimitați',
      'API Access complet',
      'Manager dedicat',
      'SLA garantat 99.9%',
      'Deployment custom'
    ]
  }
};

export default function PaymentSimulationModal({
  isOpen,
  onClose,
  plan,
  onPaymentSuccess,
  language = 'ro'
}) {
  const [step, setStep] = useState('form'); // form, processing, success
  const [cardNumber, setCardNumber] = useState('');
  const [cardName, setCardName] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvv, setCvv] = useState('');
  const [errors, setErrors] = useState({});

  const planDetails = PLAN_DETAILS[plan] || PLAN_DETAILS.PRO;

  const formatCardNumber = (value) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = (matches && matches[0]) || '';
    const parts = [];
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    return parts.length ? parts.join(' ') : value;
  };

  const formatExpiry = (value) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    if (v.length >= 2) {
      return v.substring(0, 2) + '/' + v.substring(2, 4);
    }
    return v;
  };

  const validateForm = () => {
    const newErrors = {};

    if (!cardNumber || cardNumber.replace(/\s/g, '').length < 16) {
      newErrors.cardNumber = language === 'ro' ? 'Număr card invalid' : 'Invalid card number';
    }

    if (!cardName || cardName.trim().length < 3) {
      newErrors.cardName = language === 'ro' ? 'Introdu numele de pe card' : 'Enter name on card';
    }

    if (!expiry || expiry.length < 5) {
      newErrors.expiry = language === 'ro' ? 'Data expirării invalidă' : 'Invalid expiry date';
    }

    if (!cvv || cvv.length < 3) {
      newErrors.cvv = language === 'ro' ? 'CVV invalid' : 'Invalid CVV';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setStep('processing');

    // Simulate payment processing with realistic delay
    await new Promise(resolve => setTimeout(resolve, 2000));

    setStep('success');

    // Wait a moment then trigger success callback
    await new Promise(resolve => setTimeout(resolve, 1500));

    if (onPaymentSuccess) {
      onPaymentSuccess(plan);
    }
  };

  const handleClose = () => {
    if (step === 'processing') return; // Don't allow closing during processing
    setStep('form');
    setCardNumber('');
    setCardName('');
    setExpiry('');
    setCvv('');
    setErrors({});
    onClose();
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <Motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
        onClick={step !== 'processing' ? handleClose : undefined}
      >
        <Motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="bg-card border border-border rounded-2xl w-full max-w-md overflow-hidden shadow-2xl"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-primary/10 via-primary/5 to-transparent p-6 border-b border-border">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-primary/15">
                  <CreditCard className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-bold text-foreground">{planDetails.name}</h3>
                  <p className="text-sm text-muted-foreground">
                    {planDetails.price} {planDetails.currency}{planDetails.period}
                  </p>
                </div>
              </div>
              {step !== 'processing' && (
                <button
                  onClick={handleClose}
                  className="p-2 rounded-lg hover:bg-muted/60 transition-colors"
                >
                  <X className="w-5 h-5 text-muted-foreground" />
                </button>
              )}
            </div>
          </div>

          {/* Content */}
          <div className="p-6">
            <AnimatePresence mode="wait">
              {step === 'form' && (
                <Motion.form
                  key="form"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  onSubmit={handleSubmit}
                  className="space-y-4"
                >
                  {/* Demo Notice */}
                  <div className="bg-amber-500/10 border border-amber-500/30 rounded-lg p-3 text-center">
                    <p className="text-sm text-amber-600 dark:text-amber-400 font-medium">
                      🎭 {language === 'ro' ? 'Mod Demonstrație' : 'Demo Mode'}
                    </p>
                    <p className="text-xs text-amber-600/80 dark:text-amber-400/80 mt-1">
                      {language === 'ro'
                        ? 'Folosește orice date fictive pentru a testa'
                        : 'Use any fictional data to test'
                      }
                    </p>
                  </div>

                  {/* Card Number */}
                  <div className="space-y-2">
                    <Label htmlFor="cardNumber">
                      {language === 'ro' ? 'Număr Card' : 'Card Number'}
                    </Label>
                    <div className="relative">
                      <Input
                        id="cardNumber"
                        placeholder="4242 4242 4242 4242"
                        value={cardNumber}
                        onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
                        maxLength={19}
                        className={errors.cardNumber ? 'border-destructive' : ''}
                      />
                      <CreditCard className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    </div>
                    {errors.cardNumber && (
                      <p className="text-xs text-destructive">{errors.cardNumber}</p>
                    )}
                  </div>

                  {/* Card Holder Name */}
                  <div className="space-y-2">
                    <Label htmlFor="cardName">
                      {language === 'ro' ? 'Nume pe Card' : 'Name on Card'}
                    </Label>
                    <Input
                      id="cardName"
                      placeholder="ION POPESCU"
                      value={cardName}
                      onChange={(e) => setCardName(e.target.value.toUpperCase())}
                      className={errors.cardName ? 'border-destructive' : ''}
                    />
                    {errors.cardName && (
                      <p className="text-xs text-destructive">{errors.cardName}</p>
                    )}
                  </div>

                  {/* Expiry & CVV */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="expiry">
                        {language === 'ro' ? 'Data Expirării' : 'Expiry Date'}
                      </Label>
                      <Input
                        id="expiry"
                        placeholder="MM/YY"
                        value={expiry}
                        onChange={(e) => setExpiry(formatExpiry(e.target.value))}
                        maxLength={5}
                        className={errors.expiry ? 'border-destructive' : ''}
                      />
                      {errors.expiry && (
                        <p className="text-xs text-destructive">{errors.expiry}</p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="cvv">CVV</Label>
                      <div className="relative">
                        <Input
                          id="cvv"
                          type="password"
                          placeholder="•••"
                          value={cvv}
                          onChange={(e) => setCvv(e.target.value.replace(/\D/g, ''))}
                          maxLength={4}
                          className={errors.cvv ? 'border-destructive' : ''}
                        />
                        <Lock className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      </div>
                      {errors.cvv && (
                        <p className="text-xs text-destructive">{errors.cvv}</p>
                      )}
                    </div>
                  </div>

                  {/* Security Badge */}
                  <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground py-2">
                    <ShieldCheck className="w-4 h-4 text-green-500" />
                    <span>
                      {language === 'ro'
                        ? 'Plată securizată cu criptare SSL'
                        : 'Secure payment with SSL encryption'
                      }
                    </span>
                  </div>

                  {/* Submit Button */}
                  <Button type="submit" variant="primary" className="w-full py-3">
                    {language === 'ro'
                      ? `Plătește ${planDetails.price} ${planDetails.currency}`
                      : `Pay ${planDetails.price} ${planDetails.currency}`
                    }
                  </Button>

                  <p className="text-xs text-center text-muted-foreground">
                    {language === 'ro'
                      ? 'Prin continuare, ești de acord cu Termenii și Condițiile'
                      : 'By continuing, you agree to our Terms & Conditions'
                    }
                  </p>
                </Motion.form>
              )}

              {step === 'processing' && (
                <Motion.div
                  key="processing"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="py-12 text-center"
                >
                  <div className="relative w-20 h-20 mx-auto mb-6">
                    <Motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      className="absolute inset-0 rounded-full border-4 border-primary/20 border-t-primary"
                    />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <CreditCard className="w-8 h-8 text-primary" />
                    </div>
                  </div>
                  <h3 className="text-lg font-bold text-foreground mb-2">
                    {language === 'ro' ? 'Se procesează plata...' : 'Processing payment...'}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {language === 'ro'
                      ? 'Te rugăm să aștepți, nu închide această fereastră.'
                      : 'Please wait, do not close this window.'
                    }
                  </p>
                </Motion.div>
              )}

              {step === 'success' && (
                <Motion.div
                  key="success"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="py-12 text-center"
                >
                  <Motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 200, damping: 10 }}
                    className="w-20 h-20 mx-auto mb-6 rounded-full bg-green-500/15 flex items-center justify-center"
                  >
                    <CheckCircle className="w-10 h-10 text-green-500" />
                  </Motion.div>
                  <h3 className="text-lg font-bold text-foreground mb-2">
                    {language === 'ro' ? 'Plată reușită!' : 'Payment successful!'}
                  </h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    {language === 'ro'
                      ? `Bine ai venit în ${planDetails.name}!`
                      : `Welcome to ${planDetails.name}!`
                    }
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {language === 'ro'
                      ? 'Vei fi redirecționat automat...'
                      : 'You will be redirected automatically...'
                    }
                  </p>
                </Motion.div>
              )}
            </AnimatePresence>
          </div>
        </Motion.div>
      </Motion.div>
    </AnimatePresence>
  );
}