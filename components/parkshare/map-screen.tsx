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

  // Geolocalización real continua (estilo Google Maps)
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

  // Buscador global en tiempo real (cualquier dirección, lugar o ciudad del mundo)
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

  // Cargar plazas reales alrededor del destino seleccionado
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

  // Pulsar cualquier punto del mapa para seleccionarlo como destino
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

        {/* Barra superior de navegación GPS en vivo o buscador global */}
        {isNavigating && destination ? (
          <div className="absolute inset-x-4 top-3 z-30 rounded-[24px] bg-[#166534] p-4 text-white shadow-[0_10px_28px_rgba(22,101,52,0.38)]">
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-3 min-w-0">
                <div className="flex size-11 shrink-0 items-center justify-center rounded-2xl bg-white/15">
                  <Navigation className="size-6 text-white" aria-hidden="true" />
                </div>
                <div className="min-w-0">
                  <p className="truncate text-[16px] font-extrabold leading-tight">
                    {routeInfo?.nextStep || `Hacia ${destination.name}`}
                  </p>
                  <p className="mt-0.5 text-[12px] font-semibold text-emerald-100">
                    {routeInfo ? `${routeInfo.durationMin} min · ${routeInfo.distanceKm} km` : 'Calculando...'} · {destination.name}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={handleStopNavigation}
                className="shrink-0 rounded-full bg-red-500 px-3.5 py-2 text-[12px] font-extrabold text-white shadow hover:bg-red-600"
              >
                Salir
              </button>
            </div>
          </div>
        ) : (
          <div ref={searchBoxRef} className="absolute inset-x-4 top-3 z-30">
            <div className="flex h-[62px] items-center gap-2 rounded-full bg-surface px-3 shadow-[0_6px_18px_rgba(31,45,49,0.12)]">
              <button
                type="button"
                aria-label="Abrir menú"
                onClick={openDrawer}
                className="flex size-11 shrink-0 items-center justify-center rounded-full text-ink hover:bg-field"
              >
                <Menu className="size-[22px]" aria-hidden="true" />
              </button>
              <input
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && suggestions.length > 0) {
                    e.preventDefault()
                    handleSelectSuggestion(suggestions[0])
                  }
                }}
                placeholder="Buscar dirección o pulsa en el mapa..."
                aria-label="Buscar destino en cualquier lugar del mundo"
                className="min-w-0 flex-1 bg-transparent text-[16px] font-medium text-ink placeholder:text-ink-subtle focus:outline-none"
              />
              {query ? (
                <button
                  type="button"
                  aria-label="Borrar destino"
                  onClick={handleClearDestination}
                  className="flex size-8 shrink-0 items-center justify-center rounded-full bg-field text-ink-muted hover:text-ink"
                >
                  <X className="size-4" aria-hidden="true" />
                </button>
              ) : null}
              <button
                type="button"
                aria-label="Abrir perfil"
                onClick={() => setTab('profile')}
                className="shrink-0 rounded-full focus:outline-none focus-visible:ring-2 focus-visible:ring-brand"
              >
                <Avatar name={user.name} src={user.avatar} size={46} />
              </button>
            </div>

            {(suggestions.length > 0 || searching) && (
              <div className="mt-2 overflow-hidden rounded-[22px] bg-surface shadow-[0_12px_30px_rgba(31,45,49,0.18)] border border-line">
                {searching && suggestions.length === 0 ? (
                  <p className="px-4 py-3 text-[13px] font-medium text-ink-muted">Buscando ubicación...</p>
                ) : (
                  suggestions.map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => handleSelectSuggestion(item)}
                      className="flex w-full items-start gap-3 border-b border-line/60 px-4 py-3 text-left last:border-b-0 hover:bg-field"
                    >
                      <MapPin className="mt-0.5 size-4 shrink-0 text-brand-deep" aria-hidden="true" />
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-[14px] font-bold text-ink">{item.name}</p>
                        <p className="truncate text-[12px] text-ink-muted">{item.subtitle}</p>
                      </div>
                    </button>
                  ))
                )}
              </div>
            )}

            {destination && routeInfo && suggestions.length === 0 && (
              <div className="mt-2 inline-flex items-center gap-2 rounded-full bg-surface/95 px-3.5 py-1.5 text-[12px] font-bold text-ink shadow-[0_4px_12px_rgba(31,45,49,0.12)] backdrop-blur-xs">
                <span className="size-2 rounded-full bg-[#18b259]" aria-hidden="true" />
                <Route className="size-3.5 text-brand-deep" aria-hidden="true" />
                <span>
                  Ruta más corta: {routeInfo.distanceKm} km ({routeInfo.durationMin} min)
                </span>
              </div>
            )}
          </div>
        )}

        {/* Leyenda compacta */}
        <div className="pointer-events-none absolute bottom-3 left-4 right-20 z-20">
          <div className="inline-flex max-w-full flex-wrap items-center gap-x-2.5 gap-y-1 rounded-2xl bg-surface/92 px-3 py-1.5 shadow-[0_4px_14px_rgba(31,45,49,0.12)] backdrop-blur-xs">
            {legendItems.map((item) => (
              <div key={item.key} className="flex items-center gap-1">
                <span
                  className="inline-block h-3 w-2.5 rounded-[3px] shrink-0"
                  style={{ backgroundColor: item.color }}
                  aria-hidden="true"
                />
                <span className="text-[11px] font-bold text-ink">{item.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom sheet */}
      <section
        aria-label="Panel de plazas"
        className={`absolute inset-x-0 bottom-0 z-30 rounded-t-[30px] bg-surface shadow-[0_-8px_26px_rgba(31,45,49,0.10)] transition-transform duration-300 ${
          sheetOpen ? 'translate-y-0' : 'translate-y-[calc(100%-64px)]'
        }`}
      >
        <button
          type="button"
          aria-label={sheetOpen ? 'Contraer panel' : 'Expandir panel'}
          onClick={() => setSheetOpen((v) => !v)}
          className="flex w-full justify-center pt-2.5 pb-1"
        >
          <span className="h-[5px] w-11 rounded-full bg-[#d3d0c9]" />
        </button>

        <div className="max-h-[58vh] overflow-y-auto px-5 pb-6">
          <div className="flex items-center justify-between gap-2">
            <div className="min-w-0 flex-1">
              <h2 className="truncate text-[22px] font-extrabold tracking-tight text-ink">
                {destination ? `Plazas en ${destination.name}` : 'Plazas disponibles'}
              </h2>
              <p className="mt-0.5 text-[14px] font-medium text-ink-muted">
                {loadingSpots ? (
                  'Buscando plazas en calles reales...'
                ) : (
                  <>
                    {counts.free} libres · {counts.busy} ocupadas
                    {destination ? ` (radio ${DESTINATION_RADIUS} m)` : ''}
                  </>
                )}
              </p>
            </div>

            {destination && !isNavigating && (
              <button
                type="button"
                onClick={handleStartNavigation}
                className="flex shrink-0 items-center gap-1.5 rounded-full bg-brand px-4 py-2.5 text-[14px] font-extrabold text-ink shadow-[0_4px_12px_rgba(253,161,102,0.4)] hover:bg-brand-strong active:scale-[0.98]"
              >
                <Navigation className="size-4 fill-ink" aria-hidden="true" />
                <span>Iniciar ruta</span>
              </button>
            )}
          </div>

          {/* Ficha de plaza seleccionada */}
          {selected ? (
            <div className="mt-3.5 rounded-[22px] bg-field p-4">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <span
                    className="flex size-10 shrink-0 items-center justify-center rounded-[12px] text-[15px] font-extrabold"
                    style={{
                      background: selectedBusy ? spotColors.ocupada : spotColors[selected.type],
                      color: readableTextColor(selectedBusy ? spotColors.ocupada : spotColors[selected.type]),
                    }}
                  >
                    P
                  </span>
                  <div>
                    <p className="text-[15px] font-extrabold text-ink">{SPOT_LABELS[selected.type]}</p>
                    <p className="text-[13px] text-ink-muted">{selected.street}</p>
                    <p className="mt-1 flex items-center gap-2 text-[12px] font-semibold text-ink-muted">
                      <span className="inline-flex items-center gap-1">
                        <MapPin className="size-3.5" aria-hidden="true" />
                        A {distanceToUser(selected, userLocation)} m de ti
                      </span>
                      <span>·</span>
                      <span className={selectedBusy ? 'text-danger' : 'text-[#138c47]'}>
                        {selectedBusy ? 'Ocupada' : 'Libre'}
                      </span>
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  aria-label="Cerrar detalle de plaza"
                  onClick={() => setSelected(null)}
                  className="flex size-8 items-center justify-center rounded-full bg-surface text-ink-muted hover:text-ink"
                >
                  <X className="size-4" aria-hidden="true" />
                </button>
              </div>
            </div>
          ) : null}

          {/* Acciones principales */}
          <div className="mt-3.5 grid grid-cols-2 gap-3.5">
            <button
              type="button"
              onClick={() => claimOrRelease(true)}
              className="flex h-[96px] flex-col items-center justify-center gap-1.5 rounded-[22px] bg-brand px-4 text-ink shadow-[0_6px_16px_rgba(253,161,102,0.34)] transition-transform hover:bg-brand-strong active:scale-[0.99]"
            >
              <CarArrow direction="in" />
              <span className="text-[17px] font-extrabold tracking-tight">Ocupo plaza</span>
            </button>
            <button
              type="button"
              onClick={() => claimOrRelease(false)}
              className="flex h-[96px] flex-col items-center justify-center gap-1.5 rounded-[22px] bg-brand-soft px-4 text-ink transition-transform hover:bg-[#ffdec5] active:scale-[0.99]"
            >
              <CarArrow direction="out" />
              <span className="text-[17px] font-extrabold tracking-tight">Dejo mi plaza</span>
            </button>
          </div>

          <p className="mt-3 flex items-center justify-center gap-1.5 text-center text-[13px] font-medium text-ink-muted">
            <span
              className={`size-2 rounded-full ${
                gpsStatus === 'live' ? 'bg-[#18b259]' : 'bg-amber-500'
              }`}
              aria-hidden="true"
            />
            <span>
              {gpsStatus === 'live'
                ? 'Ubicación GPS conectada · Pulsa el mapa o busca un destino'
                : 'Pulsa cualquier punto del mapa o busca un destino'}
            </span>
          </p>

          {/* Filtros */}
          <div className="mt-5 border-t border-line pt-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Layers className="size-4 text-ink-muted" aria-hidden="true" />
                <span className="text-[15px] font-extrabold text-ink">Filtros</span>
              </div>
              <button
                type="button"
                aria-pressed={filters.soloLibres}
                onClick={() => toggleFilter('soloLibres')}
                className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[12px] font-bold transition-colors ${
                  filters.soloLibres ? 'bg-ink text-white' : 'bg-field text-ink-muted hover:text-ink'
                }`}
              >
                <CheckCircle2 className="size-3.5" aria-hidden="true" />
                Solo libres
              </button>
            </div>

            <div className="mt-3 flex flex-wrap gap-2">
              {(Object.keys(SPOT_LABELS) as SpotType[]).map((type) => {
                const active = filters[type]
                const color = spotColors[type]
                return (
                  <button
                    key={type}
                    type="button"
                    aria-pressed={active}
                    onClick={() => toggleFilter(type)}
                    className={`inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-[12.5px] font-bold transition-all ${
                      active
                        ? 'border-transparent bg-field text-ink shadow-2xs'
                        : 'border-line bg-surface text-ink-subtle opacity-60'
                    }`}
                  >
                    <span
                      className="size-2.5 rounded-full"
                      style={{ background: color }}
                      aria-hidden="true"
                    />
                    {SPOT_LABELS[type]}
                  </button>
                )
              })}
            </div>
          </div>

          {/* Plazas cercanas dentro del radio */}
          <div className="mt-5 border-t border-line pt-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <SquareParking className="size-4 text-ink-muted" aria-hidden="true" />
                <span className="text-[15px] font-extrabold text-ink">
                  {destination ? `Plazas cerca de ${destination.name}` : 'Plazas cercanas'}
                </span>
              </div>
              <span className="inline-flex items-center gap-1 text-[12px] font-semibold text-ink-muted">
                <Clock className="size-3.5" aria-hidden="true" />
                En vivo
              </span>
            </div>

            <ul className="mt-3 flex flex-col gap-2">
              {spotsInScope
                .filter((spot) => isSpotVisible(spot, busyOverrides[spot.id] ?? spot.busy, filters))
                .slice(0, 12)
                .map((spot) => {
                  const busy = busyOverrides[spot.id] ?? spot.busy
                  const color = busy ? spotColors.ocupada : spotColors[spot.type]
                  const refPoint = destination ?? userLocation
                  return (
                    <li key={spot.id}>
                      <button
                        type="button"
                        onClick={() => setSelected(spot)}
                        className="flex w-full items-center gap-3 rounded-[16px] bg-field/80 px-3.5 py-2.5 text-left hover:bg-field"
                      >
                        <span
                          className="flex size-8 shrink-0 items-center justify-center rounded-[10px] text-[13px] font-extrabold"
                          style={{ background: color, color: readableTextColor(color) }}
                        >
                          P
                        </span>
                        <span className="min-w-0 flex-1">
                          <span className="block truncate text-[13.5px] font-bold text-ink">
                            {spot.street}
                          </span>
                          <span className="block text-[12px] text-ink-muted">
                            {SPOT_LABELS[spot.type]} · a {distanceToUser(spot, refPoint)} m
                          </span>
                        </span>
                        <span
                          className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[11px] font-extrabold ${
                            busy ? 'bg-danger-soft text-danger' : 'bg-[#dff5e7] text-[#138c47]'
                          }`}
                        >
                          <CircleCheckBig className="size-3" aria-hidden="true" />
                          {busy ? 'Ocupada' : 'Libre'}
                        </span>
                      </button>
                    </li>
                  )
                })}
            </ul>
          </div>
        </div>
      </section>
    </div>
  )
}

