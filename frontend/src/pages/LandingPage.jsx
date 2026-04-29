import LandingLayout from "../components/landing/LandingLayout";
import LandingNavbar from "../components/landing/LandingNavbar";
import HeroSection from "../components/landing/HeroSection";
import FeaturesSection from "../components/landing/FeaturesSection";
import DashboardPreviewSection from "../components/landing/DashboardPreviewSection";
import HowItWorksSection from "../components/landing/HowItWorksSection";
import TestimonialsSection from "../components/landing/TestimonialsSection";
import PricingSection from "../components/landing/PricingSection";
import AboutSection from "../components/landing/AboutSection";
import FAQSection from "../components/landing/FAQSection";
import CTABannerSection from "../components/landing/CTABannerSection";
import NewsletterSection from "../components/landing/NewsletterSection";
import LandingFooter from "../components/landing/LandingFooter";
import LandingChatWidget from "../components/landing/LandingChatWidget";

export default function LandingPage() {
  return (
    <LandingLayout>
      {/* Navigation */}
      <LandingNavbar />

      {/* Main Content */}
      <main className="flex-1">
        <HeroSection />
        <FeaturesSection />
        <DashboardPreviewSection />
        <HowItWorksSection />
        <TestimonialsSection />
        <PricingSection />
        <AboutSection />
        <FAQSection />
        <CTABannerSection />
        <NewsletterSection />
      </main>

      {/* Footer */}
      <LandingFooter />

      {/* AI Chat Widget */}
      <LandingChatWidget />
    </LandingLayout>
  );
}
