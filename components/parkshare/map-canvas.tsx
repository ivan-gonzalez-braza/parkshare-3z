'use client'

import { useEffect, useRef, useState } from 'react'
import { LocateFixed, Minus, Plus } from 'lucide-react'
import { useApp } from './app-provider'
import {
  SPOT_LABELS,
  type Coords,
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
  spots,
  userLocation,
  destination,
  searchRadius,
  busyOverrides,
  selectedId,
  onSelect,
  onRouteCalculated,
}: {
  spots: Spot[]
  userLocation: Coords
  destination: (Coords & { name: string }) | null
  searchRadius: number
  busyOverrides: Record<string, boolean>
  selectedId: string | null
  onSelect: (spot: Spot | null) => void
  onRouteCalculated?: (info: { distanceKm: string; durationMin: number } | null) => void
}) {
  const { filters, spotColors } = useApp()
  const containerRef = useRef<HTMLDivElement>(null)
  const mapRef = useRef<any>(null)
  const markersLayerRef = useRef<any>(null)
  const userLayerRef = useRef<any>(null)
  const routeLayerRef = useRef<any>(null)
  const onSelectRef = useRef(onSelect)
  const onRouteRef = useRef(onRouteCalculated)
  const [leafletReady, setLeafletReady] = useState(false)

  onSelectRef.current = onSelect
  onRouteRef.current = onRouteCalculated

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
      }).setView([userLocation.lat, userLocation.lng], 15)

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '&copy; OpenStreetMap',
      }).addTo(map)

      userLayerRef.current = L.layerGroup().addTo(map)
      routeLayerRef.current = L.layerGroup().addTo(map)
      markersLayerRef.current = L.layerGroup().addTo(map)

      map.on('click', () => {
        onSelectRef.current(null)
      })

      mapRef.current = map
      setLeafletReady(true)
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
        userLayerRef.current = null
        routeLayerRef.current = null
        setLeafletReady(false)
      }
    }
  }, [])

  useEffect(() => {
    const L = window.L
    const layer = userLayerRef.current
    if (!leafletReady || !L || !layer) return

    layer.clearLayers()

    const userIcon = L.divIcon({
      className: '',
      iconSize: [28, 28],
      iconAnchor: [14, 14],
      html: `
        <div title="Tu ubicación" style="position:relative;width:28px;height:28px;display:flex;align-items:center;justify-content:center;">
          <span style="position:absolute;inset:0;border-radius:9999px;background:rgba(49,135,244,0.28);"></span>
          <span style="position:relative;width:14px;height:14px;border-radius:9999px;background:#3187f4;border:3px solid #ffffff;box-shadow:0 1px 4px rgba(0,0,0,0.4);"></span>
        </div>
      `,
    })

    L.marker([userLocation.lat, userLocation.lng], { icon: userIcon, interactive: false }).addTo(layer)
  }, [leafletReady, userLocation])

  useEffect(() => {
    const L = window.L
    const routeLayer = routeLayerRef.current
    const map = mapRef.current
    if (!leafletReady || !L || !routeLayer || !map) return

    routeLayer.clearLayers()

    if (!destination) {
      onRouteRef.current?.(null)
      return
    }

    L.circle([destination.lat, destination.lng], {
      radius: searchRadius,
      color: '#fda166',
      weight: 2,
      dashArray: '6, 6',
      fillColor: '#fda166',
      fillOpacity: 0.08,
      interactive: false,
    }).addTo(routeLayer)

    const destIcon = L.divIcon({
      className: '',
      iconSize: [34, 34],
      iconAnchor: [17, 34],
      html: `
        <div style="display:flex;flex-direction:column;align-items:center;">
          <div style="width:26px;height:26px;border-radius:9999px;background:#1f2d31;color:#ffffff;border:3px solid #fda166;display:flex;align-items:center;justify-content:center;font-weight:900;font-size:12px;box-shadow:0 3px 8px rgba(0,0,0,0.35);">★</div>
          <div style="width:3px;height:8px;background:#1f2d31;"></div>
        </div>
      `,
    })
    L.marker([destination.lat, destination.lng], { icon: destIcon })
      .bindPopup(`<b>Destino:</b> ${destination.name}`)
      .addTo(routeLayer)

    let cancelled = false
    const osrmUrl = `https://router.project-osrm.org/route/v1/driving/${userLocation.lng},${userLocation.lat};${destination.lng},${destination.lat}?overview=full&geometries=geojson`

    fetch(osrmUrl)
      .then((res) => res.json())
      .then((data) => {
        if (cancelled || !routeLayerRef.current || !mapRef.current) return
        const route = data?.routes?.[0]
        if (!route?.geometry?.coordinates) {
          mapRef.current.flyTo([destination.lat, destination.lng], 16)
          return
        }

        const latLngs = route.geometry.coordinates.map(([lng, lat]: [number, number]) => [lat, lng])
        const polyline = L.polyline(latLngs, {
          color: '#2563eb',
          weight: 6,
          opacity: 0.88,
          lineJoin: 'round',
        }).addTo(routeLayerRef.current)

        const distanceKm = (route.distance / 1000).toFixed(1)
        const durationMin = Math.max(1, Math.round(route.duration / 60))
        onRouteRef.current?.({ distanceKm, durationMin })

        mapRef.current.fitBounds(polyline.getBounds(), {
          paddingTopLeft: [40, 155],
          paddingBottomRight: [40, 270],
          maxZoom: 16,
        })
      })
      .catch(() => {
        if (!cancelled && mapRef.current) {
          mapRef.current.flyTo([destination.lat, destination.lng], 16)
        }
      })

    return () => {
      cancelled = true
    }
  }, [leafletReady, userLocation, destination, searchRadius])

  useEffect(() => {
    const L = window.L
    const layer = markersLayerRef.current
    if (!leafletReady || !L || !layer) return

    layer.clearLayers()

    const visibleSpots = spots.filter((spot) =>
      isSpotVisible(spot, busyOverrides[spot.id] ?? spot.busy, filters),
    )

    const isCompact = Boolean(destination)
    const size = isCompact ? 22 : 34
    const half = Math.round(size / 2)

    visibleSpots.forEach((spot) => {
      const busy = busyOverrides[spot.id] ?? spot.busy
      const bg = busy ? spotColors.ocupada : spotColors[spot.type]
      const fg = readableTextColor(bg)
      const selected = spot.id === selectedId
      const badge = SPOT_BADGE_TEXT[spot.type]

      const icon = L.divIcon({
        className: '',
        iconSize: [size, size],
        iconAnchor: [half, half],
        html: `
          <div
            title="${SPOT_LABELS[spot.type]} · ${spot.street}"
            style="
              width: ${size}px;
              height: ${size}px;
              border-radius: ${isCompact ? '7px' : '10px'};
              background: ${bg};
              color: ${fg};
              display: flex;
              align-items: center;
              justify-content: center;
              font-weight: 800;
              font-size: ${isCompact ? '10px' : '13px'};
              box-shadow: 0 1px 4px rgba(0,0,0,0.28);
              border: ${selected ? '2.5px solid #1f2d31' : '1.5px solid #ffffff'};
              transform: ${selected ? 'scale(1.3)' : 'scale(1)'};
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
  }, [leafletReady, spots, busyOverrides, filters, spotColors, selectedId, destination])

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
          <MapControl label="Acercar" onClick={() => mapRef.current?.zoomIn()}>
            <Plus className="size-5" aria-hidden="true" />
          </MapControl>
          <span className="mx-3 h-px bg-line" aria-hidden="true" />
          <MapControl label="Alejar" onClick={() => mapRef.current?.zoomOut()}>
            <Minus className="size-5" aria-hidden="true" />
          </MapControl>
        </div>
        <button
          type="button"
          aria-label="Centrar en mi ubicación"
          onClick={() =>
            mapRef.current?.flyTo([userLocation.lat, userLocation.lng], 16, { duration: 0.5 })
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
