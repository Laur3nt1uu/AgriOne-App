import { useState } from 'react';
import { Button } from '../../ui/button';
import { Download, FileText, ExternalLink, CheckCircle2, BookOpen } from 'lucide-react';
import { motion as Motion } from 'framer-motion';

const tutorials = [
  {
    id: 'getting-started',
    title: { ro: 'Primii Pași cu AgriOne', en: 'Getting Started Guide' },
    description: { ro: 'Configurează contul și primul teren în 15 minute', en: 'Set up your account and first land in 15 minutes' },
    duration: '15 min',
    level: 'Beginner',
    htmlFile: '/tutorials/getting-started-guide.html',
    topics: [
      { ro: 'Crearea contului', en: 'Account creation' },
      { ro: 'Adăugarea terenului', en: 'Adding land' },
      { ro: 'Navigarea dashboard-ului', en: 'Dashboard navigation' },
      { ro: 'Configurarea profilului', en: 'Profile setup' }
    ]
  },
  {
    id: 'iot-setup',
    title: { ro: 'Configurare Senzori IoT', en: 'IoT Sensor Setup' },
    description: { ro: 'Ghid complet pentru instalarea senzorilor ESP32', en: 'Complete guide for ESP32 sensor installation' },
    duration: '45 min',
    level: 'Intermediate',
    htmlFile: '/tutorials/iot-sensor-setup.html',
    topics: [
      { ro: 'Tipuri de senzori', en: 'Sensor types' },
      { ro: 'Asamblarea hardware', en: 'Hardware assembly' },
      { ro: 'Programarea firmware', en: 'Firmware programming' },
      { ro: 'Calibrarea senzorilor', en: 'Sensor calibration' }
    ]
  }
];

const TutorialCard = ({ tutorial, language }) => {
  const [downloading, setDownloading] = useState(false);
  const getText = (obj) => obj[language] || obj.en;

  const handleDownload = async () => {
    setDownloading(true);
    try {
      // Open tutorial then trigger print dialog
      const printWindow = window.open(tutorial.htmlFile, '_blank');
      if (printWindow) {
        printWindow.onload = () => {
          setTimeout(() => {
            printWindow.print();
          }, 1000);
        };
      }
    } finally {
      setTimeout(() => setDownloading(false), 2000);
    }
  };

  const getLevelBadgeColor = (level) => {
    switch (level.toLowerCase()) {
      case 'beginner': return 'bg-green-100 text-green-700 border-green-300 dark:bg-green-900/30 dark:text-green-400 dark:border-green-700';
      case 'intermediate': return 'bg-yellow-100 text-yellow-700 border-yellow-300 dark:bg-yellow-900/30 dark:text-yellow-400 dark:border-yellow-700';
      case 'advanced': return 'bg-red-100 text-red-700 border-red-300 dark:bg-red-900/30 dark:text-red-400 dark:border-red-700';
      default: return 'bg-gray-100 text-gray-700 border-gray-300';
    }
  };

  return (
    <Motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4 }}
      className="bg-card border border-border rounded-xl p-6 shadow-sm hover:shadow-md transition-all duration-300"
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-primary/15 text-primary">
            <BookOpen className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-semibold text-foreground text-lg">{getText(tutorial.title)}</h3>
            <div className="flex items-center gap-2 mt-1">
              <span className={`px-2 py-0.5 rounded-full text-xs border ${getLevelBadgeColor(tutorial.level)}`}>
                {tutorial.level}
              </span>
              <span className="text-sm text-muted-foreground">• {tutorial.duration}</span>
            </div>
          </div>
        </div>
      </div>

      <p className="text-muted-foreground mb-4">{getText(tutorial.description)}</p>

      <div className="mb-4">
        <h4 className="text-sm font-medium text-foreground mb-2">
          {language === 'ro' ? 'Subiecte acoperite:' : 'Topics covered:'}
        </h4>
        <div className="grid grid-cols-2 gap-2">
          {tutorial.topics.map((topic, index) => (
            <div key={index} className="flex items-center gap-2 text-sm">
              <CheckCircle2 className="w-3 h-3 text-primary flex-shrink-0" />
              <span className="text-muted-foreground">{getText(topic)}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="flex gap-2 pt-4 border-t border-border">
        {/* Direct link styled as button - no nested button/anchor */}
        <a
          href={tutorial.htmlFile}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 inline-flex items-center justify-center gap-2 h-8 rounded-lg px-3 text-sm font-light transition-all duration-300 border border-border/20 bg-card/40 backdrop-blur-xl text-foreground hover:bg-card/60 hover:border-primary/40 hover:text-primary"
        >
          <ExternalLink className="w-4 h-4" />
          {language === 'ro' ? 'Vezi Tutorial' : 'View Tutorial'}
        </a>
        <Button
          variant="primary"
          size="sm"
          onClick={handleDownload}
          disabled={downloading}
          className="flex items-center gap-2 flex-1"
        >
          <Download className="w-4 h-4" />
          {downloading
            ? (language === 'ro' ? 'Se deschide...' : 'Opening...')
            : (language === 'ro' ? 'Descarcă PDF' : 'Download PDF')
          }
        </Button>
      </div>
    </Motion.div>
  );
};

export default function TutorialLibrary({ language = 'ro' }) {
  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-foreground mb-2">
          {language === 'ro' ? '📚 Biblioteca de Tutoriale' : '📚 Tutorial Library'}
        </h2>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          {language === 'ro'
            ? 'Ghiduri pas cu pas pentru a maximiza utilizarea platformei AgriOne. Toate tutorialele includ capturi de ecran și exemple practice.'
            : 'Step-by-step guides to maximize your AgriOne platform usage. All tutorials include screenshots and practical examples.'
          }
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {tutorials.map((tutorial) => (
          <TutorialCard
            key={tutorial.id}
            tutorial={tutorial}
            language={language}
          />
        ))}
      </div>

      <div className="bg-muted/30 rounded-xl p-6 text-center">
        <h3 className="font-semibold text-foreground mb-2">
          {language === 'ro' ? '🚀 Mai multe tutoriale în curând!' : '🚀 More tutorials coming soon!'}
        </h3>
        <p className="text-muted-foreground text-sm mb-4">
          {language === 'ro'
            ? 'Lucrăm la ghiduri pentru sistemul de alerte, analiza financiară, integrarea API și multe altele.'
            : 'We\'re working on guides for alert system, financial analysis, API integration and much more.'
          }
        </p>
        <div className="flex flex-wrap justify-center gap-2">
          {[
            { ro: 'Sistemul de Alerte', en: 'Alert System' },
            { ro: 'Analiză Financiară', en: 'Financial Analysis' },
            { ro: 'Integrarea API', en: 'API Integration' },
            { ro: 'Depanare Avansată', en: 'Advanced Troubleshooting' }
          ].map((upcoming, index) => (
            <span
              key={index}
              className="px-3 py-1 bg-card border border-border rounded-full text-sm text-muted-foreground"
            >
              {language === 'ro' ? upcoming.ro : upcoming.en}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}