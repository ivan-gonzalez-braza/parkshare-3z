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
  // --- CENTRE / EIXAMPLE / HAVANA ---
  { id: 'pumsa-tereses', lat: 41.53912, lng: 2.44356, type: 'pago', busy: false, vertical: false, street: 'Plaça de les Tereses, 42 (PUMSA)' },
  { id: 'pumsa-tereses-ev', lat: 41.53925, lng: 2.44372, type: 'carga', busy: false, vertical: false, street: 'Plaça de les Tereses (Recarga EV)' },
  { id: 'pumsa-parc-central', lat: 41.53854, lng: 2.44781, type: 'pago', busy: true, vertical: false, street: 'Camí de la Geganta, 2 (Parc Central)' },
  { id: 'pumsa-granollers', lat: 41.54321, lng: 2.44112, type: 'pago', busy: false, vertical: false, street: 'Camí de la Geganta, 82 (Pl. Granollers)' },
  { id: 'pumsa-cuba', lat: 41.54395, lng: 2.43821, type: 'pago', busy: false, vertical: false, street: 'Plaça de Cuba, 25 (PUMSA)' },
  { id: 'rambla-movilidad', lat: 41.53820, lng: 2.44490, type: 'movilidad', busy: false, vertical: false, street: 'La Rambla, 18' },
  { id: 'biada-descarga', lat: 41.53640, lng: 2.44610, type: 'descarga', busy: false, vertical: false, street: 'Ronda de Barceló / Biada' },
  { id: 'estacio-moto', lat: 41.53530, lng: 2.44720, type: 'moto', busy: false, vertical: true, street: 'Plaça de Miquel Biada (Estació RENFE)' },
  { id: 'havana-01', lat: 41.54080, lng: 2.45250, type: 'gratuita', busy: false, vertical: false, street: 'Calzada · Carrer de l’Havana' },
  { id: 'havana-02', lat: 41.54160, lng: 2.45380, type: 'gratuita', busy: true, vertical: false, street: 'Calzada · Ronda de Cervantes (Havana)' },

  // --- PASSEIG MARÍTIM / PLATJA / PORT ---
  { id: 'solar-varador', lat: 41.53321, lng: 2.45123, type: 'gratuita', busy: false, vertical: false, street: 'Passeig Marítim - Varador', capacity: 160 },
  { id: 'solar-puerto', lat: 41.53450, lng: 2.44890, type: 'gratuita', busy: true, vertical: false, street: 'Passeig Marítim - Puerto de Mataró', capacity: 137 },
  { id: 'solar-sant-simo', lat: 41.53980, lng: 2.46120, type: 'gratuita', busy: false, vertical: false, street: 'Passeig Marítim - Sant Simó', capacity: 210 },
  { id: 'puerto-ev', lat: 41.53390, lng: 2.44940, type: 'carga', busy: false, vertical: false, street: 'Port de Mataró · Punto de Carga' },

  // --- TECNOCAMPUS / EL RENGLE / PLA D'EN BOET ---
  { id: 'tc-subterraneo', lat: 41.52820, lng: 2.43420, type: 'pago', busy: false, vertical: false, street: 'Parking Subterráneo TecnoCampus (Av. Ernest Lluch)' },
  { id: 'tc-rengle-libre', lat: 41.52910, lng: 2.43540, type: 'gratuita', busy: false, vertical: false, street: 'Calzada · Avinguda d’Ernest Lluch (El Rengle)' },
  { id: 'tc-rengle-ocupada', lat: 41.52980, lng: 2.43630, type: 'gratuita', busy: true, vertical: true, street: 'Calzada batería · Carrer de Tordera' },
  { id: 'tc-ev', lat: 41.52850, lng: 2.43480, type: 'carga', busy: false, vertical: false, street: 'Electrolinera TecnoCampus · Av. Ernest Lluch' },
  { id: 'solar-torre-llauder', lat: 41.53720, lng: 2.44190, type: 'gratuita', busy: false, vertical: false, street: 'Carrer Roma, 3 (Torre Llauder)', capacity: 178 },
  { id: 'boet-poligono-1', lat: 41.53180, lng: 2.43150, type: 'gratuita', busy: false, vertical: false, street: 'Calzada · Carrer de Pablo Iglesias (Boet)' },
  { id: 'boet-poligono-2', lat: 41.53350, lng: 2.43490, type: 'descarga', busy: true, vertical: false, street: 'Calzada DUM · Carrer de Carrasco i Formiguera' },

  // --- CERDANYOLA / PERAMÀS / CAMÍ DE LA SERRA ---
  { id: 'solar-tarradellas', lat: 41.54670, lng: 2.43210, type: 'gratuita', busy: false, vertical: false, street: 'Ronda de Josep Tarradellas', capacity: 298 },
  { id: 'solar-sorrall', lat: 41.54580, lng: 2.43350, type: 'gratuita', busy: false, vertical: false, street: 'Zona Esportiva El Sorrall', capacity: 80 },
  { id: 'cerdanyola-puig-1', lat: 41.54320, lng: 2.42980, type: 'gratuita', busy: false, vertical: false, street: 'Calzada · Avinguda de Puig i Cadafalch' },
  { id: 'cerdanyola-puig-2', lat: 41.54450, lng: 2.42850, type: 'gratuita', busy: true, vertical: true, street: 'Calzada batería · Passeig Ramon Berenguer III' },
  { id: 'cerdanyola-gatassa', lat: 41.54190, lng: 2.42690, type: 'gratuita', busy: false, vertical: false, street: 'Calzada · Carrer de la Gatassa' },
  { id: 'peramas-ronda', lat: 41.54250, lng: 2.43680, type: 'gratuita', busy: false, vertical: false, street: 'Calzada · Ronda d’O’Donnell (Peramàs)' },

  // --- HOSPITAL DE MATARÓ / MATARÓ PARC / CIRERA / MOLINS ---
  { id: 'hosp-les-valls-1', lat: 41.55660, lng: 2.43720, type: 'gratuita', busy: false, vertical: false, street: 'Solar Les Valls · Carrer de Galícia (Hospital)', capacity: 150 },
  { id: 'hosp-les-valls-2', lat: 41.55610, lng: 2.43790, type: 'gratuita', busy: true, vertical: false, street: 'Solar Les Valls · Zona Sur (Hospital)', capacity: 155 },
  { id: 'hosp-cirera-pago', lat: 41.55820, lng: 2.43510, type: 'pago', busy: false, vertical: false, street: 'Parking Subterráneo Hospital de Mataró' },
  { id: 'hosp-pmr', lat: 41.55760, lng: 2.43610, type: 'movilidad', busy: false, vertical: false, street: 'Entrada Urgencias · Hospital de Mataró' },
  { id: 'hosp-ev', lat: 41.55720, lng: 2.43660, type: 'carga', busy: true, vertical: false, street: 'Carrer de Galícia · Recarga EV Hospital' },
  { id: 'mp-ext-1', lat: 41.55420, lng: 2.43350, type: 'gratuita', busy: false, vertical: false, street: 'Parking Exterior Mataró Parc (Norte)' },
  { id: 'mp-ext-2', lat: 41.55350, lng: 2.43420, type: 'gratuita', busy: true, vertical: false, street: 'Calzada · Carrer d’Estrasburg (Mataró Parc)' },
  { id: 'mp-ev', lat: 41.55480, lng: 2.43280, type: 'carga', busy: false, vertical: false, street: 'Electrolinera Mataró Parc' },
  { id: 'solar-triangle-molins', lat: 41.54890, lng: 2.43540, type: 'gratuita', busy: false, vertical: false, street: 'Aparcamiento Triangle Molins', capacity: 350 },
  { id: 'cirera-carretera', lat: 41.55380, lng: 2.43990, type: 'gratuita', busy: false, vertical: false, street: 'Calzada · Carretera de Cirera' },

  // --- ROCAFONDA / EL PALAU / VISTA ALEGRE / ESCORXADOR ---
  { id: 'rocafonda-peru-1', lat: 41.54850, lng: 2.45180, type: 'gratuita', busy: false, vertical: false, street: 'Calzada · Avinguda del Perú (Rocafonda)' },
  { id: 'rocafonda-peru-2', lat: 41.54940, lng: 2.45310, type: 'gratuita', busy: true, vertical: true, street: 'Calzada batería · Carrer de Pablo Picasso' },
  { id: 'palau-escorsador', lat: 41.54520, lng: 2.44890, type: 'gratuita', busy: false, vertical: false, street: 'Calzada · Carrer de Miquel Biada (El Palau)' },
  { id: 'vista-alegre-1', lat: 41.55250, lng: 2.44650, type: 'gratuita', busy: false, vertical: false, street: 'Calzada · Carretera de Mata (Vista Alegre)' },
  { id: 'vista-alegre-2', lat: 41.55140, lng: 2.44520, type: 'gratuita', busy: true, vertical: false, street: 'Calzada · Parc de Rocafonda / Vista Alegre' },
  { id: 'girona-01', lat: 41.54610, lng: 2.43510, type: 'gratuita', busy: false, vertical: false, street: 'Calzada · Carrer de Girona' },
  { id: 'girona-02', lat: 41.54690, lng: 2.43580, type: 'gratuita', busy: true, vertical: false, street: 'Calzada · Carrer de Girona' },
]

