'use client'

import { cn } from '@/lib/utils'

export function Toggle({
  checked,
  onChange,
  label,
}: {
  checked: boolean
  onChange: (value: boolean) => void
  label: string
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      onClick={() => onChange(!checked)}
      className={cn(
        'relative h-[34px] w-[57px] shrink-0 rounded-full transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand',
        checked ? 'bg-brand' : 'bg-track',
      )}
    >
      <span
        className={cn(
          'absolute top-[3px] left-[3px] size-7 rounded-full bg-white shadow-[0_2px_4px_rgba(0,0,0,0.15)] transition-transform',
          checked && 'translate-x-[23px]',
        )}
      />
    </button>
  )
}
