import { motion as Motion, useScroll, useTransform } from "framer-motion";
import { Zap, Settings, TrendingUp, ArrowRight } from "lucide-react";
import { useRef } from "react";
import { useNavigate } from "react-router-dom";
import { authStore } from "../../auth/auth.store";
import { useLanguage } from "../../i18n/LanguageProvider";
import { Button } from "../../ui/button";
import { ScrollReveal, MagneticWrapper } from "./ScrollAnimations";

const STEPS = [
  { key: "install", icon: Zap, color: "primary" },
  { key: "rules", icon: Settings, color: "blue-500" },
  { key: "monitor", icon: TrendingUp, color: "green-500" },
];

export default function HowItWorksSection() {
  const navigate = useNavigate();
  const isAuthenticated = authStore.isAuthed();
  const { t } = useLanguage();

  /* SVG path draw on scroll */
  const pathRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: pathRef,
    offset: ["start 80%", "end 40%"],
  });
  const pathLength = useTransform(scrollYProgress, [0, 1], [0, 1]);

  return (
    <section id="how-it-works" className="py-24 lg:py-36 relative overflow-hidden">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <div className="text-center mb-20">
          <ScrollReveal variant="blur-up">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium mb-6">
              <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
              {t("howItWorks.badge")}
            </div>
          </ScrollReveal>
          <Motion.h2
            initial={{ opacity: 0, y: 20, filter: "blur(8px)" }}
            whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            transition={{ delay: 0.1, duration: 0.7 }}
            viewport={{ once: true }}
            className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-foreground mb-6"
          >
            {t("howItWorks.title")}{" "}
            <span className="bg-gradient-to-r from-primary via-emerald-400 to-blue-500 bg-clip-text text-transparent">
              {t("howItWorks.titleHighlight")}
            </span>
          </Motion.h2>
          <ScrollReveal variant="blur-up" delay={0.3}>
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
              {t("howItWorks.subtitle")}
            </p>
          </ScrollReveal>
        </div>

        {/* Timeline with SVG path */}
        <div ref={pathRef} className="relative">
          {/* Drawn SVG line (desktop) */}
          <svg
            className="absolute left-1/2 -translate-x-1/2 top-0 h-full w-[2px] hidden lg:block"
            viewBox="0 0 2 600"
            preserveAspectRatio="none"
          >
            <line x1="1" y1="0" x2="1" y2="600" stroke="rgb(var(--border) / 0.2)" strokeWidth="2" />
            <Motion.line
              x1="1" y1="0" x2="1" y2="600"
              stroke="rgb(var(--primary))"
              strokeWidth="2"
              style={{ pathLength }}
            />
          </svg>

          <div className="space-y-16 lg:space-y-24">
            {STEPS.map((step, i) => {
              const Icon = step.icon;
              const isEven = i % 2 === 0;
              return (
                <ScrollReveal key={i} variant={isEven ? "fade-left" : "fade-right"} delay={i * 0.1}>
                  <div className={`flex flex-col lg:flex-row items-center gap-8 lg:gap-16 ${!isEven ? "lg:flex-row-reverse" : ""}`}>
                    {/* Card */}
                    <div className="flex-1 w-full">
                      <Motion.div
                        className="glass p-8 relative overflow-hidden group"
                        whileHover={{ y: -4, boxShadow: `0 20px 40px rgb(var(--${step.color}) / 0.12)` }}
                        transition={{ duration: 0.3 }}
                      >
                        <div className={`absolute inset-0 bg-gradient-to-br from-${step.color}/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none`} />
                        <div className="relative z-10">
                          <div className="flex items-center gap-4 mb-4">
                            <div className={`inline-flex items-center justify-center w-12 h-12 rounded-xl bg-${step.color}/10 border border-${step.color}/20`}>
                              <Icon className={`w-6 h-6 text-${step.color}`} />
                            </div>
                            <span className="text-xs uppercase tracking-widest text-muted-foreground font-medium">
                              {t(`howItWorks.steps.${step.key}.duration`)}
                            </span>
                          </div>
                          <h3 className="text-xl lg:text-2xl font-bold text-foreground mb-3">
                            {t(`howItWorks.steps.${step.key}.title`)}
                          </h3>
                          <p className="text-muted-foreground leading-relaxed">
                            {t(`howItWorks.steps.${step.key}.description`)}
                          </p>
                        </div>
                      </Motion.div>
                    </div>

                    {/* Center number */}
                    <div className="hidden lg:flex items-center justify-center relative z-10">
                      <Motion.div
                        className={`w-14 h-14 rounded-full bg-${step.color}/10 border-2 border-${step.color}/30 flex items-center justify-center backdrop-blur-sm`}
                        whileInView={{ scale: [0, 1.2, 1] }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.3 + i * 0.2, type: "spring", stiffness: 200 }}
                      >
                        <span className={`text-lg font-bold text-${step.color}`}>{i + 1}</span>
                      </Motion.div>
                    </div>

                    {/* Spacer for grid alignment */}
                    <div className="flex-1 hidden lg:block" />
                  </div>
                </ScrollReveal>
              );
            })}
          </div>
        </div>

        {/* CTA */}
        <ScrollReveal variant="blur-up" delay={0.2} className="text-center mt-20">
          <MagneticWrapper strength={0.12} className="inline-block">
            <Button
              onClick={() => isAuthenticated ? navigate("/app/dashboard") : navigate("/auth/register")}
              size="lg"
              className="font-semibold px-10 py-5 text-base rounded-full relative group overflow-hidden"
            >
              <Motion.div className="absolute inset-0 bg-gradient-to-r from-primary to-emerald-500 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <span className="relative z-10 flex items-center gap-2">
                {isAuthenticated ? t("howItWorks.ctaPrimaryAuthed") : t("howItWorks.ctaPrimary")}
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </span>
            </Button>
          </MagneticWrapper>
        </ScrollReveal>
      </div>
    </section>
  );
}
