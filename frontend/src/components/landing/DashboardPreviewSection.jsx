import { motion as Motion } from "framer-motion";
import { Monitor, Activity, BarChart3, Bell, Leaf, Droplets, Thermometer, Wind } from "lucide-react";
import { useLanguage } from "../../i18n/LanguageProvider";
import { ScrollReveal, Parallax, CountUp, TiltCard } from "./ScrollAnimations";

export default function DashboardPreviewSection() {
  const { t } = useLanguage();

  const kpis = [
    { value: 30, suffix: "+", label: t("dashboardPreview.kpis.farms"), icon: Leaf, color: "primary" },
    { value: 120, suffix: "+", label: t("dashboardPreview.kpis.sensors"), icon: Activity, color: "blue-500" },
    { value: 850, suffix: "+", label: t("dashboardPreview.kpis.alerts"), icon: Bell, color: "amber-500" },
    { value: 99, suffix: "%", label: t("dashboardPreview.kpis.uptime"), icon: Monitor, color: "green-500" },
  ];

  return (
    <section className="py-24 lg:py-36 bg-card/20 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 pointer-events-none">
        <Parallax speed={-0.12}>
          <Motion.div
            className="absolute top-1/3 left-1/3 w-96 h-96 rounded-full opacity-10 blur-3xl"
            style={{ background: "radial-gradient(circle, rgb(var(--primary) / 0.3), transparent)" }}
            animate={{ scale: [1, 1.2, 1], x: [0, 40, 0] }}
            transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
          />
        </Parallax>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <div className="text-center mb-16 lg:mb-20">
          <ScrollReveal variant="blur-up">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium mb-6">
              <BarChart3 className="w-4 h-4" />
              {t("dashboardPreview.badge")}
            </div>
          </ScrollReveal>

          <ScrollReveal variant="blur-up" delay={0.1}>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-foreground mb-6">
              {t("dashboardPreview.title")}{" "}
              <span className="bg-gradient-to-r from-primary to-blue-500 bg-clip-text text-transparent">
                {t("dashboardPreview.titleHighlight")}
              </span>
            </h2>
          </ScrollReveal>

          <ScrollReveal variant="blur-up" delay={0.3}>
            <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              {t("dashboardPreview.subtitle")}
            </p>
          </ScrollReveal>
        </div>

        {/* KPI Counters with TiltCard */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
          {kpis.map((kpi, index) => {
            const Icon = kpi.icon;
            return (
              <ScrollReveal key={index} variant="blur-up" delay={index * 0.1}>
                <TiltCard tiltMax={10} glare className="h-full">
                  <div className="glass p-6 text-center h-full">
                    <Motion.div
                      className={`inline-flex items-center justify-center w-12 h-12 rounded-xl bg-${kpi.color}/10 border border-${kpi.color}/20 mb-4`}
                      animate={{
                        boxShadow: [
                          "0 0 0 rgba(34,197,94,0)",
                          "0 0 20px rgba(34,197,94,0.2)",
                          "0 0 0 rgba(34,197,94,0)",
                        ],
                      }}
                      transition={{ duration: 3, repeat: Infinity, delay: index * 0.5 }}
                    >
                      <Icon className={`w-6 h-6 text-${kpi.color}`} />
                    </Motion.div>
                    <div className="text-3xl lg:text-4xl font-bold text-foreground mb-2">
                      <CountUp target={kpi.value} suffix={kpi.suffix} />
                    </div>
                    <div className="text-sm text-muted-foreground font-medium">{kpi.label}</div>
                  </div>
                </TiltCard>
              </ScrollReveal>
            );
          })}
        </div>

        {/* Mock Dashboard */}
        <ScrollReveal variant="fade-up" delay={0.2} className="max-w-5xl mx-auto">
          <TiltCard tiltMax={4} className="w-full">
            <Motion.div
              className="glass p-0 overflow-hidden"
              whileHover={{ boxShadow: "0 30px 60px rgba(34,197,94,0.12)" }}
              transition={{ duration: 0.3 }}
            >
              {/* Mock Header Bar */}
              <div className="flex items-center gap-3 px-6 py-4 border-b border-border/30 bg-card/60">
                <div className="flex gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-400" />
                  <div className="w-3 h-3 rounded-full bg-amber-400" />
                  <div className="w-3 h-3 rounded-full bg-green-400" />
                </div>
                <div className="flex-1 flex items-center justify-center">
                  <div className="px-4 py-1.5 rounded-lg bg-background/50 border border-border/30 text-xs text-muted-foreground font-mono">
                    app.agrione.io/{t("dashboardPreview.mockLabels.dashboard").toLowerCase()}
                  </div>
                </div>
                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              </div>

              <div className="flex">
                {/* Mini Sidebar */}
                <div className="hidden md:flex flex-col w-48 border-r border-border/30 bg-card/40 p-4 gap-3">
                  <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-primary/10 border border-primary/20 text-primary text-sm font-medium">
                    <BarChart3 className="w-4 h-4" />
                    {t("dashboardPreview.mockLabels.overview")}
                  </div>
                  {[t("dashboardPreview.mockLabels.liveData"), t("dashboardPreview.mockLabels.alerts")].map((label) => (
                    <div key={label} className="flex items-center gap-2 px-3 py-2 rounded-lg text-muted-foreground text-sm">
                      <div className="w-4 h-4 rounded bg-muted/30" />
                      {label}
                    </div>
                  ))}
                </div>

                {/* Main Content */}
                <div className="flex-1 p-6 space-y-6">
                  {/* Cards Row */}
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    {[
                      { label: t("dashboardPreview.mockLabels.soilMoisture"), value: "67%", icon: Droplets, color: "blue-500", trend: "+3%" },
                      { label: t("dashboardPreview.mockLabels.temperature"), value: "24\u00b0C", icon: Thermometer, color: "amber-500", trend: "-1\u00b0C" },
                      { label: t("dashboardPreview.mockLabels.humidity"), value: "45%", icon: Wind, color: "green-500", trend: "+5%" },
                      { label: t("dashboardPreview.mockLabels.alerts"), value: "3", icon: Bell, color: "red-500", trend: "Active" },
                    ].map((card, i) => {
                      const CardIcon = card.icon;
                      return (
                        <Motion.div
                          key={i}
                          className="bg-background/40 rounded-xl p-4 border border-border/30"
                          animate={{
                            boxShadow: [
                              "0 0 0 rgba(34,197,94,0)",
                              "0 0 15px rgba(34,197,94,0.08)",
                              "0 0 0 rgba(34,197,94,0)",
                            ],
                          }}
                          transition={{ duration: 3, repeat: Infinity, delay: i * 0.7 }}
                        >
                          <div className="flex items-center justify-between mb-2">
                            <CardIcon className={`w-4 h-4 text-${card.color}`} />
                            <span className="text-xs text-green-500 font-medium">{card.trend}</span>
                          </div>
                          <div className="text-xl font-bold text-foreground">{card.value}</div>
                          <div className="text-xs text-muted-foreground mt-1">{card.label}</div>
                        </Motion.div>
                      );
                    })}
                  </div>

                  {/* Chart Area Mock */}
                  <div className="bg-background/40 rounded-xl p-5 border border-border/30">
                    <div className="flex items-center justify-between mb-4">
                      <div className="text-sm font-semibold text-foreground">{t("dashboardPreview.mockLabels.soilMoisture")}</div>
                      <div className="text-xs text-muted-foreground">{t("dashboardPreview.mockLabels.liveData")}</div>
                    </div>
                    <div className="flex items-end gap-2 h-32">
                      {[40, 65, 55, 80, 70, 90, 60, 75, 85, 50, 95, 70].map((h, i) => (
                        <Motion.div
                          key={i}
                          className="flex-1 rounded-t-md bg-gradient-to-t from-primary/60 to-primary/20"
                          initial={{ height: 0 }}
                          whileInView={{ height: `${h}%` }}
                          transition={{ delay: 0.5 + i * 0.05, duration: 0.6, ease: "easeOut" }}
                          viewport={{ once: true }}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </Motion.div>
          </TiltCard>
        </ScrollReveal>
      </div>
    </section>
  );
}
