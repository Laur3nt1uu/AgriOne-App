import { motion as Motion } from "framer-motion";
import { Thermometer, Bell, MapPin, DollarSign } from "lucide-react";
import { useLanguage } from "../../i18n/LanguageProvider";
import {
  ScrollReveal,
  TiltCard,
  StaggerContainer,
  StaggerItem,
} from "./ScrollAnimations";

/*  Animated illustrations  */
function MonitoringVisual() {
  return (
    <div className="relative w-full max-w-sm mx-auto">
      <div className="grid grid-cols-2 gap-3">
        {[
          { label: "23.5\u00b0C", color: "primary", w: "70%" },
          { label: "67%", color: "blue-500", w: "55%" },
          { label: "42%", color: "green-500", w: "80%" },
          { label: "1013 hPa", color: "amber-500", w: "45%" },
        ].map((d, i) => (
          <Motion.div
            key={i}
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 + i * 0.1, type: "spring", stiffness: 200 }}
            className="bg-card/60 rounded-xl p-4 border border-border/20 backdrop-blur-sm"
          >
            <div className="text-xs text-muted-foreground mb-2">Sensor {i + 1}</div>
            <div className={`text-lg font-bold text-${d.color}`}>{d.label}</div>
            <div className="mt-2 h-1.5 bg-border/20 rounded-full overflow-hidden">
              <Motion.div
                className={`h-full bg-${d.color}/60 rounded-full`}
                initial={{ width: 0 }}
                whileInView={{ width: d.w }}
                viewport={{ once: true }}
                transition={{ delay: 0.4 + i * 0.1, duration: 1, ease: "easeOut" }}
              />
            </div>
          </Motion.div>
        ))}
      </div>
    </div>
  );
}

function AlertsVisual() {
  const alerts = [
    { text: "Temperatura critica \u2014 38\u00b0C", type: "destructive" },
    { text: "Umiditate sol scazuta \u2014 15%", type: "warn" },
    { text: "Sensor AGRI-002 offline", type: "warn" },
  ];
  return (
    <div className="relative w-full max-w-sm mx-auto space-y-3">
      {alerts.map((a, i) => (
        <Motion.div
          key={i}
          initial={{ opacity: 0, x: 40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 + i * 0.15, type: "spring", stiffness: 120 }}
          className={`flex items-center gap-3 p-4 rounded-xl border backdrop-blur-sm ${
            a.type === "destructive"
              ? "bg-destructive/10 border-destructive/20"
              : "bg-amber-500/10 border-amber-500/20"
          }`}
        >
          <Motion.div
            animate={{ scale: [1, 1.3, 1] }}
            transition={{ duration: 2, repeat: Infinity, delay: i * 0.5 }}
            className={`w-2.5 h-2.5 rounded-full flex-shrink-0 ${
              a.type === "destructive" ? "bg-destructive" : "bg-amber-500"
            }`}
          />
          <span className="text-sm font-medium text-foreground">{a.text}</span>
        </Motion.div>
      ))}
    </div>
  );
}

function MappingVisual() {
  const colors = [
    "bg-green-500/40", "bg-green-600/50", "bg-emerald-500/30",
    "bg-primary/35", "bg-green-400/45", "bg-emerald-600/40",
  ];
  return (
    <div className="relative w-full max-w-sm mx-auto">
      <div className="grid grid-cols-4 grid-rows-3 gap-1.5 aspect-[4/3]">
        {Array.from({ length: 12 }, (_, i) => (
          <Motion.div
            key={i}
            initial={{ opacity: 0, scale: 0 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.15 + i * 0.04, type: "spring", stiffness: 200 }}
            className={`rounded-lg ${colors[i % colors.length]} border border-border/10`}
          />
        ))}
      </div>
    </div>
  );
}

