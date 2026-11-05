'use client'

import { createContext, useContext, useEffect, useMemo, useState } from 'react'

export type FilterKey =
  | 'gratuita'
  | 'carga'
  | 'movilidad'
  | 'pago'
  | 'descarga'
  | 'moto'
  | 'soloLibres'
export type SpotColorKey =
  | 'gratuita'
  | 'pago'
  | 'carga'
  | 'descarga'
  | 'movilidad'
  | 'moto'
  | 'ocupada'

export const DEFAULT_FILTERS: Record<FilterKey, boolean> = {
  gratuita: true,
  carga: true,
  movilidad: true,
  pago: true,
  descarga: true,
  moto: true,
  soloLibres: false,
}

export const DEFAULT_SPOT_COLORS: Record<SpotColorKey, string> = {
  gratuita: '#26c66e',
  pago: '#3477f6',
  carga: '#8b5cf6',
  descarga: '#f4cd36',
  movilidad: '#80ccf2',
  moto: '#ff953f',
  ocupada: '#ef4b50',
}

export type Profile = {
  fullName: string
  username: string
  email: string
  photo: string
}

type AppState = {
  filters: Record<FilterKey, boolean>
  toggleFilter: (key: FilterKey) => void
  resetFilters: () => void
  spotColors: Record<SpotColorKey, string>
  setSpotColor: (key: SpotColorKey, color: string) => void
  resetSpotColors: () => void
  darkMode: boolean
  setDarkMode: (value: boolean) => void
  notifications: boolean
  setNotifications: (value: boolean) => void
  language: string
  setLanguage: (value: string) => void
  profile: Profile
  setProfile: (profile: Profile) => void
}

const AppContext = createContext<AppState | null>(null)

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [filters, setFilters] = useState<Record<FilterKey, boolean>>(DEFAULT_FILTERS)
  const [spotColors, setSpotColors] = useState(DEFAULT_SPOT_COLORS)
  const [darkMode, setDarkMode] = useState(false)
  const [notifications, setNotifications] = useState(true)
  const [language, setLanguage] = useState('Español')
  const [profile, setProfile] = useState<Profile>({
    fullName: 'Elena Martínez',
    username: '@elena_parker',
    email: 'elena.martinez@gmail.com',
    photo: '/figma/elena-profile.jpg',
  })

  useEffect(() => {
    const root = document.documentElement
    root.classList.toggle('dark', darkMode)
    root.classList.toggle('light', !darkMode)
    root.style.colorScheme = darkMode ? 'dark' : 'light'
  }, [darkMode])

  const value = useMemo<AppState>(
    () => ({
      filters,
      toggleFilter: (key) => setFilters((prev) => ({ ...prev, [key]: !prev[key] })),
      resetFilters: () => setFilters(DEFAULT_FILTERS),
      spotColors,
      setSpotColor: (key, color) => setSpotColors((prev) => ({ ...prev, [key]: color })),
      resetSpotColors: () => setSpotColors(DEFAULT_SPOT_COLORS),
      darkMode,
      setDarkMode,
      notifications,
      setNotifications,
      language,
      setLanguage,
      profile,
      setProfile,
    }),
    [filters, spotColors, darkMode, notifications, language, profile],
  )

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}

export function useApp() {
  const context = useContext(AppContext)
  if (!context) throw new Error('useApp must be used within AppProvider')
  return context
}
