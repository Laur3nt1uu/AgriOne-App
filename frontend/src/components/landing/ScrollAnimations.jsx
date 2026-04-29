import { motion as Motion, useScroll, useTransform } from "framer-motion";
import { useRef, useState, useEffect, useMemo } from "react";

/* ── ScrollReveal ─────────────────────────────────────────────
   Wraps any children and animates them on viewport entry.
   Variants: fade-up (default), fade-left, fade-right, fade-scale, blur-up
*/
const PRESETS = {
  "fade-up": { hidden: { opacity: 0, y: 60 }, visible: { opacity: 1, y: 0 } },
  "fade-down": { hidden: { opacity: 0, y: -60 }, visible: { opacity: 1, y: 0 } },
  "fade-left": { hidden: { opacity: 0, x: -60 }, visible: { opacity: 1, x: 0 } },
  "fade-right": { hidden: { opacity: 0, x: 60 }, visible: { opacity: 1, x: 0 } },
  "fade-scale": { hidden: { opacity: 0, scale: 0.9 }, visible: { opacity: 1, scale: 1 } },
  "blur-up": {
    hidden: { opacity: 0, y: 40, filter: "blur(10px)" },
    visible: { opacity: 1, y: 0, filter: "blur(0px)" },
  },
};

export function ScrollReveal({
  children,
  variant = "fade-up",
  delay = 0,
  duration = 0.7,
  className = "",
  once = true,
  threshold = 0.15,
  as = "div",
}) {
  const preset = PRESETS[variant] || PRESETS["fade-up"];
  const Tag = Motion[as] || Motion.div;

  return (
    <Tag
      initial="hidden"
      whileInView="visible"
      viewport={{ once, amount: threshold }}
      variants={{
        hidden: preset.hidden,
        visible: {
          ...preset.visible,
          transition: {
            duration,
            delay,
            ease: [0.25, 0.46, 0.45, 0.94], // easeOutQuad
          },
        },
      }}
      className={className}
    >
      {children}
    </Tag>
  );
}

/* ── TextReveal ──────────────────────────────────────────────
   Splits text into words and animates word-by-word on scroll entry.
*/
export function TextReveal({
  children,
  className = "",
  delay = 0,
  stagger = 0.03,
  once = true,
  as = "span",
}) {
  if (typeof children !== "string") return <span className={className}>{children}</span>;

  const words = children.split(" ");
  const Tag = Motion[as] || Motion.span;

  return (
    <Tag
      initial="hidden"
      whileInView="visible"
      viewport={{ once, amount: 0.3 }}
      variants={{
        hidden: {},
        visible: { transition: { staggerChildren: stagger, delayChildren: delay } },
      }}
      className={className}
      aria-label={children}
    >
      {words.map((word, i) => (
        <Motion.span
          key={`${word}-${i}`}
          variants={{
            hidden: { opacity: 0, y: 20, filter: "blur(4px)" },
            visible: {
              opacity: 1,
              y: 0,
              filter: "blur(0px)",
              transition: { duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] },
            },
          }}
          className="inline-block"
        >
          {word}{i < words.length - 1 ? "\u00A0" : ""}
        </Motion.span>
      ))}
    </Tag>
  );
}

/* ── Parallax ────────────────────────────────────────────────
   Applies scroll-linked Y translation for a parallax effect.
   speed: 0.1 = subtle, 0.5 = strong. Negative = moves opposite.
*/
export function Parallax({
  children,
  speed = 0.15,
  className = "",
  as = "div",
}) {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], [speed * -100, speed * 100]);
  const Tag = Motion[as] || Motion.div;

  return (
    <Tag ref={ref} style={{ y }} className={className}>
      {children}
    </Tag>
  );
}

/* ── StaggerContainer ────────────────────────────────────────
   Container that staggers its direct children's animations.
*/
export function StaggerContainer({
  children,
  stagger = 0.08,
  delay = 0,
  className = "",
  once = true,
  threshold = 0.1,
}) {
  return (
    <Motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once, amount: threshold }}
      variants={{
        hidden: {},
        visible: { transition: { staggerChildren: stagger, delayChildren: delay } },
      }}
      className={className}
    >
      {children}
    </Motion.div>
  );
}

/* ── StaggerItem ─────────────────────────────────────────────
   Child of StaggerContainer. Fades up by default.
*/
export function StaggerItem({ children, className = "", variant = "fade-up" }) {
  const preset = PRESETS[variant] || PRESETS["fade-up"];
  return (
    <Motion.div
      variants={{
        hidden: preset.hidden,
        visible: {
          ...preset.visible,
          transition: { duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] },
        },
      }}
      className={className}
    >
      {children}
    </Motion.div>
  );
}

/* ── ScrollProgress ──────────────────────────────────────────
   A thin progress bar at the top of the viewport showing
   scroll progress of the container (or page).
*/
export function ScrollProgress({ className = "" }) {
  const { scrollYProgress } = useScroll();
  const scaleX = useTransform(scrollYProgress, [0, 1], [0, 1]);

  return (
    <Motion.div
      className={`fixed top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-primary via-blue-500 to-primary z-[100] origin-left ${className}`}
      style={{ scaleX }}
    />
  );
}