function FinancialVisual() {
  const bars = [35, 55, 42, 68, 51, 78, 62, 85];
  return (
    <div className="relative w-full max-w-sm mx-auto">
      <div className="flex items-end gap-2 h-40">
        {bars.map((h, i) => (
          <Motion.div
            key={i}
            className="flex-1 bg-gradient-to-t from-primary/60 to-primary/20 rounded-t-md"
            initial={{ height: 0 }}
            whileInView={{ height: `${h}%` }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 + i * 0.06, duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
          />
        ))}
      </div>
      <Motion.div
        className="mt-3 h-0.5 bg-gradient-to-r from-transparent via-primary/40 to-transparent"
        initial={{ scaleX: 0 }}
        whileInView={{ scaleX: 1 }}
        viewport={{ once: true }}
        transition={{ delay: 0.7, duration: 0.6 }}
      />
    </div>
  );
}

const VISUALS = [MonitoringVisual, AlertsVisual, MappingVisual, FinancialVisual];

/*  Main Section  */
export default function FeaturesSection() {
  const { t } = useLanguage();

  const features = [
    { icon: Thermometer, title: t("features.monitoring.title"), desc: t("features.monitoring.description"), details: t("features.monitoring.details"), color: "primary" },
    { icon: Bell, title: t("features.alerts.title"), desc: t("features.alerts.description"), details: t("features.alerts.details"), color: "blue-500" },
    { icon: MapPin, title: t("features.mapping.title"), desc: t("features.mapping.description"), details: t("features.mapping.details"), color: "green-500" },
    { icon: DollarSign, title: t("features.financial.title"), desc: t("features.financial.description"), details: t("features.financial.details"), color: "amber-500" },
  ];

  return (
    <section id="features" className="py-24 lg:py-36 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <div className="text-center mb-16 lg:mb-24">
          <ScrollReveal variant="blur-up">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium mb-6">
              <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
              {t("features.badge")}
            </div>
          </ScrollReveal>
          <ScrollReveal variant="blur-up" delay={0.1}>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-foreground mb-6">
              {t("features.title")}{" "}
              <span className="bg-gradient-to-r from-primary to-blue-500 bg-clip-text text-transparent">
                {t("features.titleHighlight")}
              </span>{" "}
              {t("features.titleEnd")}
            </h2>
          </ScrollReveal>
          <ScrollReveal variant="blur-up" delay={0.3}>
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
              {t("features.subtitle")}
            </p>
          </ScrollReveal>
        </div>

        {/* Alternating feature rows */}
        <div className="space-y-20 lg:space-y-32">
          {features.map((f, i) => {
            const Icon = f.icon;
            const Visual = VISUALS[i];
            const isOdd = i % 2 !== 0;

            return (
              <div
                key={i}
                className={`flex flex-col lg:flex-row items-center gap-12 lg:gap-20 ${
                  isOdd ? "lg:flex-row-reverse" : ""
                }`}
              >
                {/* Text */}
                <ScrollReveal
                  variant={isOdd ? "fade-right" : "fade-left"}
                  delay={0.1}
                  className="flex-1 w-full"
                >
                  <Motion.div
                    className={`inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-${f.color}/10 border border-${f.color}/20 mb-6`}
                  >
                    <Icon className={`w-7 h-7 text-${f.color}`} />
                  </Motion.div>
                  <h3 className="text-2xl lg:text-3xl xl:text-4xl font-extrabold text-foreground mb-4 leading-tight">
                    {f.title}
                  </h3>
                  <p className="text-lg text-muted-foreground mb-3 leading-relaxed">
                    {f.desc}
                  </p>
                  <p className="text-base text-muted-foreground/70 leading-relaxed">
                    {f.details}
                  </p>
                </ScrollReveal>

                {/* Visual inside TiltCard */}
                <ScrollReveal
                  variant={isOdd ? "fade-left" : "fade-right"}
                  delay={0.25}
                  className="flex-1 w-full"
                >
                  <TiltCard tiltMax={8} glare className="w-full">
                    <div className="glass p-8 lg:p-10">
                      <Visual />
                    </div>
                  </TiltCard>
                </ScrollReveal>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
