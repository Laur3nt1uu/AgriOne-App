import { motion as Motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, FileText } from "lucide-react";
import LandingLayout from "../../components/landing/LandingLayout";
import LandingNavbar from "../../components/landing/LandingNavbar";
import LandingFooter from "../../components/landing/LandingFooter";
import { Button } from "../../ui/button";
import { useLanguage } from "../../i18n/LanguageProvider";

export default function TermsPage() {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const sections = t("legal.terms.sections");

  return (
    <LandingLayout>
      <LandingNavbar />

      <section className="relative pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          {/* Back */}
          <Motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4 }}
          >
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate(-1)}
              className="mb-8 text-muted-foreground hover:text-foreground"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              {t("legal.back")}
            </Button>
          </Motion.div>

          {/* Header */}
          <Motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-12"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center">
                <FileText className="w-5 h-5 text-blue-500" />
              </div>
              <span className="text-sm text-muted-foreground font-medium">
                {t("legal.terms.lastUpdated")}
              </span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-3">
              {t("legal.terms.title")}
            </h1>
            <p className="text-muted-foreground text-lg leading-relaxed max-w-2xl">
              {t("legal.terms.intro")}
            </p>
          </Motion.div>

          {/* Sections */}
          <div className="space-y-10">
            {sections.map((section, i) => (
              <Motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 + i * 0.05 }}
                className="bg-card/50 border border-border/50 rounded-2xl p-6 sm:p-8 backdrop-blur-sm"
              >
                <h2 className="text-xl font-semibold text-foreground mb-3">
                  {section.title}
                </h2>
                <div className="text-muted-foreground leading-relaxed whitespace-pre-line text-sm">
                  {section.body}
                </div>
              </Motion.div>
            ))}
          </div>
        </div>
      </section>

      <LandingFooter />
    </LandingLayout>
  );
}
