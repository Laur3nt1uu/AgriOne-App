import { motion as Motion } from "framer-motion";

export default function NexusAtmosphere({ className = "" }) {
  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`}
    >
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(900px 520px at 20% 10%, rgb(var(--primary) / 0.18), transparent 60%)," +
            "radial-gradient(820px 520px at 90% 0%, rgb(var(--warn) / 0.12), transparent 62%)," +
            "radial-gradient(760px 520px at 10% 90%, rgb(var(--accent) / 0.10), transparent 64%)," +
            "rgb(var(--background) / 1)",
        }}
      />

      <Motion.div
        className="absolute -top-1/2 -left-1/2 w-full h-full bg-primary/10 rounded-full blur-3xl"
        animate={{ scale: [1, 1.18, 1], opacity: [0.25, 0.45, 0.25] }}
        transition={{ duration: 8, repeat: Infinity }}
      />

      <Motion.div
        className="absolute -bottom-1/2 -right-1/2 w-full h-full bg-primary/10 rounded-full blur-3xl"
        animate={{ scale: [1.2, 1, 1.2], opacity: [0.45, 0.25, 0.45] }}
        transition={{ duration: 8, repeat: Infinity, delay: 1 }}
      />

      <Motion.div
        className="absolute inset-0 opacity-20"
        style={{
          background:
            "linear-gradient(135deg, rgb(var(--primary) / 0.18), transparent, rgb(var(--warn) / 0.10))",
          backgroundSize: "200% 200%",
          animation: "gradient-shift 6s ease infinite",
        }}
      />
    </div>
  );
}
