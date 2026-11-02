import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { cn } from '@/lib/utils'

export function ScreenHeader({
  title,
  backHref,
  className,
  titleClassName,
}: {
  title: string
  backHref?: string
  className?: string
  titleClassName?: string
}) {
  return (
    <header className={cn('relative flex h-[76px] items-center justify-center px-7', className)}>
      {backHref ? (
        <Link
          href={backHref}
          aria-label="Volver"
          className="absolute left-5 flex size-10 items-center justify-center rounded-full text-ink transition-colors hover:bg-field"
        >
          <ArrowLeft className="size-6" strokeWidth={2} aria-hidden="true" />
        </Link>
      ) : null}
      <h1 className={cn('text-[22px] font-extrabold tracking-tight text-ink', titleClassName)}>{title}</h1>
    </header>
  )
}
