import { motion as Motion } from "framer-motion";

export function StatusBadge({ status }) {
  const isOnline = status === "online";

  return (
    <Motion.div
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ type: "spring", stiffness: 200, damping: 15 }}
      className={`
        inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-light
        backdrop-blur-sm relative overflow-hidden border
        ${
          isOnline
            ? "bg-primary/10 text-primary border-primary/20"
            : "bg-muted/30 text-muted-foreground border-border/30"
        }
      `}
    >
      {isOnline ? (
        <Motion.div
          className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/15 to-transparent"
          animate={{ x: ["-100%", "100%"] }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
        />
      ) : null}
      <Motion.span
        className={`w-1.5 h-1.5 rounded-full relative z-10 ${
          isOnline ? "bg-primary" : "bg-muted-foreground"
        }`}
        animate={
          isOnline
            ? { scale: [1, 1.4, 1], opacity: [1, 0.6, 1] }
            : {}
        }
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
      >
        {isOnline ? (
          <Motion.span
            className="absolute inset-0 rounded-full bg-primary"
            animate={{
              scale: [1, 2, 1],
              opacity: [0.8, 0, 0.8],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeOut",
            }}
          />
        ) : null}
      </Motion.span>
      <span className="relative z-10 uppercase tracking-wide">
        {isOnline ? "Online" : "Offline"}
      </span>
    </Motion.div>
  );
}
