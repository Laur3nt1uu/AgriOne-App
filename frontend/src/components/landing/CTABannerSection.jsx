import { useState } from "react";
import { motion as Motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { ArrowRight, CreditCard, Clock, Shield } from "lucide-react";
import { authStore } from "../../auth/auth.store";
import { useLanguage } from "../../i18n/LanguageProvider";
import { Button } from "../../ui/button";
import ContactModal from "../ContactModal";

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
    <section className="py-20 lg:py-28 relative overflow-hidden">
      {/* Background Gradient */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-blue-500/10 to-primary/10" />
        <Motion.div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full opacity-20 blur-3xl"
          style={{ background: "radial-gradient(circle, rgb(var(--primary) / 0.4), transparent)" }}
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
        {/* Main Content */}
        <Motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <Motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.8 }}
            viewport={{ once: true }}
            className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-foreground mb-6"
          >
            {t("ctaBanner.title")}
          </Motion.h2>

          <Motion.p
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.8 }}
            viewport={{ once: true }}
            className="text-lg md:text-xl text-muted-foreground mb-10 leading-relaxed max-w-2xl mx-auto"
          >
            {t("ctaBanner.subtitle")}
          </Motion.p>

          {/* CTAs */}
          <Motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            viewport={{ once: true }}
            className="flex flex-col sm:flex-row gap-4 justify-center mb-10"
          >
            <Motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button
                onClick={handlePrimary}
                size="lg"
                className="font-semibold px-10 py-5 text-base relative group overflow-hidden"
              >
                <Motion.div
                  className="absolute inset-0 bg-gradient-to-r from-primary to-blue-500 opacity-0 group-hover:opacity-100 transition-opacity"
                />
                <span className="relative z-10 flex items-center gap-2">
                  {isAuthenticated ? t("ctaBanner.ctaPrimaryAuthed") : t("ctaBanner.ctaPrimary")}
                  <Motion.div
                    animate={{ x: [0, 5, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  >
                    <ArrowRight className="w-5 h-5" />
                  </Motion.div>
                </span>
              </Button>
            </Motion.div>

            <Motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button
                onClick={() => setContactOpen(true)}
                variant="outline"
                size="lg"
                className="font-semibold px-10 py-5 text-base"
              >
                {t("ctaBanner.ctaSecondary")}
              </Button>
            </Motion.div>
          </Motion.div>

          {/* Trust Indicators */}
          <Motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            viewport={{ once: true }}
            className="flex flex-col sm:flex-row items-center justify-center gap-6 sm:gap-8"
          >
            {trustItems.map((item, index) => {
              const Icon = item.icon;
              return (
                <Motion.div
                  key={index}
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  transition={{ delay: 0.5 + index * 0.1 }}
                  viewport={{ once: true }}
                  className="flex items-center gap-2 text-muted-foreground"
                >
                  <Icon className="w-4 h-4 text-primary" />
                  <span className="text-sm font-medium">{item.label}</span>
                </Motion.div>
              );
            })}
          </Motion.div>
        </Motion.div>
      </div>

      {/* Contact Modal */}
      <ContactModal open={contactOpen} onClose={() => setContactOpen(false)} />
    </section>
  );
}
