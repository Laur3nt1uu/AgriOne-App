import { useState } from 'react';
import { motion as Motion, AnimatePresence } from 'framer-motion';
import { X, Crown, Sparkles, ArrowRight, Check } from 'lucide-react';
import { Button } from '../ui/button';
import { useStripePayment } from '../hooks/useStripePayment';
import { usePlanFeatures } from '../hooks/usePlanFeatures';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../i18n/LanguageProvider';

const FEATURE_DESCRIPTIONS = {
  advanced_analytics: {
    title: { ro: 'Analiză Avansată', en: 'Advanced Analytics' },
    description: { ro: 'Predicții AI, tendințe și recomendări personalizate', en: 'AI predictions, trends and personalized recommendations' }
  },
  sms_alerts: {
    title: { ro: 'Alerte SMS', en: 'SMS Alerts' },
    description: { ro: 'Notificări instant pe telefon pentru situații critice', en: 'Instant phone notifications for critical situations' }
  },
  pdf_exports: {
    title: { ro: 'Export PDF', en: 'PDF Exports' },
    description: { ro: 'Rapoarte profesionale pentru terenuri și finanțe', en: 'Professional reports for lands and finances' }
  },
  api_access_basic: {
    title: { ro: 'API Access', en: 'API Access' },
    description: { ro: 'Integrări cu alte sisteme și aplicații', en: 'Integrations with other systems and applications' }
  },
  apia_integration: {
    title: { ro: 'Integrare APIA', en: 'APIA Integration' },
    description: { ro: 'Calculator automat pentru subvenții agricole', en: 'Automatic calculator for agricultural subsidies' }
  },
  data_export: {
    title: { ro: 'Export Date', en: 'Data Export' },
    description: { ro: 'Descarcă datele în format CSV și Excel', en: 'Download data in CSV and Excel format' }
  }
};

