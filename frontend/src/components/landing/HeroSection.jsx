import { useNavigate } from "react-router-dom";
import { motion as Motion } from "framer-motion";
import { ArrowRight, Play, ChevronDown } from "lucide-react";
import { authStore } from "../../auth/auth.store";
import { useLanguage } from "../../i18n/LanguageProvider";
import { Button } from "../../ui/button";

export default function HeroSection() {
  const navigate = useNavigate();
  const isAuthenticated = authStore.isAuthed();
  const { t } = useLanguage();

  const handleAccessPlatform = () => {
    if (isAuthenticated) {
      navigate("/app/dashboard");
    } else {
      navigate("/auth/login", { state: { from: { pathname: "/app/dashboard" } } });
    }
  };

  const handleLearnMore = () => {
    const featuresElement = document.querySelector("#features");
    if (featuresElement) {
      featuresElement.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 pointer-events-none">
        <Motion.div
          className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full opacity-20 blur-3xl"
          style={{
            background: "radial-gradient(circle, rgb(var(--primary) / 0.4), transparent)"
          }}
          animate={{
            scale: [1, 1.3, 1],
            x: [0, 100, 0],
            y: [0, -50, 0]
          }}
          transition={{
            duration: 12,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />

        <Motion.div
          className="absolute top-1/3 right-1/4 w-80 h-80 rounded-full opacity-15 blur-3xl"
          style={{
            background: "radial-gradient(circle, rgb(var(--blue-500) / 0.4), transparent)"
          }}
          animate={{
            scale: [1, 1.2, 1],
            x: [0, -80, 0],
            y: [0, 60, 0]
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 2
          }}
        />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Content */}
          <Motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center lg:text-left"
          >
            {/* Badge */}
            <Motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium mb-6"
            >
              <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
              {t("hero.badge")}
            </Motion.div>

            {/* Headline */}
            <Motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.8 }}
              className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-foreground mb-6 leading-tight"
            >
              {t("hero.headline")}{" "}
              <span className="bg-gradient-to-r from-primary via-primary to-blue-500 bg-clip-text text-transparent">
                {t("hero.headlineHighlight")}
              </span>
            </Motion.h1>

            {/* Subheadline */}
            <Motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.8 }}
              className="text-lg md:text-xl text-muted-foreground mb-8 leading-relaxed max-w-2xl lg:max-w-none"
            >
              {t("hero.subheadline")}
            </Motion.p>

            {/* CTAs */}
            <Motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.8 }}
              className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start"
            >
              <Motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  onClick={handleAccessPlatform}
                  size="lg"
                  className="font-semibold px-8 py-4 text-base relative group overflow-hidden"
                >
                  <Motion.div
                    className="absolute inset-0 bg-gradient-to-r from-primary to-blue-500 opacity-0 group-hover:opacity-100 transition-opacity"
                  />
                  <span className="relative z-10 flex items-center gap-2">
                    {isAuthenticated ? t("hero.ctaPrimaryAuthed") : t("hero.ctaPrimary")}
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
                  onClick={handleLearnMore}
                  variant="outline"
                  size="lg"
                  className="font-semibold px-8 py-4 text-base relative group"
                >
                  <span className="flex items-center gap-2">
                    <Play className="w-5 h-5" />
                    {t("hero.ctaSecondary")}
                  </span>
                </Button>
              </Motion.div>
            </Motion.div>

            {/* Stats */}
            <Motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.8 }}
              className="mt-12 grid grid-cols-3 gap-6 lg:gap-8"
            >
              {[
                { value: "30+", label: t("hero.stats.farms") },
                { value: "120+", label: t("hero.stats.sensors") },
                { value: "99.2%", label: t("hero.stats.uptime") }
              ].map((stat, index) => (
                <Motion.div
                  key={stat.label}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.7 + index * 0.1, duration: 0.6 }}
                  className="text-center"
                >
                  <div className="text-2xl lg:text-3xl font-bold text-foreground mb-1">
                    {stat.value}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {stat.label}
                  </div>
                </Motion.div>
              ))}
            </Motion.div>
          </Motion.div>

          {/* Visual */}
          <Motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative"
          >
            <Motion.div
              className="relative rounded-2xl bg-card/60 border border-border/50 backdrop-blur-xl p-6 shadow-2xl"
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.3 }}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-transparent to-blue-500/20 rounded-2xl" />

              <div className="relative z-10 space-y-4">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center">
                      <div className="w-4 h-4 rounded bg-primary" />
                    </div>
                    <div>
                      <div className="w-20 h-3 bg-foreground/20 rounded mb-1" />
                      <div className="w-16 h-2 bg-muted-foreground/30 rounded" />
                    </div>
                  </div>
                  <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  {[1, 2, 3, 4].map((i) => (
                    <Motion.div
                      key={i}
                      className="bg-background/40 rounded-xl p-3 border border-border/30"
                      animate={{
                        boxShadow: [
                          "0 0 0 rgba(34, 197, 94, 0.0)",
                          "0 0 20px rgba(34, 197, 94, 0.1)",
                          "0 0 0 rgba(34, 197, 94, 0.0)",
                        ]
                      }}
                      transition={{ duration: 3, repeat: Infinity, delay: i * 0.5 }}
                    >
                      <div className="w-full h-2 bg-muted-foreground/20 rounded mb-2" />
                      <div className="w-3/4 h-1 bg-primary/40 rounded" />
                    </Motion.div>
                  ))}
                </div>
              </div>
            </Motion.div>

            <Motion.div
              className="absolute -top-4 -right-4 w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center"
              animate={{
                y: [0, -10, 0],
                rotate: [0, 180, 360]
              }}
              transition={{ duration: 6, repeat: Infinity }}
            >
              <div className="w-6 h-6 rounded-full bg-primary" />
            </Motion.div>

            <Motion.div
              className="absolute -bottom-4 -left-4 w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center"
              animate={{
                y: [0, 10, 0],
                x: [0, 5, 0]
              }}
              transition={{ duration: 4, repeat: Infinity, delay: 1 }}
            >
              <div className="w-4 h-4 rounded-full bg-blue-500" />
            </Motion.div>
          </Motion.div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <Motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 0.8 }}
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
      >
        <Motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="flex flex-col items-center text-muted-foreground cursor-pointer"
          onClick={handleLearnMore}
        >
          <span className="text-sm mb-2">{t("hero.scrollToExplore")}</span>
          <ChevronDown className="w-5 h-5" />
        </Motion.div>
      </Motion.div>
    </section>
  );
}
