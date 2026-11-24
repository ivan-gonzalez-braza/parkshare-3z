"use client";

import { useEffect, useRef } from "react";
import { APARCAMIENTOS_MATARO, TRAMOS_CALZADA_MATARO } from "@/lib/mataro-aparcamientos";

declare global {
  interface Window {
    L: any;
  }
}

export default function MataroMap() {
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapInstanceRef = useRef<any>(null);

  useEffect(() => {
    if (!mapContainerRef.current) return;

    // 1. Cargar CSS de Leaflet si no existe
    if (!document.getElementById("leaflet-css")) {
      const link = document.createElement("link");
      link.id = "leaflet-css";
      link.rel = "stylesheet";
      link.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css";
      document.head.appendChild(link);
    }

    const initMap = () => {
      const L = window.L;
      if (!L || !mapContainerRef.current || mapInstanceRef.current) return;

      const map = L.map(mapContainerRef.current).setView([41.5388, 2.4446], 14);
      mapInstanceRef.current = map;

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        maxZoom: 19,
        attribution: "&copy; OpenStreetMap contributors",
      }).addTo(map);

      // Marcadores de parkings y solares
      APARCAMIENTOS_MATARO.forEach((park) => {
        L.marker([park.coordenadas.lat, park.coordenadas.lng])
          .addTo(map)
          .bindPopup(
            `<b>${park.nombre}</b><br/>${park.direccion}<br/>${park.gratuito ? "Gratuito" : "De pago"}`
          );
      });

      // Marcadores individuales en calzada
      TRAMOS_CALZADA_MATARO.forEach((tramo) => {
        tramo.puntos_estacionamiento.forEach((punto) => {
          L.marker([punto.lat, punto.lng])
            .addTo(map)
            .bindPopup(
              `<b>${tramo.calle}</b><br/>Calzada (${punto.orientacion})<br/>Plazas aprox: ${punto.capacidad_estimada_plazas}`
            );
        });
      });
    };

    // 2. Cargar JS de Leaflet si no existe, o iniciar directamente
    if (window.L) {
      initMap();
    } else {
      const existingScript = document.getElementById("leaflet-js");
      if (!existingScript) {
        const script = document.createElement("script");
        script.id = "leaflet-js";
        script.src = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.js";
        script.async = true;
        script.onload = initMap;
        document.body.appendChild(script);
      } else {
        existingScript.addEventListener("load", initMap);
      }
    }

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  return (
    <div
      ref={mapContainerRef}
      style={{ width: "100%", height: "600px", borderRadius: "12px", zIndex: 0 }}
    />
  );
}
