import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { SirahEvent } from '@/types/sirah';
import { X, BookOpen } from 'lucide-react';

interface QuranIndexModalProps {
  isOpen: boolean;
  onClose: () => void;
  events: SirahEvent[];
  language: "id" | "en" | "ar";
}

export default function QuranIndexModal({ isOpen, onClose, events, language }: QuranIndexModalProps) {
  const isArabic = language === "ar";
  
  // Filter events that have quranicContext
  const quranicEvents = events.filter(e => e.quranicContext);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/80 backdrop-blur-sm cursor-pointer"
            onClick={onClose}
          />
          
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-4xl max-h-[85vh] bg-deep-obsidian border border-sand-gold/30 rounded-2xl shadow-2xl overflow-hidden flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-white/10 bg-black/20">
              <div className="flex items-center gap-3">
                <BookOpen className="w-6 h-6 text-sand-gold" />
                <h2 className="text-xl md:text-2xl font-bold text-white tracking-wide">
                  {isArabic ? "فهرس القرآن الكريم" : (language === "en" ? "Thematic Quran Index" : "Indeks Thematik Al-Qur'an")}
                </h2>
              </div>
              <button 
                onClick={onClose}
                className="p-2 rounded-full hover:bg-white/10 text-gray-400 hover:text-white transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-6 md:p-8 space-y-8 scroll-smooth">
              <p className={`text-gray-400 text-sm md:text-base leading-relaxed ${isArabic ? 'text-right font-arabic' : ''}`}>
                {isArabic 
                  ? "مجموعة من الآيات القرآنية التي نزلت لتخليد وتوضيح الأحداث التاريخية في السيرة النبوية."
                  : (language === "en" 
                    ? "A collection of Quranic verses revealed to immortalize and explain historical events in the Prophet's Seerah."
                    : "Kumpulan ayat-ayat Al-Qur'an yang diturunkan untuk mengabadikan dan menjelaskan peristiwa-peristiwa bersejarah dalam Sirah Nabawiyah.")}
              </p>

              <div className="grid gap-6">
                {quranicEvents.map((event) => (
                  <div key={event.id} className="bg-white/5 border border-white/10 rounded-xl p-6 hover:border-sand-gold/50 transition-colors">
                    <div className={`flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 pb-4 border-b border-white/5 ${isArabic ? 'md:flex-row-reverse' : ''}`}>
                      <div>
                        <h3 className={`text-lg font-bold text-sand-gold ${isArabic ? 'text-right font-arabic' : ''}`}>
                          {event.title[language] || event.title['id']}
                        </h3>
                        <p className={`text-sm text-gray-400 ${isArabic ? 'text-right font-arabic' : ''}`}>
                          {isArabic ? "الفصل" : "Bab"} {event.order}
                        </p>
                      </div>
                      <div className="px-4 py-2 bg-sand-gold/10 text-sand-gold rounded-lg border border-sand-gold/20 font-semibold text-sm whitespace-nowrap text-center">
                        Surah {event.quranicContext!.surahName} : {event.quranicContext!.ayahRange}
                      </div>
                    </div>

                    <div className="space-y-6">
                      <p className="text-2xl md:text-3xl text-right font-arabic leading-loose text-white">
                        {event.quranicContext!.arabicText}
                      </p>
                      <p className={`text-gray-300 italic leading-relaxed ${isArabic ? 'text-right font-arabic text-xl' : 'text-left'}`} dir={isArabic ? "rtl" : "ltr"}>
                        "{language === "en" ? event.quranicContext!.translation.en : event.quranicContext!.translation.id}"
                      </p>
                    </div>
                  </div>
                ))}

                {quranicEvents.length === 0 && (
                  <div className="text-center text-gray-500 py-12">
                    {isArabic ? "لا توجد آيات قرآنية متاحة." : "Tidak ada data ayat Al-Qur'an."}
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
