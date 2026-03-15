import { motion as Motion } from "framer-motion";
import { Star, Quote } from "lucide-react";
import { useLanguage } from "../../i18n/LanguageProvider";

function getInitials(name) {
  return name.split(" ").map(n => n[0]).join("").toUpperCase();
}

const avatarColors = [
  "from-primary to-blue-500",
  "from-blue-500 to-purple-500",
  "from-green-500 to-primary",
  "from-amber-500 to-orange-500",
];

export default function TestimonialsSection() {
  const { t } = useLanguage();

  const testimonials = t("testimonials.items");

  return (
    <section className="py-20 lg:py-32 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 pointer-events-none">
        <Motion.div
          className="absolute top-1/4 right-1/4 w-80 h-80 rounded-full opacity-10 blur-3xl"
          style={{ background: "radial-gradient(circle, rgb(var(--primary) / 0.3), transparent)" }}
          animate={{ scale: [1, 1.3, 1], y: [0, -40, 0] }}
          transition={{ duration: 16, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <Motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <Motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium mb-6"
          >
            <Star className="w-4 h-4 fill-primary" />
            {t("testimonials.badge")}
          </Motion.div>

          <Motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.8 }}
            viewport={{ once: true }}
            className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-foreground mb-6"
          >
            {t("testimonials.title")}{" "}
            <span className="bg-gradient-to-r from-primary to-blue-500 bg-clip-text text-transparent">
              {t("testimonials.titleHighlight")}
            </span>
          </Motion.h2>

          <Motion.p
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            viewport={{ once: true }}
            className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed"
          >
            {t("testimonials.subtitle")}
          </Motion.p>
        </Motion.div>

        {/* Testimonials Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {Array.isArray(testimonials) && testimonials.map((item, index) => (
            <Motion.div
              key={index}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1, duration: 0.6, type: "spring", stiffness: 100 }}
              viewport={{ once: true }}
              whileHover={{ y: -8 }}
              className="group"
            >
              <Motion.div
                className="glass p-6 h-full relative overflow-hidden"
                whileHover={{ boxShadow: "0 20px 40px rgb(var(--primary) / 0.12)" }}
                transition={{ duration: 0.3 }}
              >
                {/* Quote Icon */}
                <Quote className="w-8 h-8 text-primary/20 mb-4" />

                {/* Stars */}
                <div className="flex gap-1 mb-4">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star key={star} className="w-4 h-4 fill-amber-400 text-amber-400" />
                  ))}
                </div>

                {/* Quote Text */}
                <p className="text-muted-foreground text-sm leading-relaxed mb-6">
                  &ldquo;{item.quote}&rdquo;
                </p>

                {/* Author */}
                <div className="flex items-center gap-3 mt-auto">
                  <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${avatarColors[index % avatarColors.length]} flex items-center justify-center text-white text-sm font-bold`}>
                    {getInitials(item.name)}
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-foreground">{item.name}</div>
                    <div className="text-xs text-muted-foreground">{item.farm}</div>
                  </div>
                </div>
              </Motion.div>
            </Motion.div>
          ))}
        </div>

        {/* Trust Stats */}
        <Motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.6 }}
          viewport={{ once: true }}
          className="mt-16 flex flex-col sm:flex-row items-center justify-center gap-8 sm:gap-16"
        >
          {[
            { value: "30+", label: t("testimonials.trustStats.farms") },
            { value: "4.8/5", label: t("testimonials.trustStats.rating") },
            { value: "95%", label: t("testimonials.trustStats.satisfaction") },
          ].map((stat, index) => (
            <Motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.6 + index * 0.1, duration: 0.5 }}
              viewport={{ once: true }}
              className="text-center"
            >
              <div className="text-2xl lg:text-3xl font-bold text-foreground">{stat.value}</div>
              <div className="text-sm text-muted-foreground">{stat.label}</div>
            </Motion.div>
          ))}
        </Motion.div>
      </div>
    </section>
  );
}
