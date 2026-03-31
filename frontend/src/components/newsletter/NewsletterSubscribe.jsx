import { useState } from "react";
import { motion as Motion } from "framer-motion";
import { Mail, ArrowRight, CheckCircle } from "lucide-react";
import { apiClient } from "../../api/client";
import { toastError, toastSuccess } from "../../utils/toast";
import { useLanguage } from "../../i18n/LanguageProvider";
import { Button } from "../../ui/button";

export default function NewsletterSubscribe() {
  const { t, language } = useLanguage();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [subscribed, setSubscribed] = useState(false);

  const content = {
    ro: {
      heading: "Abonează-te la Newsletter",
      subheading: "Primește cele mai noi informații despre agricultură, tehnologie și legislație.",
      placeholder: "adresa@email.com",
      button: "Abonează-te",
      buttonLoading: "Se procesează...",
      success: "Abonare reușită! Verifică-ți emailul.",
      benefits: [
        "Noutăți despre tehnologii agricole",
        "Legislație APIA și subvenții",
        "Prognoze meteo pentru culturile tale",
        "Tutoriale și ghiduri AgriOne",
      ],
    },
    en: {
      heading: "Subscribe to Newsletter",
      subheading: "Get the latest information about agriculture, technology and legislation.",
      placeholder: "your@email.com",
      button: "Subscribe",
      buttonLoading: "Processing...",
      success: "Successfully subscribed! Check your email.",
      benefits: [
        "Latest in agricultural technology",
        "APIA legislation and subsidies",
        "Weather forecasts for your crops",
        "AgriOne tutorials and guides",
      ],
    },
  };

  const text = content[language] || content.ro;

  async function handleSubmit(e) {
    e.preventDefault();
    if (!email || !email.includes("@")) {
      toastError(null, language === "ro" ? "Email invalid." : "Invalid email.");
      return;
    }

    setLoading(true);
    try {
      await apiClient.post("/api/newsletter/subscribe", {
        email,
        language,
        source: "blog_page",
      });

      toastSuccess(text.success);
      setSubscribed(true);
      setEmail("");
    } catch (err) {
      toastError(err, language === "ro" ? "Abonarea a eșuat." : "Subscription failed.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20 rounded-xl p-8 md:p-12 border border-green-100 dark:border-green-900/30"
    >
      <div className="max-w-3xl mx-auto text-center">
        {/* Icon */}
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 dark:bg-green-900/30 mb-6">
          <Mail className="w-8 h-8 text-green-600 dark:text-green-400" />
        </div>

        {/* Heading */}
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
          {text.heading}
        </h2>
        <p className="text-lg text-gray-600 dark:text-gray-300 mb-8">
          {text.subheading}
        </p>

        {/* Benefits */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-8 text-left">
          {text.benefits.map((benefit, index) => (
            <div
              key={index}
              className="flex items-start gap-3 text-sm text-gray-700 dark:text-gray-300"
            >
              <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
              <span>{benefit}</span>
            </div>
          ))}
        </div>

        {/* Form */}
        {subscribed ? (
          <Motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center gap-2 px-6 py-3 bg-green-100 dark:bg-green-900/30 rounded-lg text-green-800 dark:text-green-200 font-medium"
          >
            <CheckCircle className="w-5 h-5" />
            {text.success}
          </Motion.div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={text.placeholder}
              disabled={loading}
              required
              className="flex-1 px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed"
            />
            <Button
              type="submit"
              disabled={loading}
              className="px-6 py-3 bg-green-600 hover:bg-green-700 dark:bg-green-600 dark:hover:bg-green-700 text-white font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 whitespace-nowrap"
            >
              {loading ? text.buttonLoading : text.button}
              {!loading && <ArrowRight className="w-4 h-4" />}
            </Button>
          </form>
        )}

        {/* Privacy note */}
        <p className="mt-6 text-xs text-gray-500 dark:text-gray-400">
          {language === "ro"
            ? "Ne respectăm utilizatorii. Niciodată nu vom trimite spam sau vom vinde datele tale."
            : "We respect our users. We'll never send spam or sell your data."}
        </p>
      </div>
    </Motion.div>
  );
}
