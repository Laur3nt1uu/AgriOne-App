import { useNavigate } from "react-router-dom";
import { motion as Motion, useScroll, useTransform } from "framer-motion";
import { ArrowRight, ChevronDown, Sprout } from "lucide-react";
import { useRef } from "react";
import { authStore } from "../../auth/auth.store";
import { useLanguage } from "../../i18n/LanguageProvider";
import { Button } from "../../ui/button";
import {
  Parallax,
  CountUp,
  MagneticWrapper,
  FloatingParticles,
} from "./ScrollAnimations";

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
    document.querySelector("#features")?.scrollIntoView({ behavior: "smooth" });
  };

  /* scroll-linked hero parallax fade-out */
  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });
  const heroOpacity = useTransform(scrollYProgress, [0, 0.55], [1, 0]);
  const heroScale = useTransform(scrollYProgress, [0, 0.55], [1, 0.92]);
  const heroY = useTransform(scrollYProgress, [0, 0.55], [0, 120]);

  return (
    <section
      ref={heroRef}
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
    >
      {/* ── Gradient mesh background ── */}
      <div className="absolute inset-0 pointer-events-none">
        <Parallax speed={-0.12}>
          <div
            className="absolute -top-[20%] -left-[10%] w-[550px] h-[550px] rounded-full opacity-25 blur-[120px]"
            style={{
              background: "rgb(var(--primary) / 0.6)",
              animation: "gradientFloat 18s ease-in-out infinite",
            }}
          />
        </Parallax>
        <Parallax speed={0.08}>
          <div
            className="absolute top-[15%] -right-[8%] w-[480px] h-[480px] rounded-full opacity-20 blur-[100px]"
            style={{
              background: "rgb(59 130 246 / 0.5)",
              animation: "gradientFloat 22s ease-in-out 3s infinite",
            }}
          />
        </Parallax>
        <Parallax speed={-0.06}>
          <div
            className="absolute -bottom-[15%] left-[25%] w-[400px] h-[400px] rounded-full opacity-15 blur-[110px]"
            style={{
              background: "rgb(var(--primary) / 0.35)",
              animation: "gradientFloat 20s ease-in-out 6s infinite",
            }}
          />
        </Parallax>
      </div>

      {/* ── Floating particles ── */}
      <FloatingParticles count={30} />

      {/* ── Subtle grid overlay ── */}
      <div
        className="absolute inset-0 opacity-[0.025] pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.08) 1px, transparent 1px)",
          backgroundSize: "80px 80px",
        }}
      />

      {/* ── Main content ── */}
      <Motion.div
        style={{ opacity: heroOpacity, scale: heroScale, y: heroY }}
        className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center"
      >
        {/* Badge */}
        <Motion.div
          initial={{ opacity: 0, y: 20, filter: "blur(10px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{ delay: 0.15, duration: 0.8 }}
          className="inline-flex items-center gap-2.5 px-5 py-2.5 rounded-full bg-primary/8 border border-primary/15 text-primary text-sm font-medium mb-10 backdrop-blur-sm"
        >
          <Sprout className="w-4 h-4" />
          {t("hero.badge")}
        </Motion.div>

        {/* Headline — large, centered, word reveal */}
        <Motion.h1
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-extrabold text-foreground mb-8 leading-[1.05] tracking-tight"
        >
          <Motion.span
            initial={{ opacity: 0, y: 20, filter: "blur(8px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            transition={{ delay: 0.35, duration: 0.8 }}
          >
            {t("hero.headline")}
          </Motion.span>{" "}
          <Motion.span
            initial={{ opacity: 0, scale: 0.85, filter: "blur(14px)" }}
            animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
            transition={{
              delay: 0.85,
              duration: 1,
              ease: [0.25, 0.46, 0.45, 0.94],
            }}
            className="bg-gradient-to-r from-primary via-emerald-400 to-blue-500 bg-clip-text text-transparent"
          >
            {t("hero.headlineHighlight")}
          </Motion.span>
        </Motion.h1>

        {/* Subheadline */}
        <Motion.p
          initial={{ opacity: 0, y: 30, filter: "blur(8px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{ delay: 0.6, duration: 0.8 }}
          className="text-lg md:text-xl lg:text-2xl text-muted-foreground mb-14 leading-relaxed max-w-3xl mx-auto"
        >
          {t("hero.subheadline")}
        </Motion.p>

        {/* CTA buttons — magnetic */}
        <Motion.div
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.75, duration: 0.8 }}
          className="flex flex-col sm:flex-row gap-5 justify-center mb-20"
        >
          <MagneticWrapper strength={0.15}>
            <Button
              onClick={handleAccessPlatform}
              size="lg"
              className="font-semibold px-10 py-5 text-base rounded-full relative group overflow-hidden shadow-lg shadow-primary/20 hover:shadow-primary/40 transition-shadow duration-500"
            >
              <Motion.div className="absolute inset-0 bg-gradient-to-r from-primary to-emerald-500 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <span className="relative z-10 flex items-center gap-2">
                {isAuthenticated
                  ? t("hero.ctaPrimaryAuthed")
                  : t("hero.ctaPrimary")}
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </span>
            </Button>
          </MagneticWrapper>

          <MagneticWrapper strength={0.15}>
            <Button
              onClick={handleLearnMore}
              variant="outline"
              size="lg"
              className="font-semibold px-10 py-5 text-base rounded-full border-border/30 backdrop-blur-sm hover:bg-card/40 transition-colors duration-300"
            >
              {t("hero.ctaSecondary")}
            </Button>
          </MagneticWrapper>
        </Motion.div>

        {/* Stats — CountUp */}
        <Motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 0.8 }}
          className="grid grid-cols-3 gap-8 max-w-2xl mx-auto"
        >
          {[
            { value: 30, suffix: "+", label: t("hero.stats.farms") },
            { value: 120, suffix: "+", label: t("hero.stats.sensors") },
            { value: 99.2, suffix: "%", label: t("hero.stats.uptime") },
          ].map((stat, i) => (
            <Motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                delay: 1.1 + i * 0.12,
                duration: 0.6,
                type: "spring",
                stiffness: 120,
              }}
              className="text-center"
            >
              <div className="text-3xl lg:text-4xl font-bold text-foreground mb-1">
                <CountUp target={stat.value} suffix={stat.suffix} />
              </div>
              <div className="text-sm text-muted-foreground tracking-wide">
                {stat.label}
              </div>
            </Motion.div>
          ))}
        </Motion.div>
      </Motion.div>

      {/* ── Scroll indicator ── */}
      <Motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.6, duration: 0.8 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
      >
        <Motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="flex flex-col items-center text-muted-foreground/50 cursor-pointer hover:text-muted-foreground/80 transition-colors"
          onClick={handleLearnMore}
        >
          <span className="text-xs uppercase tracking-[0.2em] mb-2">
            {t("hero.scrollToExplore")}
          </span>
          <ChevronDown className="w-5 h-5" />
        </Motion.div>
      </Motion.div>
    </section>
  );
}
