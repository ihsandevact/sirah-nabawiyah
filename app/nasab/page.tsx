"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

// Must dynamically import the ForceGraph to avoid window is not defined errors in SSR
const NasabGraph = dynamic(() => import("@/components/NasabGraph"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-screen flex items-center justify-center bg-deep-obsidian text-sand-gold font-bold">
      Memuat Jaringan Nasab...
    </div>
  )
});

export default function NasabPage() {
  return (
    <main className="w-full h-screen relative bg-deep-obsidian">
      {/* Back Button */}
      <Link href="/" className="absolute top-6 left-6 z-50 flex items-center gap-2 bg-black/50 hover:bg-black/80 px-4 py-2 rounded-full border border-white/10 text-white transition-all backdrop-blur-md">
        <ArrowLeft className="w-4 h-4" />
        <span className="font-semibold text-sm">Kembali ke Peta</span>
      </Link>
      
      {/* Header Title */}
      <div className="absolute top-6 right-6 z-50 text-right pointer-events-none">
        <h1 className="text-2xl font-bold text-white tracking-wide">Pohon Nasab Quraisy</h1>
        <p className="text-gray-400 text-sm mt-1">Interaktif Node Network Graph</p>
      </div>

      <NasabGraph />
    </main>
  );
}
