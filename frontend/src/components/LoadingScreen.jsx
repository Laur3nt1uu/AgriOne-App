import { useEffect, useState } from "react";
import { motion as Motion } from "framer-motion";
import logo from "../assets/agrione.png";

export default function LoadingScreen({ onComplete }) {
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    const timer1 = setTimeout(() => setFadeOut(true), 2000);
    const timer2 = setTimeout(() => onComplete(), 2500);
    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, [onComplete]);

  return (
    <div
      className={`fixed inset-0 z-50 flex flex-col items-center justify-center transition-opacity duration-500 ${
        fadeOut ? "opacity-0" : "opacity-100"
      }`}
      style={{
        background:
          "radial-gradient(900px 520px at 30% 20%, rgb(var(--primary) / 0.14), transparent 60%)," +
          "radial-gradient(720px 460px at 80% 10%, rgb(var(--accent) / 0.10), transparent 62%)," +
          "radial-gradient(760px 520px at 10% 90%, rgb(var(--warn) / 0.10), transparent 64%)," +
          "linear-gradient(180deg, rgb(var(--background) / 0.75), rgb(var(--background) / 0.0) 50%)," +
          "rgb(var(--background) / 1)",
      }}
    >
      {/* Animated orb */}
      <Motion.div
        className="absolute w-[500px] h-[500px] rounded-full blur-3xl"
        style={{
          background: "radial-gradient(circle, rgba(16, 185, 129, 0.2), transparent 70%)",
        }}
        animate={{ scale: [1, 1.3, 1], opacity: [0.3, 0.6, 0.3] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
      />

      <div className="flex flex-col items-center gap-6 relative z-10">
        <Motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: "spring", stiffness: 200, damping: 15 }}
        >
          <Motion.img
            src={logo}
            alt="AgriOne"
            className="w-32 h-32 rounded-3xl shadow-2xl"
            animate={{
              boxShadow: [
                "0 24px 70px rgba(16, 185, 129, 0.22)",
                "0 24px 70px rgba(16, 185, 129, 0.45)",
                "0 24px 70px rgba(16, 185, 129, 0.22)",
              ],
            }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          />
        </Motion.div>

        <Motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-4xl font-extrabold text-foreground tracking-wide"
        >
          AgriOne
        </Motion.div>

        <Motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-sm text-muted-foreground"
        >
          Agricultură inteligentă
        </Motion.div>

        {/* Pulsing dots */}
        <div className="flex gap-2 mt-4">
          {[0, 1, 2].map((i) => (
            <Motion.div
              key={i}
              className="w-2 h-2 rounded-full bg-primary"
              animate={{ scale: [1, 1.5, 1], opacity: [0.4, 1, 0.4] }}
              transition={{
                duration: 1,
                repeat: Infinity,
                ease: "easeInOut",
                delay: i * 0.2,
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
