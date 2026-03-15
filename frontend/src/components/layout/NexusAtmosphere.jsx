import { motion as Motion } from "framer-motion";

export default function NexusAtmosphere({ className = "" }) {
  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none fixed inset-0 overflow-hidden ${className}`}
    >
      {/* Base atmosphere gradient */}
      <div
        className="absolute inset-0"
        style={{ background: "var(--atmosphere-gradient)" }}
      />

      {/* Primary green orb - center */}
      <Motion.div
        className="absolute top-1/2 left-1/2 w-[600px] h-[600px] rounded-full blur-3xl"
        style={{
          background: "radial-gradient(circle, rgba(16, 185, 129, 0.15) 0%, transparent 70%)",
          transform: "translate(-50%, -50%)",
        }}
        animate={{ scale: [1, 1.2, 1], opacity: [0.15, 0.25, 0.15] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Blue accent orb - top right */}
      <Motion.div
        className="absolute right-0 top-0 w-[400px] h-[400px] rounded-full blur-3xl"
        style={{
          background: "radial-gradient(circle, rgba(59, 130, 246, 0.1) 0%, transparent 70%)",
        }}
        animate={{ x: [0, -100, 0], y: [0, 100, 0], scale: [1, 1.15, 1] }}
        transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Purple orb - bottom left */}
      <Motion.div
        className="absolute bottom-0 left-0 w-[350px] h-[350px] rounded-full blur-3xl"
        style={{
          background: "radial-gradient(circle, rgba(139, 92, 246, 0.08) 0%, transparent 70%)",
        }}
        animate={{ x: [0, 80, 0], y: [0, -80, 0], scale: [1, 1.1, 1] }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Gradient shift overlay */}
      <Motion.div
        className="absolute inset-0 opacity-20"
        style={{
          background: "linear-gradient(135deg, rgb(var(--primary) / 0.18), transparent, rgb(var(--warn) / 0.10))",
          backgroundSize: "200% 200%",
          animation: "gradient-shift 6s ease infinite",
        }}
      />
    </div>
  );
}
