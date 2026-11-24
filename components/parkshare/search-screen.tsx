'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { ArrowLeft, ArrowUpLeft, Clock, House, Loader2, MapPin, Navigation, X } from 'lucide-react'
import { AppShell } from './app-shell'

type PlaceResult = {
  name: string
  subtitle: string
  lat: number
  lng: number
}

const PRESETS: PlaceResult[] = [
  { name: 'Plaça de les Tereses', subtitle: 'Centre, Mataró', lat: 41.53912, lng: 2.44356 },
  { name: 'Hospital de Mataró', subtitle: 'Carretera de Cirera, Mataró', lat: 41.5512, lng: 2.4398 },
  { name: 'Estació de Mataró / Platja', subtitle: 'Plaça de Miquel Biada, Mataró', lat: 41.5353, lng: 2.4472 },
  { name: 'Mataró Parc', subtitle: 'Carrer d’Estrasburg, Mataró', lat: 41.5546, lng: 2.4332 },
]

export function SearchScreen() {
  const router = useRouter()
  const [query, setQuery] = useState('')
  const [searching, setSearching] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')
  const [suggestions, setSuggestions] = useState<PlaceResult[]>([])

  const goToDestination = (place: PlaceResult) => {
    const params = new URLSearchParams({
      destLat: String(place.lat),
      destLng: String(place.lng),
      destName: place.name,
    })
    router.push(`/mapa?${params.toString()}`)
  }

  // Autocompletado en tiempo real mientras escribes (lugares, edificios y calles)
  useEffect(() => {
    const clean = query.trim()
    if (clean.length < 3) {
      setSuggestions([])
      setErrorMsg('')
      setSearching(false)
      return
    }

    const controller = new AbortController()
    const timer = setTimeout(async () => {
      setSearching(true)
      setErrorMsg('')

      try {
        const url =
          `https://nominatim.openstreetmap.org/search?format=json&addressdetails=1&limit=6` +
          `&countrycodes=es&viewbox=2.40,41.57,2.49,41.51&bounded=0` +
          `&q=${encodeURIComponent(clean)}`

        const res = await fetch(url, {
          signal: controller.signal,
          headers: { 'Accept-Language': 'es' },
        })
        const data = await res.json()

        if (!Array.isArray(data) || data.length === 0) {
          setSuggestions([])
          setErrorMsg('No se encontraron lugares con ese nombre.')
        } else {
          const mapped: PlaceResult[] = data.map((item: any) => {
            const parts = String(item.display_name).split(',')
            const primary = item.name?.trim() || parts[0]?.trim() || clean
            const secondary = parts
              .slice(1, 4)
              .map((p: string) => p.trim())
              .filter(Boolean)
              .join(', ')

            return {
              name: primary,
              subtitle: secondary || 'España',
              lat: parseFloat(item.lat),
              lng: parseFloat(item.lon),
            }
          })
          setSuggestions(mapped)
        }
      } catch (err: any) {
        if (err?.name !== 'AbortError') {
          setErrorMsg('Error al buscar sugerencias. Comprueba tu conexión.')
        }
      } finally {
        setSearching(false)
      }
    }, 350)

    return () => {
      clearTimeout(timer)
      controller.abort()
    }
  }, [query])

  const handleFormSubmit = (event: React.FormEvent) => {
    event.preventDefault()
    if (suggestions.length > 0) {
      goToDestination(suggestions[0])
    } else if (!query.trim()) {
      router.push('/mapa')
    }
  }

  const showingLiveResults = query.trim().length >= 3
  const listToRender = showingLiveResults ? suggestions : PRESETS

  return (
    <AppShell>
      <main className="flex flex-1 flex-col px-6 pt-4">
        <h1 className="sr-only">Buscar destino</h1>
        <form role="search" className="flex items-center gap-4" onSubmit={handleFormSubmit}>
          <Link href="/mapa" aria-label="Volver al mapa" className="-ml-1 text-ink">
            <ArrowLeft className="size-6" aria-hidden="true" />
          </Link>
          <div className="flex h-[62px] flex-1 items-center rounded-full border-2 border-brand bg-surface pr-3 pl-5 shadow-[0_0_0_4px_rgba(253,161,102,0.15)]">
            <label htmlFor="address" className="sr-only">Destino</label>
            <input
              id="address"
              autoFocus
              value={query}
              onChange={(event) => {
                setQuery(event.target.value)
                setErrorMsg('')
              }}
              onKeyDown={(event) => {
                if (event.nativeEvent.isComposing || event.keyCode === 229) event.stopPropagation()
              }}
              placeholder="Ej: Hospital de Mataró, Mataró Parc..."
              className="min-w-0 flex-1 bg-transparent text-[18px] text-ink caret-brand outline-none placeholder:text-subtle"
            />
            {searching ? (
              <Loader2 className="size-5 shrink-0 animate-spin text-brand" aria-hidden="true" />
            ) : query ? (
              <button
                type="button"
                aria-label="Borrar búsqueda"
                onClick={() => {
                  setQuery('')
                  setSuggestions([])
                  setErrorMsg('')
                }}
                className="flex size-7 shrink-0 items-center justify-center rounded-full bg-field text-subtle"
              >
                <X className="size-4" strokeWidth={2.5} aria-hidden="true" />
              </button>
            ) : null}
          </div>
        </form>

        {errorMsg ? (
          <p className="mt-3 rounded-2xl bg-busy/10 px-4 py-2.5 text-[14px] font-semibold text-busy">
            {errorMsg}
          </p>
        ) : null}

        {!showingLiveResults ? (
          <div className="mt-6 grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => goToDestination(PRESETS[0])}
              className="flex h-[64px] items-center gap-3 rounded-full bg-field px-6 text-[19px] font-extrabold text-ink transition-colors hover:bg-track"
            >
              <House className="size-6 text-brand" strokeWidth={2} aria-hidden="true" />
              Casa
            </button>
            <button
              type="button"
              onClick={() => goToDestination(PRESETS[1])}
              className="flex h-[64px] items-center gap-3 rounded-full bg-field px-6 text-[19px] font-extrabold text-ink transition-colors hover:bg-track"
            >
              <MapPin className="size-6 text-brand" strokeWidth={2} aria-hidden="true" />
              Hospital
            </button>
          </div>
        ) : null}

        <h2 className="mt-7 text-[14px] font-bold text-subtle">
          {showingLiveResults
            ? searching
              ? 'Buscando ubicaciones...'
              : 'Selecciona tu destino'
            : 'Destinos frecuentes'}
        </h2>

        <ul className="mt-2">
          {listToRender.map((item, index) => (
            <li key={`${item.name}-${item.lat}-${index}`}>
              <button
                type="button"
                onClick={() => goToDestination(item)}
                className="group flex w-full items-center gap-4 text-left"
              >
                {showingLiveResults ? (
                  <Navigation className="size-5 shrink-0 text-brand" strokeWidth={2} aria-hidden="true" />
                ) : (
                  <Clock className="size-6 shrink-0 text-subtle" strokeWidth={1.75} aria-hidden="true" />
                )}
                <span
                  className={`flex flex-1 items-center py-3.5 ${index < listToRender.length - 1 ? 'border-b border-line' : ''}`}
                >
                  <span className="min-w-0 flex-1 pr-2">
                    <span className="block truncate text-[18px] font-extrabold text-ink group-hover:underline">
                      {item.name}
                    </span>
                    <span className="block truncate text-[14px] text-subtle">{item.subtitle}</span>
                  </span>
                  <ArrowUpLeft className="size-5 shrink-0 text-subtle" aria-hidden="true" />
                </span>
              </button>
            </li>
          ))}
        </ul>
      </main>
    </AppShell>
  )
}
