import React from "react";
import { SirahEvent } from "@/types/sirah";
import { motion, AnimatePresence } from "framer-motion";
import { X, BookOpen, Quote } from "lucide-react";

interface DeepDiveModalProps {
  event: SirahEvent | null;
  language: "id" | "en" | "ar";
  onClose: () => void;
}

export default function DeepDiveModal({ event, language, onClose }: DeepDiveModalProps) {
  if (!event) return null;

  const isArabic = language === "ar";

  // Using detailedContent if available, fallback to description
  const content = event.detailedContent ? event.detailedContent[language] || event.detailedContent['id'] : event.description[language] || event.description['id'];

  return (
    <AnimatePresence>
      {event && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 md:p-12">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/80 backdrop-blur-md cursor-pointer"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="relative w-full max-w-4xl max-h-[90vh] bg-deep-obsidian border border-white/10 rounded-2xl shadow-2xl flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-white/10 bg-black/20">
              <div className="flex items-center gap-3 text-sand-gold">
                <BookOpen className="w-6 h-6" />
                <h2 className="text-xl font-bold font-arabic tracking-wide">
                  {isArabic ? "اقرأ المزيد" : (language === "en" ? "Deep Dive Article" : "Artikel Mendalam")}
                </h2>
              </div>
              <button 
                onClick={onClose}
                className="p-2 rounded-full hover:bg-white/10 text-gray-400 hover:text-white transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Content Body */}
            <div className="flex-1 overflow-y-auto p-6 md:p-10 scroll-smooth">
              <h1 className={`text-3xl md:text-5xl font-bold text-white mb-8 ${isArabic ? "font-arabic text-right leading-relaxed" : "leading-tight"}`} dir={isArabic ? "rtl" : "ltr"}>
                {event.title[language] || event.title['id']}
              </h1>

              {/* Quranic Context Box */}
              {event.quranicContext && (
                <div className="mb-10 bg-gradient-to-br from-sand-gold/20 to-transparent border border-sand-gold/30 rounded-2xl p-6 md:p-8 relative">
                  <Quote className="absolute top-6 right-6 w-12 h-12 text-sand-gold/20" />
                  <div className="text-sand-gold font-bold uppercase tracking-widest text-sm mb-4">
                    {isArabic ? "السياق القرآني" : "Konteks Al-Qur'an (Asbabun Nuzul)"}
                  </div>
                  <h3 className="text-xl text-white font-semibold mb-6">
                    Surah {event.quranicContext.surahName} : {event.quranicContext.ayahRange}
                  </h3>
                  <p className="text-2xl md:text-4xl text-right font-arabic leading-loose text-white mb-6">
                    {event.quranicContext.arabicText}
                  </p>
                  <p className={`text-gray-300 italic ${isArabic ? 'text-right' : 'text-left'}`} dir={isArabic ? "rtl" : "ltr"}>
                    "{language === "en" ? event.quranicContext.translation.en : event.quranicContext.translation.id}"
                  </p>
                </div>
              )}

              {/* Main Article Text */}
              <div 
                className={`prose prose-invert prose-lg max-w-none text-gray-300 ${isArabic ? 'text-right font-arabic leading-loose text-2xl' : 'leading-relaxed'}`}
                dir={isArabic ? "rtl" : "ltr"}
              >
                {/* Splitting newlines if they exist in the JSON text */}
                {content?.split('\n').map((paragraph, idx) => (
                  <p key={idx} className="mb-6">{paragraph}</p>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
