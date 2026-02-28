import { useMemo, useState } from "react";
import logo from "../../assets/agrione.png";

export default function AuthVideoLayout({ title, subtitle, children, footer }) {
  const [videoOk, setVideoOk] = useState(true);
  const videoSrc = "/assets/video/auth-bg.mp4";
  const showDevHint = useMemo(() => import.meta.env.DEV, []);

  return (
    <div className="min-h-screen relative overflow-hidden">
      {videoOk && (
        <video
          className="absolute inset-0 h-full w-full object-cover"
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          onError={(e) => {
            const mediaError = e?.currentTarget?.error;
            const code = mediaError?.code;
            const message = mediaError?.message;
            // Usually means 404 (file missing) or unsupported codec.
            // Keep UI usable, but make it obvious in dev.
            console.warn("Auth background video failed to load:", {
              src: videoSrc,
              code,
              message,
              error: mediaError,
            });
            setVideoOk(false);
          }}
          aria-hidden="true"
        >
          <source src={videoSrc} type="video/mp4" />
        </video>
      )}

      <div className="absolute inset-0 bg-gradient-to-b from-white/40 via-white/25 to-white/45" />

      <div className="relative z-10 min-h-screen flex items-center justify-center p-4 animate-fadeIn">
        <div className="w-full max-w-md glass rounded-3xl p-7 agri-pattern">
          <div className="flex items-center gap-3">
            <img src={logo} alt="AgriOne" className="w-14 h-14 rounded-2xl" />
            <div>
              <div className="text-2xl font-extrabold tracking-tight">{title}</div>
              {subtitle ? <div className="text-sm muted">{subtitle}</div> : null}
            </div>
          </div>

          <div className="mt-6">{children}</div>

          {!videoOk && showDevHint ? (
            <div className="mt-4 text-xs muted">
              Video background nu s-a încărcat. Verifică fișierul: <span className="font-semibold">public/assets/video/auth-bg.mp4</span>
            </div>
          ) : null}

          {footer ? <div className="mt-5">{footer}</div> : null}
        </div>
      </div>
    </div>
  );
}
