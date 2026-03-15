import { motion as Motion } from "framer-motion";
import { Zap, Settings, TrendingUp, ArrowRight, CheckCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { authStore } from "../../auth/auth.store";
import { useLanguage } from "../../i18n/LanguageProvider";
import { Button } from "../../ui/button";

export default function HowItWorksSection() {
  const navigate = useNavigate();
  const isAuthenticated = authStore.isAuthed();
  const { t } = useLanguage();

  const steps = [
    {
      icon: Zap,
      title: t("howItWorks.steps.install.title"),
      description: t("howItWorks.steps.install.description"),
      details: t("howItWorks.steps.install.details"),
      color: "primary",
      duration: t("howItWorks.steps.install.duration")
    },
    {
      icon: Settings,
      title: t("howItWorks.steps.rules.title"),
      description: t("howItWorks.steps.rules.description"),
      details: t("howItWorks.steps.rules.details"),
      color: "blue-500",
      duration: t("howItWorks.steps.rules.duration")
    },
    {
      icon: TrendingUp,
      title: t("howItWorks.steps.monitor.title"),
      description: t("howItWorks.steps.monitor.description"),
      details: t("howItWorks.steps.monitor.details"),
      color: "green-500",
      duration: t("howItWorks.steps.monitor.duration")
    }
  ];

  const handleGetStarted = () => {
    if (isAuthenticated) {
      navigate("/app/dashboard");
    } else {
      navigate("/auth/register");
    }
  };

  return (
    <section id="how-it-works" className="py-20 lg:py-32 bg-card/20 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 pointer-events-none">
        <Motion.div
          className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full opacity-8 blur-3xl"
          style={{
            background: "radial-gradient(circle, rgb(var(--blue-500) / 0.3), transparent)"
          }}
          animate={{
            scale: [1, 1.3, 1],
            x: [0, -60, 0],
            y: [0, 40, 0]
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <Motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16 lg:mb-20"
        >
          <Motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium mb-6"
          >
            <CheckCircle className="w-4 h-4" />
            {t("howItWorks.badge")}
          </Motion.div>

          <Motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.8 }}
            viewport={{ once: true }}
            className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-foreground mb-6"
          >
            {t("howItWorks.title")}{" "}
            <span className="bg-gradient-to-r from-primary to-blue-500 bg-clip-text text-transparent">
              {t("howItWorks.titleHighlight")}
            </span>
          </Motion.h2>

          <Motion.p
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            viewport={{ once: true }}
            className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed"
          >
            {t("howItWorks.subtitle")}
          </Motion.p>
        </Motion.div>

        {/* Steps */}
        <div className="relative">
          {/* Mobile: Vertical Layout */}
          <div className="md:hidden space-y-8">
            {steps.map((step, index) => (
              <StepCard key={index} step={step} index={index} />
            ))}
          </div>

          {/* Desktop: Horizontal Layout with Connectors */}
          <div className="hidden md:block">
            <div className="grid md:grid-cols-3 gap-8 lg:gap-12 relative">
              {steps.map((step, index) => (
                <div key={index} className="relative">
                  <StepCard step={step} index={index} />

                  {index < steps.length - 1 && (
                    <Motion.div
                      initial={{ opacity: 0, scale: 0 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.5 + index * 0.2, duration: 0.6 }}
                      viewport={{ once: true }}
                      className="absolute top-1/2 -right-6 lg:-right-8 transform -translate-y-1/2 z-10"
                    >
                      <Motion.div
                        animate={{ x: [0, 5, 0] }}
                        transition={{ duration: 2, repeat: Infinity, delay: index }}
                        className="w-8 h-8 lg:w-12 lg:h-12 rounded-full bg-card/80 backdrop-blur-xl border border-border/50 flex items-center justify-center shadow-lg"
                      >
                        <ArrowRight className="w-4 h-4 lg:w-6 lg:h-6 text-primary" />
                      </Motion.div>
                    </Motion.div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom CTA Section */}
        <Motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mt-16 lg:mt-20"
        >
          <Motion.div
            className="glass p-8 lg:p-12 max-w-3xl mx-auto"
            whileHover={{
              boxShadow: "0 20px 40px rgba(var(--primary), 0.15)"
            }}
            transition={{ duration: 0.3 }}
          >
            <Motion.h3
              className="text-2xl lg:text-3xl font-bold text-foreground mb-4"
            >
              {t("howItWorks.bottomTitle")}
            </Motion.h3>

            <Motion.p
              className="text-muted-foreground text-lg mb-8 leading-relaxed"
            >
              {t("howItWorks.bottomSubtitle")}
            </Motion.p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  onClick={handleGetStarted}
                  size="lg"
                  className="font-semibold px-8 py-4 text-base"
                >
                  {isAuthenticated ? t("howItWorks.ctaPrimaryAuthed") : t("howItWorks.ctaPrimary")}
                </Button>
              </Motion.div>

              <Motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  onClick={() => navigate(isAuthenticated ? "/app/profile" : "/auth/login")}
                  variant="outline"
                  size="lg"
                  className="font-semibold px-8 py-4 text-base"
                >
                  {isAuthenticated ? t("howItWorks.ctaSecondaryAuthed") : t("howItWorks.ctaSecondary")}
                </Button>
              </Motion.div>
            </div>
          </Motion.div>
        </Motion.div>
      </div>
    </section>
  );
}

function StepCard({ step, index }) {
  const Icon = step.icon;

  return (
    <Motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{
        delay: index * 0.2,
        duration: 0.8,
        type: "spring",
        stiffness: 100
      }}
      viewport={{ once: true }}
      whileHover={{ y: -8 }}
      className="group relative"
    >
      <Motion.div
        className="glass p-8 h-full text-center relative overflow-hidden"
        whileHover={{
          boxShadow: `0 20px 40px rgb(var(--${step.color}) / 0.15)`
        }}
        transition={{ duration: 0.3 }}
      >
        {/* Step Number */}
        <Motion.div
          className="absolute top-4 right-4 w-8 h-8 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-primary text-sm font-bold"
          whileHover={{ rotate: 360 }}
          transition={{ duration: 0.6 }}
        >
          {index + 1}
        </Motion.div>

        {/* Duration Badge */}
        <Motion.div
          className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-muted/50 text-muted-foreground text-xs font-medium mb-6"
        >
          <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
          {step.duration}
        </Motion.div>

        {/* Icon */}
        <Motion.div
          className="mb-6 flex justify-center"
          whileHover={{ rotate: 5, scale: 1.1 }}
          transition={{ duration: 0.2 }}
        >
          <Motion.div
            className={`inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-${step.color}/10 border border-${step.color}/20 group-hover:bg-${step.color}/20 transition-colors duration-300`}
            animate={{
              boxShadow: [
                `0 0 0 rgb(var(--${step.color}) / 0.0)`,
                `0 0 30px rgb(var(--${step.color}) / 0.3)`,
                `0 0 0 rgb(var(--${step.color}) / 0.0)`
              ]
            }}
            transition={{ duration: 3, repeat: Infinity, delay: index * 0.8 }}
          >
            <Icon
              className={`w-10 h-10 text-${step.color} group-hover:scale-110 transition-transform duration-300`}
            />
          </Motion.div>
        </Motion.div>

        {/* Content */}
        <Motion.h3
          className="text-xl lg:text-2xl font-bold text-foreground mb-3 group-hover:text-primary transition-colors duration-300"
        >
          {step.title}
        </Motion.h3>

        <Motion.p
          className="text-muted-foreground font-medium mb-4 text-base lg:text-lg"
        >
          {step.description}
        </Motion.p>

        <Motion.p
          className="text-muted-foreground/80 text-sm lg:text-base leading-relaxed"
        >
          {step.details}
        </Motion.p>

        {/* Decorative Elements */}
        <Motion.div
          className={`absolute -bottom-2 -left-2 w-16 h-16 rounded-full bg-${step.color}/5 blur-xl`}
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.6, 0.3]
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            delay: index * 1.2
          }}
        />
      </Motion.div>
    </Motion.div>
  );
}