export default function PremiumFeatureGate({
  feature,
  children,
  showUpgradeButton = true,
  customMessage,
  language = 'ro',
  // "panel": lock card that replaces a settings row/section; "inline": small locked
  // button for toolbars, where a panel would not fit
  variant = 'panel',
  className = '',
}) {
  const [showModal, setShowModal] = useState(false);
  const { hasFeature, getRequiredPlanForFeature } = usePlanFeatures();
  const { simulatePayment, loading } = useStripePayment();
  const { t } = useLanguage();
  const navigate = useNavigate();

  const requiredPlan = getRequiredPlanForFeature(feature);
  const hasAccess = hasFeature(feature);

  if (hasAccess) {
    return children;
  }

  const featureInfo = FEATURE_DESCRIPTIONS[feature] || {
    title: { ro: 'Funcționalitate Premium', en: 'Premium Feature' },
    description: { ro: 'Această funcționalitate este disponibilă în planurile Pro/Enterprise', en: 'This feature is available in Pro/Enterprise plans' }
  };

  const handleUpgrade = async () => {
    if (requiredPlan === 'PRO') {
      await simulatePayment('PRO');
      setShowModal(false);
    } else {
      navigate('/app/plan');
    }
  };

  const getText = (obj) => obj[language] || obj.en;

  const planLabel = requiredPlan === 'PRO' ? 'PRO' : 'ENTERPRISE';
  const premiumBadge = (
    <div className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 text-white text-xs font-bold">
      <Crown className="w-3 h-3" />
      {planLabel}
    </div>
  );

  // Toolbar variant: a small locked button standing in for the gated control.
  const lockedInline = (
    <Button
      variant="ghost"
      size="sm"
      onClick={() => setShowModal(true)}
      className={className}
      title={customMessage || getText(featureInfo.description)}
    >
      <Crown className="w-4 h-4 mr-1 text-amber-500" />
      {getText(featureInfo.title)}
      <span className="ml-1 text-[10px] font-bold text-amber-500">{planLabel}</span>
    </Button>
  );

  // Panel variant: the gated children are only a blurred backdrop; the lock panel is in
  // normal flow so it defines the height and can never spill over the elements below it.
  const lockedPanel = (
    <div className={`relative overflow-hidden rounded-xl ${className}`}>
      <div className="absolute inset-0 filter blur-sm pointer-events-none opacity-40 select-none" aria-hidden="true">
        {children}
      </div>

      <div className="relative flex flex-col sm:flex-row sm:items-center gap-4 p-4 bg-card/80 backdrop-blur-sm rounded-xl border border-border">
        <div className="flex items-center gap-3 sm:flex-col sm:gap-2 shrink-0">
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary/20 to-amber-500/20 flex items-center justify-center">
            <Crown className="w-6 h-6 text-amber-500" />
          </div>
          {premiumBadge}
        </div>

        <div className="min-w-0 flex-1">
          <div className="font-semibold text-foreground">{getText(featureInfo.title)}</div>
          <p className="text-sm text-muted-foreground mt-1">
            {customMessage || getText(featureInfo.description)}
          </p>
        </div>

        {showUpgradeButton && (
          <div className="flex flex-col items-stretch sm:items-end gap-1.5 shrink-0">
            <Button variant="primary" size="sm" onClick={() => setShowModal(true)}>
              <Sparkles className="w-4 h-4 mr-2" />
              {language === 'ro' ? 'Upgrade acum' : 'Upgrade now'}
            </Button>
            <button
              type="button"
              onClick={() => navigate('/app/plan')}
              className="text-xs text-muted-foreground hover:text-primary transition-colors text-center sm:text-right"
            >
              {language === 'ro' ? 'Vezi toate planurile' : 'View all plans'}
            </button>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <>
      {variant === 'inline' ? lockedInline : lockedPanel}

      <AnimatePresence>
        {showModal && (
          <Motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
            onClick={() => setShowModal(false)}
          >
            <Motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="bg-card border border-border rounded-xl p-6 max-w-md w-full relative"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setShowModal(false)}
                className="absolute top-4 right-4 p-2 rounded-lg hover:bg-muted/60 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="text-center mb-6">
                <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-br from-primary/20 to-amber-500/20 flex items-center justify-center">
                  <Crown className="w-10 h-10 text-amber-500" />
                </div>

                <h3 className="text-xl font-bold text-foreground mb-2">
                  {t('ui.premium.unlockFeatures')}
                </h3>

                <p className="text-muted-foreground text-sm">
                  {language === 'ro'
                    ? 'Upgradeaza la planul Pro pentru acces complet la toate funcționalitățile avansate.'
                    : 'Upgrade to Pro plan for full access to all advanced features.'
                  }
                </p>
              </div>

              {requiredPlan === 'PRO' && (
                <div className="space-y-3 mb-6">
                  {[
                    'advanced_analytics',
                    'sms_alerts',
                    'pdf_exports',
                    'apia_integration'
                  ].map((featureKey) => {
                    const info = FEATURE_DESCRIPTIONS[featureKey];
                    return (
                      <div key={featureKey} className="flex items-start gap-3">
                        <Check className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                        <div>
                          <div className="font-medium text-sm text-foreground">
                            {getText(info.title)}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {getText(info.description)}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              <div className="bg-gradient-to-r from-primary/10 to-amber-500/10 rounded-lg p-4 mb-6">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-bold text-lg">
                      {requiredPlan === 'PRO' ? '49 RON' : 'Custom'}
                      {requiredPlan === 'PRO' && (
                        <span className="text-sm font-normal text-muted-foreground">/lună</span>
                      )}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {requiredPlan === 'PRO'
                        ? (language === 'ro' ? 'Plan Pro' : 'Pro Plan')
                        : (language === 'ro' ? 'Plan Enterprise' : 'Enterprise Plan')
                      }
                    </div>
                  </div>
                  {premiumBadge}
                </div>
              </div>

              <div className="space-y-3">
                <Button
                  onClick={handleUpgrade}
                  disabled={loading}
                  variant="primary"
                  className="w-full"
                >
                  {loading ? (
                    language === 'ro' ? 'Se procesează...' : 'Processing...'
                  ) : (
                    <>
                      {requiredPlan === 'PRO'
                        ? (language === 'ro' ? 'Upgrade la Pro' : 'Upgrade to Pro')
                        : (language === 'ro' ? 'Contactează Sales' : 'Contact Sales')
                      }
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </>
                  )}
                </Button>

                <Button
                  onClick={() => setShowModal(false)}
                  variant="ghost"
                  className="w-full"
                >
                  {language === 'ro' ? 'Nu acum' : 'Not now'}
                </Button>
              </div>
            </Motion.div>
          </Motion.div>
        )}
      </AnimatePresence>
    </>
  );
}