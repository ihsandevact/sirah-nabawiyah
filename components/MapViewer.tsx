"use client";

import React, { useRef, useEffect, useState } from "react";
import * as maplibregl from "maplibre-gl";
import { Coordinate } from "@/types/sirah";
import along from "@turf/along";
import length from "@turf/length";
import { FeatureCollection, Feature, Point, LineString } from "geojson";

interface MapViewerProps {
  center: Coordinate;
  zoom: number;
  pitch?: number;
  bearing?: number;
  tacticalData?: any;
}

export default function MapViewer({ center, zoom, pitch = 0, bearing = 0, tacticalData }: MapViewerProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<maplibregl.Map | null>(null);
  const [mapLoaded, setMapLoaded] = useState(false);

  useEffect(() => {
    if (map.current || !mapContainer.current) return;

    // Fix: Explicitly declare the worker URL using CDN to avoid Next.js bundler issues
    maplibregl.setWorkerUrl("https://unpkg.com/maplibre-gl@6.11.2/dist/maplibre-gl-worker.mjs");

    map.current = new maplibregl.Map({
      container: mapContainer.current,
      style: "https://tiles.openfreemap.org/styles/liberty", // Default OpenFreeMap style
      center: center,
      zoom: zoom,
      pitch: pitch,
      bearing: bearing,
      attributionControl: false,
    });

    map.current.addControl(new maplibregl.NavigationControl(), "top-right");

    map.current.on("load", () => {
      setMapLoaded(true);
      map.current?.resize(); // Force layout recalculation when style is loaded
    });

    // ResizeObserver ensures map matches container size dynamically
    const resizeObserver = new ResizeObserver(() => {
      if (map.current) {
        map.current.resize();
      }
    });
    resizeObserver.observe(mapContainer.current);

    return () => {
      resizeObserver.disconnect();
      map.current?.remove();
      map.current = null;
    };
  }, []); // Only run once on mount

  useEffect(() => {
    if (!mapLoaded || !map.current) return;

    map.current.flyTo({
      center,
      zoom,
      pitch,
      bearing,
      essential: true,
      duration: 2000,
    });
  }, [center, zoom, pitch, bearing, mapLoaded]);

  useEffect(() => {
    if (!mapLoaded || !map.current) return;

    const sourceId = "tactical-source";

    if (!map.current.getSource(sourceId)) {
      map.current.addSource(sourceId, {
        type: "geojson",
        data: { type: "FeatureCollection", features: [] }
      });
      map.current.addSource("tactical-animated-source", {
        type: "geojson",
        data: { type: "FeatureCollection", features: [] }
      });
    }

    const addTacticalLayers = () => {
      if (!map.current) return;
      if (!map.current.getSource(sourceId)) return;

      if (!map.current.getLayer("tactical-polygon")) {
        map.current.addLayer({
          id: "tactical-polygon",
          type: "fill",
          source: sourceId,
          filter: ["==", ["geometry-type"], "Polygon"],
          paint: {
            "fill-color": ["get", "color"],
            "fill-opacity": 0.4
          }
        });
      }

      if (!map.current.getLayer("tactical-line")) {
        map.current.addLayer({
          id: "tactical-line",
          type: "line",
          source: sourceId,
          filter: ["==", ["geometry-type"], "LineString"],
          paint: {
            "line-color": ["get", "color"],
            "line-width": 4,
            "line-dasharray": [2, 2]
          }
        });
      }

      if (!map.current.getLayer("tactical-point")) {
        map.current.addLayer({
          id: "tactical-point",
          type: "circle",
          source: sourceId,
          filter: ["all", ["==", ["geometry-type"], "Point"], ["!", ["has", "icon"]]],
          paint: {
            "circle-radius": 6,
            "circle-color": ["get", "color"],
            "circle-stroke-width": 2,
            "circle-stroke-color": "#ffffff"
          }
        });
      }
      
      if (!map.current.getLayer("tactical-icon")) {
        map.current.addLayer({
          id: "tactical-icon",
          type: "symbol",
          source: sourceId,
          filter: ["all", ["==", ["geometry-type"], "Point"], ["has", "icon"]],
          layout: {
            "text-field": ["get", "icon"],
            "text-size": 32,
            "text-anchor": "bottom",
            "text-allow-overlap": true
          }
        });
      }

      if (!map.current.getLayer("tactical-label")) {
        map.current.addLayer({
          id: "tactical-label",
          type: "symbol",
          source: sourceId,
          layout: {
            "text-field": ["get", "label"],
            "text-size": 14,
            "text-anchor": "top",
            "text-offset": [0, 0.5]
          },
          paint: {
            "text-color": ["get", "color"],
            "text-halo-color": "#ffffff",
            "text-halo-width": 2
          }
        });
      }

      if (!map.current.getLayer("tactical-animated-point")) {
        map.current.addLayer({
          id: "tactical-animated-point",
          type: "circle",
          source: "tactical-animated-source",
          paint: {
            "circle-radius": 8,
            "circle-color": ["get", "color"],
            "circle-stroke-width": 3,
            "circle-stroke-color": "#ffffff",
            "circle-pitch-alignment": "map"
          }
        });
      }
    };

    addTacticalLayers();

    const src = map.current.getSource(sourceId) as maplibregl.GeoJSONSource;
    if (src) {
      if (tacticalData) {
        src.setData(tacticalData);
      } else {
        src.setData({ type: "FeatureCollection", features: [] });
      }
    }

    // Handle style changes by re-adding layers once style loads
    const onStyleData = () => {
      addTacticalLayers();
    };
    map.current.on('styledata', onStyleData);

    // Animation Loop for Marching Ants and Moving Points
    let animationId: number;
    let step = 0;
    let time = 0;
    const dashArraySequence = [
      [0, 4, 3], [0.5, 4, 2.5], [1, 4, 2], [1.5, 4, 1.5], [2, 4, 1], [2.5, 4, 0.5], [3, 4, 0],
      [0, 0, 3, 4], [0, 0.5, 3, 4], [0, 1, 3, 4], [0, 1.5, 3, 4], [0, 2, 3, 4], [0, 2.5, 3, 4], [0, 3, 3, 4]
    ];
    
    // Extract LineStrings and their lengths for point animation
    const lines = tacticalData?.features?.filter((f: any) => f.geometry.type === 'LineString') || [];
    const lineLengths = lines.map((line: any) => length(line as Feature<LineString>));
    
    const animateTactics = () => {
      if (!map.current) return;

      // 1. Marching Ants
      if (map.current.getLayer("tactical-line")) {
        const newStep = Math.floor(step / 2) % dashArraySequence.length;
        map.current.setPaintProperty("tactical-line", "line-dasharray", dashArraySequence[newStep]);
        step++;
      }
      
      // 2. Moving Points along lines
      if (lines.length > 0) {
        time += 0.005; // speed of animation (0 to 1 loop)
        const pointFeatures: Feature<Point>[] = lines.map((line: any, idx: number) => {
          const l = lineLengths[idx];
          // use modulo to loop from 0 to total length
          const distance = (time % 1) * l; 
          const p = along(line as Feature<LineString>, distance);
          p.properties = { ...line.properties };
          return p as Feature<Point>;
        });
        
        const animSrc = map.current.getSource("tactical-animated-source") as maplibregl.GeoJSONSource;
        if (animSrc) {
          animSrc.setData({ type: "FeatureCollection", features: pointFeatures });
        }
      } else {
        const animSrc = map.current.getSource("tactical-animated-source") as maplibregl.GeoJSONSource;
        if (animSrc) {
          animSrc.setData({ type: "FeatureCollection", features: [] });
        }
      }

      animationId = requestAnimationFrame(animateTactics);
    };
    
    animateTactics();

    return () => {
      if (animationId) cancelAnimationFrame(animationId);
      if (map.current) map.current.off('styledata', onStyleData);
    };
  }, [tacticalData, mapLoaded]);

  const [isSatellite, setIsSatellite] = useState(false);
  const toggleMapStyle = () => {
    if (!map.current) return;
    const newMode = !isSatellite;
    setIsSatellite(newMode);
    
    if (newMode) {
      // Free satellite layer via Esri
      map.current.setStyle({
        version: 8,
        sources: {
          'satellite': {
            type: 'raster',
            tiles: ['https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}'],
            tileSize: 256
          }
        },
        layers: [{
          id: 'satellite-layer',
          type: 'raster',
          source: 'satellite',
          minzoom: 0,
          maxzoom: 22
        }]
      });
    } else {
      map.current.setStyle("https://tiles.openfreemap.org/styles/liberty");
    }
  };

  return (
    <div className="relative w-full h-full" style={{ minHeight: '100%', minWidth: '100%' }}>
      <div ref={mapContainer} className="absolute inset-0 w-full h-full" />
      {/* Overlay to give a historical desert tint. Removed mix-blend-color for WebGL stability */}
      {!isSatellite && <div className="absolute inset-0 pointer-events-none bg-desert-umber/10" />}
      
      {/* Satellite Toggle Button */}
      <button 
        onClick={toggleMapStyle}
        className="absolute bottom-4 left-4 md:bottom-auto md:top-6 md:left-6 z-50 p-2 md:p-3 bg-deep-obsidian/80 backdrop-blur-md text-white rounded-xl shadow-lg border border-white/10 hover:bg-sand-gold transition-colors font-bold text-[10px] md:text-xs uppercase tracking-widest flex items-center gap-2"
      >
        {isSatellite ? "🗺️ Mode Vektor" : "🛰️ Mode Satelit"}
      </button>
    </div>
  );
}
