import { useState } from "react";
import { motion as Motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { CheckCircle, Sparkles } from "lucide-react";
import { authStore } from "../../auth/auth.store";
import { useLanguage } from "../../i18n/LanguageProvider";
import { Button } from "../../ui/button";
import ContactModal from "../ContactModal";

const PLAN_ORDER = { STARTER: 0, PRO: 1, ENTERPRISE: 2 };

export default function PricingSection() {
  const navigate = useNavigate();
  const isAuthenticated = authStore.isAuthed();
  const userPlan = authStore.getUser()?.plan || "STARTER";
  const { t } = useLanguage();
  const [contactOpen, setContactOpen] = useState(false);

  const tiers = [
    { key: "starter", planKey: "STARTER", popular: false },
    { key: "pro", planKey: "PRO", popular: true },
    { key: "enterprise", planKey: "ENTERPRISE", popular: false },
  ];

  const getCTA = (tier) => {
    if (!isAuthenticated) {
      return { text: t(`pricing.cta${tier.key.charAt(0).toUpperCase() + tier.key.slice(1)}`), disabled: false };
    }
    if (userPlan === tier.planKey) {
      return { text: t("pricing.ctaCurrent"), disabled: true };
    }
    if (PLAN_ORDER[userPlan] < PLAN_ORDER[tier.planKey]) {
      return { text: t("pricing.ctaUpgrade"), disabled: false };
    }
    return { text: t("pricing.ctaChangePlan"), disabled: false };
  };

  const handleCTA = (tier) => {
    if (tier.planKey === "ENTERPRISE") {
      setContactOpen(true);
      return;
    }
    if (!isAuthenticated) {
      navigate("/auth/register");
    } else {
      navigate("/app/plan");
    }
  };

  return (
    <section id="pricing" className="py-20 lg:py-32 bg-card/20 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 pointer-events-none">
        <Motion.div
          className="absolute top-1/2 right-1/3 w-80 h-80 rounded-full opacity-10 blur-3xl"
          style={{ background: "radial-gradient(circle, rgb(var(--primary) / 0.3), transparent)" }}
          animate={{ scale: [1, 1.2, 1], x: [0, -50, 0] }}
          transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <Motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <Motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium mb-6"
          >
            <Sparkles className="w-4 h-4" />
            {t("pricing.badge")}
          </Motion.div>

          <Motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.8 }}
            viewport={{ once: true }}
            className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-foreground mb-6"
          >
            {t("pricing.title")}{" "}
            <span className="bg-gradient-to-r from-primary to-blue-500 bg-clip-text text-transparent">
              {t("pricing.titleHighlight")}
            </span>
          </Motion.h2>

          <Motion.p
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            viewport={{ once: true }}
            className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed"
          >
            {t("pricing.subtitle")}
          </Motion.p>
        </Motion.div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto items-start">
          {tiers.map((tier, index) => {
            const tierData = t(`pricing.tiers.${tier.key}`);
            const features = tierData?.features || [];
            const isPro = tier.popular;
            const cta = getCTA(tier);
            const isCurrent = isAuthenticated && userPlan === tier.planKey;

            return (
              <Motion.div
                key={tier.key}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.15, duration: 0.6, type: "spring", stiffness: 100 }}
                viewport={{ once: true }}
                whileHover={{ y: -8 }}
                className={`group relative ${isPro ? "md:-mt-4 md:mb-4" : ""}`}
              >
                {/* Popular Badge */}
                {isPro && (
                  <Motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.4 }}
                    viewport={{ once: true }}
                    className="absolute -top-4 left-1/2 -translate-x-1/2 z-10"
                  >
                    <div className="px-4 py-1.5 rounded-full bg-gradient-to-r from-primary to-blue-500 text-white text-xs font-bold shadow-lg">
                      {t("pricing.mostPopular")}
                    </div>
                  </Motion.div>
                )}

                {/* Current Plan Badge */}
                {isCurrent && !isPro && (
                  <Motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.4 }}
                    viewport={{ once: true }}
                    className="absolute -top-4 left-1/2 -translate-x-1/2 z-10"
                  >
                    <div className="px-4 py-1.5 rounded-full bg-card border border-primary/30 text-primary text-xs font-bold shadow-lg">
                      {t("pricing.ctaCurrent")}
                    </div>
                  </Motion.div>
                )}

                <Motion.div
                  className={`glass p-8 h-full relative overflow-hidden ${
                    isPro ? "ring-2 ring-primary/30 shadow-xl shadow-primary/10" : ""
                  } ${isCurrent && !isPro ? "ring-2 ring-primary/20" : ""}`}
                  whileHover={{
                    boxShadow: isPro
                      ? "0 25px 50px rgb(var(--primary) / 0.2)"
                      : "0 20px 40px rgb(var(--primary) / 0.1)"
                  }}
                  transition={{ duration: 0.3 }}
                >
                  {/* Gradient overlay for Pro */}
                  {isPro && (
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-blue-500/5 pointer-events-none" />
                  )}

                  <div className="relative z-10">
                    {/* Tier Name */}
                    <h3 className="text-xl font-bold text-foreground mb-2">{tierData?.name}</h3>
                    <p className="text-sm text-muted-foreground mb-6">{tierData?.description}</p>

                    {/* Price */}
                    <div className="mb-8">
                      <span className="text-4xl lg:text-5xl font-extrabold text-foreground">
                        {tierData?.price}
                      </span>
                      {tier.key !== "enterprise" && (
                        <span className="text-muted-foreground text-lg ml-1">{t("pricing.perMonth")}</span>
                      )}
                    </div>

                    {/* Features */}
                    <ul className="space-y-3 mb-8">
                      {Array.isArray(features) && features.map((feature, i) => (
                        <Motion.li
                          key={i}
                          initial={{ opacity: 0, x: -10 }}
                          whileInView={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.4 + i * 0.05 }}
                          viewport={{ once: true }}
                          className="flex items-start gap-3"
                        >
                          <CheckCircle className={`w-5 h-5 mt-0.5 flex-shrink-0 ${isPro ? "text-primary" : "text-muted-foreground"}`} />
                          <span className="text-sm text-muted-foreground">{feature}</span>
                        </Motion.li>
                      ))}
                    </ul>

                    {/* CTA */}
                    <Motion.div
                      whileHover={cta.disabled ? {} : { scale: 1.03 }}
                      whileTap={cta.disabled ? {} : { scale: 0.97 }}
                    >
                      <Button
                        onClick={() => !cta.disabled && handleCTA(tier)}
                        variant={isCurrent ? "outline" : isPro ? "primary" : "outline"}
                        className={`w-full font-semibold py-3 ${cta.disabled ? "opacity-60 cursor-default" : ""}`}
                        disabled={cta.disabled}
                      >
                        {cta.text}
                      </Button>
                    </Motion.div>
                  </div>
                </Motion.div>
              </Motion.div>
            );
          })}
        </div>
      </div>

      {/* Enterprise Contact Modal */}
      <ContactModal open={contactOpen} onClose={() => setContactOpen(false)} />
    </section>
  );
}
