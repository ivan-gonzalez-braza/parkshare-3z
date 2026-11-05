export type SpotType = 'gratuita' | 'pago' | 'carga' | 'descarga' | 'movilidad' | 'moto'

export type Spot = {
  id: string
  x: number
  y: number
  type: SpotType
  busy: boolean
  vertical: boolean
  street: string
}

export const SPOT_LABELS: Record<SpotType, string> = {
  gratuita: 'Plaza gratuita',
  pago: 'Zona de pago',
  carga: 'Punto de carga',
  descarga: 'Carga y descarga',
  movilidad: 'Movilidad reducida',
  moto: 'Sitio para moto',
}

const BLOCK = 150
const STREET = 60
const PITCH = BLOCK + STREET
const COLS = 8
const ROWS = 9

export const MAP_WIDTH = COLS * PITCH + STREET
export const MAP_HEIGHT = ROWS * PITCH + STREET

const HORIZONTAL_STREETS = [
  'Avinguda Diagonal',
  'Carrer de Còrsega',
  'Carrer del Rosselló',
  'Carrer de Provença',
  'Carrer de Mallorca',
  'Carrer de València',
  "Carrer d'Aragó",
  'Carrer del Consell de Cent',
  'Carrer de la Diputació',
  'Gran Via de les Corts Catalanes',
]

const VERTICAL_STREETS = [
  'Passeig de Gràcia',
  'Carrer de Pau Claris',
  'Carrer de Roger de Llúria',
  'Carrer del Bruc',
  'Carrer de Girona',
  'Carrer de Bailèn',
  'Passeig de Sant Joan',
  'Carrer de Roger de Flor',
  'Carrer de Nàpols',
]

export const STREETS = {
  horizontal: HORIZONTAL_STREETS.map((name, index) => ({ name, y: index * PITCH + STREET / 2 })),
  vertical: VERTICAL_STREETS.map((name, index) => ({ name, x: index * PITCH + STREET / 2 })),
}

const PARK_BLOCKS = new Set(['1-6', '6-1', '5-7', '2-3'])

export const BLOCKS = Array.from({ length: COLS * ROWS }, (_, index) => {
  const col = index % COLS
  const row = Math.floor(index / COLS)
  return {
    id: `${col}-${row}`,
    x: STREET + col * PITCH,
    y: STREET + row * PITCH,
    size: BLOCK,
    park: PARK_BLOCKS.has(`${col}-${row}`),
  }
})

export const DISTRICTS = [
  { name: "LA DRETA\nDE L'EIXAMPLE", x: STREET + 3 * PITCH + 18, y: STREET + 4 * PITCH + 52 },
  { name: 'SAGRADA\nFAMÍLIA', x: STREET + 7 * PITCH + 22, y: STREET + 1 * PITCH + 52 },
  { name: 'FORT\nPIENC', x: STREET + 6 * PITCH + 34, y: STREET + 7 * PITCH + 52 },
  { name: "L'ANTIGA\nESQUERRA", x: STREET + 0 * PITCH + 20, y: STREET + 3 * PITCH + 52 },
]

export const PARKS = [
  { name: 'Jardins de la\nTorre de les Aigües', blockId: '1-6' },
  { name: 'Jardins de\nPalau Robert', blockId: '6-1' },
  { name: 'Jardins de\nFlorensa', blockId: '5-7' },
  { name: 'Jardins de\nJaume Perich', blockId: '2-3' },
]

export const USER_POSITION = { x: 3 * PITCH + STREET / 2, y: 4 * PITCH + STREET / 2 }

function createRandom(seed: number) {
  let state = seed
  return () => {
    state = (state * 1664525 + 1013904223) % 4294967296
    return state / 4294967296
  }
}

const TYPE_WEIGHTS: [SpotType, number][] = [
  ['gratuita', 0.34],
  ['pago', 0.24],
  ['carga', 0.1],
  ['descarga', 0.12],
  ['movilidad', 0.1],
  ['moto', 0.1],
]

function pickType(value: number): SpotType {
  let acc = 0
  for (const [type, weight] of TYPE_WEIGHTS) {
    acc += weight
    if (value < acc) return type
  }
  return 'gratuita'
}

function generateSpots(): Spot[] {
  const random = createRandom(20260511)
  const spots: Spot[] = []

  for (let row = 0; row <= ROWS; row++) {
    for (let col = 0; col < COLS; col++) {
      if (random() < 0.25) continue
      const type = pickType(random())
      const count = 2 + Math.floor(random() * 3)
      const startX = STREET + col * PITCH + 8 + Math.floor(random() * (BLOCK - 16 - count * 40))
      const side = random() < 0.5 ? 4 : STREET - 21
      for (let i = 0; i < count; i++) {
        spots.push({
          id: `h-${row}-${col}-${i}`,
          x: startX + i * 40,
          y: row * PITCH + side,
          type,
          busy: random() < 0.45,
          vertical: false,
          street: HORIZONTAL_STREETS[row],
        })
      }
    }
  }

  for (let col = 0; col <= COLS; col++) {
    for (let row = 0; row < ROWS; row++) {
      if (random() < 0.25) continue
      const type = pickType(random())
      const count = 2 + Math.floor(random() * 3)
      const startY = STREET + row * PITCH + 8 + Math.floor(random() * (BLOCK - 16 - count * 40))
      const side = random() < 0.5 ? 4 : STREET - 23
      for (let i = 0; i < count; i++) {
        spots.push({
          id: `v-${col}-${row}-${i}`,
          x: col * PITCH + side,
          y: startY + i * 40,
          type,
          busy: random() < 0.45,
          vertical: true,
          street: VERTICAL_STREETS[col],
        })
      }
    }
  }

  return spots
}

export const SPOTS = generateSpots()

export function distanceToUser(spot: Spot) {
  return Math.round(Math.hypot(spot.x - USER_POSITION.x, spot.y - USER_POSITION.y) * 0.9)
}

export function isSpotVisible(spot: Spot, busy: boolean, filters: Record<SpotType | 'soloLibres', boolean>) {
  if (!filters[spot.type]) return false
  if (filters.soloLibres && busy) return false
  return true
}

export function readableTextColor(hex: string) {
  const value = hex.replace('#', '')
  const r = parseInt(value.slice(0, 2), 16)
  const g = parseInt(value.slice(2, 4), 16)
  const b = parseInt(value.slice(4, 6), 16)
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255
  return luminance > 0.62 ? '#1f2d31' : '#ffffff'
}
