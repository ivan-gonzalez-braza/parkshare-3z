'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { Accessibility, Bike, Euro, LocateFixed, Minus, Plus, Truck, Zap } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useApp } from './app-provider'
import {
  BLOCKS,
  DISTRICTS,
  MAP_HEIGHT,
  MAP_WIDTH,
  PARKS,
  SPOT_LABELS,
  SPOTS,
  STREETS,
  USER_POSITION,
  type Spot,
  type SpotType,
  isSpotVisible,
  readableTextColor,
} from './map-data'

const MIN_SCALE = 0.45
const MAX_SCALE = 2

type View = { x: number; y: number; scale: number; smooth: boolean }
type Size = { w: number; h: number }

const SPOT_ICONS: Record<Exclude<SpotType, 'gratuita'>, typeof Zap> = {
  pago: Euro,
  carga: Zap,
  descarga: Truck,
  movilidad: Accessibility,
  moto: Bike,
}

function clampView(view: View, size: Size): View {
  const width = MAP_WIDTH * view.scale
  const height = MAP_HEIGHT * view.scale
  const x = width <= size.w ? (size.w - width) / 2 : Math.min(0, Math.max(size.w - width, view.x))
  const y = height <= size.h ? (size.h - height) / 2 : Math.min(0, Math.max(size.h - height, view.y))
  return { ...view, x, y }
}

function centeredView(size: Size, scale: number, smooth: boolean): View {
  return clampView(
    { x: size.w / 2 - USER_POSITION.x * scale, y: size.h / 2 - USER_POSITION.y * scale, scale, smooth },
    size,
  )
}

