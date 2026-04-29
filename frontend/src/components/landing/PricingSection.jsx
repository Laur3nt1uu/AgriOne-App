import { useState } from "react";
import { motion as Motion } from "framer-motion";
import { Check, Sparkles, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { authStore } from "../../auth/auth.store";
import { useLanguage } from "../../i18n/LanguageProvider";
import { Button } from "../../ui/button";
import ContactModal from "../ContactModal";
import { ScrollReveal, TiltCard, MagneticWrapper, StaggerContainer, StaggerItem } from "./ScrollAnimations";

export default function PricingSection() {
  const navigate = useNavigate();
  const isAuthenticated = authStore.isAuthed();
  const user = authStore.getUser?.() ?? {};
  const { t } = useLanguage();
  const [contactOpen, setContactOpen] = useState(false);

  const plans = [
    {
      key: "starter",
      price: t("pricing.tiers.starter.price"),
      period: null,
      popular: false,
      features: Array.isArray(t("pricing.tiers.starter.features", { returnObjects: true }))
        ? t("pricing.tiers.starter.features", { returnObjects: true })
        : [],
      cta: isAuthenticated ? t("pricing.ctaAuthed") : t("pricing.ctaStarter"),
      action: () => isAuthenticated ? navigate("/app/dashboard") : navigate("/auth/register"),
    },
    {
      key: "pro",
      price: t("pricing.tiers.pro.price"),
      period: t("pricing.perMonth"),
      popular: true,
      features: Array.isArray(t("pricing.tiers.pro.features", { returnObjects: true }))
        ? t("pricing.tiers.pro.features", { returnObjects: true })
        : [],
      cta: isAuthenticated ? t("pricing.ctaAuthed") : t("pricing.ctaPro"),
      action: () => isAuthenticated ? navigate("/app/dashboard") : navigate("/auth/register"),
    },
    {
      key: "enterprise",
      price: t("pricing.tiers.enterprise.price"),
      period: null,
      popular: false,
      features: Array.isArray(t("pricing.tiers.enterprise.features", { returnObjects: true }))
        ? t("pricing.tiers.enterprise.features", { returnObjects: true })
        : [],
      cta: t("pricing.ctaEnterprise"),
      action: () => setContactOpen(true),
    },
  ];

  return (
    <section id="pricing" className="py-24 lg:py-36 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <div className="text-center mb-16 lg:mb-20">
          <ScrollReveal variant="blur-up">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium mb-6">
              <Sparkles className="w-4 h-4" />
              {t("pricing.badge")}
            </div>
          </ScrollReveal>
          <ScrollReveal variant="blur-up" delay={0.1}>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-foreground mb-6">
              {t("pricing.title")}{" "}
              <span className="bg-gradient-to-r from-primary to-blue-500 bg-clip-text text-transparent">
                {t("pricing.titleHighlight")}
              </span>
            </h2>
          </ScrollReveal>
          <ScrollReveal variant="blur-up" delay={0.3}>
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
              {t("pricing.subtitle")}
            </p>
          </ScrollReveal>
        </div>

        {/* Cards grid */}
        <StaggerContainer stagger={0.15} className="grid md:grid-cols-3 gap-8 items-stretch">
          {plans.map((plan) => {
            const isCurrent = isAuthenticated && user.plan === plan.key;
            return (
              <StaggerItem key={plan.key} variant="blur-up">
                <TiltCard tiltMax={8} glare className="h-full group">
                  <div className={`glass p-8 h-full flex flex-col relative overflow-hidden transition-all duration-300 ${
                    plan.popular
                      ? "border-primary/30 shadow-lg shadow-primary/10"
                      : ""
                  }`}>
                    {/* Popular badge */}
                    {plan.popular && (
                      <div className="absolute -top-px left-1/2 -translate-x-1/2">
                        <div className="px-4 py-1 bg-gradient-to-r from-primary to-emerald-500 text-white text-xs font-semibold rounded-b-lg">
                          {t("pricing.mostPopular")}
                        </div>
                      </div>
                    )}

                    {/* Current plan badge */}
                    {isCurrent && (
                      <div className="absolute top-4 right-4">
                        <div className="px-3 py-1 bg-primary/10 border border-primary/20 text-primary text-xs font-medium rounded-full">
                          {t("pricing.ctaCurrent")}
                        </div>
                      </div>
                    )}

                    <h3 className="text-xl font-bold text-foreground mb-2">
                      {t(`pricing.tiers.${plan.key}.name`)}
                    </h3>
                    <p className="text-sm text-muted-foreground mb-6">
                      {t(`pricing.tiers.${plan.key}.description`)}
                    </p>

                    <div className="mb-8">
                      <span className="text-4xl font-extrabold text-foreground">{plan.price}</span>
                      {plan.period && (
                        <span className="text-muted-foreground ml-1">/ {plan.period}</span>
                      )}
                    </div>

                    <ul className="space-y-3 mb-8 flex-1">
                      {plan.features.map((f, fi) => (
                        <li key={fi} className="flex items-start gap-3">
                          <Check className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                          <span className="text-sm text-muted-foreground">{f}</span>
                        </li>
                      ))}
                    </ul>

                    <MagneticWrapper strength={0.1}>
                      <Button
                        onClick={plan.action}
                        size="lg"
                        variant={plan.popular ? "default" : "outline"}
                        className={`w-full font-semibold rounded-full ${
                          plan.popular
                            ? "shadow-lg shadow-primary/20"
                            : ""
                        }`}
                        disabled={isCurrent}
                      >
                        {isCurrent ? t("pricing.ctaCurrent") : plan.cta}
                      </Button>
                    </MagneticWrapper>
                  </div>
                </TiltCard>
              </StaggerItem>
            );
          })}
        </StaggerContainer>
      </div>

      <ContactModal open={contactOpen} onClose={() => setContactOpen(false)} />
    </section>
  );
}
