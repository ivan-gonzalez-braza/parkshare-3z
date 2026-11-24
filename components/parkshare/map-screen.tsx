'use client'

import { Suspense, useCallback, useEffect, useMemo, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import {
  ArrowDownLeft,
  ArrowUpRight,
  Car,
  Menu,
  Navigation,
  Route,
  SlidersHorizontal,
  X,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { AppShell } from './app-shell'
import { FiltersSheet } from './filters-sheet'
import { MapCanvas } from './map-canvas'
import { type SpotColorKey, useApp } from './app-provider'
import {
  SPOT_LABELS,
  SPOTS,
  USER_POSITION,
  type Coords,
  type Spot,
  type SpotType,
  distanceBetweenCoords,
  isSpotVisible,
} from './map-data'

const LEGEND_TYPES: SpotType[] = ['gratuita', 'pago', 'carga', 'descarga', 'movilidad', 'moto']
const DESTINATION_RADIUS = 600 // metros alrededor del destino donde se muestran plazas

function MapScreenContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { profile, spotColors, filters } = useApp()

  const [filtersOpen, setFiltersOpen] = useState(false)
  const [busyOverrides, setBusyOverrides] = useState<Record<string, boolean>>({})
  const [selected, setSelected] = useState<Spot | null>(null)
  const [userLocation, setUserLocation] = useState<Coords>(USER_POSITION)
  const [routeInfo, setRouteInfo] = useState<{ distanceKm: string; durationMin: number } | null>(null)
  const [message, setMessage] = useState('Localizando tu ubicación...')
  const closeFilters = useCallback(() => setFiltersOpen(false), [])

  // 1. Obtener GPS real del usuario al cargar
  useEffect(() => {
    if (!('geolocation' in navigator)) {
      setMessage('Ubicación predeterminada: Centro de Mataró')
      return
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setUserLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude })
        setMessage('Ubicación GPS conectada')
      },
      () => {
        setMessage('GPS no disponible · Usando Centro de Mataró')
      },
      { enableHighAccuracy: true, timeout: 8000 },
    )
  }, [])

  // 2. Leer destino elegido en el buscador
  const destination = useMemo(() => {
    const lat = parseFloat(searchParams.get('destLat') || '')
    const lng = parseFloat(searchParams.get('destLng') || '')
    const name = searchParams.get('destName') || ''
    if (!Number.isFinite(lat) || !Number.isFinite(lng) || !name) return null
    return { lat, lng, name }
  }, [searchParams])

  // 3. Filtrar plazas: si hay destino, SOLO mostramos las que están cerca del destino (libres y ocupadas)
  const visibleAreaSpots = useMemo(() => {
    if (!destination) return SPOTS
    return SPOTS.filter(
      (spot) => distanceBetweenCoords(destination, { lat: spot.lat, lng: spot.lng }) <= DESTINATION_RADIUS,
    )
  }, [destination])

  const referencePoint = destination ?? userLocation
  const isBusy = (spot: Spot) => busyOverrides[spot.id] ?? spot.busy

  const nearbyFree = visibleAreaSpots.filter(
    (spot) =>
      !isBusy(spot) &&
      isSpotVisible(spot, false, filters) &&
      distanceBetweenCoords(referencePoint, { lat: spot.lat, lng: spot.lng }) <= DESTINATION_RADIUS,
  ).length

  const nearbyBusy = visibleAreaSpots.filter(
    (spot) =>
      isBusy(spot) &&
      isSpotVisible(spot, true, filters) &&
      distanceBetweenCoords(referencePoint, { lat: spot.lat, lng: spot.lng }) <= DESTINATION_RADIUS,
  ).length

  const activeTypes = LEGEND_TYPES.filter((type) => filters[type])
  const hiddenCount = LEGEND_TYPES.length - activeTypes.length + (filters.soloLibres ? 1 : 0)

  const clearDestination = () => {
    setSelected(null)
    setRouteInfo(null)
    router.push('/mapa')
  }

  const handleAction = (action: 'ocupo' | 'dejo') => {
    if (!selected) {
      setMessage('Selecciona una plaza en el mapa primero')
      return
    }
    const busy = action === 'ocupo'
    if (isBusy(selected) === busy) {
      setMessage(busy ? 'Esa plaza ya está ocupada' : 'Esa plaza ya está libre')
      return
    }
    setBusyOverrides((prev) => ({ ...prev, [selected.id]: busy }))
    setMessage(busy ? 'Plaza registrada como ocupada' : 'Plaza compartida con la comunidad')
  }

  return (
    <AppShell className="h-dvh overflow-hidden">
      <main className="relative flex flex-1 flex-col">
        <h1 className="sr-only">Mapa de aparcamiento</h1>
        <div className="relative flex-1 overflow-hidden">
          <MapCanvas
            spots={visibleAreaSpots}
            userLocation={userLocation}
            destination={destination}
            searchRadius={DESTINATION_RADIUS}
            busyOverrides={busyOverrides}
            selectedId={selected?.id ?? null}
            onSelect={setSelected}
            onRouteCalculated={setRouteInfo}
          />

          <div className="absolute inset-x-5 top-4 z-10 flex h-[72px] items-center gap-3 rounded-full bg-surface pr-3 pl-6 shadow-[0_6px_24px_rgba(31,45,49,0.12)]">
            <button
              type="button"
              onClick={() => setFiltersOpen(true)}
              aria-label="Abrir filtros de mapa"
              className="text-ink"
            >
              <Menu className="size-6" aria-hidden="true" />
            </button>
            <span className="h-8 w-px bg-line" aria-hidden="true" />
            <Link href="/buscar" className="min-w-0 flex-1 truncate text-[19px] font-semibold text-ink">
              {destination ? destination.name : '¿A dónde vas?'}
            </Link>
            {destination ? (
              <button
                type="button"
                onClick={clearDestination}
                aria-label="Quitar destino"
                className="flex size-8 shrink-0 items-center justify-center rounded-full bg-field text-subtle hover:text-ink"
              >
                <X className="size-4" strokeWidth={2.5} aria-hidden="true" />
              </button>
            ) : null}
            <Link href="/perfil" aria-label="Mi perfil" className="shrink-0 rounded-full ring-2 ring-brand">
              <Image
                src={profile.photo || '/placeholder.svg'}
                alt=""
                width={48}
                height={48}
                className="size-12 rounded-full object-cover"
              />
            </Link>
          </div>

          <div className="pointer-events-none absolute top-[104px] left-6 z-10 flex flex-wrap items-center gap-2 pr-14">
            <span className="flex h-[34px] items-center gap-2 rounded-full bg-surface px-3 text-[13px] font-extrabold text-ink shadow-[0_2px_10px_rgba(31,45,49,0.1)]">
              <span className="size-2 rounded-full bg-free" aria-hidden="true" />
              {routeInfo ? (
                <span className="flex items-center gap-1.5">
                  <Route className="size-3.5 text-brand" aria-hidden="true" />
                  Ruta más corta: {routeInfo.distanceKm} km ({routeInfo.durationMin} min)
                </span>
              ) : (
                'ParkShare · En directo'
              )}
            </span>
            {hiddenCount > 0 ? (
              <button
                type="button"
                onClick={() => setFiltersOpen(true)}
                className="pointer-events-auto flex h-[34px] items-center gap-1.5 rounded-full bg-brand px-3 text-[13px] font-extrabold text-on-brand shadow-[0_2px_10px_rgba(31,45,49,0.1)]"
              >
                <SlidersHorizontal className="size-3.5" aria-hidden="true" />
                Filtros activos
              </button>
            ) : null}
          </div>

          <div
            className="pointer-events-none absolute top-[110px] right-10 z-10 flex flex-col items-center text-[11px] font-bold text-ink"
            aria-hidden="true"
          >
            N
            <Navigation className="size-4 fill-brand text-brand" />
          </div>

          {selected ? (
            <SpotCard
              spot={selected}
              referencePoint={referencePoint}
              busy={isBusy(selected)}
              onClose={() => setSelected(null)}
            />
          ) : null}

          <ul
            aria-label="Leyenda del mapa"
            className="absolute bottom-10 left-6 z-10 flex max-w-[calc(100%-110px)] flex-wrap items-center gap-x-3 gap-y-1.5 rounded-[17px] bg-surface px-3 py-2 text-[12px] font-extrabold text-ink shadow-[0_2px_10px_rgba(31,45,49,0.1)]"
          >
            {activeTypes.map((type) => (
              <LegendItem key={type} color={spotColors[type as SpotColorKey]} label={SHORT_LABELS[type]} />
            ))}
            {!filters.soloLibres ? <LegendItem color={spotColors.ocupada} label="Ocupada" /> : null}
            {activeTypes.length === 0 ? <li className="text-subtle">Sin capas visibles</li> : null}
          </ul>
        </div>

        <section
          aria-labelledby="nearby-title"
          className="relative z-20 -mt-6 rounded-t-[28px] bg-surface px-6 pt-2.5 pb-7 shadow-[0_-6px_24px_rgba(31,45,49,0.08)]"
        >
          <div className="mx-auto h-[5px] w-10 rounded-full bg-handle" aria-hidden="true" />
          <h2 id="nearby-title" className="mt-5 text-[23px] font-extrabold text-ink">
            {destination ? `Plazas junto a ${destination.name}` : 'Aparcamiento cerca de ti'}
          </h2>
          <p className="mt-0.5 text-[15px] text-subtle">
            {nearbyFree} {nearbyFree === 1 ? 'libre' : 'libres'} · {nearbyBusy}{' '}
            {nearbyBusy === 1 ? 'ocupada' : 'ocupadas'} (radio {DESTINATION_RADIUS} m)
          </p>
          <div className="mt-5 grid grid-cols-2 gap-3">
            <ActionButton
              label="Ocupo plaza"
              onClick={() => handleAction('ocupo')}
              variant="primary"
              Arrow={ArrowDownLeft}
            />
            <ActionButton
              label="Dejo mi plaza"
              onClick={() => handleAction('dejo')}
              variant="soft"
              Arrow={ArrowUpRight}
            />
          </div>
          <p className="mt-5 flex items-center justify-center gap-2 text-[14px] text-ink" aria-live="polite">
            <span className="size-2 rounded-full bg-free" aria-hidden="true" />
            {message}
          </p>
        </section>

        <FiltersSheet open={filtersOpen} onClose={closeFilters} />
      </main>
    </AppShell>
  )
}

