import { motion as Motion } from "framer-motion";
import { Heart, Lightbulb, Users, Zap, Target, Eye, GraduationCap } from "lucide-react";
import { useLanguage } from "../../i18n/LanguageProvider";

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
    <section id="about" className="py-20 lg:py-32 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 pointer-events-none">
        <Motion.div
          className="absolute bottom-1/3 left-1/4 w-80 h-80 rounded-full opacity-10 blur-3xl"
          style={{ background: "radial-gradient(circle, rgb(var(--primary) / 0.3), transparent)" }}
          animate={{ scale: [1, 1.2, 1], y: [0, 30, 0] }}
          transition={{ duration: 16, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <Motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <Motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium mb-6"
          >
            <Heart className="w-4 h-4" />
            {t("about.badge")}
          </Motion.div>

          <Motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.8 }}
            viewport={{ once: true }}
            className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-foreground mb-6"
          >
            {t("about.title")}{" "}
            <span className="bg-gradient-to-r from-primary to-blue-500 bg-clip-text text-transparent">
              {t("about.titleHighlight")}
            </span>
          </Motion.h2>

          <Motion.p
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            viewport={{ once: true }}
            className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed"
          >
            {t("about.subtitle")}
          </Motion.p>
        </Motion.div>

        {/* Mission & Vision */}
        <div className="grid lg:grid-cols-2 gap-8 mb-16">
          {/* Mission */}
          <Motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            whileHover={{ y: -4 }}
          >
            <Motion.div
              className="glass p-8 h-full relative overflow-hidden"
              whileHover={{ boxShadow: "0 20px 40px rgb(var(--primary) / 0.12)" }}
              transition={{ duration: 0.3 }}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent pointer-events-none" />
              <div className="relative z-10">
                <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-primary/10 border border-primary/20 mb-6">
                  <Target className="w-7 h-7 text-primary" />
                </div>
                <h3 className="text-xl font-bold text-foreground mb-3">{t("about.mission.label")}</h3>
                <p className="text-muted-foreground leading-relaxed">{t("about.mission.text")}</p>
              </div>
            </Motion.div>
          </Motion.div>

          {/* Vision */}
          <Motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            whileHover={{ y: -4 }}
          >
            <Motion.div
              className="glass p-8 h-full relative overflow-hidden"
              whileHover={{ boxShadow: "0 20px 40px rgb(var(--blue-500) / 0.12)" }}
              transition={{ duration: 0.3 }}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-transparent to-transparent pointer-events-none" />
              <div className="relative z-10">
                <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-blue-500/10 border border-blue-500/20 mb-6">
                  <Eye className="w-7 h-7 text-blue-500" />
                </div>
                <h3 className="text-xl font-bold text-foreground mb-3">{t("about.vision.label")}</h3>
                <p className="text-muted-foreground leading-relaxed">{t("about.vision.text")}</p>
              </div>
            </Motion.div>
          </Motion.div>
        </div>

        {/* Thesis Badge */}
        <Motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          viewport={{ once: true }}
          className="mb-16"
        >
          <Motion.div
            className="glass p-8 max-w-3xl mx-auto text-center relative overflow-hidden"
            whileHover={{ boxShadow: "0 20px 40px rgb(var(--primary) / 0.1)" }}
            transition={{ duration: 0.3 }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-blue-500/5 to-primary/5 pointer-events-none" />
            <div className="relative z-10">
              <Motion.div
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-500 text-sm font-medium mb-4"
                animate={{
                  boxShadow: [
                    "0 0 0 rgba(245, 158, 11, 0.0)",
                    "0 0 20px rgba(245, 158, 11, 0.15)",
                    "0 0 0 rgba(245, 158, 11, 0.0)"
                  ]
                }}
                transition={{ duration: 3, repeat: Infinity }}
              >
                <GraduationCap className="w-4 h-4" />
                {t("about.thesisBadge")}
              </Motion.div>
              <p className="text-muted-foreground leading-relaxed">{t("about.thesisText")}</p>
            </div>
          </Motion.div>
        </Motion.div>

        {/* Values */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {values.map((key, index) => {
            const Icon = valueIcons[key];
            const color = valueColors[index];
            return (
              <Motion.div
                key={key}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.6, type: "spring", stiffness: 100 }}
                viewport={{ once: true }}
                whileHover={{ y: -6 }}
                className="group"
              >
                <Motion.div
                  className="glass p-6 h-full text-center relative overflow-hidden"
                  whileHover={{ boxShadow: `0 20px 40px rgb(var(--${color}) / 0.12)` }}
                  transition={{ duration: 0.3 }}
                >
                  <Motion.div
                    className={`inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-${color}/10 border border-${color}/20 mb-4 group-hover:bg-${color}/20 transition-colors`}
                    animate={{
                      boxShadow: [
                        `0 0 0 rgb(var(--${color}) / 0.0)`,
                        `0 0 20px rgb(var(--${color}) / 0.2)`,
                        `0 0 0 rgb(var(--${color}) / 0.0)`
                      ]
                    }}
                    transition={{ duration: 3, repeat: Infinity, delay: index * 0.6 }}
                  >
                    <Icon className={`w-7 h-7 text-${color}`} />
                  </Motion.div>
                  <h4 className="text-lg font-bold text-foreground mb-2 group-hover:text-primary transition-colors">
                    {t(`about.values.${key}.title`)}
                  </h4>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {t(`about.values.${key}.description`)}
                  </p>
                </Motion.div>
              </Motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
