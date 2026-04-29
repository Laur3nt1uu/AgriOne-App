import { motion as Motion } from "framer-motion";
import NexusAtmosphere from "../layout/NexusAtmosphere";
import { ScrollProgress } from "./ScrollAnimations";
import useLenis from "../../hooks/useLenis";

export default function LandingLayout({ children }) {
  useLenis();

  return (
    <div className="min-h-screen bg-background text-foreground relative overflow-x-hidden">
      {/* Scroll Progress Indicator */}
      <ScrollProgress />

      {/* Animated Background */}
      <NexusAtmosphere className="fixed inset-0 z-0" />

      {/* Main Content */}
      <Motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="relative z-10 min-h-screen flex flex-col"
      >
        {children}
      </Motion.div>
    </div>
  );
}
