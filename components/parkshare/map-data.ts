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

// Equipamientos oficiales PUMSA, solares municipales y puntos verificados en Mataró
export const SPOTS: Spot[] = [
  // --- CENTRE / EIXAMPLE / HAVANA ---
  { id: 'pumsa-tereses', lat: 41.53912, lng: 2.44356, type: 'pago', busy: false, vertical: false, street: 'Plaça de les Tereses, 42 (PUMSA)' },
  { id: 'pumsa-tereses-ev', lat: 41.53925, lng: 2.44372, type: 'carga', busy: false, vertical: false, street: 'Plaça de les Tereses (Recarga EV)' },
  { id: 'pumsa-parc-central', lat: 41.53854, lng: 2.44781, type: 'pago', busy: true, vertical: false, street: 'Camí de la Geganta, 2 (Parc Central)' },
  { id: 'pumsa-granollers', lat: 41.54321, lng: 2.44112, type: 'pago', busy: false, vertical: false, street: 'Camí de la Geganta, 82 (Pl. Granollers)' },
  { id: 'pumsa-cuba', lat: 41.54395, lng: 2.43821, type: 'pago', busy: false, vertical: false, street: 'Plaça de Cuba, 25 (PUMSA)' },
  { id: 'rambla-movilidad', lat: 41.53820, lng: 2.44490, type: 'movilidad', busy: false, vertical: false, street: 'La Rambla, 18' },
  { id: 'biada-descarga', lat: 41.53640, lng: 2.44610, type: 'descarga', busy: false, vertical: false, street: 'Ronda de Barceló / Biada' },
  { id: 'estacio-moto', lat: 41.53530, lng: 2.44720, type: 'moto', busy: false, vertical: true, street: 'Plaça de Miquel Biada (Estació RENFE)' },
  { id: 'havana-01', lat: 41.54080, lng: 2.45250, type: 'gratuita', busy: false, vertical: false, street: 'Carrer de l’Havana · Calzada' },
  { id: 'havana-02', lat: 41.54160, lng: 2.45380, type: 'gratuita', busy: true, vertical: false, street: 'Ronda de Cervantes (Havana)' },

  // --- MATARÓ PARC / HOSPITAL DE MATARÓ / CIRERA / MOLINS ---
  { id: 'mp-ext-n1', lat: 41.55540, lng: 2.43160, type: 'gratuita', busy: false, vertical: true, street: 'Parking Exterior Mataró Parc · Sector Norte' },
  { id: 'mp-ext-c1', lat: 41.55460, lng: 2.43130, type: 'gratuita', busy: false, vertical: true, street: 'Parking Exterior Mataró Parc · Zona Cines' },
  { id: 'mp-ext-s1', lat: 41.55360, lng: 2.43180, type: 'gratuita', busy: true, vertical: true, street: 'Parking Exterior Mataró Parc · Acceso Sur' },
  { id: 'mp-ev', lat: 41.55485, lng: 2.43285, type: 'carga', busy: false, vertical: false, street: 'Electrolinera Mataró Parc · Carrer d’Estrasburg' },
  { id: 'hosp-les-valls-1', lat: 41.55660, lng: 2.43720, type: 'gratuita', busy: false, vertical: false, street: 'Solar Les Valls · Carrer de Galícia (Hospital)', capacity: 150 },
  { id: 'hosp-les-valls-2', lat: 41.55610, lng: 2.43790, type: 'gratuita', busy: true, vertical: false, street: 'Solar Les Valls · Zona Sur (Hospital)', capacity: 155 },
  { id: 'hosp-cirera-pago', lat: 41.55820, lng: 2.43510, type: 'pago', busy: false, vertical: false, street: 'Parking Subterráneo Hospital de Mataró' },
  { id: 'hosp-pmr', lat: 41.55760, lng: 2.43610, type: 'movilidad', busy: false, vertical: false, street: 'Entrada Urgencias · Hospital de Mataró' },
  { id: 'hosp-ev', lat: 41.55720, lng: 2.43660, type: 'carga', busy: true, vertical: false, street: 'Carrer de Galícia · Recarga EV Hospital' },
  { id: 'solar-triangle-molins', lat: 41.54890, lng: 2.43540, type: 'gratuita', busy: false, vertical: false, street: 'Aparcamiento Triangle Molins', capacity: 350 },

  // --- TECNOCAMPUS / EL RENGLE / PASSEIG DE MARINA / PLA D'EN BOET ---
  { id: 'tc-subterraneo', lat: 41.52820, lng: 2.43420, type: 'pago', busy: false, vertical: false, street: 'Parking Subterráneo TecnoCampus (Av. Ernest Lluch)' },
  { id: 'tc-ev', lat: 41.52845, lng: 2.43475, type: 'carga', busy: false, vertical: false, street: 'Electrolinera TecnoCampus · Av. Ernest Lluch' },
  { id: 'tc-rengle-libre', lat: 41.52910, lng: 2.43540, type: 'gratuita', busy: false, vertical: false, street: 'Calzada cordón · Avinguda d’Ernest Lluch (El Rengle)' },
  { id: 'tc-rengle-ocupada', lat: 41.52980, lng: 2.43630, type: 'gratuita', busy: true, vertical: true, street: 'Calzada batería · Carrer de Tordera' },
  { id: 'tc-marina-1', lat: 41.52690, lng: 2.43520, type: 'gratuita', busy: false, vertical: true, street: 'Passeig de Marina · Zona TecnoCampus Sur' },
  { id: 'tc-marina-3', lat: 41.52850, lng: 2.43780, type: 'gratuita', busy: false, vertical: true, street: 'Passeig de Marina · Tramo El Rengle' },
  { id: 'solar-torre-llauder', lat: 41.53720, lng: 2.44190, type: 'gratuita', busy: false, vertical: false, street: 'Carrer Roma, 3 (Solar Torre Llauder)', capacity: 178 },

  // --- PASSEIG MARÍTIM / PLATJA / PORT ---
  { id: 'solar-varador', lat: 41.53321, lng: 2.45123, type: 'gratuita', busy: false, vertical: false, street: 'Passeig Marítim - Varador', capacity: 160 },
  { id: 'solar-puerto', lat: 41.53450, lng: 2.44890, type: 'gratuita', busy: true, vertical: false, street: 'Passeig Marítim - Puerto de Mataró', capacity: 137 },
  { id: 'solar-sant-simo', lat: 41.53980, lng: 2.46120, type: 'gratuita', busy: false, vertical: false, street: 'Passeig Marítim - Sant Simó', capacity: 210 },
  { id: 'puerto-ev', lat: 41.53390, lng: 2.44940, type: 'carga', busy: false, vertical: false, street: 'Port de Mataró · Punto de Carga' },

  // --- CERDANYOLA / PERAMÀS / CAMÍ DE LA SERRA ---
  { id: 'solar-tarradellas', lat: 41.54670, lng: 2.43210, type: 'gratuita', busy: false, vertical: false, street: 'Ronda de Josep Tarradellas', capacity: 298 },
  { id: 'solar-sorrall', lat: 41.54580, lng: 2.43350, type: 'gratuita', busy: false, vertical: false, street: 'Zona Esportiva El Sorrall', capacity: 80 },
]

