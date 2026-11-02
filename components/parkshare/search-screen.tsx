'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { ArrowLeft, ArrowUpLeft, Clock, House, X } from 'lucide-react'
import { AppShell } from './app-shell'

const RECENT = [
  { street: 'Calle Gran Vía, 45', city: 'Madrid' },
  { street: 'Calle de Alcalá, 120', city: 'Madrid' },
  { street: 'Paseo de la Castellana, 89', city: 'Madrid' },
]

export function SearchScreen() {
  const router = useRouter()
  const [query, setQuery] = useState('')
  const results = RECENT.filter((item) =>
    `${item.street} ${item.city}`.toLowerCase().includes(query.trim().toLowerCase()),
  )

  return (
    <AppShell>
      <main className="flex flex-1 flex-col px-6 pt-4">
        <h1 className="sr-only">Buscar dirección</h1>
        <form
          role="search"
          className="flex items-center gap-4"
          onSubmit={(event) => {
            event.preventDefault()
            router.push('/mapa')
          }}
        >
          <Link href="/mapa" aria-label="Volver al mapa" className="-ml-1 text-ink">
            <ArrowLeft className="size-6" aria-hidden="true" />
          </Link>
          <div className="flex h-[62px] flex-1 items-center rounded-full border-2 border-brand bg-white pr-3 pl-5 shadow-[0_0_0_4px_rgba(253,161,102,0.15)]">
            <label htmlFor="address" className="sr-only">Dirección</label>
            <input
              id="address"
              autoFocus
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              onKeyDown={(event) => {
                if (event.nativeEvent.isComposing || event.keyCode === 229) event.stopPropagation()
              }}
              placeholder="Escribe una dirección..."
              className="min-w-0 flex-1 bg-transparent text-[18px] text-ink caret-brand outline-none placeholder:text-subtle"
            />
            {query ? (
              <button
                type="button"
                aria-label="Borrar búsqueda"
                onClick={() => setQuery('')}
                className="flex size-7 items-center justify-center rounded-full bg-field text-subtle"
              >
                <X className="size-4" strokeWidth={2.5} aria-hidden="true" />
              </button>
            ) : null}
          </div>
        </form>

        <div className="mt-6 grid grid-cols-2 gap-3">
          {['Casa', 'Trabajo'].map((place) => (
            <Link
              key={place}
              href="/mapa"
              className="flex h-[64px] items-center gap-3 rounded-full bg-field px-6 text-[19px] font-extrabold text-ink transition-colors hover:bg-[#eaedec]"
            >
              <House className="size-6 text-brand" strokeWidth={2} aria-hidden="true" />
              {place}
            </Link>
          ))}
        </div>

        <h2 className="mt-8 text-[14px] font-bold text-subtle">Búsquedas recientes</h2>
        <ul className="mt-3">
          {results.map((item, index) => (
            <li key={item.street}>
              <Link href="/mapa" className="group flex items-center gap-4">
                <Clock className="size-6 shrink-0 text-subtle" strokeWidth={1.75} aria-hidden="true" />
                <span
                  className={`flex flex-1 items-center py-3.5 ${index < results.length - 1 ? 'border-b border-line' : ''}`}
                >
                  <span className="flex-1">
                    <span className="block text-[18px] font-extrabold text-ink group-hover:underline">
                      {item.street}
                    </span>
                    <span className="block text-[15px] text-subtle">{item.city}</span>
                  </span>
                  <ArrowUpLeft className="size-5 text-subtle" aria-hidden="true" />
                </span>
              </Link>
            </li>
          ))}
          {results.length === 0 ? (
            <li className="py-6 text-[15px] text-subtle">Pulsa Enter para buscar “{query}”.</li>
          ) : null}
        </ul>
      </main>
    </AppShell>
  )
}
