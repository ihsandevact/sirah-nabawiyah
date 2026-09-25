"use client";

import React, { useState } from "react";
import dynamic from "next/dynamic";
import { SirahEvent } from "@/types/sirah";
import NarrativeCard from "./NarrativeCard";
import LanguageToggle from "./LanguageToggle";
import DeepDiveModal from "./DeepDiveModal";
import { Menu, X, Book } from "lucide-react";

const MapViewer = dynamic(() => import("./MapViewer"), {
  ssr: false,
  loading: () => <div className="w-full h-full flex items-center justify-center text-sand-gold font-bold">Memuat Peta...</div>
});

interface ClientScrollytellingProps {
  events: SirahEvent[];
}

export default function ClientScrollytelling({ events }: ClientScrollytellingProps) {
  const [language, setLanguage] = useState<"id" | "en" | "ar">("id");
  const [activeEvent, setActiveEvent] = useState<SirahEvent | null>(events.length > 0 ? events[0] : null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [modalEvent, setModalEvent] = useState<SirahEvent | null>(null);

  if (events.length === 0) {
    return <div className="p-8 text-center text-white">No data available.</div>;
  }

  const mapData = activeEvent ? activeEvent.mapData : events[0].mapData;
  const isArabic = language === "ar";

  return (
    <div className="flex flex-col md:flex-row w-full h-full">
      
      {/* Universal Floating Menu Button */}
      <button 
        onClick={() => setIsSidebarOpen(true)}
        className="fixed top-4 left-4 z-50 p-3 bg-deep-obsidian/80 backdrop-blur-md rounded-xl border border-white/10 text-white shadow-[0_0_20px_rgba(0,0,0,0.5)] hover:bg-deep-obsidian transition-all group flex items-center gap-3"
      >
        <Menu className="w-6 h-6 group-hover:text-sand-gold transition-colors" />
        <span className="hidden md:inline font-bold text-sm tracking-wide text-gray-300 group-hover:text-white uppercase">Daftar Isi</span>
      </button>

      {/* Off-canvas Sidebar Navigation (Overlay) */}
      <div className={`fixed top-0 left-0 h-screen w-80 bg-deep-obsidian/95 backdrop-blur-xl border-r border-white/10 z-[60] transform transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] flex flex-col shadow-2xl ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}`}>
        
        {/* Sidebar Header */}
        <div className="p-6 border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Book className="w-6 h-6 text-sand-gold" />
            <h2 className="text-lg font-bold text-white tracking-wide">
              {isArabic ? "قائمة المحتويات" : (language === "en" ? "Table of Contents" : "Daftar Isi")}
            </h2>
          </div>
          <button onClick={() => setIsSidebarOpen(false)} className="text-gray-400 hover:text-white bg-white/5 p-2 rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Sidebar Links */}
        <div className="flex-1 overflow-y-auto p-4 space-y-1 scroll-smooth">
          {events.map((event) => {
            const isActive = activeEvent?.id === event.id;
            return (
              <a
                key={event.id}
                href={`#${event.id}`}
                onClick={() => setIsSidebarOpen(false)}
                className={`block px-4 py-3 text-sm rounded-xl transition-all duration-300 ${
                  isActive 
                    ? "bg-sand-gold/15 text-sand-gold font-bold border-l-4 border-sand-gold shadow-inner" 
                    : "text-gray-400 hover:bg-white/5 hover:text-gray-200 border-l-4 border-transparent"
                } ${isArabic ? "text-right font-arabic" : ""}`}
                dir={isArabic ? "rtl" : "ltr"}
              >
                <div className="text-xs uppercase tracking-widest opacity-60 mb-1">
                  {isArabic ? "الباب" : "Bab"} {event.order < 10 ? `0${event.order}` : event.order}
                </div>
                {event.title[language] || event.title['id']}
              </a>
            );
          })}
        </div>
        
        {/* Sidebar Footer */}
        <div className="p-4 border-t border-white/10 text-center">
          <a href="/nasab" className="block w-full py-3 rounded-xl bg-sand-gold/20 text-sand-gold hover:bg-sand-gold hover:text-white transition-colors text-sm font-semibold tracking-wide">
            {isArabic ? "شجرة النسب" : "Pohon Nasab"}
          </a>
        </div>
      </div>

      {/* Overlay Backdrop */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/60 z-50 backdrop-blur-sm transition-opacity duration-500 cursor-pointer"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Mobile Map (Top Fixed) / Desktop Map (Right Sticky) */}
      {/* Restored to 55vw width for Desktop to balance layout */}
      <div className="h-[40vh] md:h-screen w-full md:w-[55vw] fixed top-0 md:right-0 z-0 bg-desert-umber">
        <MapViewer 
          center={mapData.center} 
          zoom={mapData.zoom} 
          pitch={mapData.pitch} 
          bearing={mapData.bearing} 
          tacticalData={activeEvent?.tacticalData}
        />
      </div>

      {/* Mobile Text (Bottom Scroll) / Desktop Text (Left Scroll) */}
      {/* Restored to 45vw width for comfortable reading space */}
      <div className="w-full md:w-[45vw] h-full z-10 mt-[40vh] md:mt-0 md:bg-deep-obsidian/95 backdrop-blur-sm overflow-y-auto overflow-x-hidden scroll-smooth relative pointer-events-auto shadow-2xl">
        
        {/* Header / Intro Spacer */}
        <div className="min-h-screen flex flex-col items-center justify-center p-8 text-center relative border-b border-white/5">
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-deep-obsidian/50 pointer-events-none"></div>
          <h1 className="text-4xl md:text-5xl font-arabic font-bold text-sand-gold mb-6 drop-shadow-lg pt-12 md:pt-0">
            السيرة النبوية
          </h1>
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
            Sirah Interaktif
          </h2>
          <p className="text-gray-400 max-w-sm mx-auto text-sm leading-relaxed" dir={isArabic ? "rtl" : "ltr"}>
            {language === "id" 
              ? "Jelajahi jejak langkah Rasulullah ﷺ dan para sahabat melalui visualisasi spasial historis."
              : language === "en"
              ? "Explore the historical footsteps of Prophet Muhammad ﷺ and the companions through spatial visualization."
              : "استكشف الخطى التاريخية للنبي محمد ﷺ والصحابة من خلال التصور المكاني."}
          </p>

          <div className="mt-16 animate-bounce opacity-50 flex flex-col items-center">
            <span className="text-xs tracking-widest uppercase mb-2">
              {isArabic ? "قم بالتمرير لأسفل" : "Mulai Membaca"}
            </span>
            <div className="w-px h-16 bg-gradient-to-b from-sand-gold to-transparent"></div>
          </div>
        </div>

        <div className="pb-32 px-4 md:px-8">
          {events.map((event) => (
            <NarrativeCard 
              key={event.id} 
              event={event} 
              language={language}
              isActive={activeEvent?.id === event.id}
              onActive={setActiveEvent} 
              onOpenModal={() => setModalEvent(event)}
            />
          ))}
        </div>
      </div>

      <LanguageToggle language={language} onChange={setLanguage} />
      
      {/* Deep Dive Modal Overlay */}
      <DeepDiveModal 
        event={modalEvent} 
        language={language} 
        onClose={() => setModalEvent(null)} 
      />
    </div>
  );
}