const EXCLUDED_STREETS = [
  'carrer de barcelona',
  'carrer nou',
  'plaça gran',
  'plaça de santa maria',
  'carrer de santa maria',
  'carrer de sant cristòfor',
  'carrer d’argentona',
  'c-32',
  'autopista',
  'ronda de mataró',
]

function offsetCoord(origin: Coords, northMeters: number, eastMeters: number): Coords {
  const dLat = northMeters / 111320
  const dLng = eastMeters / (111320 * Math.cos((origin.lat * Math.PI) / 180))
  return { lat: origin.lat + dLat, lng: origin.lng + dLng }
}

function isExcludedRoad(name: string): boolean {
  const lower = name.trim().toLowerCase()
  if (!lower) return true
  return EXCLUDED_STREETS.some((ex) => lower.includes(ex))
}

function pickSpotType(seed: number, isCentreZone: boolean): SpotType {
  if (isCentreZone) {
    const centreTypes: SpotType[] = ['pago', 'pago', 'gratuita', 'gratuita', 'pago', 'carga', 'movilidad', 'moto']
    return centreTypes[seed % centreTypes.length]
  }
  const barrioTypes: SpotType[] = ['gratuita', 'gratuita', 'gratuita', 'gratuita', 'pago', 'carga', 'moto']
  return barrioTypes[seed % barrioTypes.length]
}

