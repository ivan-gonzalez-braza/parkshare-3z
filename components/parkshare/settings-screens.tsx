'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Check, ChevronRight, Lock, Search } from 'lucide-react'
import { AppShell } from './app-shell'
import { ScreenHeader } from './screen-header'
import { Toggle } from './toggle'
import { type SpotColorKey, useApp } from './app-provider'

function SettingsHeader({ title, backHref, size = 'text-[30px]' }: { title: string; backHref: string; size?: string }) {
  return (
    <ScreenHeader title={title} backHref={backHref} className="mt-4" titleClassName={`${size} font-semibold`} />
  )
}

export function SettingsScreen() {
  const { darkMode, setDarkMode, notifications, setNotifications, language } = useApp()

  return (
    <AppShell className="font-poppins">
      <SettingsHeader title="Ajustes" backHref="/perfil" />
      <main className="px-7 pb-10">
        <h2 className="mt-[34px] text-[15px] text-subtle">Preferencias de la App</h2>
        <ul className="mt-2">
          <li className="flex h-[89px] items-center justify-between border-b border-line">
            <span className="text-[18px] font-medium">Modo Noche</span>
            <Toggle checked={darkMode} onChange={setDarkMode} label="Modo Noche" />
          </li>
          <li className="flex h-[89px] items-center justify-between border-b border-line">
            <span className="text-[18px] font-medium">Notificaciones</span>
            <Toggle checked={notifications} onChange={setNotifications} label="Notificaciones" />
          </li>
          <li>
            <Link href="/ajustes/colores" className="flex h-[89px] items-center justify-between border-b border-line">
              <span className="text-[18px] font-medium">Cambiar color de plazas</span>
              <ChevronRight className="size-5 text-subtle" aria-hidden="true" />
            </Link>
          </li>
          <li>
            <Link href="/ajustes/idioma" className="flex h-[89px] items-center gap-3 border-b border-line">
              <span className="flex-1 text-[18px] font-medium">Idioma</span>
              <span className="text-[16px] text-subtle">{language}</span>
              <ChevronRight className="size-5 text-subtle" aria-hidden="true" />
            </Link>
          </li>
        </ul>

        <h2 className="mt-10 text-[15px] text-subtle">Privacidad</h2>
        <Link href="/ajustes/seguridad" className="mt-2 flex h-[89px] items-center gap-3 border-b border-line">
          <Lock className="size-6" strokeWidth={1.75} aria-hidden="true" />
          <span className="flex-1 text-[18px] font-medium">Seguridad y permisos</span>
          <ChevronRight className="size-5 text-subtle" aria-hidden="true" />
        </Link>
      </main>
    </AppShell>
  )
}

const COLOR_ROWS: { key: SpotColorKey; label: string }[] = [
  { key: 'gratuita', label: 'Plaza Gratuita' },
  { key: 'pago', label: 'Zona de Pago' },
  { key: 'carga', label: 'Punto de carga' },
  { key: 'descarga', label: 'Carga y descarga' },
  { key: 'movilidad', label: 'Movilidad reducida' },
  { key: 'moto', label: 'Sitios para Moto' },
  { key: 'ocupada', label: 'Plazas Ocupadas' },
]

export function SpotColorsScreen() {
  const { spotColors, setSpotColor, resetSpotColors } = useApp()

  return (
    <AppShell className="font-poppins">
      <SettingsHeader title="Color de plazas" backHref="/ajustes" size="text-[26px]" />
      <main className="flex flex-1 flex-col px-7 pb-10">
        <ul className="mt-[66px] mb-12">
          {COLOR_ROWS.map(({ key, label }, index) => (
            <li
              key={key}
              className={`flex h-[89px] items-center justify-between ${index < COLOR_ROWS.length - 1 ? 'border-b border-line' : ''}`}
            >
              <span className="text-[18px] font-medium">{label}</span>
              <label
                className="relative size-10 cursor-pointer rounded-full ring-offset-2 transition-shadow hover:ring-2 hover:ring-line"
                style={{ backgroundColor: spotColors[key] }}
              >
                <span className="sr-only">Cambiar color de {label}</span>
                <input
                  type="color"
                  value={spotColors[key]}
                  onChange={(event) => setSpotColor(key, event.target.value)}
                  className="absolute inset-0 cursor-pointer opacity-0"
                />
              </label>
            </li>
          ))}
        </ul>
        <button
          type="button"
          onClick={resetSpotColors}
          className="mt-auto h-[72px] w-full rounded-full border-2 border-brand text-[18px] font-medium text-brand transition-colors hover:bg-brand-soft"
        >
          Restaurar colores
        </button>
      </main>
    </AppShell>
  )
}