/* ── CountUp ─────────────────────────────────────────────────
   Animates a number from 0 to target on viewport entry.
*/
export function CountUp({ target, suffix = "", prefix = "", duration = 2 }) {
  const ref = useRef(null);
  const [display, setDisplay] = useState(0);
  const done = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting && !done.current) {
          done.current = true;
          const t0 = performance.now();
          const step = (now) => {
            const p = Math.min((now - t0) / (duration * 1000), 1);
            const ease = 1 - Math.pow(1 - p, 4);
            setDisplay(
              target % 1 !== 0
                ? parseFloat((ease * target).toFixed(1))
                : Math.floor(ease * target)
            );
            if (p < 1) requestAnimationFrame(step);
          };
          requestAnimationFrame(step);
        }
      },
      { threshold: 0.3 }
    );
    io.observe(el);
    return () => io.unobserve(el);
  }, [target, duration]);

  return (
    <span ref={ref}>
      {prefix}
      {display}
      {suffix}
    </span>
  );
}

/* ── TiltCard ────────────────────────────────────────────────
   3D perspective tilt following the cursor. Adds a glare layer.
*/
export function TiltCard({
  children,
  className = "",
  tiltMax = 12,
  glare = true,
}) {
  const ref = useRef(null);
  const [tilt, setTilt] = useState({ rotateX: 0, rotateY: 0 });
  const [glarePos, setGlarePos] = useState({ x: 50, y: 50 });

  const onMove = (e) => {
    if (!ref.current) return;
    const { left, top, width, height } = ref.current.getBoundingClientRect();
    const x = (e.clientX - left) / width - 0.5;
    const y = (e.clientY - top) / height - 0.5;
    setTilt({ rotateX: -y * tiltMax, rotateY: x * tiltMax });
    setGlarePos({ x: (x + 0.5) * 100, y: (y + 0.5) * 100 });
  };

  const onLeave = () => {
    setTilt({ rotateX: 0, rotateY: 0 });
    setGlarePos({ x: 50, y: 50 });
  };

  return (
    <Motion.div
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      animate={tilt}
      transition={{ type: "spring", stiffness: 300, damping: 20, mass: 0.5 }}
      className={`relative ${className}`}
      style={{ perspective: 1000, transformStyle: "preserve-3d" }}
    >
      {children}
      {glare && (
        <div
          className="absolute inset-0 rounded-[inherit] pointer-events-none opacity-0 hover:opacity-100 transition-opacity duration-300 z-10"
          style={{
            background: `radial-gradient(circle at ${glarePos.x}% ${glarePos.y}%, rgba(255,255,255,0.12) 0%, transparent 60%)`,
          }}
        />
      )}
    </Motion.div>
  );
}

/* ── MagneticWrapper ─────────────────────────────────────────
   Subtly moves children toward the cursor on hover.
*/
export function MagneticWrapper({
  children,
  className = "",
  strength = 0.3,
}) {
  const ref = useRef(null);
  const [pos, setPos] = useState({ x: 0, y: 0 });

  const onMove = (e) => {
    if (!ref.current) return;
    const { left, top, width, height } = ref.current.getBoundingClientRect();
    setPos({
      x: (e.clientX - left - width / 2) * strength,
      y: (e.clientY - top - height / 2) * strength,
    });
  };

  return (
    <Motion.div
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={() => setPos({ x: 0, y: 0 })}
      animate={pos}
      transition={{ type: "spring", stiffness: 150, damping: 15, mass: 0.1 }}
      className={className}
    >
      {children}
    </Motion.div>
  );
}

/* ── FloatingParticles ───────────────────────────────────────
   Ambient floating particles for visual atmosphere.
   Requires @keyframes floatParticle in CSS.
*/
export function FloatingParticles({ count = 25, className = "" }) {
  const particles = useMemo(
    () =>
      Array.from({ length: count }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: Math.random() * 3 + 1,
        dur: Math.random() * 20 + 15,
        delay: Math.random() * 15,
        opacity: Math.random() * 0.4 + 0.1,
      })),
    [count]
  );

  return (
    <div
      className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`}
    >
      {particles.map((p) => (
        <div
          key={p.id}
          className="absolute rounded-full bg-primary/40"
          style={{
            left: `${p.x}%`,
            top: `${p.y}%`,
            width: p.size,
            height: p.size,
            opacity: p.opacity,
            animation: `floatParticle ${p.dur}s ease-in-out ${p.delay}s infinite`,
          }}
        />
      ))}
    </div>
  );
}

/* ── CharReveal ──────────────────────────────────────────────
   Animates text character-by-character with stagger.
*/
export function CharReveal({
  children,
  className = "",
  delay = 0,
  stagger = 0.02,
  once = true,
}) {
  if (typeof children !== "string")
    return <span className={className}>{children}</span>;

  const chars = children.split("");

  return (
    <Motion.span
      initial="hidden"
      whileInView="visible"
      viewport={{ once, amount: 0.3 }}
      variants={{
        hidden: {},
        visible: {
          transition: { staggerChildren: stagger, delayChildren: delay },
        },
      }}
      className={className}
      aria-label={children}
    >
      {chars.map((c, i) => (
        <Motion.span
          key={`${c}-${i}`}
          variants={{
            hidden: { opacity: 0, y: 25, filter: "blur(8px)" },
            visible: {
              opacity: 1,
              y: 0,
              filter: "blur(0px)",
              transition: {
                duration: 0.35,
                ease: [0.25, 0.46, 0.45, 0.94],
              },
            },
          }}
          className="inline-block"
          style={{ whiteSpace: c === " " ? "pre" : undefined }}
        >
          {c === " " ? "\u00A0" : c}
        </Motion.span>
      ))}
    </Motion.span>
  );
}
