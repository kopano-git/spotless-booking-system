"use client";

import { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, Polygon } from "react-leaflet";
import L from "leaflet";
// @ts-expect-error CSS imports are handled by the framework bundler.
import "leaflet/dist/leaflet.css";

// --- UPDATE WITH YOUR CARTO KEY ---
const CARTO_KEY = "cb1_5anx_1_c93a73ec7b29731c873c2a68";

const CORE_CENTER: [number, number] = [-33.8500, 18.7000];
const ZOOM_LEVEL = 12; // Slightly zoomed in to focus on the suburbs

const serviceAreas = [
  { name: "Graanendal", pos: [-33.8333, 18.6833] as [number, number], color: "#ef4444" }, // Red
  { name: "Buh-Rein Estate", pos: [-33.8200, 18.7300] as [number, number], color: "#22c55e" }, // Green
  { name: "Pinehurst", pos: [-33.8500, 18.7100] as [number, number], color: "#22c55e" },
  { name: "Vredekloof", pos: [-33.8667, 18.6833] as [number, number], color: "#f59e0b" }, // Orange
  { name: "Protea Hoogte", pos: [-33.8900, 18.7000] as [number, number], color: "#f59e0b" },
];

const corePerimeter = [
  [-33.8000, 18.6500],
  [-33.8100, 18.7600],
  [-33.8700, 18.7600],
  [-33.9100, 18.6800],
  [-33.8800, 18.6300],
] as [number, number][];

// Custom marker with a subtle drop shadow
const createCustomIcon = (color: string) => {
  return L.divIcon({
    className: "custom-leaflet-marker",
    html: `<div style="background-color: ${color}; width: 28px; height: 28px; border-radius: 50%; border: 3px solid white; box-shadow: 0 4px 10px rgba(0,0,0,0.15); display: flex; align-items: center; justify-content: center;"><div style="width: 8px; height: 8px; background-color: white; border-radius: 50%;"></div></div>`,
    iconSize: [28, 28],
    iconAnchor: [14, 14],
    popupAnchor: [0, -14],
  });
};

export default function CoverageMap() {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return <div className="h-[500px] w-full bg-gray-100 rounded-3xl animate-pulse flex items-center justify-center text-gray-400">Loading Map...</div>;
  }

  return (
    <div className="h-[500px] w-full rounded-3xl overflow-hidden border border-gray-200 shadow-sm relative z-0">
      <MapContainer 
        center={CORE_CENTER} 
        zoom={ZOOM_LEVEL} 
        scrollWheelZoom={false}
        className="h-full w-full bg-[#f9f9f9]"
      >
        {/* CARTO VOYAGER TILES - Clean, Google Maps feel */}
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
          url={`https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png?key=${CARTO_KEY}`}
        />

        {/* Draw the dashed perimeter */}
        <Polygon 
          positions={corePerimeter} 
          pathOptions={{ 
            color: "#6b7280", // Gray line
            weight: 2, 
            dashArray: "6, 6", 
            fillColor: "#3b82f6", // Very light blue fill
            fillOpacity: 0.05 
          }} 
        />

        {/* Drop the custom pins */}
        {serviceAreas.map((area) => (
          <Marker 
            key={area.name} 
            position={area.pos} 
            icon={createCustomIcon(area.color)}
          >
            <Popup className="premium-popup">
              <div className="font-sans">
                <strong className="block text-black text-sm mb-1">{area.name}</strong>
                <span className="text-xs text-gray-600">Serviced by Spotless.</span>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}