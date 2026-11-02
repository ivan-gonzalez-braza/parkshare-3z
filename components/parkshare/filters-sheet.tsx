'use client'

import { useEffect } from 'react'
import { Accessibility, Bike, Euro, Truck, X, Zap } from 'lucide-react'
import { type FilterKey, useApp } from './app-provider'
import { Toggle } from './toggle'

const FILTERS: { key: FilterKey; label: string; icon: typeof Zap }[] = [
  { key: 'carga', label: 'Puntos de carga', icon: Zap },
  { key: 'movilidad', label: 'Movilidad reducida', icon: Accessibility },
  { key: 'pago', label: 'Zonas de pago', icon: Euro },
  { key: 'descarga', label: 'Carga y descarga', icon: Truck },
  { key: 'moto', label: 'Sitios para moto', icon: Bike },
]

export function FiltersSheet({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { filters, toggleFilter } = useApp()

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
        className="absolute inset-0 bg-ink/30 animate-in fade-in"
        onClick={onClose}
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="filters-title"
        className="relative w-full rounded-t-[36px] bg-white px-7 pt-3 pb-8 shadow-[0_-8px_30px_rgba(31,45,49,0.12)] animate-in slide-in-from-bottom duration-300"
      >
        <div className="mx-auto h-[5px] w-11 rounded-full bg-[#dcdfe0]" />
        <div className="relative mt-6 flex items-center justify-center">
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
        <ul className="mt-5 flex flex-col">
          {FILTERS.map(({ key, label, icon: Icon }) => (
            <li key={key} className="flex h-20 items-center gap-5">
              <Icon className="size-7 text-subtle" strokeWidth={1.5} aria-hidden="true" />
              <span className="flex-1 text-[20px] text-ink">{label}</span>
              <Toggle checked={filters[key]} onChange={() => toggleFilter(key)} label={label} />
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
