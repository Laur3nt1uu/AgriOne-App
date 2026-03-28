import { useState } from "react";
import { motion as Motion, AnimatePresence } from "framer-motion";
import { CheckCircle, Crown, Sparkles, Building2, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { authStore } from "../../auth/auth.store";
import { api } from "../../api/endpoints";
import { useLanguage } from "../../i18n/LanguageProvider";
import { toastError, toastSuccess } from "../../utils/toast";
import { Button } from "../../ui/button";
import ContactModal from "../../components/ContactModal";
import PaymentSimulationModal from "../../components/PaymentSimulationModal";

const PLAN_ORDER = { STARTER: 0, PRO: 1, ENTERPRISE: 2 };
const PLAN_ICONS = { STARTER: Sparkles, PRO: Crown, ENTERPRISE: Building2 };

export default function PlanPage() {
  const nav = useNavigate();
  const { t, language } = useLanguage();
  const [currentPlan, setCurrentPlan] = useState(authStore.getPlan());
  const [confirming, setConfirming] = useState(null);
  const [loading, setLoading] = useState(false);
  const [contactOpen, setContactOpen] = useState(false);
  const [paymentModalOpen, setPaymentModalOpen] = useState(false);
  const [selectedPlanForPayment, setSelectedPlanForPayment] = useState(null);

  const tiers = [
    { key: "starter", planKey: "STARTER", popular: false },
    { key: "pro", planKey: "PRO", popular: true },
    { key: "enterprise", planKey: "ENTERPRISE", popular: false },
  ];

  const handlePaymentSuccess = async (plan) => {
    try {
      // Call the simulate endpoint to update the plan in database
      const res = await api.payments.simulate({ plan });
      if (res.ok) {
        const newUser = res.user || { ...authStore.getUser(), plan };
        authStore.updateUser(newUser);
        setCurrentPlan(plan);
        toastSuccess(language === 'ro' ? `Bine ai venit în planul ${plan}!` : `Welcome to ${plan} plan!`);
      }
    } catch (err) {
      toastError(err);
    }
    setPaymentModalOpen(false);
    setSelectedPlanForPayment(null);
    setConfirming(null);
  };

  const handleChange = async () => {
    if (!confirming) return;

    // For paid plans, open payment modal
    if (['PRO', 'ENTERPRISE'].includes(confirming)) {
      setSelectedPlanForPayment(confirming);
      setPaymentModalOpen(true);
      return;
    }

    // For downgrade to STARTER, use direct API call
    setLoading(true);
    try {
      const res = await api.auth.changePlan({ plan: confirming });
      const newUser = res?.user || { ...authStore.getUser(), plan: confirming };
      authStore.updateUser(newUser);
      setCurrentPlan(confirming);
      toastSuccess(t("plan.successMessage"));
      setConfirming(null);
    } catch (err) {
      toastError(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <Motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row sm:items-center gap-4"
      >
        <div className="flex items-center gap-3">
          <button
            onClick={() => nav(-1)}
            className="p-2 rounded-xl hover:bg-card/60 transition-colors text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="page-title">{t("plan.title")}</h1>
            <p className="text-sm muted mt-1">{t("plan.subtitle")}</p>
          </div>
        </div>
      </Motion.div>

      {/* Plan Cards */}
      <div className="grid md:grid-cols-3 gap-6">
        {tiers.map((tier, index) => {
          const tierData = t(`pricing.tiers.${tier.key}`);
          const features = tierData?.features || [];
          const isCurrent = currentPlan === tier.planKey;
          const isPro = tier.popular;
          const Icon = PLAN_ICONS[tier.planKey];

          return (
            <Motion.div
              key={tier.key}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -4 }}
              className={`card p-6 relative overflow-hidden ${
                isCurrent ? "ring-2 ring-primary/40" : ""
              } ${isPro && !isCurrent ? "ring-1 ring-primary/20" : ""}`}
            >
              {/* Current badge */}
              {isCurrent && (
                <div className="absolute top-4 right-4">
                  <span className="px-3 py-1 rounded-full bg-primary/10 border border-primary/25 text-primary text-xs font-bold">
                    {t("plan.currentBadge")}
                  </span>
                </div>
              )}

              {/* Pro badge */}
              {isPro && !isCurrent && (
                <div className="absolute top-4 right-4">
                  <span className="px-3 py-1 rounded-full bg-gradient-to-r from-primary to-blue-500 text-white text-xs font-bold">
                    {t("pricing.mostPopular")}
                  </span>
                </div>
              )}

              <div className="flex items-center gap-3 mb-4">
                <div className={`p-2.5 rounded-xl ${isCurrent ? "bg-primary/15 text-primary" : "bg-card-foreground/5 text-muted-foreground"}`}>
                  <Icon className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-foreground">{tierData?.name}</h3>
                  <p className="text-xs text-muted-foreground">{tierData?.description}</p>
                </div>
              </div>

              {/* Price */}
              <div className="mb-6">
                <span className="text-3xl font-extrabold text-foreground">{tierData?.price}</span>
                {tier.key !== "enterprise" && (
                  <span className="text-muted-foreground text-sm ml-1">{t("pricing.perMonth")}</span>
                )}
              </div>

              {/* Features */}
              <ul className="space-y-2.5 mb-6">
                {Array.isArray(features) && features.map((feature, i) => (
                  <li key={i} className="flex items-start gap-2.5">
                    <CheckCircle className={`w-4 h-4 mt-0.5 flex-shrink-0 ${isCurrent ? "text-primary" : "text-muted-foreground/60"}`} />
                    <span className="text-sm text-muted-foreground">{feature}</span>
                  </li>
                ))}
              </ul>

              {/* CTA */}
              {isCurrent ? (
                <Button variant="outline" className="w-full opacity-60 cursor-default" disabled>
                  {t("pricing.ctaCurrent")}
                </Button>
              ) : tier.planKey === "ENTERPRISE" ? (
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => setContactOpen(true)}
                >
                  {t("pricing.ctaEnterprise")}
                </Button>
              ) : (
                <Button
                  variant={isPro ? "primary" : "outline"}
                  className="w-full"
                  onClick={() => setConfirming(tier.planKey)}
                >
                  {PLAN_ORDER[currentPlan] < PLAN_ORDER[tier.planKey]
                    ? t("pricing.ctaUpgrade")
                    : t("pricing.ctaChangePlan")}
                </Button>
              )}
            </Motion.div>
          );
        })}
      </div>

      {/* Confirmation Modal */}
      <AnimatePresence>
        {confirming && (
          <Motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
          >
            <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => !loading && setConfirming(null)} />
            <Motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="card p-6 max-w-md w-full relative z-10"
            >
              <h3 className="text-lg font-bold text-foreground mb-2">{t("plan.confirmTitle")}</h3>
              <p className="text-sm text-muted-foreground mb-1">
                {t("plan.confirmMessage")} <strong>{confirming}</strong>.
              </p>
              <p className="text-xs text-muted-foreground/70 mb-6">
                {t("plan.confirmNote")}
              </p>
              <div className="flex gap-3 justify-end">
                <Button variant="ghost" onClick={() => setConfirming(null)} disabled={loading}>
                  {t("plan.cancelButton")}
                </Button>
                <Button variant="primary" onClick={handleChange} disabled={loading}>
                  {loading ? "..." : t("plan.confirmButton")}
                </Button>
              </div>
            </Motion.div>
          </Motion.div>
        )}
      </AnimatePresence>

      {/* Payment Simulation Modal */}
      <PaymentSimulationModal
        isOpen={paymentModalOpen}
        onClose={() => {
          setPaymentModalOpen(false);
          setSelectedPlanForPayment(null);
          setConfirming(null);
        }}
        plan={selectedPlanForPayment}
        onPaymentSuccess={handlePaymentSuccess}
        language={language}
      />

      {/* Enterprise Contact Modal */}
      <ContactModal open={contactOpen} onClose={() => setContactOpen(false)} />
    </div>
  );
}
