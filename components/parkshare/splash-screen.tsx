'use client'

import { useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { AppShell } from './app-shell'

export function SplashScreen() {
  const router = useRouter()

  useEffect(() => {
    const timer = setTimeout(() => router.push('/registro'), 2200)
    return () => clearTimeout(timer)
  }, [router])

  return (
    <AppShell className="bg-brand">
      <Link
        href="/registro"
        aria-label="Entrar en ParkShare"
        className="flex flex-1 items-center justify-center"
      >
        <h1 className="sr-only">ParkShare</h1>
        <Image
          src="/figma/logo-white.png"
          alt="Logotipo de ParkShare"
          width={958}
          height={603}
          priority
          className="h-auto w-[234px] animate-in fade-in zoom-in-95 duration-700"
        />
      </Link>
    </AppShell>
  )
}
