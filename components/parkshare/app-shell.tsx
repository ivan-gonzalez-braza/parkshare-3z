import { cn } from '@/lib/utils'

export function AppShell({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) {
  return (
    <div className="flex min-h-dvh justify-center bg-[#f6f2ee]">
      <div
        className={cn(
          'relative flex min-h-dvh w-full max-w-[440px] flex-col bg-white text-ink md:shadow-[0_0_40px_rgba(31,45,49,0.08)]',
          className,
        )}
      >
        {children}
      </div>
    </div>
  )
}
