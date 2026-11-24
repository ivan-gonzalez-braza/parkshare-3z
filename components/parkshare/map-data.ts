export type SpotType = 'gratuita' | 'pago' | 'carga' | 'descarga' | 'movilidad' | 'moto'

export type Spot = {
  id: string
  lat: number
  lng: number
  type: SpotType
  busy: boolean
  vertical: boolean
  street: string
  capacity?: number
  details?: string
}

export type Coords = { lat: number; lng: number }

export const SPOT_LABELS: Record<SpotType, string> = {
  gratuita: 'Plaza gratuita',
  pago: 'Zona de pago',
  carga: 'Punto de carga',
  descarga: 'Carga y descarga',
  movilidad: 'Movilidad reducida',
  moto: 'Sitio para moto',
}

export const USER_POSITION: Coords = { lat: 41.5391, lng: 2.4445 }

export const SPOTS: Spot[] = [
  {
    id: 'pumsa-tereses',
    lat: 41.53912,
    lng: 2.44356,
    type: 'pago',
    busy: false,
    vertical: false,
    street: 'Plaça de les Tereses, 42 (PUMSA)',
    details: 'Rotación y abonados',
  },
  {
    id: 'pumsa-tereses-ev',
    lat: 41.53925,
    lng: 2.44372,
    type: 'carga',
    busy: false,
    vertical: false,
    street: 'Plaça de les Tereses (Recarga EV)',
    details: 'Punto de carga eléctrica PUMSA',
  },
  {
    id: 'pumsa-parc-central',
    lat: 41.53854,
    lng: 2.44781,
    type: 'pago',
    busy: true,
    vertical: false,
    street: 'Camí de la Geganta, 2 (Parc Central)',
    details: 'Subterráneo Recinte Firal',
  },
  {
    id: 'pumsa-granollers',
    lat: 41.54321,
    lng: 2.44112,
    type: 'pago',
    busy: false,
    vertical: false,
    street: 'Camí de la Geganta, 82 (Pl. Granollers)',
    details: 'Junto a Policía Local',
  },
  {
    id: 'pumsa-cuba',
    lat: 41.54395,
    lng: 2.43821,
    type: 'pago',
    busy: false,
    vertical: false,
    street: 'Plaça de Cuba, 25 (PUMSA)',
    details: 'Mercat de la Plaça de Cuba',
  },
  {
    id: 'solar-varador',
    lat: 41.53321,
    lng: 2.45123,
    type: 'gratuita',
    busy: false,
    vertical: false,
    street: 'Passeig Marítim - Varador',
    capacity: 160,
    details: 'Solar gratuito (160 plazas)',
  },
  {
    id: 'solar-puerto',
    lat: 41.53450,
    lng: 2.44890,
    type: 'gratuita',
    busy: true,
    vertical: false,
    street: 'Passeig Marítim - Puerto de Mataró',
    capacity: 137,
    details: 'Solar gratuito (137 plazas)',
  },
  {
    id: 'solar-sant-simo',
    lat: 41.53980,
    lng: 2.46120,
    type: 'gratuita',
    busy: false,
    vertical: false,
    street: 'Passeig Marítim - Sant Simó',
    capacity: 210,
    details: 'Solar gratuito (210 plazas)',
  },
  {
    id: 'solar-triangle-molins',
    lat: 41.54890,
    lng: 2.43540,
    type: 'gratuita',
    busy: false,
    vertical: false,
    street: 'Aparcamiento Triangle Molins',
    capacity: 350,
    details: 'Solar gratuito (350 plazas)',
  },
  {
    id: 'solar-torre-llauder',
    lat: 41.53720,
    lng: 2.44190,
    type: 'gratuita',
    busy: false,
    vertical: false,
    street: 'Carrer Roma, 3 (Torre Llauder)',
    capacity: 178,
    details: 'Solar gratuito (178 plazas)',
  },
  {
    id: 'solar-les-valls',
    lat: 41.55120,
    lng: 2.43980,
    type: 'gratuita',
    busy: true,
    vertical: false,
    street: 'Carrer de Galícia, 213 (Hospital)',
    capacity: 305,
    details: 'Solar gratuito Les Valls (305 plazas)',
  },
  {
    id: 'solar-tarradellas',
    lat: 41.54670,
    lng: 2.43210,
    type: 'gratuita',
    busy: false,
    vertical: false,
    street: 'Ronda de Josep Tarradellas',
    capacity: 298,
    details: 'Solar gratuito (298 plazas)',
  },
  {
    id: 'solar-sorrall',
    lat: 41.54580,
    lng: 2.43350,
    type: 'gratuita',
    busy: false,
    vertical: false,
    street: 'Zona Esportiva El Sorrall',
    capacity: 80,
    details: 'Solar gratuito (80 plazas)',
  },
  {
    id: 'puig-01',
    lat: 41.54890,
    lng: 2.44390,
    type: 'gratuita',
    busy: false,
    vertical: false,
    street: 'Avinguda de Puig i Cadafalch',
    capacity: 3,
    details: 'Calzada cordón · ~3 plazas',
  },
  {
    id: 'puig-02',
    lat: 41.54910,
    lng: 2.44420,
    type: 'gratuita',
    busy: true,
    vertical: true,
    street: 'Avinguda de Puig i Cadafalch',
    capacity: 4,
    details: 'Calzada batería · ~4 plazas',
  },
  {
    id: 'puig-03',
    lat: 41.54930,
    lng: 2.44450,
    type: 'gratuita',
    busy: false,
    vertical: false,
    street: 'Avinguda de Puig i Cadafalch',
    capacity: 3,
    details: 'Calzada cordón · ~3 plazas',
  },
  {
    id: 'girona-01',
    lat: 41.54610,
    lng: 2.43510,
    type: 'gratuita',
    busy: false,
    vertical: false,
    street: 'Carrer de Girona',
    capacity: 5,
    details: 'Calzada cordón · ~5 plazas',
  },
  {
    id: 'girona-02',
    lat: 41.54690,
    lng: 2.43580,
    type: 'gratuita',
    busy: true,
    vertical: false,
    street: 'Carrer de Girona',
    capacity: 4,
    details: 'Calzada cordón · ~4 plazas',
  },
  {
    id: 'girona-03',
    lat: 41.54780,
    lng: 2.43650,
    type: 'gratuita',
    busy: false,
    vertical: true,
    street: 'Carrer de Girona',
    capacity: 6,
    details: 'Calzada batería · ~6 plazas',
  },
  {
    id: 'mistral-01',
    lat: 41.54800,
    lng: 2.43350,
    type: 'gratuita',
    busy: false,
    vertical: false,
    street: 'Ronda de Frederic Mistral',
    capacity: 8,
    details: 'Calzada cordón · ~8 plazas',
  },
  {
    id: 'mistral-02',
    lat: 41.54820,
    lng: 2.43390,
    type: 'gratuita',
    busy: false,
    vertical: false,
    street: 'Ronda de Frederic Mistral',
    capacity: 7,
    details: 'Calzada cordón · ~7 plazas',
  },
  {
    id: 'rambla-movilidad',
    lat: 41.53820,
    lng: 2.44490,
    type: 'movilidad',
    busy: false,
    vertical: false,
    street: 'La Rambla, 18',
    details: 'Plaza reservada PMR',
  },
  {
    id: 'biada-descarga',
    lat: 41.53640,
    lng: 2.44610,
    type: 'descarga',
    busy: false,
    vertical: false,
    street: 'Ronda de Barceló / Biada',
    details: 'Zona DUM carga y descarga',
  },
  {
    id: 'estacio-moto',
    lat: 41.53530,
    lng: 2.44720,
    type: 'moto',
    busy: false,
    vertical: true,
    street: 'Plaça de Miquel Biada (Estació)',
    details: 'Aparcamiento motocicletas',
  },
]

export function distanceBetweenCoords(a: Coords, b: Coords) {
  const R = 6371000
  const toRad = (deg: number) => (deg * Math.PI) / 180
  const dLat = toRad(b.lat - a.lat)
  const dLng = toRad(b.lng - a.lng)
  const h =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(a.lat)) * Math.cos(toRad(b.lat)) * Math.sin(dLng / 2) * Math.sin(dLng / 2)
  return Math.round(R * 2 * Math.atan2(Math.sqrt(h), Math.sqrt(1 - h)))
}

export function distanceToUser(spot: Spot, referencePoint: Coords = USER_POSITION) {
  return distanceBetweenCoords(referencePoint, { lat: spot.lat, lng: spot.lng })
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
