'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import {
  CheckCircle2,
  CircleCheckBig,
  Clock,
  Layers,
  MapPin,
  Menu,
  Navigation,
  Route,
  SquareParking,
  X,
} from 'lucide-react'
import { useApp } from './app-provider'
import { MapCanvas } from './map-canvas'
import {
  SPOTS,
  SPOT_LABELS,
  USER_POSITION,
  type Coords,
  type Spot,
  type SpotType,
  distanceBetweenCoords,
  distanceToUser,
  fetchRealSpotsNear,
  isSpotVisible,
  readableTextColor,
} from './map-data'
import { Avatar } from './ui-parts'

const DESTINATION_RADIUS = 500

type SearchSuggestion = {
  id: string
  name: string
  subtitle: string
  lat: number
  lng: number
}

export function MapScreen() {
  const { user, openDrawer, setTab, spotColors, showToast } = useApp()
  const [query, setQuery] = useState('')
  const [suggestions, setSuggestions] = useState<SearchSuggestion[]>([])
  const [searching, setSearching] = useState(false)
  const [selected, setSelected] = useState<Spot | null>(null)
  const [sheetOpen, setSheetOpen] = useState(true)
  const [userLocation, setUserLocation] = useState<Coords>(USER_POSITION)
  const [heading, setHeading] = useState<number | null>(null)
  const [gpsStatus, setGpsStatus] = useState<'loading' | 'live' | 'fallback'>('loading')
  const [destination, setDestination] = useState<(Coords & { name: string }) | null>(null)
  const [isNavigating, setIsNavigating] = useState(false)
  const [routeInfo, setRouteInfo] = useState<{
    distanceKm: string
    durationMin: number
    nextStep?: string
  } | null>(null)
  const [nearbySpots, setNearbySpots] = useState<Spot[]>(SPOTS)
  const [loadingSpots, setLoadingSpots] = useState(false)
  const [busyOverrides, setBusyOverrides] = useState<Record<string, boolean>>({})
  const [filters, setFilters] = useState<Record<SpotType | 'soloLibres', boolean>>({
    gratuita: true,
    pago: true,
    carga: true,
    descarga: true,
    movilidad: true,
    moto: true,
    soloLibres: false,
  })
  const searchBoxRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (typeof window === 'undefined' || !('geolocation' in navigator)) {
      setGpsStatus('fallback')
      return
    }

    const watchId = navigator.geolocation.watchPosition(
      (pos) => {
        setUserLocation({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
        })
        if (typeof pos.coords.heading === 'number' && !Number.isNaN(pos.coords.heading)) {
          setHeading(pos.coords.heading)
        }
        setGpsStatus('live')
      },
      () => {
        setGpsStatus((prev) => (prev === 'live' ? 'live' : 'fallback'))
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 2000 },
    )

    return () => navigator.geolocation.clearWatch(watchId)
  }, [])

  useEffect(() => {
    const trimmed = query.trim()
    if (trimmed.length < 2 || (destination && trimmed === destination.name)) {
      setSuggestions([])
      return
    }

    const controller = new AbortController()
    const timer = setTimeout(async () => {
      setSearching(true)
      try {
        const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
          trimmed,
        )}&limit=6&addressdetails=1`
        const res = await fetch(url, {
          signal: controller.signal,
          headers: { 'Accept-Language': 'es' },
        })
        const data = await res.json()
        const mapped: SearchSuggestion[] = (Array.isArray(data) ? data : []).map((item: any) => {
          const addr = item.address || {}
          const primaryName =
            item.name ||
            addr.road ||
            addr.pedestrian ||
            addr.square ||
            addr.suburb ||
            item.display_name.split(',')[0]

          const locality =
            addr.city || addr.town || addr.village || addr.municipality || addr.state || ''
          const country = addr.country || ''
          const subtitleParts = [addr.road && addr.road !== primaryName ? addr.road : '', locality, country].filter(
            Boolean,
          )

          return {
            id: String(item.place_id),
            name: primaryName,
            subtitle: subtitleParts.join(', ') || item.display_name,
            lat: parseFloat(item.lat),
            lng: parseFloat(item.lon),
          }
        })
        setSuggestions(mapped)
      } catch {
        // Ignorar abortos al teclear rápido
      } finally {
        setSearching(false)
      }
    }, 300)

    return () => {
      clearTimeout(timer)
      controller.abort()
    }
  }, [query, destination])

  useEffect(() => {
    if (!destination) {
      setNearbySpots(SPOTS)
      setIsNavigating(false)
      return
    }

    let cancelled = false
    setLoadingSpots(true)
    fetchRealSpotsNear(destination, DESTINATION_RADIUS)
      .then((spots) => {
        if (!cancelled) setNearbySpots(spots)
      })
      .finally(() => {
        if (!cancelled) setLoadingSpots(false)
      })

    return () => {
      cancelled = true
    }
  }, [destination?.lat, destination?.lng])

  const spotsInScope = useMemo(() => {
    if (!destination) return nearbySpots
    return nearbySpots.filter(
      (spot) => distanceBetweenCoords(destination, { lat: spot.lat, lng: spot.lng }) <= DESTINATION_RADIUS,
    )
  }, [nearbySpots, destination])

  const counts = useMemo(() => {
    let free = 0
    let busy = 0
    for (const spot of spotsInScope) {
      const isBusy = busyOverrides[spot.id] ?? spot.busy
      if (isBusy) busy += 1
      else free += 1
    }
    return { free, busy }
  }, [spotsInScope, busyOverrides])

  const handleSelectSuggestion = (item: SearchSuggestion) => {
    setDestination({ lat: item.lat, lng: item.lng, name: item.name })
    setQuery(item.name)
    setSuggestions([])
    setSelected(null)
    setIsNavigating(false)
    setSheetOpen(true)
    showToast(`Destino fijado: ${item.name}`)
  }

  const handleMapClick = async (coords: Coords) => {
    const tempName = `${coords.lat.toFixed(4)}, ${coords.lng.toFixed(4)}`
    setDestination({ lat: coords.lat, lng: coords.lng, name: tempName })
    setQuery(tempName)
    setSuggestions([])
    setSelected(null)
    setIsNavigating(false)
    setSheetOpen(true)

    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${coords.lat}&lon=${coords.lng}&zoom=18&addressdetails=1`,
        { headers: { 'Accept-Language': 'es' } },
      )
      const data = await res.json()
      const addr = data?.address || {}
      const realPlaceName =
        data?.name ||
        addr.road ||
        addr.pedestrian ||
        addr.square ||
        addr.suburb ||
        addr.city ||
        addr.town ||
        data?.display_name?.split(',')[0]

      if (realPlaceName) {
        setDestination((prev) =>
          prev && prev.lat === coords.lat && prev.lng === coords.lng
            ? { ...prev, name: realPlaceName }
            : prev,
        )
        setQuery(realPlaceName)
        showToast(`Destino seleccionado: ${realPlaceName}`)
      }
    } catch {
      showToast('Destino seleccionado en el mapa')
    }
  }

  const handleClearDestination = () => {
    setQuery('')
    setDestination(null)
    setSuggestions([])
    setSelected(null)
    setRouteInfo(null)
    setIsNavigating(false)
  }

  const handleStartNavigation = () => {
    if (!destination) return
    setIsNavigating(true)
    setSelected(null)
    showToast(`Iniciando ruta hacia ${destination.name}`)
  }

  const handleStopNavigation = () => {
    setIsNavigating(false)
    showToast('Navegación finalizada')
  }

  const toggleFilter = (key: SpotType | 'soloLibres') => {
    setFilters((prev) => ({ ...prev, [key]: !prev[key] }))
  }

  const claimOrRelease = (occupy: boolean) => {
    const reference = destination ?? userLocation
    if (selected) {
      setBusyOverrides((prev) => ({ ...prev, [selected.id]: occupy }))
      showToast(
        occupy
          ? `Plaza ocupada en ${selected.street}`
          : `Plaza liberada en ${selected.street}`,
      )
      return
    }
    const candidate = spotsInScope
      .filter((spot) => isSpotVisible(spot, busyOverrides[spot.id] ?? spot.busy, filters))
      .filter((spot) => (occupy ? !(busyOverrides[spot.id] ?? spot.busy) : busyOverrides[spot.id] ?? spot.busy))
      .sort((a, b) => distanceToUser(a, reference) - distanceToUser(b, reference))[0]

    if (!candidate) {
      showToast(occupy ? 'No hay plazas libres en esta zona' : 'No tienes plazas ocupadas cerca')
      return
    }
    setBusyOverrides((prev) => ({ ...prev, [candidate.id]: occupy }))
    setSelected(candidate)
    setSheetOpen(true)
    showToast(
      occupy
        ? `Has ocupado plaza en ${candidate.street}`
        : `Has dejado libre tu plaza en ${candidate.street}`,
    )
  }

  const selectedBusy = selected ? busyOverrides[selected.id] ?? selected.busy : false

  const legendItems: { key: SpotType | 'ocupada'; label: string; color: string }[] = [
    { key: 'gratuita', label: 'Libre', color: spotColors.gratuita },
    { key: 'pago', label: 'Pago', color: spotColors.pago },
    { key: 'carga', label: 'Carga', color: spotColors.carga },
    { key: 'descarga', label: 'C/D', color: spotColors.descarga },
    { key: 'movilidad', label: 'PMR', color: spotColors.movilidad },
    { key: 'moto', label: 'Moto', color: spotColors.moto },
    { key: 'ocupada', label: 'Ocupada', color: spotColors.ocupada },
  ]

  return (
    <div className="relative h-full w-full overflow-hidden bg-map select-none">
      <div className="relative h-[68%] w-full">
        <MapCanvas
          spots={spotsInScope}
          userLocation={userLocation}
          heading={heading}
          destination={destination}
          isNavigating={isNavigating}
          searchRadius={DESTINATION_RADIUS}
          busyOverrides={busyOverrides}
          selectedId={selected?.id ?? null}
          onSelect={(spot) => {
            setSelected(spot)
            if (spot) setSheetOpen(true)
          }}
          onMapClick={handleMapClick}
          onRouteCalculated={setRouteInfo}
        />

        {isNavigating && destination ? (
          <div className="absolute inset-x-4 top-3 z-30 rounded-[24px] bg-[#166534] p-4 text-white shadow-[0_10px_28px_rgba(22,101,52,0.38)]">
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-3 min-w-0">
                <div className="flex size-11 shrink-0 items-center justify-center rounded-2xl bg-white/15">
                  <Navigation className="size