export function MapCanvas({
  busyOverrides,
  selectedId,
  onSelect,
}: {
  busyOverrides: Record<string, boolean>
  selectedId: string | null
  onSelect: (spot: Spot | null) => void
}) {
  const { filters, spotColors } = useApp()
  const viewportRef = useRef<HTMLDivElement>(null)
  const sizeRef = useRef<Size>({ w: 440, h: 600 })
  const [view, setView] = useState<View>(() => centeredView(sizeRef.current, 1, false))
  const pointers = useRef(new Map<number, { x: number; y: number }>())
  const gesture = useRef<{
    startX: number
    startY: number
    view: View
    distance: number
    moved: boolean
  } | null>(null)
  const suppressClick = useRef(false)

  const updateView = useCallback((updater: (prev: View) => View) => {
    setView((prev) => clampView(updater(prev), sizeRef.current))
  }, [])

  const zoomAround = useCallback(
    (factor: number, cx: number, cy: number, smooth: boolean, base?: View) => {
      updateView((prev) => {
        const from = base ?? prev
        const scale = Math.min(MAX_SCALE, Math.max(MIN_SCALE, from.scale * factor))
        const ratio = scale / from.scale
        return { x: cx - (cx - from.x) * ratio, y: cy - (cy - from.y) * ratio, scale, smooth }
      })
    },
    [updateView],
  )

  useEffect(() => {
    const element = viewportRef.current
    if (!element) return
    let first = true
    const observer = new ResizeObserver(([entry]) => {
      sizeRef.current = { w: entry.contentRect.width, h: entry.contentRect.height }
      if (first) {
        first = false
        setView(centeredView(sizeRef.current, 1, false))
      } else {
        setView((prev) => clampView(prev, sizeRef.current))
      }
    })
    observer.observe(element)

    const onWheel = (event: WheelEvent) => {
      event.preventDefault()
      const rect = element.getBoundingClientRect()
      if (event.ctrlKey) {
        zoomAround(Math.exp(-event.deltaY * 0.01), event.clientX - rect.left, event.clientY - rect.top, false)
      } else {
        updateView((prev) => ({ ...prev, x: prev.x - event.deltaX, y: prev.y - event.deltaY, smooth: false }))
      }
    }
    element.addEventListener('wheel', onWheel, { passive: false })
    return () => {
      observer.disconnect()
      element.removeEventListener('wheel', onWheel)
    }
  }, [updateView, zoomAround])

  const pinchInfo = () => {
    const [a, b] = Array.from(pointers.current.values())
    return { distance: Math.hypot(a.x - b.x, a.y - b.y), cx: (a.x + b.x) / 2, cy: (a.y + b.y) / 2 }
  }

  const onPointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    const rect = event.currentTarget.getBoundingClientRect()
    pointers.current.set(event.pointerId, { x: event.clientX - rect.left, y: event.clientY - rect.top })
    const info = pointers.current.size === 2 ? pinchInfo() : null
    gesture.current = {
      startX: info ? info.cx : event.clientX - rect.left,
      startY: info ? info.cy : event.clientY - rect.top,
      view,
      distance: info?.distance ?? 0,
      moved: gesture.current?.moved ?? false,
    }
  }

  const onPointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    const current = gesture.current
    if (!current || !pointers.current.has(event.pointerId)) return
    const rect = event.currentTarget.getBoundingClientRect()
    pointers.current.set(event.pointerId, { x: event.clientX - rect.left, y: event.clientY - rect.top })

    if (pointers.current.size >= 2) {
      const { distance, cx, cy } = pinchInfo()
      current.moved = true
      const base = { ...current.view, x: current.view.x + (cx - current.startX), y: current.view.y + (cy - current.startY) }
      zoomAround(distance / current.distance, cx, cy, false, base)
      return
    }

    const dx = event.clientX - rect.left - current.startX
    const dy = event.clientY - rect.top - current.startY
    if (!current.moved && Math.hypot(dx, dy) < 5) return
    if (!current.moved) {
      current.moved = true
      event.currentTarget.setPointerCapture(event.pointerId)
    }
    updateView(() => ({ ...current.view, x: current.view.x + dx, y: current.view.y + dy, smooth: false }))
  }

  const onPointerEnd = (event: React.PointerEvent<HTMLDivElement>) => {
    pointers.current.delete(event.pointerId)
    if (gesture.current?.moved) suppressClick.current = true
    if (pointers.current.size === 0) {
      gesture.current = null
    } else {
      const [remaining] = Array.from(pointers.current.values())
      gesture.current = { startX: remaining.x, startY: remaining.y, view, distance: 0, moved: true }
    }
  }

  const onClickCapture = (event: React.MouseEvent) => {
    if (suppressClick.current) {
      suppressClick.current = false
      event.stopPropagation()
      event.preventDefault()
    }
  }

  const onKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.target !== event.currentTarget) return
    const step = 80
    const moves: Record<string, [number, number]> = {
      ArrowUp: [0, step],
      ArrowDown: [0, -step],
      ArrowLeft: [step, 0],
      ArrowRight: [-step, 0],
    }
    if (moves[event.key]) {
      event.preventDefault()
      const [dx, dy] = moves[event.key]
      updateView((prev) => ({ ...prev, x: prev.x + dx, y: prev.y + dy, smooth: true }))
    } else if (event.key === '+' || event.key === '=') {
      zoomAround(1.25, sizeRef.current.w / 2, sizeRef.current.h / 2, true)
    } else if (event.key === '-') {
      zoomAround(0.8, sizeRef.current.w / 2, sizeRef.current.h / 2, true)
    }
  }

  const visibleSpots = SPOTS.filter((spot) => isSpotVisible(spot, busyOverrides[spot.id] ?? spot.busy, filters))

  return (
    <>
      <div
        ref={viewportRef}
        tabIndex={0}
        role="application"
        aria-roledescription="mapa"
        aria-label="Mapa de plazas del Eixample. Arrastra o usa las flechas para moverte y + o - para hacer zoom."
        className="absolute inset-0 cursor-grab touch-none overflow-hidden bg-map outline-none select-none active:cursor-grabbing focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-inset"
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerEnd}
        onPointerCancel={onPointerEnd}
        onClickCapture={onClickCapture}
        onClick={() => onSelect(null)}
        onKeyDown={onKeyDown}
      >
        <div
          className="absolute top-0 left-0 origin-top-left will-change-transform"
          style={{
            width: MAP_WIDTH,
            height: MAP_HEIGHT,
            transform: `translate3d(${view.x}px, ${view.y}px, 0) scale(${view.scale})`,
            transition: view.smooth ? 'transform 260ms ease-out' : 'none',
          }}
        >
          {BLOCKS.map((block) => (
            <div
              key={block.id}
              className={cn('absolute rounded-[26px]', block.park ? 'bg-map-park' : 'bg-map-block')}
              style={{ left: block.x, top: block.y, width: block.size, height: block.size }}
            >
              {block.park ? (
                <>
                  <span className="absolute top-6 left-8 size-7 rounded-full bg-free/20" />
                  <span className="absolute right-7 bottom-10 size-9 rounded-full bg-free/15" />
                  <span className="absolute top-16 right-12 size-5 rounded-full bg-free/20" />
                </>
              ) : (
                <div className="absolute inset-[16px] rounded-[14px] bg-map-inner" />
              )}
            </div>
          ))}

          {STREETS.horizontal.map((street, index) => (
            <span
              key={street.name}
              className="pointer-events-none absolute -translate-y-1/2 text-[11px] whitespace-nowrap text-map-label"
              style={{ top: street.y, left: 70 + (index % 3) * 420 + 150 }}
            >
              {street.name}
            </span>
          ))}
          {STREETS.vertical.map((street, index) => (
            <span
              key={street.name}
              className="pointer-events-none absolute -translate-x-1/2 -rotate-90 text-[11px] whitespace-nowrap text-map-label"
              style={{ left: street.x, top: 330 + (index % 3) * 520 }}
            >
              {street.name}
            </span>
          ))}

          {DISTRICTS.map((district) => (
            <span
              key={district.name}
              className="pointer-events-none absolute text-[11px] leading-[1.6] tracking-[0.14em] whitespace-pre text-faint"
              style={{ left: district.x, top: district.y }}
            >
              {district.name}
            </span>
          ))}

          {PARKS.map((park) => {
            const block = BLOCKS.find((item) => item.id === park.blockId)
            if (!block) return null
            return (
              <span
                key={park.name}
                className="pointer-events-none absolute text-[11px] leading-snug whitespace-pre text-free"
                style={{ left: block.x + 14, top: block.y + block.size - 46 }}
              >
                {park.name}
              </span>
            )
          })}

          {visibleSpots.map((spot) => {
            const busy = busyOverrides[spot.id] ?? spot.busy
            const color = busy ? spotColors.ocupada : spotColors[spot.type]
            const Icon = spot.type === 'gratuita' ? null : SPOT_ICONS[spot.type]
            const selected = spot.id === selectedId
            return (
              <button
                key={spot.id}
                type="button"
                onClick={(event) => {
                  event.stopPropagation()
                  onSelect(spot)
                }}
                aria-label={`${SPOT_LABELS[spot.type]}, ${busy ? 'ocupada' : 'libre'}, ${spot.street}`}
                aria-pressed={selected}
                className={cn(
                  'absolute flex items-center justify-center rounded-[5px] text-[12px] font-black shadow-[0_1px_2px_rgba(0,0,0,0.18)] transition-transform hover:scale-110',
                  selected && 'z-10 scale-125 ring-2 ring-ink ring-offset-1 ring-offset-map',
                )}
                style={{
                  left: spot.x,
                  top: spot.y,
                  width: spot.vertical ? 19 : 34,
                  height: spot.vertical ? 34 : 17,
                  backgroundColor: color,
                  color: readableTextColor(color),
                }}
              >
                {Icon ? <Icon className="size-3" strokeWidth={2.5} aria-hidden="true" /> : 'P'}
              </button>
            )
          })}

          <span
            className="pointer-events-none absolute flex size-[78px] -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-locate/15"
            style={{ left: USER_POSITION.x, top: USER_POSITION.y }}
          >
            <span className="absolute inset-0 animate-ping rounded-full bg-locate/10" />
            <span className="relative size-[18px] rounded-full border-[3px] border-surface bg-locate shadow-[0_1px_4px_rgba(49,135,244,0.5)]" />
            <span className="sr-only">Tu ubicación</span>
          </span>
        </div>
      </div>

      <div className="absolute right-5 bottom-8 z-10 flex flex-col gap-2.5">
        <div className="flex flex-col overflow-hidden rounded-[18px] bg-surface shadow-[0_4px_14px_rgba(31,45,49,0.14)]">
          <MapControl
            label="Acercar"
            onClick={() => zoomAround(1.3, sizeRef.current.w / 2, sizeRef.current.h / 2, true)}
          >
            <Plus className="size-5" aria-hidden="true" />
          </MapControl>
          <span className="mx-3 h-px bg-line" aria-hidden="true" />
          <MapControl
            label="Alejar"
            onClick={() => zoomAround(1 / 1.3, sizeRef.current.w / 2, sizeRef.current.h / 2, true)}
          >
            <Minus className="size-5" aria-hidden="true" />
          </MapControl>
        </div>
        <button
          type="button"
          aria-label="Centrar en mi ubicación"
          onClick={() => setView(centeredView(sizeRef.current, Math.max(view.scale, 1), true))}
          className="flex size-[52px] items-center justify-center rounded-[18px] bg-surface text-[#c4622d] shadow-[0_4px_14px_rgba(31,45,49,0.14)] hover:bg-field"
        >
          <LocateFixed className="size-6" aria-hidden="true" />
        </button>
      </div>
    </>
  )
}

function MapControl({
  label,
  onClick,
  children,
}: {
  label: string
  onClick: () => void
  children: React.ReactNode
}) {
  return (
    <button
      type="button"
      aria-label={label}
      onClick={onClick}
      className="flex size-[52px] items-center justify-center text-ink hover:bg-field"
    >
      {children}
    </button>
  )
}
