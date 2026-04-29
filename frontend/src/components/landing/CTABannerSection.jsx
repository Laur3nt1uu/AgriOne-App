import { useState } from "react";
import { motion as Motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { ArrowRight, CreditCard, Clock, Shield } from "lucide-react";
import { authStore } from "../../auth/auth.store";
import { useLanguage } from "../../i18n/LanguageProvider";
import { Button } from "../../ui/button";
import ContactModal from "../ContactModal";
import { ScrollReveal, Parallax, MagneticWrapper, FloatingParticles } from "./ScrollAnimations";

export default function CTABannerSection() {
  const navigate = useNavigate();
  const isAuthenticated = authStore.isAuthed();
  const { t } = useLanguage();
  const [contactOpen, setContactOpen] = useState(false);

  const handlePrimary = () => {
    if (isAuthenticated) {
      navigate("/app/dashboard");
    } else {
      navigate("/auth/register");
    }
  };

  const trustItems = [
    { icon: CreditCard, label: t("ctaBanner.trust.noCreditCard") },
    { icon: Clock, label: t("ctaBanner.trust.quickSetup") },
    { icon: Shield, label: t("ctaBanner.trust.cancelAnytime") },
  ];

  return (
    <section className="py-24 lg:py-36 relative overflow-hidden">
      {/* Background gradient + particles */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-blue-500/10 to-primary/10" />
        <Parallax speed={-0.15}>
          <Motion.div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full opacity-20 blur-3xl"
            style={{ background: "radial-gradient(circle, rgb(var(--primary) / 0.4), transparent)" }}
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          />
        </Parallax>
        <FloatingParticles count={20} />
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
        <ScrollReveal variant="blur-up">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-foreground mb-6">
            {t("ctaBanner.title")}
          </h2>
        </ScrollReveal>

        <ScrollReveal variant="blur-up" delay={0.2}>
          <p className="text-lg md:text-xl text-muted-foreground mb-10 leading-relaxed max-w-2xl mx-auto">
            {t("ctaBanner.subtitle")}
          </p>
        </ScrollReveal>

        {/* CTA Buttons */}
        <ScrollReveal variant="fade-up" delay={0.3}>
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-10">
            <MagneticWrapper strength={0.15}>
              <Button
                onClick={handlePrimary}
                size="lg"
                className="font-semibold px-10 py-5 text-base rounded-full shadow-lg shadow-primary/20 relative group overflow-hidden"
              >
                <Motion.div className="absolute inset-0 bg-gradient-to-r from-primary to-blue-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                <span className="relative z-10 flex items-center gap-2">
                  {isAuthenticated ? t("ctaBanner.ctaPrimaryAuthed") : t("ctaBanner.ctaPrimary")}
                  <Motion.div animate={{ x: [0, 5, 0] }} transition={{ duration: 1.5, repeat: Infinity }}>
                    <ArrowRight className="w-5 h-5" />
                  </Motion.div>
                </span>
              </Button>
            </MagneticWrapper>

            <MagneticWrapper strength={0.15}>
              <Button
                onClick={() => setContactOpen(true)}
                variant="outline"
                size="lg"
                className="font-semibold px-10 py-5 text-base rounded-full"
              >
                {t("ctaBanner.ctaSecondary")}
              </Button>
            </MagneticWrapper>
          </div>
        </ScrollReveal>

        {/* Trust Indicators */}
        <ScrollReveal variant="fade-up" delay={0.4}>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 sm:gap-8">
            {trustItems.map((item, index) => {
              const Icon = item.icon;
              return (
                <div key={index} className="flex items-center gap-2 text-muted-foreground">
                  <Icon className="w-4 h-4 text-primary" />
                  <span className="text-sm font-medium">{item.label}</span>
                </div>
              );
            })}
          </div>
        </ScrollReveal>
      </div>

      <ContactModal open={contactOpen} onClose={() => setContactOpen(false)} />
    </section>
  );
}
