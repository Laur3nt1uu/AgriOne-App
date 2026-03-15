import { motion as Motion } from "framer-motion";
import { Thermometer, Bell, MapPin, DollarSign, ArrowRight } from "lucide-react";
import { useLanguage } from "../../i18n/LanguageProvider";

export default function FeaturesSection() {
  const { t } = useLanguage();

  const features = [
    {
      icon: Thermometer,
      title: t("features.monitoring.title"),
      description: t("features.monitoring.description"),
      details: t("features.monitoring.details"),
      color: "primary"
    },
    {
      icon: Bell,
      title: t("features.alerts.title"),
      description: t("features.alerts.description"),
      details: t("features.alerts.details"),
      color: "blue-500"
    },
    {
      icon: MapPin,
      title: t("features.mapping.title"),
      description: t("features.mapping.description"),
      details: t("features.mapping.details"),
      color: "green-500"
    },
    {
      icon: DollarSign,
      title: t("features.financial.title"),
      description: t("features.financial.description"),
      details: t("features.financial.details"),
      color: "amber-500"
    }
  ];

  return (
    <section id="features" className="py-20 lg:py-32 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 pointer-events-none">
        <Motion.div
          className="absolute top-1/2 left-1/4 w-72 h-72 rounded-full opacity-10 blur-3xl"
          style={{
            background: "radial-gradient(circle, rgb(var(--primary) / 0.3), transparent)"
          }}
          animate={{
            scale: [1, 1.2, 1],
            x: [0, 50, 0]
          }}
          transition={{
            duration: 15,
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
            <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            {t("features.badge")}
          </Motion.div>

          <Motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.8 }}
            viewport={{ once: true }}
            className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-foreground mb-6"
          >
            {t("features.title")}{" "}
            <span className="bg-gradient-to-r from-primary to-blue-500 bg-clip-text text-transparent">
              {t("features.titleHighlight")}
            </span>{" "}
            {t("features.titleEnd")}
          </Motion.h2>

          <Motion.p
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            viewport={{ once: true }}
            className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed"
          >
            {t("features.subtitle")}
          </Motion.p>
        </Motion.div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <Motion.div
                key={index}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{
                  delay: index * 0.1,
                  duration: 0.8,
                  type: "spring",
                  stiffness: 100
                }}
                viewport={{ once: true }}
                whileHover={{ y: -8, scale: 1.02 }}
                className="group relative"
              >
                <Motion.div
                  className="glass p-8 h-full relative overflow-hidden"
                  whileHover={{
                    boxShadow: `0 20px 40px rgb(var(--${feature.color}) / 0.15)`
                  }}
                  transition={{ duration: 0.3 }}
                >
                  <Motion.div
                    className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                    style={{
                      background: `linear-gradient(135deg, rgb(var(--${feature.color}) / 0.1), transparent, rgb(var(--${feature.color}) / 0.05))`
                    }}
                  />

                  <Motion.div
                    className="absolute inset-0 opacity-0 group-hover:opacity-100"
                    animate={{ x: ["-100%", "200%"] }}
                    transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                    style={{
                      background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent)",
                      width: "50%"
                    }}
                  />

                  <div className="relative z-10">
                    <Motion.div
                      className="mb-6"
                      whileHover={{ rotate: 5 }}
                      transition={{ duration: 0.2 }}
                    >
                      <Motion.div
                        className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-${feature.color}/10 border border-${feature.color}/20 group-hover:bg-${feature.color}/20 transition-colors duration-300`}
                        animate={{
                          boxShadow: [
                            `0 0 0 rgb(var(--${feature.color}) / 0.0)`,
                            `0 0 20px rgb(var(--${feature.color}) / 0.3)`,
                            `0 0 0 rgb(var(--${feature.color}) / 0.0)`
                          ]
                        }}
                        transition={{ duration: 3, repeat: Infinity, delay: index * 0.5 }}
                      >
                        <Icon
                          className={`w-8 h-8 text-${feature.color} group-hover:scale-110 transition-transform duration-300`}
                        />
                      </Motion.div>
                    </Motion.div>

                    <Motion.h3
                      className="text-xl lg:text-2xl font-bold text-foreground mb-4 group-hover:text-primary transition-colors duration-300"
                      whileHover={{ x: 5 }}
                      transition={{ duration: 0.2 }}
                    >
                      {feature.title}
                    </Motion.h3>

                    <Motion.p
                      className="text-muted-foreground font-medium mb-4 text-base lg:text-lg"
                      whileHover={{ x: 5 }}
                      transition={{ duration: 0.2, delay: 0.05 }}
                    >
                      {feature.description}
                    </Motion.p>

                    <Motion.p
                      className="text-muted-foreground/80 text-sm lg:text-base leading-relaxed mb-6"
                      whileHover={{ x: 5 }}
                      transition={{ duration: 0.2, delay: 0.1 }}
                    >
                      {feature.details}
                    </Motion.p>

                    <Motion.div
                      className="flex items-center text-primary font-medium group-hover:text-primary/80 transition-colors cursor-pointer"
                      whileHover={{ x: 5 }}
                      transition={{ duration: 0.2 }}
                    >
                      <span className="text-sm lg:text-base">{t("features.learnMore")}</span>
                      <Motion.div
                        animate={{ x: [0, 5, 0] }}
                        transition={{ duration: 1.5, repeat: Infinity }}
                        className="ml-2"
                      >
                        <ArrowRight className="w-4 h-4" />
                      </Motion.div>
                    </Motion.div>
                  </div>

                  <Motion.div
                    className={`absolute -top-2 -right-2 w-20 h-20 rounded-full bg-${feature.color}/5 blur-xl`}
                    animate={{
                      scale: [1, 1.2, 1],
                      opacity: [0.5, 0.8, 0.5]
                    }}
                    transition={{
                      duration: 4,
                      repeat: Infinity,
                      delay: index * 0.8
                    }}
                  />
                </Motion.div>
              </Motion.div>
            );
          })}
        </div>

        {/* Bottom CTA */}
        <Motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mt-16 lg:mt-20"
        >
          <Motion.p className="text-muted-foreground text-lg mb-6">
            {t("features.bottomCta")}
          </Motion.p>

          <Motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-primary to-blue-500 text-white font-semibold rounded-xl hover:shadow-xl transition-shadow duration-300"
            onClick={() => {
              const element = document.querySelector("#how-it-works");
              if (element) {
                element.scrollIntoView({ behavior: "smooth" });
              }
            }}
          >
            {t("features.seeHowItWorks")}
            <Motion.div
              animate={{ x: [0, 5, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              <ArrowRight className="w-5 h-5" />
            </Motion.div>
          </Motion.button>
        </Motion.div>
      </div>
    </section>
  );
}
