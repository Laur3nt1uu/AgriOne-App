import { useState } from "react";
import { motion as Motion } from "framer-motion";
import { Mail, ArrowRight, CheckCircle, Bell, BarChart3, Sun } from "lucide-react";
import { apiClient } from "../../api/client";
import { toastError, toastSuccess } from "../../utils/toast";
import { useLanguage } from "../../i18n/LanguageProvider";
import { Button } from "../../ui/button";
import { ScrollReveal, Parallax } from "./ScrollAnimations";

export default function NewsletterSection() {
  const { t, language } = useLanguage();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [subscribed, setSubscribed] = useState(false);

  const benefits = [
    { icon: Bell, key: "alerts" },
    { icon: BarChart3, key: "insights" },
    { icon: Sun, key: "weather" },
  ];

  async function handleSubmit(e) {
    e.preventDefault();
    if (!email || !email.includes("@")) {
      toastError(null, t("newsletter.invalidEmail"));
      return;
    }

    setLoading(true);
    try {
      await apiClient.post("/api/newsletter/subscribe", {
        email,
        language,
        source: "landing_page",
      });
      toastSuccess(t("newsletter.success"));
      setSubscribed(true);
      setEmail("");
    } catch (err) {
      toastError(err, t("newsletter.error"));
    } finally {
      setLoading(false);
    }
  }

  return (
    <section id="newsletter" className="py-20 lg:py-28 relative overflow-hidden">
      {/* Background blobs */}
      <div className="absolute inset-0 pointer-events-none">
        <Parallax speed={-0.08}>
          <div
            className="absolute top-[10%] -right-[5%] w-[400px] h-[400px] rounded-full opacity-15 blur-[100px]"
            style={{ background: "rgb(var(--primary) / 0.5)" }}
          />
        </Parallax>
        <Parallax speed={0.06}>
          <div
            className="absolute -bottom-[10%] left-[10%] w-[350px] h-[350px] rounded-full opacity-10 blur-[90px]"
            style={{ background: "rgb(59 130 246 / 0.4)" }}
          />
        </Parallax>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="bg-card/50 border border-border/50 rounded-3xl p-8 sm:p-12 lg:p-16 backdrop-blur-sm">
          <div className="text-center">
            {/* Badge */}
            <ScrollReveal variant="blur-up">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium mb-6">
                <Mail className="w-4 h-4" />
                {t("newsletter.badge")}
              </div>
            </ScrollReveal>

            {/* Heading */}
            <Motion.h2
              initial={{ opacity: 0, y: 20, filter: "blur(8px)" }}
              whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              transition={{ delay: 0.1, duration: 0.7 }}
              viewport={{ once: true }}
              className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-foreground mb-4"
            >
              {t("newsletter.title")}
            </Motion.h2>

            <ScrollReveal variant="blur-up" delay={0.2}>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-10">
                {t("newsletter.subtitle")}
              </p>
            </ScrollReveal>

            {/* Benefits */}
            <Motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.6 }}
              viewport={{ once: true }}
              className="flex flex-col sm:flex-row justify-center gap-6 mb-10"
            >
              {benefits.map((b) => {
                const Icon = b.icon;
                return (
                  <div
                    key={b.key}
                    className="flex items-center gap-2.5 text-sm text-muted-foreground"
                  >
                    <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                      <Icon className="w-4 h-4 text-primary" />
                    </div>
                    <span>{t(`newsletter.benefits.${b.key}`)}</span>
                  </div>
                );
              })}
            </Motion.div>

            {/* Form / Success */}
            <Motion.div
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.6 }}
              viewport={{ once: true }}
            >
              {subscribed ? (
                <Motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="inline-flex items-center gap-2.5 px-6 py-3.5 rounded-xl bg-green-500/10 border border-green-500/20 text-green-600 dark:text-green-400 font-medium"
                >
                  <CheckCircle className="w-5 h-5" />
                  {t("newsletter.success")}
                </Motion.div>
              ) : (
                <form
                  onSubmit={handleSubmit}
                  className="flex flex-col sm:flex-row gap-3 max-w-lg mx-auto"
                >
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder={t("newsletter.placeholder")}
                    disabled={loading}
                    required
                    className="flex-1 px-5 py-3.5 rounded-xl border border-border/50 bg-background/80 text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary/40 disabled:opacity-50 transition-all text-sm"
                  />
                  <Button
                    type="submit"
                    disabled={loading}
                    className="px-7 py-3.5 font-semibold rounded-xl relative group overflow-hidden shadow-lg shadow-primary/20 hover:shadow-primary/40 transition-shadow duration-500 whitespace-nowrap"
                  >
                    <span className="relative z-10 flex items-center gap-2">
                      {loading ? t("newsletter.loading") : t("newsletter.button")}
                      {!loading && (
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      )}
                    </span>
                  </Button>
                </form>
              )}

              <p className="mt-5 text-xs text-muted-foreground/70">
                {t("newsletter.privacy")}
              </p>
            </Motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
