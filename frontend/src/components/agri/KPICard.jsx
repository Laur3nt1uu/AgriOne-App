import { TrendingUp, TrendingDown } from "lucide-react";
import { motion as Motion } from "framer-motion";

const variantColors = {
  default: "#10B981",
  success: "#10B981",
  warning: "#F59E0B",
  danger: "#DC2626",
};

export function KPICard({
  title,
  value,
  subtitle,
  trend,
  trendValue,
  icon,
  variant = "default",
}) {
  const glowColor = variantColors[variant] || variantColors.default;

  return (
    <Motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
      className="relative overflow-hidden rounded-2xl p-6 backdrop-blur-xl border border-border/15 transition-all duration-500 group active:scale-[0.98]"
      style={{
        background: "var(--glass-bg)",
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
        borderImage:
          "linear-gradient(135deg, var(--agri-border-gradient-start), var(--agri-border-gradient-end)) 1",
      }}
    >
      {/* Laser-cut border effect */}
      <div
        className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
        style={{
          background: `linear-gradient(135deg, rgba(255,255,255,0.08), ${glowColor}33)`,
          padding: "1px",
          mask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
          WebkitMask:
            "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
          maskComposite: "exclude",
          WebkitMaskComposite: "xor",
        }}
      />

      {/* Bioluminescent glow */}
      <Motion.div
        className="absolute -inset-1 rounded-2xl opacity-0 group-hover:opacity-100 blur-xl transition-opacity duration-500"
        style={{
          background: `radial-gradient(circle at center, ${glowColor}26, transparent 70%)`,
        }}
      />

      <div className="relative z-10 flex items-start justify-between">
        <div className="flex-1">
          <Motion.p
            className="text-xs uppercase tracking-wider text-muted-foreground/70 mb-3 font-light"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
          >
            {title}
          </Motion.p>

          <div className="flex items-baseline gap-3 mb-2">
            <Motion.h3
              className="text-3xl md:text-4xl font-light tabular-nums"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 150 }}
            >
              {value}
            </Motion.h3>

            {trend && trendValue ? (
              <Motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
                className={`flex items-center gap-1 text-xs font-medium ${
                  trend === "up" ? "text-primary" : "text-destructive"
                }`}
              >
                <Motion.div
                  animate={{
                    y: trend === "up" ? [-1, 1, -1] : [1, -1, 1],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                >
                  {trend === "up" ? (
                    <TrendingUp className="w-3.5 h-3.5" />
                  ) : (
                    <TrendingDown className="w-3.5 h-3.5" />
                  )}
                </Motion.div>
                <span>{trendValue}</span>
              </Motion.div>
            ) : null}
          </div>

          {subtitle ? (
            <Motion.p
              className="text-xs text-muted-foreground/60 font-light"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.25 }}
            >
              {subtitle}
            </Motion.p>
          ) : null}
        </div>

        {icon ? (
          <Motion.div
            className="text-primary/40 group-hover:text-primary transition-colors duration-500 relative"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3, type: "spring" }}
          >
            <Motion.div
              className="absolute inset-0 rounded-full blur-lg opacity-0 group-hover:opacity-60"
              style={{
                background: `radial-gradient(circle, ${glowColor}, transparent)`,
              }}
            />
            <div className="relative">{icon}</div>
          </Motion.div>
        ) : null}
      </div>

      {/* Corner accent */}
      <Motion.div
        className="absolute -bottom-8 -right-8 w-24 h-24 rounded-full opacity-0 group-hover:opacity-20 blur-2xl"
        style={{
          background: `radial-gradient(circle, ${glowColor}, transparent)`,
        }}
        animate={{ scale: [1, 1.1, 1] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
      />
    </Motion.div>
  );
}
