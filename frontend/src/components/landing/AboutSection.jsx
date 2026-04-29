import { motion as Motion } from "framer-motion";
import { Heart, Lightbulb, Users, Zap, Target, Eye } from "lucide-react";
import { useLanguage } from "../../i18n/LanguageProvider";
import { ScrollReveal, Parallax, StaggerContainer, StaggerItem, TiltCard } from "./ScrollAnimations";

const valueIcons = {
  accessibility: Heart,
  simplicity: Lightbulb,
  innovation: Zap,
  community: Users,
};

const valueColors = ["primary", "blue-500", "green-500", "amber-500"];

export default function AboutSection() {
  const { t } = useLanguage();
  const values = ["accessibility", "simplicity", "innovation", "community"];

  return (
    <section id="about" className="py-24 lg:py-36 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 pointer-events-none">
        <Parallax speed={0.1}>
          <Motion.div
            className="absolute bottom-1/3 left-1/4 w-80 h-80 rounded-full opacity-10 blur-3xl"
            style={{ background: "radial-gradient(circle, rgb(var(--primary) / 0.3), transparent)" }}
            animate={{ scale: [1, 1.2, 1], y: [0, 30, 0] }}
            transition={{ duration: 16, repeat: Infinity, ease: "easeInOut" }}
          />
        </Parallax>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <div className="text-center mb-16 lg:mb-20">
          <ScrollReveal variant="blur-up">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium mb-6">
              <Heart className="w-4 h-4" />
              {t("about.badge")}
            </div>
          </ScrollReveal>

          <ScrollReveal variant="blur-up" delay={0.1}>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-foreground mb-6">
              {t("about.title")}{" "}
              <span className="bg-gradient-to-r from-primary to-blue-500 bg-clip-text text-transparent">
                {t("about.titleHighlight")}
              </span>
            </h2>
          </ScrollReveal>

          <ScrollReveal variant="blur-up" delay={0.3}>
            <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              {t("about.subtitle")}
            </p>
          </ScrollReveal>
        </div>

        {/* Mission & Vision */}
        <div className="grid lg:grid-cols-2 gap-8 mb-16">
          <ScrollReveal variant="fade-left">
            <TiltCard tiltMax={6} glare className="h-full">
              <div className="glass p-8 h-full relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent pointer-events-none" />
                <div className="relative z-10">
                  <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-primary/10 border border-primary/20 mb-6">
                    <Target className="w-7 h-7 text-primary" />
                  </div>
                  <h3 className="text-xl font-bold text-foreground mb-3">{t("about.mission.label")}</h3>
                  <p className="text-muted-foreground leading-relaxed">{t("about.mission.text")}</p>
                </div>
              </div>
            </TiltCard>
          </ScrollReveal>

          <ScrollReveal variant="fade-right" delay={0.15}>
            <TiltCard tiltMax={6} glare className="h-full">
              <div className="glass p-8 h-full relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-transparent to-transparent pointer-events-none" />
                <div className="relative z-10">
                  <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-blue-500/10 border border-blue-500/20 mb-6">
                    <Eye className="w-7 h-7 text-blue-500" />
                  </div>
                  <h3 className="text-xl font-bold text-foreground mb-3">{t("about.vision.label")}</h3>
                  <p className="text-muted-foreground leading-relaxed">{t("about.vision.text")}</p>
                </div>
              </div>
            </TiltCard>
          </ScrollReveal>
        </div>

        {/* Values */}
        <StaggerContainer stagger={0.1} className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {values.map((key, index) => {
            const Icon = valueIcons[key];
            const color = valueColors[index];
            return (
              <StaggerItem key={key} variant="blur-up">
                <TiltCard tiltMax={10} glare className="h-full">
                  <div className="glass p-6 h-full text-center">
                    <Motion.div
                      className={`inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-${color}/10 border border-${color}/20 mb-4`}
                      animate={{
                        boxShadow: [
                          "0 0 0 rgba(34,197,94,0)",
                          "0 0 20px rgba(34,197,94,0.2)",
                          "0 0 0 rgba(34,197,94,0)",
                        ],
                      }}
                      transition={{ duration: 3, repeat: Infinity, delay: index * 0.6 }}
                    >
                      <Icon className={`w-7 h-7 text-${color}`} />
                    </Motion.div>
                    <h4 className="text-lg font-bold text-foreground mb-2">
                      {t(`about.values.${key}.title`)}
                    </h4>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {t(`about.values.${key}.description`)}
                    </p>
                  </div>
                </TiltCard>
              </StaggerItem>
            );
          })}
        </StaggerContainer>
      </div>
    </section>
  );
}
