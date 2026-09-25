"use client";

import React, { useEffect, useRef, useState } from "react";
import { SirahEvent } from "@/types/sirah";
import { BookOpen, Volume2, Square } from "lucide-react";
import { motion } from "framer-motion";

interface NarrativeCardProps {
  event: SirahEvent;
  language: "id" | "en" | "ar";
  isActive: boolean;
  onActive: (event: SirahEvent) => void;
}

export default function NarrativeCard({ event, language, isActive, onActive }: NarrativeCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  
  const isArabic = language === "ar";
  const dir = isArabic ? "rtl" : "ltr";

  // Intersection Observer for Scrollytelling
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            onActive(event);
          }
        });
      },
      {
        root: null,
        rootMargin: "-40% 0px -40% 0px",
        threshold: 0,
      }
    );

    if (cardRef.current) observer.observe(cardRef.current);
    return () => {
      if (cardRef.current) observer.unobserve(cardRef.current);
    };
  }, [event, onActive]);

  // Audio Playback Logic
  const handlePlayAudio = () => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) {
      alert("Browser Anda tidak mendukung fitur Text-to-Speech.");
      return;
    }

    if (isPlaying) {
      window.speechSynthesis.cancel();
      setIsPlaying(false);
      return;
    }

    const textToRead = event.description[language] || event.description['id'];
    const utterance = new SpeechSynthesisUtterance(textToRead);
    
    if (language === 'ar') utterance.lang = 'ar-SA';
    else if (language === 'id') utterance.lang = 'id-ID';
    else utterance.lang = 'en-US';
    
    // Adjust speed and pitch for better storytelling
    utterance.rate = 0.85; 
    utterance.pitch = 0.95;

    utterance.onend = () => setIsPlaying(false);
    utterance.onerror = () => setIsPlaying(false);

    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utterance);
    setIsPlaying(true);
  };

  // Stop audio if component unmounts or language changes
  useEffect(() => {
    window.speechSynthesis?.cancel();
    setIsPlaying(false);
    return () => {
      window.speechSynthesis?.cancel();
    };
  }, [language]);

  return (
    <div
      ref={cardRef}
      className="min-h-[80vh] flex flex-col justify-center px-4 py-16 sm:px-8 max-w-2xl mx-auto"
      dir={dir}
    >
      <motion.div 
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: false, margin: "-10% 0px -10% 0px" }}
        transition={{ duration: 0.7, ease: "easeOut" }}
        className={`bg-parchment-sand p-6 md:p-10 rounded-2xl shadow-2xl border transition-all duration-700 relative z-10 ${
          isActive 
            ? "border-sand-gold shadow-[0_0_40px_-10px_rgba(217,119,6,0.3)] scale-[1.02]" 
            : "border-desert-umber/20 hover:border-sand-gold/50 scale-100"
        } ${isArabic ? "font-arabic text-right" : ""}`}
      >
        <div className={`flex items-center justify-between mb-4`}>
          <div className={`flex items-center gap-2 text-sand-gold text-sm tracking-widest uppercase ${isArabic ? 'font-sans font-bold' : 'font-semibold'}`}>
            <span className="w-8 h-[1px] bg-sand-gold inline-block"></span>
            {isArabic ? `الباب ` : `Bab `} {event.order < 10 ? `0${event.order}` : event.order}
          </div>
          
          <button 
            onClick={handlePlayAudio}
            className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-deep-obsidian border border-white/10 text-gray-300 hover:text-sand-gold hover:border-sand-gold/30 transition-colors"
            title={isArabic ? "استمع إلى السرد" : (language === "id" ? "Dengarkan Narasi" : "Listen to Narrative")}
          >
            {isPlaying ? (
              <>
                <Square className="w-3.5 h-3.5 fill-current" />
                <span className="text-xs font-semibold uppercase">{isArabic ? "إيقاف" : "Stop"}</span>
              </>
            ) : (
              <>
                <Volume2 className="w-4 h-4" />
                <span className="text-xs font-semibold uppercase">{isArabic ? "استمع" : "Play"}</span>
              </>
            )}
          </button>
        </div>
        
        <h2 className={`text-3xl md:text-5xl font-bold mb-6 text-white leading-tight ${isArabic ? 'leading-relaxed' : ''}`}>
          {event.title[language] || event.title['id']}
        </h2>
        
        <p className={`text-lg md:text-xl text-gray-300 mb-8 font-light ${isArabic ? 'leading-loose' : 'leading-relaxed'}`}>
          {event.description[language] || event.description['id']}
        </p>

        <div className={`bg-deep-obsidian/60 rounded-xl p-5 border border-white/5 flex items-start gap-4 ${isArabic ? 'font-sans text-right flex-row' : ''}`}>
          <div className="bg-desert-umber/20 p-2 rounded-lg">
            <BookOpen className="w-6 h-6 text-desert-umber shrink-0" />
          </div>
          <div>
            <p className="text-sm text-gray-400 font-medium tracking-wide">AR-RAHIQ AL-MAKHTUM</p>
            <p className="text-sm text-gray-500 mt-1">
              {isArabic ? `الصفحة ${event.bookReference.page} • الباب: ${event.bookReference.chapter}` : `Halaman ${event.bookReference.page} • Bab: ${event.bookReference.chapter}`}
            </p>
          </div>
        </div>

        {event.ibrahs && event.ibrahs.length > 0 && (
          <div className={`mt-10 space-y-5 ${isArabic ? 'font-sans' : ''}`}>
            <h3 className="text-xl font-bold text-emerald-prophetic flex items-center gap-3">
              <span className="w-2 h-2 rounded-full bg-emerald-prophetic inline-block animate-pulse"></span>
              {isArabic ? "العبر والدروس" : (language === "id" ? "Ibrah & Aksi Nyata" : "Lessons & Actions")}
            </h3>
            {event.ibrahs.map((ibrah) => (
              <motion.div 
                key={ibrah.id}
                initial={{ opacity: 0, x: isArabic ? 20 : -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className={`p-5 ${
                  isArabic 
                    ? 'bg-gradient-to-l from-emerald-prophetic/10 to-transparent border-r-4 border-emerald-prophetic rounded-l-xl' 
                    : 'bg-gradient-to-r from-emerald-prophetic/10 to-transparent border-l-4 border-emerald-prophetic rounded-r-xl'
                }`}
              >
                <h4 className="font-bold text-emerald-100 mb-2 text-lg">{ibrah.title}</h4>
                <p className="text-sm text-emerald-200/80 mb-4 leading-relaxed">{ibrah.description}</p>
                <div className="text-sm bg-emerald-prophetic/20 text-emerald-100 p-3 rounded-lg border border-emerald-prophetic/30 flex gap-2 items-start">
                  <span className="font-bold shrink-0">{isArabic ? "إجراء عملي:" : (language === "id" ? "Aksi Praktis:" : "Practical Action:")}</span> 
                  <span>{ibrah.practicalAction}</span>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </motion.div>
    </div>
  );
}
