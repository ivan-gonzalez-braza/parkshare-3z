'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { AppShell } from './app-shell'
import { ScreenHeader } from './screen-header'
import { TextField } from './text-field'

const primaryButton =
  'flex h-[76px] w-full items-center justify-center rounded-full bg-brand text-[21px] font-extrabold text-ink transition-[filter] hover:brightness-95 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink'

export function RegisterScreen() {
  const router = useRouter()

  return (
    <AppShell>
      <ScreenHeader title="ParkShare" />
      <main className="flex flex-1 flex-col px-7 pt-[50px] pb-10">
        <h2 className="text-[34px] leading-tight font-extrabold text-ink">Crea tu cuenta</h2>
        <p className="mt-3 text-[17px] leading-[1.6] text-subtle">
          Únete para encontrar y compartir aparcamiento al instante.
        </p>
        <form
          className="mt-8 flex flex-col"
          onSubmit={(event) => {
            event.preventDefault()
            router.push('/mapa')
          }}
        >
          <div className="flex flex-col gap-4">
            <label className="sr-only" htmlFor="fullName">Nombre y apellidos</label>
            <TextField id="fullName" name="fullName" placeholder="Nombre y apellidos" autoComplete="name" required />
            <label className="sr-only" htmlFor="username">Nombre de usuario</label>
            <TextField id="username" name="username" placeholder="Nombre de usuario" autoComplete="username" required />
            <label className="sr-only" htmlFor="email">Correo electrónico</label>
            <TextField id="email" name="email" type="email" placeholder="Correo electrónico" autoComplete="email" required />
            <label className="sr-only" htmlFor="password">Contraseña</label>
            <TextField id="password" name="password" type="password" placeholder="Contraseña" autoComplete="new-password" minLength={6} required />
          </div>
          <div className="-mx-1 mt-[34px] flex flex-col gap-9">
            <button type="submit" className={primaryButton}>
              Crear cuenta
            </button>
            <Link
              href="/login"
              className="flex h-[76px] w-full items-center justify-center rounded-full bg-[#b3b3b3] text-[20px] font-extrabold text-ink transition-[filter] hover:brightness-95"
            >
              ¿Ya tienes cuenta? Inicia sesión
            </Link>
          </div>
        </form>
      </main>
    </AppShell>
  )
}

export function LoginScreen() {
  const router = useRouter()

  return (
    <AppShell>
      <ScreenHeader title="ParkShare" backHref="/registro" />
      <main className="flex flex-1 flex-col px-7 pt-[50px] pb-10">
        <h2 className="text-[34px] leading-tight font-extrabold text-ink">Inicia sesión</h2>
        <form
          className="mt-[34px] flex flex-col"
          onSubmit={(event) => {
            event.preventDefault()
            router.push('/mapa')
          }}
        >
          <div className="flex flex-col gap-[33px]">
            <label className="sr-only" htmlFor="login-username">Nombre de usuario</label>
            <TextField id="login-username" name="username" placeholder="Nombre de usuario" autoComplete="username" required />
            <label className="sr-only" htmlFor="login-password">Contraseña</label>
            <TextField id="login-password" name="password" type="password" placeholder="Contraseña" autoComplete="current-password" required />
          </div>
          <button
            type="button"
            className="mt-8 self-start px-[14px] text-[17px] text-subtle underline-offset-4 hover:underline"
          >
            ¿Has olvidado tu contraseña?
          </button>
          <div className="mt-[136px] pl-1">
            <button type="submit" className={primaryButton}>
              Iniciar sesión
            </button>
          </div>
        </form>
      </main>
    </AppShell>
  )
}
