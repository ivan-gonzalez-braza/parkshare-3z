'use client'

import { useEffect, useRef, useState } from 'react'
import { LocateFixed, Minus, Plus } from 'lucide-react'
import { useApp } from './app-provider'
import {
  SPOT_LABELS,
  SPOTS,
  USER_POSITION,
  type Spot,
  isSpotVisible,
  readableTextColor,
} from './map-data'

declare global {
  interface Window {
    L: any
  }
}

const SPOT_BADGE_TEXT: Record<Spot['type'], string> = {
  gratuita: 'P',
  pago: '€',
  carga: '⚡',
  descarga: 'D',
  movilidad: '♿',
  moto: 'M',
}

export function MapCanvas({
  busyOverrides,
  selectedId,
  onSelect,
}: {
  busyOverrides: Record<string, boolean>
  selectedId: string | null
  onSelect: (spot: Spot | null) => void
}) {
  const { filters, spotColors } = useApp()
  const containerRef = useRef<HTMLDivElement>(null)
  const mapRef = useRef<any>(null)
  const markersLayerRef = useRef<any>(null)
  const onSelectRef = useRef(onSelect)
  const [leafletReady, setLeafletReady] = useState(false)

  onSelectRef.current = onSelect

  // 1. Cargar Leaflet CSS/JS desde CDN e inicializar mapa real centrado en Mataró
  useEffect(() => {
    if (!containerRef.current) return

    if (!document.getElementById('leaflet-css')) {
      const link = document.createElement('link')
      link.id = 'leaflet-css'
      link.rel = 'stylesheet'
      link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css'
      document.head.appendChild(link)
    }

    const initMap = () => {
      const L = window.L
      if (!L || !containerRef.current || mapRef.current) return

      const map = L.map(containerRef.current, {
        zoomControl: false,
        attributionControl: true,
      }).setView([USER_POSITION.lat, USER_POSITION.lng], 15)

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '&copy; OpenStreetMap',
      }).addTo(map)

      // Marcador azul pulsante de tu ubicación en Mataró
      const userIcon = L.divIcon({
        className: '',
        iconSize: [28, 28],
        iconAnchor: [14, 14],
        html: `
          <div style="position:relative;width:28px;height:28px;display:flex;align-items:center;justify-content:center;">
            <span style="position:absolute;inset:0;border-radius:9999px;background:rgba(49,135,244,0.25);"></span>
            <span style="position:relative;width:14px;height:14px;border-radius:9999px;background:#3187f4;border:3px solid #ffffff;box-shadow:0 1px 4px rgba(0,0,0,0.35);"></span>
          </div>
        `,
      })
      L.marker([USER_POSITION.lat, USER_POSITION.lng], { icon: userIcon, interactive: false }).addTo(map)

      markersLayerRef.current = L.layerGroup().addTo(map)
      map.on('click', () => onSelectRef.current(null))

      mapRef.current = map
      setLeafletReady(true)

      // Recalcular tamaño tras renderizar el contenedor flex/absolute
      setTimeout(() => map.invalidateSize(), 150)
    }

    if (window.L) {
      initMap()
    } else {
      const existingScript = document.getElementById('leaflet-js')
      if (!existingScript) {
        const script = document.createElement('script')
        script.id = 'leaflet-js'
        script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js'
        script.async = true
        script.onload = initMap
        document.body.appendChild(script)
      } else {
        existingScript.addEventListener('load', initMap)
      }
    }

    return () => {
      if (mapRef.current) {
        mapRef.current.remove()
        mapRef.current = null
        markersLayerRef.current = null
        setLeafletReady(false)
      }
    }
  }, [])

  // 2. Actualizar pines cuando cambian filtros, colores, selección o estado ocupado/libre
  useEffect(() => {
    const L = window.L
    const layer = markersLayerRef.current
    if (!leafletReady || !L || !layer) return

    layer.clearLayers()

    const visibleSpots = SPOTS.filter((spot) =>
      isSpotVisible(spot, busyOverrides[spot.id] ?? spot.busy, filters),
    )

    visibleSpots.forEach((spot) => {
      const busy = busyOverrides[spot.id] ?? spot.busy
      const bg = busy ? spotColors.ocupada : spotColors[spot.type]
      const fg = readableTextColor(bg)
      const selected = spot.id === selectedId
      const badge = SPOT_BADGE_TEXT[spot.type]

      const icon = L.divIcon({
        className: '',
        iconSize: [32, 32],
        iconAnchor: [16, 16],
        html: `
          <div
            title="${SPOT_LABELS[spot.type]} · ${spot.street}"
            style="
              width: 32px;
              height: 32px;
              border-radius: 10px;
              background: ${bg};
              color: ${fg};
              display: flex;
              align-items: center;
              justify-content: center;
              font-weight: 800;
              font-size: 13px;
              box-shadow: 0 2px 6px rgba(0,0,0,0.28);
              border: ${selected ? '3px solid #1f2d31' : '2px solid #ffffff'};
              transform: ${selected ? 'scale(1.22)' : 'scale(1)'};
              transition: transform 150ms ease;
              cursor: pointer;
            "
          >${badge}</div>
        `,
      })

      const marker = L.marker([spot.lat, spot.lng], { icon })
      marker.on('click', (e: any) => {
        L.DomEvent.stopPropagation(e)
        onSelectRef.current(spot)
      })
      marker.addTo(layer)
    })
  }, [leafletReady, busyOverrides, filters, spotColors, selectedId])

  // 3. Centrar suavemente si se selecciona una plaza (por ejemplo desde la pantalla Buscar)
  useEffect(() => {
    if (!leafletReady || !mapRef.current || !selectedId) return
    const spot = SPOTS.find((s) => s.id === selectedId)
    if (spot) {
      mapRef.current.flyTo([spot.lat, spot.lng], Math.max(mapRef.current.getZoom(), 16), {
        duration: 0.5,
      })
    }
  }, [leafletReady, selectedId])

  return (
    <>
      <div
        ref={containerRef}
        role="application"
        aria-roledescription="mapa"
        aria-label="Mapa real de aparcamientos en Mataró"
        className="absolute inset-0 z-0 h-full w-full bg-map"
      />

      <div className="absolute right-5 bottom-8 z-20 flex flex-col gap-2.5">
        <div className="flex flex-col overflow-hidden rounded-[18px] bg-surface shadow-[0_4px_14px_rgba(31,45,49,0.14)]">
          <MapControl
            label="Acercar"
            onClick={() => mapRef.current?.zoomIn()}
          >
            <Plus className="size-5" aria-hidden="true" />
          </MapControl>
          <span className="mx-3 h-px bg-line" aria-hidden="true" />
          <MapControl
            label="Alejar"
            onClick={() => mapRef.current?.zoomOut()}
          >
            <Minus className="size-5" aria-hidden="true" />
          </MapControl>
        </div>
        <button
          type="button"
          aria-label="Centrar en mi ubicación"
          onClick={() =>
            mapRef.current?.flyTo([USER_POSITION.lat, USER_POSITION.lng], 15, { duration: 0.5 })
          }
          className="flex size-[52px] items-center justify-center rounded-[18px] bg-surface text-[#c4622d] shadow-[0_4px_14px_rgba(31,45,49,0.14)] hover:bg-field"
        >
          <LocateFixed className="size-6" aria-hidden="true" />
        </button>
      </div>
    </>
  )
}

function MapControl({
  label,
  onClick,
  children,
}: {
  label: string
  onClick: () => void
  children: React.ReactNode
}) {
  return (
    <button
      type="button"
      aria-label={label}
      onClick={onClick}
      className="flex size-[52px] items-center justify-center text-ink hover:bg-field"
    >
      {children}
    </button>
  )
}
