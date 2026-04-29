import { motion as Motion } from "framer-motion";
import { Star, Quote } from "lucide-react";
import { useLanguage } from "../../i18n/LanguageProvider";
import { ScrollReveal, Parallax, StaggerContainer, StaggerItem, TiltCard, CountUp } from "./ScrollAnimations";

function getInitials(name) {
  return name.split(" ").map((n) => n[0]).join("").toUpperCase();
}

const avatarColors = [
  "from-primary to-blue-500",
  "from-blue-500 to-purple-500",
  "from-green-500 to-primary",
  "from-amber-500 to-orange-500",
];

export default function TestimonialsSection() {
  const { t } = useLanguage();
  const testimonials = t("testimonials.items");

  return (
    <section className="py-24 lg:py-36 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 pointer-events-none">
        <Parallax speed={-0.1}>
          <Motion.div
            className="absolute top-1/4 right-1/4 w-80 h-80 rounded-full opacity-10 blur-3xl"
            style={{ background: "radial-gradient(circle, rgb(var(--primary) / 0.3), transparent)" }}
            animate={{ scale: [1, 1.3, 1], y: [0, -40, 0] }}
            transition={{ duration: 16, repeat: Infinity, ease: "easeInOut" }}
          />
        </Parallax>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <div className="text-center mb-16 lg:mb-20">
          <ScrollReveal variant="blur-up">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium mb-6">
              <Star className="w-4 h-4 fill-primary" />
              {t("testimonials.badge")}
            </div>
          </ScrollReveal>

          <ScrollReveal variant="blur-up" delay={0.1}>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-foreground mb-6">
              {t("testimonials.title")}{" "}
              <span className="bg-gradient-to-r from-primary to-blue-500 bg-clip-text text-transparent">
                {t("testimonials.titleHighlight")}
              </span>
            </h2>
          </ScrollReveal>

          <ScrollReveal variant="blur-up" delay={0.3}>
            <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              {t("testimonials.subtitle")}
            </p>
          </ScrollReveal>
        </div>

        {/* Testimonials Grid */}
        <StaggerContainer stagger={0.1} className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {Array.isArray(testimonials) &&
            testimonials.map((item, index) => (
              <StaggerItem key={index} variant="blur-up">
                <TiltCard tiltMax={8} glare className="h-full">
                  <div className="glass p-6 h-full flex flex-col">
                    <Quote className="w-8 h-8 text-primary/20 mb-4" />
                    <div className="flex gap-1 mb-4">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star key={star} className="w-4 h-4 fill-amber-400 text-amber-400" />
                      ))}
                    </div>
                    <p className="text-muted-foreground text-sm leading-relaxed mb-6 flex-1">
                      &ldquo;{item.quote}&rdquo;
                    </p>
                    <div className="flex items-center gap-3 mt-auto">
                      <div
                        className={`w-10 h-10 rounded-full bg-gradient-to-br ${avatarColors[index % avatarColors.length]} flex items-center justify-center text-white text-sm font-bold`}
                      >
                        {getInitials(item.name)}
                      </div>
                      <div>
                        <div className="text-sm font-semibold text-foreground">{item.name}</div>
                        <div className="text-xs text-muted-foreground">{item.farm}</div>
                      </div>
                    </div>
                  </div>
                </TiltCard>
              </StaggerItem>
            ))}
        </StaggerContainer>

        {/* Trust Stats */}
        <ScrollReveal variant="blur-up" delay={0.4}>
          <div className="mt-16 flex flex-col sm:flex-row items-center justify-center gap-8 sm:gap-16">
            {[
              { value: 30, suffix: "+", label: t("testimonials.trustStats.farms") },
              { value: 48, suffix: "/5", prefix: "", label: t("testimonials.trustStats.rating"), raw: "4.8/5" },
              { value: 95, suffix: "%", label: t("testimonials.trustStats.satisfaction") },
            ].map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-2xl lg:text-3xl font-bold text-foreground">
                  {stat.raw ? stat.raw : <CountUp target={stat.value} suffix={stat.suffix} />}
                </div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