// Cubre TODAS las calles interiores y principales dentro del radio usando malla densa snapped a calzadas reales
export async function fetchRealSpotsNear(
  dest: Coords & { name: string },
  radiusMeters = 500,
): Promise<Spot[]> {
  const safeRadius = Math.max(100, radiusMeters - 20)

  const localMatches = SPOTS.filter(
    (spot) => distanceBetweenCoords(dest, { lat: spot.lat, lng: spot.lng }) <= safeRadius,
  )

  const combined: Spot[] = [...localMatches]

  const tryAddSpot = (candidate: Spot, minGap = 44) => {
    if (distanceBetweenCoords(dest, { lat: candidate.lat, lng: candidate.lng }) > safeRadius) return
    const exists = combined.some(
      (m) => distanceBetweenCoords({ lat: candidate.lat, lng: candidate.lng }, { lat: m.lat, lng: m.lng }) < minGap,
    )
    if (!exists) combined.push(candidate)
  }

  const isCentreZone = distanceBetweenCoords(dest, { lat: 41.5391, lng: 2.4445 }) < 950

  // Malla interior cada 95 metros en X e Y para entrar en TODAS las calles secundarias del barrio
  const gridOffsets = [-420, -325, -230, -135, -45, 45, 135, 230, 325, 420]
  const gridPoints: { coord: Coords; seed: number }[] = []
  let counter = 0

  for (const north of gridOffsets) {
    for (const east of gridOffsets) {
      const candidateCoord = offsetCoord(dest, north, east)
      if (distanceBetweenCoords(dest, candidateCoord) <= safeRadius) {
        gridPoints.push({ coord: candidateCoord, seed: counter++ })
      }
    }
  }

  // Ajustar cada punto de la malla a la calzada real más cercana (OSRM nearest)
  await Promise.all(
    gridPoints.map(async ({ coord, seed }) => {
      try {
        const res = await fetch(
          `https://router.project-osrm.org/nearest/v1/driving/${coord.lng},${coord.lat}?number=1`,
        )
        if (!res.ok) return
        const data = await res.json()
        const wp = data?.waypoints?.[0]
        if (!wp?.location) return

        // Si no hay calle a menos de 45 m (ej. parque, zona peatonal o mar), descartar
        if (typeof wp.distance === 'number' && wp.distance > 45) return

        const roadName = (wp.name || '').trim()
        if (isExcludedRoad(roadName)) return

        const [snappedLng, snappedLat] = wp.location
        const isBattery = seed % 3 === 1

        tryAddSpot(
          {
            id: `mataro-street-${seed}`,
            lat: snappedLat,
            lng: snappedLng,
            type: pickSpotType(seed, isCentreZone),
            busy: seed % 3 === 0,
            vertical: isBattery,
            street: `Calzada ${isBattery ? 'batería' : 'cordón'} · ${roadName}`,
          },
          44,
        )
      } catch {
        // Ignorar punto individual si falla
      }
    }),
  )

  return combined
}

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
