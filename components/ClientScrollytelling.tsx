"use client";

import React, { useState } from "react";
import dynamic from "next/dynamic";
import { SirahEvent } from "@/types/sirah";
import NarrativeCard from "./NarrativeCard";
import LanguageToggle from "./LanguageToggle";

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

  if (events.length === 0) {
    return <div className="p-8 text-center text-white">No data available.</div>;
  }

  const mapData = activeEvent ? activeEvent.mapData : events[0].mapData;

  return (
    <div className="flex flex-col md:flex-row w-full h-full">
      {/* Mobile Map (Top Fixed) / Desktop Map (Right Sticky) */}
      <div className="h-[40vh] md:h-screen w-full md:w-[55%] fixed top-0 md:right-0 z-0 bg-desert-umber">
        <MapViewer 
          center={mapData.center} 
          zoom={mapData.zoom} 
          pitch={mapData.pitch} 
          bearing={mapData.bearing} 
          tacticalData={activeEvent?.tacticalData}
        />
      </div>

      {/* Mobile Text (Bottom Scroll) / Desktop Text (Left Scroll) */}
      <div className="w-full md:w-[45%] h-full z-10 mt-[40vh] md:mt-0 md:bg-deep-obsidian/95 backdrop-blur-sm overflow-y-auto overflow-x-hidden scroll-smooth relative pointer-events-auto">
        
        {/* Header / Intro Spacer */}
        <div className="min-h-screen flex flex-col items-center justify-center p-8 text-center relative border-b border-white/5">
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-deep-obsidian/50 pointer-events-none"></div>
          <h1 className="text-4xl md:text-6xl font-arabic font-bold text-sand-gold mb-6 drop-shadow-lg">
            السيرة النبوية
          </h1>
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
            Sirah Interaktif
          </h2>
          <p className="text-gray-400 max-w-md mx-auto" dir={language === "ar" ? "rtl" : "ltr"}>
            {language === "id" 
              ? "Jelajahi jejak langkah Rasulullah ﷺ dan para sahabat melalui visualisasi spasial historis."
              : language === "en"
              ? "Explore the historical footsteps of Prophet Muhammad ﷺ and the companions through spatial visualization."
              : "استكشف الخطى التاريخية للنبي محمد ﷺ والصحابة من خلال التصور المكاني."}
          </p>
          
          <div className="mt-8 flex justify-center">
            <a href="/nasab" className="px-6 py-3 rounded-full bg-sand-gold/20 border border-sand-gold text-sand-gold hover:bg-sand-gold hover:text-white transition-all font-semibold text-sm tracking-wide">
              {language === "ar" ? "عرض شجرة العائلة (النسب)" : "Lihat Pohon Nasab (Node Graph)"}
            </a>
          </div>

          <div className="mt-12 animate-bounce opacity-50">
            <span className="text-sm tracking-widest uppercase">{language === "ar" ? "قم بالتمرير لأسفل" : "Scroll ke bawah"}</span>
            <div className="w-px h-12 bg-sand-gold mx-auto mt-2"></div>
          </div>
        </div>

        <div className="pb-32">
          {events.map((event) => (
            <NarrativeCard 
              key={event.id} 
              event={event} 
              language={language}
              isActive={activeEvent?.id === event.id}
              onActive={setActiveEvent} 
            />
          ))}
        </div>
      </div>

      <LanguageToggle language={language} onChange={setLanguage} />
    </div>
  );
}
