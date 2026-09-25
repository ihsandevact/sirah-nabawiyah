"use client";

import React, { useRef, useEffect, useState } from "react";
import ForceGraph2D from "react-force-graph-2d";
import nasabData from "@/data/nasab.json";

export default function NasabGraph() {
  const fgRef = useRef<any>(null);
  const [dimensions, setDimensions] = useState({ width: 800, height: 600 });

  useEffect(() => {
    // Fit to window size
    setDimensions({
      width: window.innerWidth,
      height: window.innerHeight,
    });
    
    const handleResize = () => {
      setDimensions({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };
    window.addEventListener("resize", handleResize);
    
    // Zoom to fit after a short delay to allow physics to settle
    setTimeout(() => {
      if (fgRef.current) {
        fgRef.current.zoomToFit(400, 50);
      }
    }, 1000);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className="w-full h-screen bg-deep-obsidian overflow-hidden cursor-move">
      <ForceGraph2D
        ref={fgRef}
        graphData={nasabData}
        width={dimensions.width}
        height={dimensions.height}
        nodeLabel="name"
        nodeRelSize={6}
        nodeColor={(node) => {
          if (node.group === 4) return "#D97706"; // Prophet Muhammad (Gold)
          if (node.group === 2) return "#10B981"; // Banu Hashim (Emerald)
          if (node.group === 3) return "#EF4444"; // Banu Umayya / Others (Red/Brown)
          return "#9CA3AF"; // Ancestors (Gray)
        }}
        linkColor={() => "#4B5563"}
        linkWidth={1.5}
        linkDirectionalParticles={2}
        linkDirectionalParticleSpeed={0.005}
        nodeCanvasObject={(node, ctx, globalScale) => {
          const label = node.name as string;
          const fontSize = 12 / globalScale;
          ctx.font = `bold ${fontSize}px Sans-Serif`;
          
          // Calculate text width for background
          const textWidth = ctx.measureText(label).width;
          const bckgDimensions = [textWidth, fontSize].map(n => n + fontSize * 0.2) as [number, number]; 

          ctx.fillStyle = 'rgba(12, 10, 9, 0.8)';
          if (typeof node.x === 'number' && typeof node.y === 'number') {
            ctx.fillRect(node.x - bckgDimensions[0] / 2, node.y - bckgDimensions[1] / 2, ...bckgDimensions);

            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            
            // Text color matches node color
            if (node.group === 4) ctx.fillStyle = "#FBBF24"; 
            else if (node.group === 2) ctx.fillStyle = "#34D399";
            else if (node.group === 3) ctx.fillStyle = "#FCA5A5";
            else ctx.fillStyle = "#E5E7EB";
            
            ctx.fillText(label, node.x, node.y);
          }
        }}
      />
      
      {/* Legend Overlay */}
      <div className="absolute bottom-8 left-8 bg-black/60 p-4 rounded-xl border border-white/10 backdrop-blur-sm">
        <h3 className="text-white font-bold mb-3 uppercase tracking-widest text-sm">Keterangan Nasab</h3>
        <div className="space-y-2 text-sm">
          <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-amber-500"></div><span className="text-gray-300">Nabi Muhammad ﷺ</span></div>
          <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-emerald-500"></div><span className="text-gray-300">Bani Hasyim (Leluhur Langsung)</span></div>
          <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-red-500"></div><span className="text-gray-300">Bani Abdu Syams / Umayyah</span></div>
          <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-gray-400"></div><span className="text-gray-300">Leluhur Awal (Quraisy)</span></div>
        </div>
      </div>
    </div>
  );
}
