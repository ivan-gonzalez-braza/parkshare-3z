import { cn } from '@/lib/utils'

export function TextField({ className, ...props }: React.ComponentProps<'input'>) {
  return (
    <input
      {...props}
      className={cn(
        'h-[72px] w-full rounded-[22px] bg-field px-6 text-[17px] text-ink outline-none placeholder:text-subtle focus-visible:ring-2 focus-visible:ring-brand',
        className,
      )}
    />
  )
}
