import { CheckCircle, AlertTriangle, XCircle, WifiOff, HelpCircle } from "lucide-react";
import { motion as Motion } from "framer-motion";

const config = {
  GOOD: {
    icon: CheckCircle,
    label: "Good",
    className: "bg-primary/10 text-primary border-primary/20",
    gradient: "from-primary/20 via-transparent to-transparent",
  },
  WARNING: {
    icon: AlertTriangle,
    label: "Warning",
    className: "bg-warn/10 text-warn border-warn/20",
    gradient: "from-warn/20 via-transparent to-transparent",
  },
  CRITICAL: {
    icon: XCircle,
    label: "Critical",
    className: "bg-destructive/10 text-destructive border-destructive/20",
    gradient: "from-destructive/20 via-transparent to-transparent",
  },
  OFFLINE: {
    icon: WifiOff,
    label: "Offline",
    className: "bg-muted/30 text-muted-foreground border-border/30",
    gradient: "from-muted/20 via-transparent to-transparent",
  },
  NO_DATA: {
    icon: HelpCircle,
    label: "No Data",
    className: "bg-muted/30 text-muted-foreground border-border/30",
    gradient: "from-muted/20 via-transparent to-transparent",
  },
};

export function HealthScoreBadge({ score }) {
  const cfg = config[score] || config.NO_DATA;
  const Icon = cfg.icon;

  return (
    <Motion.div
      initial={{ scale: 0, opacity: 0, rotate: -180 }}
      animate={{ scale: 1, opacity: 1, rotate: 0 }}
      transition={{ type: "spring", stiffness: 200, damping: 15 }}
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-light border backdrop-blur-sm relative overflow-hidden ${cfg.className}`}
    >
      {score !== "OFFLINE" && score !== "NO_DATA" ? (
        <Motion.div
          className={`absolute inset-0 bg-gradient-to-r ${cfg.gradient}`}
          animate={{ x: ["-100%", "100%"] }}
          transition={{ duration: 2.5, repeat: Infinity, ease: "linear" }}
        />
      ) : null}
      <Motion.div
        animate={
          score === "CRITICAL"
            ? { rotate: [0, -10, 10, -10, 10, 0] }
            : score === "WARNING"
              ? { rotate: [0, -5, 5, -5, 5, 0] }
              : {}
        }
        transition={{
          duration: 0.5,
          repeat: score === "CRITICAL" ? Infinity : score === "WARNING" ? 3 : 0,
          repeatDelay: score === "CRITICAL" ? 1.5 : 3,
        }}
        className="relative z-10"
      >
        <Icon className="w-3 h-3" />
      </Motion.div>
      <span className="relative z-10 uppercase tracking-wide">{cfg.label}</span>
    </Motion.div>
  );
}