function CarArrow({ direction }: { direction: 'in' | 'out' }) {
  return (
    <span className="relative inline-flex items-center justify-center" aria-hidden="true">
      <svg width="52" height="28" viewBox="0 0 52 28" fill="none">
        <path
          d="M5 18.5C5 16.5 6.4 15 8.3 14.7L11.2 10.6C12.1 9.3 13.6 8.5 15.2 8.5H23.8C25.4 8.5 26.9 9.3 27.8 10.6L30.7 14.7C32.6 15 34 16.5 34 18.5V21.5C34 22.3 33.3 23 32.5 23H30.5M8.5 23H6.5C5.7 23 5 22.3 5 21.5V18.5"
          stroke="#1f2d31"
          strokeWidth="2.3"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <circle cx="12.5" cy="22.5" r="3" stroke="#1f2d31" strokeWidth="2.2" />
        <circle cx="26.5" cy="22.5" r="3" stroke="#1f2d31" strokeWidth="2.2" />
        <path d="M16.5 22.5H22.5" stroke="#1f2d31" strokeWidth="2.2" strokeLinecap="round" />
        {direction === 'in' ? (
          <path
            d="M45 5L38 12M38 12H44M38 12V6"
            stroke="#1f2d31"
            strokeWidth="2.3"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        ) : (
          <path
            d="M38 12L45 5M45 5H39M45 5V11"
            stroke="#1f2d31"
            strokeWidth="2.3"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        )}
      </svg>
    </span>
  )
}