const LANGUAGES = ['Español', 'English (US)', 'Français', 'Català', 'Deutsch']

export function LanguageScreen() {
  const { language, setLanguage } = useApp()
  const [query, setQuery] = useState('')
  const filtered = LANGUAGES.filter((item) => item.toLowerCase().includes(query.trim().toLowerCase()))

  return (
    <AppShell className="font-poppins">
      <SettingsHeader title="Idioma" backHref="/ajustes" />
      <main className="px-7 pb-10">
        <div className="mt-[28px] flex h-16 items-center gap-3 rounded-full bg-field px-6">
          <Search className="size-5 text-subtle" aria-hidden="true" />
          <label htmlFor="language-search" className="sr-only">Buscar idioma</label>
          <input
            id="language-search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Buscar idioma..."
            className="flex-1 bg-transparent text-[16px] text-ink outline-none placeholder:text-faint"
          />
        </div>
        <ul className="mt-4" role="listbox" aria-label="Idiomas">
          {filtered.map((item, index) => (
            <li key={item} role="option" aria-selected={item === language}>
              <button
                type="button"
                onClick={() => setLanguage(item)}
                className={`flex h-[97px] w-full items-center justify-between text-left ${index < filtered.length - 1 ? 'border-b border-line' : ''}`}
              >
                <span className="text-[19px] font-medium">{item}</span>
                {item === language ? <Check className="size-6 text-brand" strokeWidth={2.5} aria-hidden="true" /> : null}
              </button>
            </li>
          ))}
        </ul>
      </main>
    </AppShell>
  )
}

const LEGAL_SECTIONS = [
  {
    title: '1. Términos y condiciones',
    body: [
      'El acceso y uso de ParkShare se rige por las presentes condiciones. Al utilizar la aplicación, la persona usuaria declara haber leído y comprendido este documento, que establece las condiciones de acceso a la plataforma y el uso de los servicios de aparcamiento compartido.',
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
    ],
  },
  {
    title: '2. Política de privacidad',
    body: [
      'ParkShare trata los datos personales necesarios para gestionar la cuenta, facilitar las reservas y mantener la seguridad del servicio. La información se utiliza exclusivamente para las finalidades descritas en esta política, de acuerdo con la normativa de protección de datos aplicable.',
      'Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. Los datos se conservarán durante el tiempo necesario para atender las obligaciones legales correspondientes.',
    ],
  },
  {
    title: '3. Permisos de ubicación',
    body: [
      'El permiso de ubicación permite mostrar plazas de aparcamiento cercanas y facilitar las indicaciones hasta el lugar de la reserva. ParkShare solo accede a esta información cuando la persona usuaria lo autoriza y mientras utiliza las funciones que la requieren.',
      'La autorización es voluntaria y puede revocarse en cualquier momento desde los ajustes del dispositivo. Si se desactiva, algunas funciones del mapa podrían no estar disponibles.',
    ],
  },
]

export function SecurityScreen() {
  return (
    <AppShell className="font-poppins">
      <ScreenHeader
        title="Seguridad y permisos"
        backHref="/ajustes"
        className="border-b border-line"
        titleClassName="text-[19px] font-semibold"
      />
      <main className="px-6 pt-6 pb-12">
        <p className="border-l-[3px] border-brand pl-2 text-[11px] font-medium tracking-[0.12em] text-subtle uppercase">
          ParkShare · Información legal
        </p>
        <p className="mt-3 text-[11px] text-subtle">Última actualización: 2 de noviembre de 2026</p>
        {LEGAL_SECTIONS.map((section) => (
          <section key={section.title} className="mt-7">
            <h2 className="text-[16px] font-semibold text-ink">{section.title}</h2>
            {section.body.map((paragraph) => (
              <p key={paragraph.slice(0, 24)} className="mt-2.5 text-[14px] leading-[1.6] text-muted-ink">
                {paragraph}
              </p>
            ))}
          </section>
        ))}
      </main>
    </AppShell>
  )
}
