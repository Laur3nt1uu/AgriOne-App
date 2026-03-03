import { motion as Motion } from "framer-motion";
import NexusAtmosphere from "../../components/layout/NexusAtmosphere";
import logo from "../../assets/agrione.png";

export default function AuthNexusLayout({ title, subtitle, children, footer }) {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden bg-background text-foreground">
      <NexusAtmosphere className="-z-10" />

      <Motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md relative z-10"
      >
        <Motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
          className="text-center mb-8"
        >
          <Motion.div
            className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-card/60 border border-border/20 mb-4 relative overflow-hidden"
            whileHover={{ scale: 1.1, rotate: 5 }}
            animate={{
              boxShadow: [
                "0 0 20px rgb(var(--primary) / 0.30)",
                "0 0 40px rgb(var(--primary) / 0.50)",
                "0 0 20px rgb(var(--primary) / 0.30)",
              ],
            }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <img src={logo} alt="AgriOne" className="w-10 h-10 rounded-xl" />
          </Motion.div>

          <Motion.h1
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-3xl font-bold text-foreground mb-2"
          >
            {title}
          </Motion.h1>

          {subtitle ? (
            <Motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="text-muted-foreground"
            >
              {subtitle}
            </Motion.p>
          ) : null}
        </Motion.div>

        <Motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="rounded-2xl border-2 border-border/50 bg-card/60 backdrop-blur-2xl p-6 md:p-8 relative overflow-hidden group"
          style={{ boxShadow: "0 0 80px rgb(var(--primary) / 0.18)" }}
        >
          <Motion.div
            className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
            style={{
              background:
                "linear-gradient(135deg, rgb(var(--primary) / 0.24), transparent, rgb(var(--warn) / 0.14))",
              filter: "blur(20px)",
            }}
          />

          <Motion.div
            className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-warn/10 opacity-0 group-hover:opacity-100 transition-opacity duration-700"
            style={{ backgroundSize: "200% 200%", animation: "gradient-shift 4s ease infinite" }}
          />

          <Motion.div
            className="absolute inset-0 opacity-0 group-hover:opacity-100"
            animate={{ x: ["-100%", "200%"] }}
            transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
            style={{
              background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent)",
              width: "50%",
            }}
          />

          <Motion.div
            className="absolute -top-10 -right-10 w-32 h-32 rounded-full opacity-20 blur-3xl"
            style={{ background: "radial-gradient(circle, rgb(var(--primary) / 0.55), transparent)" }}
            animate={{ scale: [1, 1.3, 1] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          />

          <div className="relative z-10">{children}</div>

          {footer ? <div className="mt-6 text-center text-sm relative z-10">{footer}</div> : null}
        </Motion.div>
      </Motion.div>
    </div>
  );
}
