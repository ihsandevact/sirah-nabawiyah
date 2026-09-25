"use client";

import React, { useRef, useEffect, useState } from "react";
import * as maplibregl from "maplibre-gl";
import { Coordinate } from "@/types/sirah";

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

      map.current.addLayer({
        id: "tactical-point",
        type: "circle",
        source: sourceId,
        filter: ["==", ["geometry-type"], "Point"],
        paint: {
          "circle-radius": 6,
          "circle-color": ["get", "color"],
          "circle-stroke-width": 2,
          "circle-stroke-color": "#ffffff"
        }
      });
      
      map.current.addLayer({
        id: "tactical-label",
        type: "symbol",
        source: sourceId,
        layout: {
          "text-field": ["get", "label"],
          "text-size": 14,
          "text-anchor": "top",
          "text-offset": [0, 1]
        },
        paint: {
          "text-color": ["get", "color"],
          "text-halo-color": "#ffffff",
          "text-halo-width": 2
        }
      });
    }

    const src = map.current.getSource(sourceId) as maplibregl.GeoJSONSource;
    if (src) {
      if (tacticalData) {
        src.setData(tacticalData);
      } else {
        src.setData({ type: "FeatureCollection", features: [] });
      }
    }
  }, [tacticalData, mapLoaded]);

  return (
    <div className="relative w-full h-full" style={{ minHeight: '100%', minWidth: '100%' }}>
      <div ref={mapContainer} className="absolute inset-0 w-full h-full" />
      {/* Overlay to give a historical desert tint. Removed mix-blend-color for WebGL stability */}
      <div className="absolute inset-0 pointer-events-none bg-desert-umber/10" />
    </div>
  );
}
