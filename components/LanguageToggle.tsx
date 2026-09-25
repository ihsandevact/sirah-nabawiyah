"use client";

import React from "react";

interface LanguageToggleProps {
  language: "id" | "en" | "ar";
  onChange: (lang: "id" | "en" | "ar") => void;
}

export default function LanguageToggle({ language, onChange }: LanguageToggleProps) {
  return (
    <div className="fixed top-4 right-4 z-50 bg-parchment-sand rounded-full p-1 border border-desert-umber/30 shadow-lg flex items-center backdrop-blur-md">
      <button
        onClick={() => onChange("id")}
        className={`px-3 py-1.5 rounded-full text-xs font-bold transition-colors ${
          language === "id"
            ? "bg-sand-gold text-white"
            : "text-gray-400 hover:text-white"
        }`}
      >
        ID
      </button>
      <button
        onClick={() => onChange("en")}
        className={`px-3 py-1.5 rounded-full text-xs font-bold transition-colors ${
          language === "en"
            ? "bg-sand-gold text-white"
            : "text-gray-400 hover:text-white"
        }`}
      >
        EN
      </button>
      <button
        onClick={() => onChange("ar")}
        className={`px-3 py-1.5 rounded-full text-xs font-bold transition-colors ${
          language === "ar"
            ? "bg-sand-gold text-white"
            : "text-gray-400 hover:text-white"
        }`}
      >
        AR
      </button>
    </div>
  );
}