// Interpola puntos cada 10 metros siguiendo el trazado exacto de cada calle
function sampleAlongCoords(points: Coords[], stepMeters = 10): Coords[] {
  const sampled: Coords[] = []
  for (let i = 0; i < points.length - 1; i++) {
    const p1 = points[i]
    const p2 = points[i + 1]
    const segLen = distanceBetweenCoords(p1, p2)
    if (segLen < 4) continue

    const steps = Math.max(1, Math.floor(segLen / stepMeters))
    for (let s = 0; s <= steps; s++) {
      const t = s / steps
      sampled.push({
        lat: p1.lat + (p2.lat - p1.lat) * t,
        lng: p1.lng + (p2.lng - p1.lng) * t,
      })
    }
  }
  return sampled
}

function offsetCoord(origin: Coords, northMeters: number, eastMeters: number): Coords {
  const dLat = northMeters / 111320
  const dLng = eastMeters / (111320 * Math.cos((origin.lat * Math.PI) / 180))
  return { lat: origin.lat + dLat, lng: origin.lng + dLng }
}

// Combina los datos reales de Mataró con un barrido denso cada 10 m por todas las calles del radio
export async function fetchRealSpotsNear(
  dest: Coords & { name: string },
  radiusMeters = 500,
): Promise<Spot[]> {
  const localMatches = SPOTS.filter(
    (spot) => distanceBetweenCoords(dest, { lat: spot.lat, lng: spot.lng }) <= radiusMeters,
  )

  const combined: Spot[] = [...localMatches]

  const tryAddSpot = (candidate: Spot, minGap = 10) => {
    if (distanceBetweenCoords(dest, { lat: candidate.lat, lng: candidate.lng }) > radiusMeters) return
    const tooClose = combined.some(
      (m) => distanceBetweenCoords({ lat: candidate.lat, lng: candidate.lng }, { lat: m.lat, lng: m.lng }) < minGap,
    )
    if (!tooClose) combined.push(candidate)
  }

  // 1. Consultar aparcamientos y calzadas reales en OpenStreetMap (Overpass)
  try {
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 4500)
    const query = `[out:json][timeout:4];(node["amenity"="parking"](around:${radiusMeters},${dest.lat},${dest.lng});way["amenity"="parking"](around:${radiusMeters},${dest.lat},${dest.lng});node["amenity"="charging_station"](around:${radiusMeters},${dest.lat},${dest.lng});node["amenity"="motorcycle_parking"](around:${radiusMeters},${dest.lat},${dest.lng}););out center;`

    const res = await fetch('https://overpass-api.de/api/interpreter', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8' },
      body: `data=${encodeURIComponent(query)}`,
      signal: controller.signal,
    })
    clearTimeout(timeoutId)

    if (res.ok) {
      const data = await res.json()
      const elements = Array.isArray(data?.elements) ? data.elements : []
      elements.forEach((el: any) => {
        const lat = el.lat ?? el.center?.lat
        const lng = el.lon ?? el.center?.lon
        if (typeof lat !== 'number' || typeof lng !== 'number') return
        const tags = el.tags || {}

        let type: SpotType = 'gratuita'
        if (tags.amenity === 'charging_station') type = 'carga'
        else if (tags.amenity === 'motorcycle_parking') type = 'moto'
        else if (tags.fee === 'yes' || tags.parking === 'underground' || tags.parking === 'multi-storey') {
          type = 'pago'
        }

        tryAddSpot({
          id: `osm-real-${el.type}-${el.id}`,
          lat,
          lng,
          type,
          busy: false,
          vertical: false,
          street: tags.name || tags['addr:street'] || `Parking · ${dest.name}`,
          capacity: tags.capacity ? Number(tags.capacity) : undefined,
        })
      })
    }
  } catch {
    // Continuar con las calzadas reales del entorno
  }

  // 2. Barrido fino (7x7 franjas + diagonales) para entrar por todas las calles interiores de Mataró cada 10 m
  const lanes = [-390, -260, -130, 0, 130, 260, 390]
  const edge = 460
  const routePairs: [Coords, Coords][] = []

  for (const offset of lanes) {
    routePairs.push([offsetCoord(dest, edge, offset), offsetCoord(dest, -edge, offset)])
    routePairs.push([offsetCoord(dest, offset, -edge), offsetCoord(dest, offset, edge)])
  }

  // Diagonales cruzadas para forzar paso por callejones y calles transversales
  routePairs.push([offsetCoord(dest, 320, -320), offsetCoord(dest, -320, 320)])
  routePairs.push([offsetCoord(dest, 320, 320), offsetCoord(dest, -320, -320)])
  routePairs.push([offsetCoord(dest, 200, -380), offsetCoord(dest, -200, 380)])
  routePairs.push([offsetCoord(dest, -200, -380), offsetCoord(dest, 200, 380)])

  await Promise.all(
    routePairs.map(async ([from, to], routeIdx) => {
      try {
        const url = `https://router.project-osrm.org/route/v1/driving/${from.lng},${from.lat};${to.lng},${to.lat}?overview=full&geometries=geojson&steps=true`
        const res = await fetch(url)
        if (!res.ok) return
        const data = await res.json()
        const steps = data?.routes?.[0]?.legs?.[0]?.steps
        if (!Array.isArray(steps)) return

        steps.forEach((step: any, stepIdx: number) => {
          const coordsList: Coords[] = (step?.geometry?.coordinates || []).map(
            ([lng, lat]: [number, number]) => ({ lat, lng }),
          )
          if (coordsList.length < 2) return

          const sampled = sampleAlongCoords(coordsList, 10)
          sampled.forEach((pt, ptIdx) => {
            const seed = routeIdx * 29 + stepIdx * 7 + ptIdx
            const isVertical = seed % 2 === 1
            tryAddSpot({
              id: `calzada-${routeIdx}-${stepIdx}-${ptIdx}`,
              lat: pt.lat,
              lng: pt.lng,
              type: 'gratuita',
              busy: false,
              vertical: isVertical,
              street: step.name
                ? `Calzada ${isVertical ? 'batería' : 'cordón'} · ${step.name}`
                : `Calzada · ${dest.name}`,
            })
          })
        })
      } catch {
        // Ignorar tramo individual si falla
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
