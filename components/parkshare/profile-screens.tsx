'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { ChevronRight, LogOut, Settings } from 'lucide-react'
import { AppShell } from './app-shell'
import { ScreenHeader } from './screen-header'
import { TextField } from './text-field'
import { useApp } from './app-provider'

export function ProfileScreen() {
  const { profile } = useApp()

  return (
    <AppShell className="font-poppins">
      <ScreenHeader
        title="Mi Perfil"
        backHref="/mapa"
        className="mt-4"
        titleClassName="text-[28px] font-semibold"
      />
      <main className="flex flex-1 flex-col px-7 pb-10">
        <div className="mt-[66px] flex flex-col items-center text-center">
          <Image
            src={profile.photo || '/placeholder.svg'}
            alt={`Foto de ${profile.fullName}`}
            width={152}
            height={152}
            priority
            className="size-[152px] rounded-full border-4 border-brand object-cover"
          />
          <h2 className="mt-7 text-[24px] font-semibold text-ink">{profile.fullName}</h2>
          <p className="mt-1.5 text-[15px] text-subtle">{profile.email}</p>
          <Link
            href="/perfil/editar"
            className="mt-6 flex h-[52px] items-center rounded-full bg-brand px-8 text-[16px] font-semibold text-on-brand transition-[filter] hover:brightness-95"
          >
            Editar perfil
          </Link>
        </div>

        <Link
          href="/ajustes"
          className="mt-14 flex h-[89px] items-center gap-4 border-y border-line text-ink"
        >
          <Settings className="size-6" strokeWidth={1.75} aria-hidden="true" />
          <span className="flex-1 text-[18px] font-medium">Ajustes</span>
          <ChevronRight className="size-5 text-subtle" aria-hidden="true" />
        </Link>

        <Link
          href="/login"
          className="mt-auto flex items-center justify-center gap-3 pt-16 text-[18px] font-medium text-ink"
        >
          <LogOut className="size-6" strokeWidth={1.75} aria-hidden="true" />
          Cerrar sesión
        </Link>
      </main>
    </AppShell>
  )
}

export function EditProfileScreen() {
  const router = useRouter()
  const { profile, setProfile } = useApp()
  const [photo, setPhoto] = useState(profile.photo === '/figma/elena-profile.jpg' ? '/figma/elena-edit.jpg' : profile.photo)

  return (
    <AppShell className="font-poppins">
      <ScreenHeader title="Editar perfil" backHref="/perfil" className="mt-2" titleClassName="text-[22px] font-semibold" />
      <main className="flex flex-1 flex-col px-7 pb-10">
        <form
          className="flex flex-1 flex-col"
          onSubmit={(event) => {
            event.preventDefault()
            const data = new FormData(event.currentTarget)
            setProfile({
              fullName: String(data.get('fullName') ?? '').trim() || profile.fullName,
              username: String(data.get('username') ?? '').trim() || profile.username,
              email: String(data.get('email') ?? '').trim() || profile.email,
              photo: photo === '/figma/elena-edit.jpg' ? '/figma/elena-profile.jpg' : photo,
            })
            router.push('/perfil')
          }}
        >
          <div className="mt-[34px] flex flex-col items-center">
            <Image
              src={photo || '/placeholder.svg'}
              alt="Foto de perfil"
              width={132}
              height={132}
              className="size-[132px] rounded-full object-cover"
            />
            <label className="mt-4 cursor-pointer text-[15px] font-medium text-brand hover:underline">
              Cambiar foto
              <input
                type="file"
                accept="image/*"
                className="sr-only"
                onChange={(event) => {
                  const file = event.target.files?.[0]
                  if (file) setPhoto(URL.createObjectURL(file))
                }}
              />
            </label>
          </div>

          <div className="mt-[42px] mb-12 flex flex-col gap-[22px]">
            <Field id="fullName" label="Nombre y apellidos" defaultValue={profile.fullName} autoComplete="name" />
            <Field id="username" label="Nombre de usuario" defaultValue={profile.username} autoComplete="username" />
            <Field id="email" label="Correo electrónico" type="email" defaultValue={profile.email} autoComplete="email" />
          </div>

          <button
            type="submit"
            className="mt-auto flex h-[76px] w-full items-center justify-center rounded-full bg-brand text-[19px] font-semibold text-white transition-[filter] hover:brightness-95"
          >
            Guardar cambios
          </button>
        </form>
      </main>
    </AppShell>
  )
}

function Field({ id, label, ...props }: { id: string; label: string } & React.ComponentProps<'input'>) {
  return (
    <div className="flex flex-col gap-2.5">
      <label htmlFor={id} className="text-[13px] text-subtle">
        {label}
      </label>
      <TextField id={id} name={id} {...props} className="h-[68px] rounded-[22px]" />
    </div>
  )
}