export function MapScreen() {
  return (
    <Suspense fallback={<div className="flex h-dvh items-center justify-center bg-map text-ink">Cargando mapa...</div>}>
      <MapScreenContent />
    </Suspense>
  )
}

const SHORT_LABELS: Record<SpotType, string> = {
  gratuita: 'Libre',
  pago: 'Pago',
  carga: 'Carga',
  descarga: 'C/D',
  movilidad: 'PMR',
  moto: 'Moto',
}

function LegendItem({ color, label }: { color: string; label: string }) {
  return (
    <li className="flex items-center gap-1.5">
      <span className="h-4 w-2.5 rounded-[3px]" style={{ backgroundColor: color }} aria-hidden="true" />
      {label}
    </li>
  )
}

function SpotCard({
  spot,
  referencePoint,
  busy,
  onClose,
}: {
  spot: Spot
  referencePoint: Coords
  busy: boolean
  onClose: () => void
}) {
  const { spotColors } = useApp()
  const dist = distanceBetweenCoords(referencePoint, { lat: spot.lat, lng: spot.lng })
  return (
    <div
      role="status"
      className="absolute inset-x-5 top-[152px] z-10 flex items-center gap-4 rounded-[24px] bg-surface p-4 shadow-[0_6px_24px_rgba(31,45,49,0.14)] animate-in fade-in slide-in-from-top-2"
    >
      <span
        className="h-12 w-3 shrink-0 rounded-full"
        style={{ backgroundColor: busy ? spotColors.ocupada : spotColors[spot.type] }}
        aria-hidden="true"
      />
      <div className="min-w-0 flex-1">
        <p className="text-[17px] font-extrabold text-ink">{SPOT_LABELS[spot.type]}</p>
        <p className="truncate text-[14px] text-subtle">
          {spot.street} · a {dist} m
        </p>
        <p className={cn('mt-0.5 text-[13px] font-extrabold', busy ? 'text-busy' : 'text-free')}>
          {busy ? 'Ocupada' : 'Libre ahora'}
        </p>
      </div>
      <button
        type="button"
        onClick={onClose}
        aria-label="Cerrar detalle de la plaza"
        className="flex size-9 shrink-0 items-center justify-center rounded-full text-ink hover:bg-field"
      >
        <X className="size-5" aria-hidden="true" />
      </button>
    </div>
  )
}

function ActionButton({
  label,
  onClick,
  variant,
  Arrow,
}: {
  label: string
  onClick: () => void
  variant: 'primary' | 'soft'
  Arrow: typeof ArrowDownLeft
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'flex h-[100px] flex-col items-center justify-center gap-2 rounded-[24px] text-[19px] font-extrabold transition-[filter] hover:brightness-[0.97] active:brightness-95',
        variant === 'primary' ? 'bg-brand text-on-brand' : 'bg-brand-soft text-ink',
      )}
    >
      <span className="flex items-center gap-2" aria-hidden="true">
        <Car className="size-6" strokeWidth={2} />
        <Arrow className="size-5" strokeWidth={2.5} />
      </span>
      {label}
    </button>
  )
}
