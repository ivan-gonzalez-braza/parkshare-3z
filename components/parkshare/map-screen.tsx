'use client'

import { useCallback, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowDownLeft, ArrowUpRight, Car, LocateFixed, Menu, Navigation } from 'lucide-react'
import { cn } from '@/lib/utils'
import { AppShell } from './app-shell'
import { FiltersSheet } from './filters-sheet'
import { MapCanvas } from './map-canvas'
import { useApp } from './app-provider'

export function MapScreen() {
  const { profile, spotColors } = useApp()
  const [filtersOpen, setFiltersOpen] = useState(false)
  const [action, setAction] = useState<'ocupo' | 'dejo' | null>(null)
  const closeFilters = useCallback(() => setFiltersOpen(false), [])

  return (
    <AppShell className="h-dvh overflow-hidden">
      <main className="relative flex flex-1 flex-col">
        <h1 className="sr-only">Mapa de aparcamiento</h1>
        <div className="relative flex-1 overflow-hidden">
          <MapCanvas />

          <div className="absolute inset-x-5 top-4 z-10 flex h-[72px] items-center gap-4 rounded-full bg-white pr-3 pl-6 shadow-[0_6px_24px_rgba(31,45,49,0.12)]">
            <button
              type="button"
              onClick={() => setFiltersOpen(true)}
              aria-label="Abrir filtros de mapa"
              className="text-ink"
            >
              <Menu className="size-6" aria-hidden="true" />
            </button>
            <span className="h-8 w-px bg-line" aria-hidden="true" />
            <Link href="/buscar" className="flex-1 text-[21px] font-semibold text-ink">
              ¿A dónde vas?
            </Link>
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

          <div className="absolute top-[104px] left-6 z-10 flex h-[34px] items-center gap-2 rounded-full bg-white px-3 text-[13px] font-extrabold text-ink shadow-[0_2px_10px_rgba(31,45,49,0.1)]">
            <span className="size-2 rounded-full bg-free" aria-hidden="true" />
            ParkShare · En directo
          </div>

          <div className="absolute top-[110px] right-10 z-10 flex flex-col items-center text-[11px] font-bold text-ink" aria-hidden="true">
            N
            <Navigation className="size-4 fill-brand text-brand" />
          </div>

          <div className="absolute bottom-10 left-6 z-10 flex h-[34px] items-center gap-4 rounded-full bg-white px-3 text-[13px] font-extrabold text-ink shadow-[0_2px_10px_rgba(31,45,49,0.1)]">
            <span className="flex items-center gap-1.5">
              <span className="h-4 w-2.5 rounded-[3px]" style={{ backgroundColor: spotColors.gratuita }} />
              Libre
            </span>
            <span className="flex items-center gap-1.5">
              <span className="h-4 w-2.5 rounded-[3px]" style={{ backgroundColor: spotColors.ocupada }} />
              Ocupada
            </span>
          </div>

          <button
            type="button"
            aria-label="Centrar en mi ubicación"
            className="absolute right-5 bottom-8 z-10 flex size-[52px] items-center justify-center rounded-[18px] bg-white text-[#c4622d] shadow-[0_4px_14px_rgba(31,45,49,0.14)]"
          >
            <LocateFixed className="size-6" aria-hidden="true" />
          </button>
        </div>

        <section
          aria-labelledby="nearby-title"
          className="relative z-20 -mt-6 rounded-t-[28px] bg-white px-6 pt-2.5 pb-7 shadow-[0_-6px_24px_rgba(31,45,49,0.08)]"
        >
          <div className="mx-auto h-[5px] w-10 rounded-full bg-[#dcdfe0]" aria-hidden="true" />
          <h2 id="nearby-title" className="mt-5 text-[25px] font-extrabold text-ink">
            Aparcamiento cerca de ti
          </h2>
          <p className="mt-0.5 text-[15px] text-subtle">12 plazas libres a menos de 300 m</p>
          <div className="mt-5 grid grid-cols-2 gap-3">
            <ActionButton
              label="Ocupo plaza"
              active={action === 'ocupo'}
              onClick={() => setAction('ocupo')}
              variant="primary"
              Arrow={ArrowDownLeft}
            />
            <ActionButton
              label="Dejo mi plaza"
              active={action === 'dejo'}
              onClick={() => setAction('dejo')}
              variant="soft"
              Arrow={ArrowUpRight}
            />
          </div>
          <p className="mt-5 flex items-center justify-center gap-2 text-[14px] text-ink" aria-live="polite">
            <span className="size-2 rounded-full bg-free" aria-hidden="true" />
            {action === 'ocupo'
              ? 'Plaza registrada como ocupada'
              : action === 'dejo'
                ? 'Plaza compartida con la comunidad'
                : 'Sensor Bluetooth conectado'}
          </p>
        </section>

        <FiltersSheet open={filtersOpen} onClose={closeFilters} />
      </main>
    </AppShell>
  )
}

function ActionButton({
  label,
  active,
  onClick,
  variant,
  Arrow,
}: {
  label: string
  active: boolean
  onClick: () => void
  variant: 'primary' | 'soft'
  Arrow: typeof ArrowDownLeft
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={cn(
        'flex h-[100px] flex-col items-center justify-center gap-2 rounded-[24px] text-[19px] font-extrabold text-ink transition-[filter,box-shadow] hover:brightness-[0.97]',
        variant === 'primary' ? 'bg-brand' : 'bg-brand-soft',
        active && 'ring-2 ring-ink/70',
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
