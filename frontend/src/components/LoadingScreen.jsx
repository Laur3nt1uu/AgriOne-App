import { useEffect, useState } from "react";
import logo from "../assets/agrione.png";

export default function LoadingScreen({ onComplete }) {
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    const timer1 = setTimeout(() => {
      setFadeOut(true);
    }, 2000);

    const timer2 = setTimeout(() => {
      onComplete();
    }, 2500);

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
          "radial-gradient(900px 520px at 30% 20%, hsl(var(--primary-500) / 0.18), transparent 60%)," +
          "radial-gradient(720px 460px at 80% 10%, hsl(var(--chart-2) / 0.12), transparent 62%)," +
          "radial-gradient(760px 520px at 10% 90%, hsl(var(--chart-3) / 0.10), transparent 64%)," +
          "linear-gradient(180deg, rgba(255,255,255,0.55), rgba(255,255,255,0.0) 50%)," +
          "var(--bg)",
      }}
    >
      <div className="flex flex-col items-center gap-6 animate-pulse">
        <img
          src={logo}
          alt="AgriOne"
          className="w-32 h-32 rounded-3xl shadow-2xl"
          style={{ boxShadow: "0 24px 70px hsl(var(--primary-500) / 0.22)" }}
        />
        <div className="text-4xl font-extrabold text-slate-900 tracking-wide">
          AgriOne
        </div>
        <div className="text-sm text-slate-700">Agricultură inteligentă</div>
      </div>
    </div>
  );
}
