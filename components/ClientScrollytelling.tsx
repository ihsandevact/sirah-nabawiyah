"use client";

import React, { useState } from "react";
import dynamic from "next/dynamic";
import { SirahEvent } from "@/types/sirah";
import NarrativeCard from "./NarrativeCard";
import LanguageToggle from "./LanguageToggle";
import DeepDiveModal from "./DeepDiveModal";
import QuizSection from "./QuizSection";
import { Menu, X, Book, Search, Compass } from "lucide-react";

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
  const [searchQuery, setSearchQuery] = useState("");
  const [readEvents, setReadEvents] = useState<string[]>([]);
  const [isExploreMode, setIsExploreMode] = useState(false);

  React.useEffect(() => {
    const saved = localStorage.getItem('sirah_read_events');
    if (saved) {
      try { setReadEvents(JSON.parse(saved)); } catch (e) {}
    }
  }, []);

  const handleEventActive = (event: SirahEvent) => {
    setActiveEvent(event);
    if (!readEvents.includes(event.id)) {
      setReadEvents(prev => {
        const next = [...prev, event.id];
        localStorage.setItem('sirah_read_events', JSON.stringify(next));
        return next;
      });
    }
  };

  if (events.length === 0) {
    return <div className="p-8 text-center text-white">No data available.</div>;
  }

  const mapData = activeEvent ? activeEvent.mapData : events[0].mapData;
  const isArabic = language === "ar";
  const dir = isArabic ? "rtl" : "ltr";

  const filteredEvents = events.filter((event) => {
    const query = searchQuery.toLowerCase();
    const title = (event.title[language] || event.title['id'] || "").toLowerCase();
    const desc = (event.description[language] || event.description['id'] || "").toLowerCase();
    return title.includes(query) || desc.includes(query);
  });

  const scrollToEvent = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "center" });
    }
    setIsSidebarOpen(false); // Close sidebar after clicking
  };

  return (
    <div className="flex flex-col md:flex-row w-full h-full">
      
      {/* Universal Floating Menu Button */}
      <button 
        onClick={() => setIsSidebarOpen(true)}
        className="fixed top-4 left-4 z-50 p-3 bg-deep-obsidian/80 backdrop-blur-md rounded-xl border border-white/10 text-white shadow-[0_0_20px_rgba(0,0,0,0.5)] hover:bg-deep-obsidian transition-all group flex items-center justify-center"
      >
        <Menu className="w-6 h-6 group-hover:text-sand-gold transition-colors" />
      </button>

      {/* Off-canvas Sidebar Navigation (Overlay) */}
      <div className={`fixed top-0 left-0 h-screen w-80 bg-deep-obsidian/95 backdrop-blur-xl border-r border-white/10 z-[60] transform transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] flex flex-col shadow-2xl ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}`}>
        
        {/* Sidebar Header */}
        <div className="p-6 border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Compass className="w-6 h-6 text-sand-gold" />
            <h2 className="text-lg font-bold text-white tracking-wide">
              {isArabic ? "القائمة الرئيسية" : (language === "en" ? "Main Menu" : "Menu Utama")}
            </h2>
          </div>
          <button onClick={() => setIsSidebarOpen(false)} className="text-gray-400 hover:text-white bg-white/5 p-2 rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search Bar */}
        <div className="p-4 border-b border-white/10">
          <div className="relative">
            <div className={`absolute inset-y-0 ${isArabic ? 'right-3' : 'left-3'} flex items-center pointer-events-none`}>
              <Search className="w-4 h-4 text-gray-400" />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={isArabic ? "ابحث عن حدث..." : (language === "en" ? "Search events..." : "Cari peristiwa...")}
              className={`w-full bg-black/20 border border-white/10 rounded-lg py-2.5 ${isArabic ? 'pr-10 pl-4 text-right' : 'pl-10 pr-4 text-left'} text-sm focus:outline-none focus:border-sand-gold focus:ring-1 focus:ring-sand-gold transition-all text-white placeholder-gray-500`}
              dir={dir}
            />
          </div>
        </div>

        {/* Sidebar Links */}
        <div className="flex-1 overflow-y-auto p-4 space-y-1 scroll-smooth">
          {filteredEvents.length === 0 ? (
            <div className="text-center text-gray-500 text-sm mt-8">
              {isArabic ? "لم يتم العثور على أي حدث." : (language === "en" ? "No events found." : "Tidak ada peristiwa yang cocok.")}
            </div>
          ) : (
            filteredEvents.map((event) => {
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
                  <div className="flex items-center justify-between gap-2">
                    <div>
                      <div className="text-xs uppercase tracking-widest opacity-60 mb-1">
                        {isArabic ? "الباب" : "Bab"} {event.order < 10 ? `0${event.order}` : event.order}
                      </div>
                      <div className="leading-snug">{event.title[language] || event.title['id']}</div>
                    </div>
                    {readEvents.includes(event.id) && (
                      <div className="flex-shrink-0 text-sand-gold text-lg bg-sand-gold/10 rounded-full w-6 h-6 flex items-center justify-center shadow-[0_0_10px_rgba(217,119,6,0.2)]" title={isArabic ? "مكتمل" : "Selesai dibaca"}>
                        ✓
                      </div>
                    )}
                  </div>
                </a>
              );
            })
          )}
        </div>
        
        {/* Sidebar Footer */}
        <div className="p-4 border-t border-white/10 flex flex-col gap-3">
          <LanguageToggle language={language} onChange={setLanguage} />
          <a href="/nasab" className="block w-full py-3 rounded-xl bg-sand-gold/20 text-sand-gold hover:bg-sand-gold hover:text-white transition-colors text-sm font-semibold tracking-wide text-center">
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

      {/* Explore Mode Toggle Button */}
      <button 
        onClick={() => setIsExploreMode(!isExploreMode)}
        className="fixed top-4 left-20 z-50 p-3 bg-deep-obsidian/80 backdrop-blur-md rounded-xl border border-white/10 text-white shadow-[0_0_20px_rgba(0,0,0,0.5)] hover:bg-deep-obsidian transition-all group flex items-center gap-3"
      >
        <Compass className={`w-6 h-6 transition-colors ${isExploreMode ? 'text-sand-gold animate-pulse' : 'group-hover:text-sand-gold'}`} />
        <span className="hidden md:inline font-bold text-sm tracking-wide text-gray-300 group-hover:text-white uppercase">
          {isExploreMode ? (language === "en" ? "Read Story" : "Baca Cerita") : (language === "en" ? "Explore" : "Eksplorasi")}
        </span>
      </button>

      {/* Mobile Map (Top Fixed) / Desktop Map (Right Sticky) */}
      <div className={`fixed top-0 md:right-0 z-0 bg-desert-umber transition-all duration-700 ease-in-out ${isExploreMode ? 'w-full h-screen' : 'h-[40vh] md:h-screen w-full md:w-[50vw]'}`}>
        <MapViewer 
          center={mapData.center} 
          zoom={mapData.zoom} 
          pitch={mapData.pitch} 
          bearing={mapData.bearing} 
          tacticalData={activeEvent?.tacticalData}
          isExploreMode={isExploreMode}
        />
      </div>

      {/* Mobile Text (Bottom Scroll) / Desktop Text (Left Scroll) */}
      <div className={`h-full z-10 md:bg-deep-obsidian/95 backdrop-blur-sm overflow-y-auto overflow-x-hidden scroll-smooth relative pointer-events-auto shadow-2xl transition-all duration-700 ease-in-out ${isExploreMode ? 'w-0 opacity-0 invisible' : 'w-full md:w-[50vw] mt-[40vh] md:mt-0 opacity-100 visible'}`}>
        
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

        <div className="pb-48 px-4 md:px-8">
          {events.map((event) => (
            <NarrativeCard 
              key={event.id} 
              event={event} 
              language={language}
              isActive={activeEvent?.id === event.id}
              onActive={handleEventActive} 
              onOpenModal={() => setModalEvent(event)}
            />
          ))}

          {/* Gamifikasi Kuis Sirah */}
          <QuizSection language={language} />
        </div>
      </div>

      {/* Interactive Timeline (Bottom Floating) */}
      <div className="fixed bottom-6 right-[25vw] translate-x-1/2 z-50 hidden md:flex flex-wrap justify-center items-center gap-1.5 p-3 bg-deep-obsidian/80 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl max-w-[45vw]">
        {events.map((event, index) => {
          const isActive = activeEvent?.id === event.id;
          const isPassed = activeEvent ? events.findIndex(e => e.id === activeEvent.id) >= index : false;
          
          return (
            <button
              key={event.id}
              onClick={() => scrollToEvent(event.id)}
              className="group relative flex flex-col items-center justify-center transition-all px-1"
            >
              {/* Tooltip */}
              <div className="absolute bottom-full mb-3 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap bg-deep-obsidian border border-sand-gold/30 shadow-xl text-white text-xs py-2 px-3 rounded-xl pointer-events-none flex flex-col items-center gap-1 z-[100]">
                <span className="text-sand-gold font-bold uppercase tracking-widest text-[10px]">{event.order < 10 ? `Bab 0${event.order}` : `Bab ${event.order}`}</span>
                <span className="text-gray-200 font-medium">{event.title[language] || event.title['id']}</span>
              </div>
              
              {/* Dot */}
              <div 
                className={`h-2 transition-all duration-300 rounded-full ${
                  isActive 
                    ? "w-8 bg-sand-gold shadow-[0_0_10px_rgba(217,119,6,0.8)]" 
                    : isPassed 
                      ? "w-2 bg-desert-umber" 
                      : "w-2 bg-white/20 hover:bg-white/50"
                }`}
              />
            </button>
          );
        })}
      </div>
      
      {/* Deep Dive Modal Overlay */}
      <DeepDiveModal 
        event={modalEvent} 
        language={language} 
        onClose={() => setModalEvent(null)} 
      />
    </div>
  );
}
