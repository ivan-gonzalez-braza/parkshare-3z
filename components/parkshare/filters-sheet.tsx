'use client'

import { useEffect } from 'react'
import { Accessibility, Bike, CircleParking, Euro, EyeOff, Truck, X, Zap } from 'lucide-react'
import { type FilterKey, useApp } from './app-provider'
import { SPOTS, type SpotType } from './map-data'
import { Toggle } from './toggle'

const TYPE_FILTERS: { key: SpotType; label: string; icon: typeof Zap }[] = [
  { key: 'gratuita', label: 'Plazas gratuitas', icon: CircleParking },
  { key: 'carga', label: 'Puntos de carga', icon: Zap },
  { key: 'movilidad', label: 'Movilidad reducida', icon: Accessibility },
  { key: 'pago', label: 'Zonas de pago', icon: Euro },
  { key: 'descarga', label: 'Carga y descarga', icon: Truck },
  { key: 'moto', label: 'Sitios para moto', icon: Bike },
]

const COUNTS = SPOTS.reduce(
  (acc, spot) => ({ ...acc, [spot.type]: (acc[spot.type] ?? 0) + 1 }),
  {} as Partial<Record<SpotType, number>>,
)

export function FiltersSheet({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { filters, toggleFilter, resetFilters, spotColors } = useApp()

  useEffect(() => {
    if (!open) return
    const onKey = (event: KeyboardEvent) => event.key === 'Escape' && onClose()
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, onClose])

  if (!open) return null

  return (
    <div className="absolute inset-0 z-40 flex items-end">
      <button
        type="button"
        aria-label="Cerrar filtros"
        className="absolute inset-0 bg-black/40 animate-in fade-in"
        onClick={onClose}
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="filters-title"
        className="relative flex max-h-[88%] w-full flex-col rounded-t-[36px] bg-surface pt-3 shadow-[0_-8px_30px_rgba(31,45,49,0.12)] animate-in slide-in-from-bottom duration-300"
      >
        <div className="mx-auto h-[5px] w-11 shrink-0 rounded-full bg-handle" />
        <div className="relative mx-7 mt-5 flex shrink-0 items-center justify-center">
          <h2 id="filters-title" className="text-[24px] font-extrabold text-ink">
            Filtros de mapa
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Cerrar"
            className="absolute right-0 flex size-9 items-center justify-center rounded-full text-ink hover:bg-field"
          >
            <X className="size-6" aria-hidden="true" />
          </button>
        </div>

        <div className="mt-3 overflow-y-auto px-7 pb-8">
          <ul className="flex flex-col">
            {TYPE_FILTERS.map(({ key, label, icon: Icon }) => (
              <FilterRow
                key={key}
                filterKey={key}
                label={label}
                hint={`${COUNTS[key] ?? 0} plazas en el mapa`}
                icon={Icon}
                color={spotColors[key]}
                checked={filters[key]}
                onToggle={toggleFilter}
              />
            ))}
            <li className="my-2 h-px bg-line" aria-hidden="true" />
            <FilterRow
              filterKey="soloLibres"
              label="Ocultar ocupadas"
              hint="Muestra solo plazas libres"
              icon={EyeOff}
              checked={filters.soloLibres}
              onToggle={toggleFilter}
            />
          </ul>
          <div className="mt-6 grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={resetFilters}
              className="h-[56px] rounded-full border-2 border-brand text-[17px] font-bold text-brand hover:bg-brand-soft"
            >
              Restablecer
            </button>
            <button
              type="button"
              onClick={onClose}
              className="h-[56px] rounded-full bg-brand text-[17px] font-extrabold text-on-brand hover:brightness-95"
            >
              Ver mapa
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

function FilterRow({
  filterKey,
  label,
  hint,
  icon: Icon,
  color,
  checked,
  onToggle,
}: {
  filterKey: FilterKey
  label: string
  hint: string
  icon: typeof Zap
  color?: string
  checked: boolean
  onToggle: (key: FilterKey) => void
}) {
  return (
    <li className="flex min-h-[68px] items-center gap-4">
      <span
        className="flex size-10 shrink-0 items-center justify-center rounded-[12px] bg-field"
        style={color ? { color } : undefined}
      >
        <Icon className="size-6 text-current" strokeWidth={1.75} aria-hidden="true" />
      </span>
      <span className="flex flex-1 flex-col">
        <span className="text-[18px] text-ink">{label}</span>
        <span className="text-[13px] text-subtle">{hint}</span>
      </span>
      <Toggle checked={checked} onChange={() => onToggle(filterKey)} label={label} />
    </li>
  )
}
