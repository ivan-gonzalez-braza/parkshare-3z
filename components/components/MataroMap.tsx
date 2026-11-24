"use client";

import { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { APARCAMIENTOS_MATARO, TRAMOS_CALZADA_MATARO } from "@/lib/mataro-aparcamientos";

export default function MataroMap() {
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);

  useEffect(() => {
    if (!mapContainerRef.current || mapInstanceRef.current) return;

    const map = L.map(mapContainerRef.current).setView([41.5388, 2.4446], 14);
    mapInstanceRef.current = map;

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      maxZoom: 19,
      attribution: '&copy; OpenStreetMap contributors'
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

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, []);

  return <div ref={mapContainerRef} className="w-full h-[600px] rounded-xl z-0" />;
}
