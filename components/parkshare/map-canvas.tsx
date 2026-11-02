'use client'

import { Zap } from 'lucide-react'
import { useApp } from './app-provider'

type Spot = { x: number; y: number; status: 'free' | 'busy' | 'charge'; vertical?: boolean }

const SPOTS: Spot[] = [
  { x: 173, y: 210, status: 'free' },
  { x: 215, y: 210, status: 'busy' },
  { x: 257, y: 210, status: 'free' },
  { x: 173, y: 246, status: 'busy' },
  { x: 215, y: 246, status: 'free' },
  { x: 99, y: 287, status: 'free', vertical: true },
  { x: 99, y: 327, status: 'busy', vertical: true },
  { x: 99, y: 368, status: 'free', vertical: true },
  { x: 130, y: 279, status: 'busy', vertical: true },
  { x: 130, y: 319, status: 'charge', vertical: true },
  { x: 313, y: 290, status: 'busy', vertical: true },
  { x: 313, y: 330, status: 'free', vertical: true },
  { x: 313, y: 370, status: 'charge', vertical: true },
  { x: 344, y: 280, status: 'free', vertical: true },
  { x: 344, y: 320, status: 'busy', vertical: true },
  { x: 344, y: 361, status: 'busy', vertical: true },
  { x: 173, y: 434, status: 'free' },
  { x: 215, y: 434, status: 'charge' },
  { x: 257, y: 434, status: 'busy' },
  { x: 173, y: 470, status: 'busy' },
  { x: 215, y: 470, status: 'free' },
  { x: 257, y: 470, status: 'busy' },
  { x: 130, y: 518, status: 'free', vertical: true },
  { x: 130, y: 558, status: 'busy', vertical: true },
  { x: 313, y: 520, status: 'free', vertical: true },
  { x: 344, y: 515, status: 'busy', vertical: true },
]

const BLOCKS = [
  { x: 0, y: 0, w: 95, h: 205 },
  { x: 155, y: 0, w: 145, h: 205 },
  { x: 365, y: 0, w: 75, h: 205, park: true },
  { x: 0, y: 265, w: 95, h: 165 },
  { x: 155, y: 265, w: 145, h: 165 },
  { x: 365, y: 265, w: 75, h: 165 },
  { x: 0, y: 490, w: 95, h: 320, park: true },
  { x: 155, y: 490, w: 145, h: 320 },
  { x: 365, y: 490, w: 75, h: 320 },
]

export function MapCanvas() {
  const { filters, spotColors } = useApp()
  const visibleSpots = SPOTS.filter((spot) => spot.status !== 'charge' || filters.carga)

  return (
    <div
      className="absolute top-0 left-1/2 h-[810px] w-[440px] -translate-x-1/2 bg-white"
      role="img"
      aria-label="Mapa de plazas de aparcamiento en La Dreta de l'Eixample"
    >
      {BLOCKS.map((block) => (
        <div
          key={`${block.x}-${block.y}`}
          className={
            block.park
              ? 'absolute rounded-[18px] bg-[#e4ece2]'
              : 'absolute rounded-[18px] bg-[#e3e7e5]'
          }
          style={{ left: block.x, top: block.y, width: block.w, height: block.h }}
        >
          {!block.park ? <div className="absolute inset-[14px] rounded-[10px] bg-[#eceeed]" /> : null}
        </div>
      ))}

      <div className="absolute top-[86px] left-[400px] size-6 rounded-full bg-[#d7e3d4]" />
      <div className="absolute top-[520px] left-[48px] size-6 rounded-full bg-[#d7e3d4]" />
      <div className="absolute top-[440px] left-[-60px] h-[360px] w-[120px] rounded-full border-[6px] border-white" />

      <span className="absolute top-[230px] left-[20px] text-[11px] text-[#7b8387]">Mallorca</span>
      <span className="absolute top-[228px] left-[172px] text-[11px] text-[#55606a]">Carrer de Mallorca</span>
      <span className="absolute top-[453px] left-[169px] text-[11px] text-[#55606a]">Carrer de Provença</span>
      <span className="absolute top-[330px] left-[86px] origin-center -rotate-90 text-[11px] text-[#55606a]">
        Carrer de Girona
      </span>
      <span className="absolute top-[334px] left-[302px] origin-center -rotate-90 text-[11px] text-[#55606a]">
        Carrer de Bailèn
      </span>
      <span className="absolute top-[340px] left-[174px] text-[11px] leading-[1.6] tracking-wide text-[#9aa2a5]">
        LA DRETA
        <br />
        {"DE L'EIXAMPLE"}
      </span>
      <span className="absolute top-[564px] left-[14px] text-[11px] leading-snug text-[#7b8387]">
        Jardins de la
        <br />
        Torre
      </span>

      {visibleSpots.map((spot) => (
        <span
          key={`${spot.x}-${spot.y}`}
          className="absolute flex items-center justify-center rounded-[5px] text-[12px] font-black text-white shadow-[0_1px_2px_rgba(0,0,0,0.18)]"
          style={{
            left: spot.x,
            top: spot.y,
            width: spot.vertical ? 19 : 34,
            height: spot.vertical ? 34 : 17,
            backgroundColor: spot.status === 'busy' ? spotColors.ocupada : spotColors.gratuita,
          }}
        >
          {spot.status === 'charge' ? <Zap className="size-3" strokeWidth={2.5} aria-hidden="true" /> : 'P'}
        </span>
      ))}

      <span className="absolute top-[385px] left-[82px] flex size-[78px] items-center justify-center rounded-full bg-locate/15">
        <span className="size-[18px] rounded-full border-[3px] border-white bg-locate shadow-[0_1px_4px_rgba(49,135,244,0.5)]" />
      </span>
    </div>
  )
}
