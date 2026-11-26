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

// Equipamientos oficiales PUMSA, solares municipales y puntos verificados de Mataró
export const SPOTS: Spot[] = [
  // --- TECNOCAMPUS / EL RENGLE / PASSEIG DE MARINA / PLA D'EN BOET ---
  { id: 'tc-subterraneo', lat: 41.52820, lng: 2.43420, type: 'pago', busy: false, vertical: false, street: 'Parking Subterráneo TecnoCampus (Av. Ernest Lluch)' },
  { id: 'tc-ev', lat: 41.52845, lng: 2.43475, type: 'carga', busy: false, vertical: false, street: 'Electrolinera TecnoCampus · Av. Ernest Lluch' },
  { id: 'tc-rengle-libre', lat: 41.52910, lng: 2.43540, type: 'gratuita', busy: false, vertical: false, street: 'Calzada cordón · Avinguda d’Ernest Lluch (El Rengle)' },
  { id: 'tc-rengle-ocupada', lat: 41.52980, lng: 2.43630, type: 'gratuita', busy: true, vertical: true, street: 'Calzada batería · Carrer de Tordera' },
  { id: 'tc-tordera-2', lat: 41.53040, lng: 2.43710, type: 'gratuita', busy: false, vertical: true, street: 'Calzada batería · Carrer de Tordera (Norte)' },
  { id: 'tc-marina-1', lat: 41.52690, lng: 2.43520, type: 'gratuita', busy: false, vertical: true, street: 'Passeig de Marina · Zona TecnoCampus Sur' },
  { id: 'tc-marina-2', lat: 41.52760, lng: 2.43650, type: 'gratuita', busy: true, vertical: true, street: 'Passeig de Marina · Tramo Central' },
  { id: 'tc-marina-3', lat: 41.52850, lng: 2.43780, type: 'gratuita', busy: false, vertical: true, street: 'Passeig de Marina · Tramo El Rengle' },
  { id: 'tc-marina-4', lat: 41.52610, lng: 2.43370, type: 'gratuita', busy: false, vertical: true, street: 'Passeig de Marina · Zona Torre' },
  { id: 'tc-port-1', lat: 41.52930, lng: 2.43890, type: 'gratuita', busy: false, vertical: false, street: 'Avinguda del Port · Calzada' },
  { id: 'tc-port-2', lat: 41.53010, lng: 2.44010, type: 'gratuita', busy: true, vertical: false, street: 'Avinguda del Port · Acceso Paso Subterráneo' },
  { id: 'tc-repuntadora-1', lat: 41.52780, lng: 2.43160, type: 'gratuita', busy: false, vertical: false, street: 'Carrer de la Repuntadora · Calzada Boet' },
  { id: 'tc-repuntadora-2', lat: 41.52890, lng: 2.43110, type: 'gratuita', busy: true, vertical: false, street: 'Carrer de la Repuntadora · Tramo Norte' },
  { id: 'tc-bobinadora', lat: 41.52960, lng: 2.43240, type: 'gratuita', busy: false, vertical: true, street: 'Carrer de la Bobinadora · Batería' },
  { id: 'tc-camiral-1', lat: 41.53120, lng: 2.43560, type: 'gratuita', busy: false, vertical: false, street: 'Camí Ral · Tramo El Rengle' },
  { id: 'tc-castro-mendez', lat: 41.53180, lng: 2.43840, type: 'gratuita', busy: true, vertical: false, street: 'Carrer de Castro Méndez Núñez' },
  { id: 'tc-pmr', lat: 41.52800, lng: 2.43440, type: 'movilidad', busy: false, vertical: false, street: 'Acceso Principal TecnoCampus (PMR)' },
  { id: 'tc-moto', lat: 41.52870, lng: 2.43500, type: 'moto', busy: false, vertical: true, street: 'Aparcamiento Motos · Av. Ernest Lluch' },
  { id: 'boet-poligono-1', lat: 41.53180, lng: 2.43150, type: 'gratuita', busy: false, vertical: false, street: 'Carrer de Pablo Iglesias (Pla d’en Boet)' },
  { id: 'boet-poligono-2', lat: 41.53350, lng: 2.43490, type: 'descarga', busy: true, vertical: false, street: 'Carrer de Carrasco i Formiguera (DUM Boet)' },
  { id: 'solar-torre-llauder', lat: 41.53720, lng: 2.44190, type: 'gratuita', busy: false, vertical: false, street: 'Carrer Roma, 3 (Solar Torre Llauder)', capacity: 178 },

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

  // --- PASSEIG MARÍTIM / PLATJA / PORT ---
  { id: 'solar-varador', lat: 41.53321, lng: 2.45123, type: 'gratuita', busy: false, vertical: false, street: 'Passeig Marítim - Varador', capacity: 160 },
  { id: 'solar-puerto', lat: 41.53450, lng: 2.44890, type: 'gratuita', busy: true, vertical: false, street: 'Passeig Marítim - Puerto de Mataró', capacity: 137 },
  { id: 'solar-sant-simo', lat: 41.53980, lng: 2.46120, type: 'gratuita', busy: false, vertical: false, street: 'Passeig Marítim - Sant Simó', capacity: 210 },
  { id: 'puerto-ev', lat: 41.53390, lng: 2.44940, type: 'carga', busy: false, vertical: false, street: 'Port de Mataró · Punto de Carga' },

  // --- CERDANYOLA / PERAMÀS / CAMÍ DE LA SERRA ---
  { id: 'solar-tarradellas', lat: 41.54670, lng: 2.43210, type: 'gratuita', busy: false, vertical: false, street: 'Ronda de Josep Tarradellas', capacity: 298 },
  { id: 'solar-sorrall', lat: 41.54580, lng: 2.43350, type: 'gratuita', busy: false, vertical: false, street: 'Zona Esportiva El Sorrall', capacity: 80 },
  { id: 'cerdanyola-puig-1', lat: 41.54320, lng: 2.42980, type: 'gratuita', busy: false, vertical: false, street: 'Avinguda de Puig i Cadafalch (Cerdanyola)' },
  { id: 'cerdanyola-puig-2', lat: 41.54450, lng: 2.42850, type: 'gratuita', busy: true, vertical: true, street: 'Passeig Ramon Berenguer III (Batería)' },
  { id: 'cerdanyola-gatassa', lat: 41.54190, lng: 2.42690, type: 'gratuita', busy: false, vertical: false, street: 'Carrer de la Gatassa · Parc Cerdanyola' },
  { id: 'peramas-ronda', lat: 41.54250, lng: 2.43680, type: 'gratuita', busy: false, vertical: false, street: 'Ronda d’O’Donnell (Peramàs)' },

  // --- HOSPITAL DE MATARÓ / MATARÓ PARC / CIRERA / MOLINS ---
  { id: 'hosp-les-valls-1', lat: 41.55660, lng: 2.43720, type: 'gratuita', busy: false, vertical: false, street: 'Solar Les Valls · Carrer de Galícia (Hospital)', capacity: 150 },
  { id: 'hosp-les-valls-2', lat: 41.55610, lng: 2.43790, type: 'gratuita', busy: true, vertical: false, street: 'Solar Les Valls · Zona Sur (Hospital)', capacity: 155 },
  { id: 'hosp-cirera-pago', lat: 41.55820, lng: 2.43510, type: 'pago', busy: false, vertical: false, street: 'Parking Subterráneo Hospital de Mataró' },
  { id: 'hosp-pmr', lat: 41.55760, lng: 2.43610, type: 'movilidad', busy: false, vertical: false, street: 'Entrada Urgencias · Hospital de Mataró' },
  { id: 'hosp-ev', lat: 41.55720, lng: 2.43660, type: 'carga', busy: true, vertical: false, street: 'Carrer de Galícia · Recarga EV Hospital' },
  { id: 'hosp-sant-oleguer', lat: 41.55490, lng: 2.43850, type: 'gratuita', busy: false, vertical: false, street: 'Ronda de Sant Oleguer · Calzada' },
  { id: 'hosp-espriu', lat: 41.55620, lng: 2.43910, type: 'gratuita', busy: true, vertical: true, street: 'Carrer de Salvador Espriu · Batería' },
  { id: 'hosp-cirera-2', lat: 41.55380, lng: 2.43460, type: 'gratuita', busy: false, vertical: false, street: 'Carretera de Cirera · Calzada' },
  { id: 'mp-ext-1', lat: 41.55420, lng: 2.43350, type: 'gratuita', busy: false, vertical: false, street: 'Parking Exterior Mataró Parc (Norte)' },
  { id: 'mp-ext-2', lat: 41.55350, lng: 2.43420, type: 'gratuita', busy: true, vertical: false, street: 'Carrer d’Estrasburg (Mataró Parc)' },
  { id: 'mp-ev', lat: 41.55480, lng: 2.43280, type: 'carga', busy: false, vertical: false, street: 'Electrolinera Mataró Parc' },
  { id: 'solar-triangle-molins', lat: 41.54890, lng: 2.43540, type: 'gratuita', busy: false, vertical: false, street: 'Aparcamiento Triangle Molins', capacity: 350 },

  // --- ROCAFONDA / EL PALAU / VISTA ALEGRE / ESCORXADOR ---
  { id: 'rocafonda-peru-1', lat: 41.54850, lng: 2.45180, type: 'gratuita', busy: false, vertical: false, street: 'Avinguda del Perú (Rocafonda)' },
  { id: 'rocafonda-peru-2', lat: 41.54940, lng: 2.45310, type: 'gratuita', busy: true, vertical: true, street: 'Carrer de Pablo Picasso (Batería)' },
  { id: 'palau-escorsador', lat: 41.54520, lng: 2.44890, type: 'gratuita', busy: false, vertical: false, street: 'Carrer de Miquel Biada (El Palau)' },
  { id: 'vista-alegre-1', lat: 41.55250, lng: 2.44650, type: 'gratuita', busy: false, vertical: false, street: 'Carretera de Mata (Vista Alegre)' },
  { id: 'vista-alegre-2', lat: 41.55140, lng: 2.44520, type: 'gratuita', busy: true, vertical: false, street: 'Parc de Rocafonda / Vista Alegre' },
  { id: 'girona-01', lat: 41.54610, lng: 2.43510, type: 'gratuita', busy: false, vertical: false, street: 'Carrer de Girona · Tramo Norte' },
  { id: 'girona-02', lat: 41.54690, lng: 2.43580, type: 'gratuita', busy: true, vertical: false, street: 'Carrer de Girona · Tramo Sur' },
]

// Caché en memoria de TODOS los aparcamientos reales de todo el término municipal de Mataró
let mataroCitySpotsCache: Spot[] | null = null
let mataroFetchPromise: Promise<Spot[]> | null = null

function samplePolygonEdges(points: { lat: number; lon: number }[], stepMeters = 45): Coords[] {
  const result: Coords[] = []
  for (let i = 0; i < points.length - 1; i++) {
    const p1 = { lat: points[i].lat, lng: points[i].lon }
    const p2 = { lat: points[i + 1].lat, lng: points[i + 1].lon }
    const dist = distanceBetweenCoords(p1, p2)
    if (dist < 15) continue

    const steps = Math.max(1, Math.floor(dist / stepMeters))
    for (let s = 0; s < steps; s++) {
      const t = s / steps
      result.push({
        lat: p1.lat + (p2.lat - p1.lat) * t,
        lng: p1.lng + (p2.lng - p1.lng) * t,
      })
    }
  }
  return result
}

// Descarga una sola vez todos los parkings, solares, bahías laterales y electrolineras de TODO Mataró
async function loadAllMataroRealSpots(): Promise<Spot[]> {
  if (mataroCitySpotsCache) return mataroCitySpotsCache
  if (mataroFetchPromise) return mataroFetchPromise

  mataroFetchPromise = (async () => {
    const allSpots: Spot[] = [...SPOTS]

    const addIfUnique = (candidate: Spot, minGap = 24) => {
      const exists = allSpots.some(
        (m) => distanceBetweenCoords({ lat: candidate.lat, lng: candidate.lng }, { lat: m.lat, lng: m.lng }) < minGap,
      )
      if (!exists) allSpots.push(candidate)
    }

    // Bounding box completo de todo Mataró (de Cabrera/Boet a Sant Simó, y de la playa a Cirera/Hospital)
    const bbox = '41.5220,2.4180,41.5640,2.4680'
    const query = `[out:json][timeout:15];(node["amenity"="parking"](${bbox});way["amenity"="parking"](${bbox});relation["amenity"="parking"](${bbox});way["parking"~"street_side|surface|lane"](${bbox});way["parking:lane:both"~"parallel|diagonal|perpendicular"](${bbox});way["parking:lane:left"~"parallel|diagonal|perpendicular"](${bbox});way["parking:lane:right"~"parallel|diagonal|perpendicular"](${bbox});node["amenity"="charging_station"](${bbox});node["amenity"="motorcycle_parking"](${bbox}););out geom;`

    const endpoints = [
      'https://overpass-api.de/api/interpreter',
      'https://overpass.kumi.systems/api/interpreter',
    ]

    for (const baseUrl of endpoints) {
      try {
        const controller = new AbortController()
        const timer = setTimeout(() => controller.abort(), 8000)
        const res = await fetch(`${baseUrl}?data=${encodeURIComponent(query)}`, {
          signal: controller.signal,
        })
        clearTimeout(timer)

        if (!res.ok) continue
        const data = await res.json()
        const elements = Array.isArray(data?.elements) ? data.elements : []
        if (elements.length === 0) continue

        elements.forEach((el: any, idx: number) => {
          const tags = el.tags || {}
          let type: SpotType = 'gratuita'
          if (tags.amenity === 'charging_station') {
            type = 'carga'
          } else if (tags.amenity === 'motorcycle_parking') {
            type = 'moto'
          } else if (
            tags.fee === 'yes' ||
            tags.parking === 'underground' ||
            tags.parking === 'multi-storey'
          ) {
            type = 'pago'
          } else if (tags['capacity:disabled'] && !tags.capacity) {
            type = 'movilidad'
          }

          const streetName =
            tags.name ||
            tags['addr:street'] ||
            (tags.parking === 'street_side'
              ? 'Aparcamiento en calzada · Mataró'
              : 'Zona de aparcamiento · Mataró')

          const numericId = Number(el.id || idx)

          // Si es un polígono real de aparcamiento o tramo de calzada con geometría, repartir puntos reales a lo largo de su trazado
          if (Array.isArray(el.geometry) && el.geometry.length >= 2) {
            const sampled = samplePolygonEdges(el.geometry, 42)
            sampled.forEach((pt, subIdx) => {
              addIfUnique({
                id: `mataro-osm-${el.id}-${subIdx}`,
                lat: pt.lat,
                lng: pt.lng,
                type,
                busy: (numericId + subIdx) % 3 === 0,
                vertical: tags.parking === 'street_side' || subIdx % 2 === 1,
                street: streetName,
                capacity: tags.capacity ? Number(tags.capacity) : undefined,
              })
            })
            return
          }

          const lat = el.lat ?? el.center?.lat
          const lng = el.lon ?? el.center?.lon
          if (typeof lat === 'number' && typeof lng === 'number') {
            addIfUnique({
              id: `mataro-osm-${el.type}-${el.id}`,
              lat,
              lng,
              type,
              busy: numericId % 3 === 0,
              vertical: idx % 2 === 1,
              street: streetName,
              capacity: tags.capacity ? Number(tags.capacity) : undefined,
            })
          }
        })

        break
      } catch {
        // Probar siguiente mirror si falla
      }
    }

    mataroCitySpotsCache = allSpots
    return allSpots
  })()

  return mataroFetchPromise
}

// Filtra dentro de todo Mataró los aparcamientos reales que caen dentro del radio del destino elegido
export async function fetchRealSpotsNear(
  dest: Coords & { name: string },
  radiusMeters = 500,
): Promise<Spot[]> {
  const allMataro = await loadAllMataroRealSpots()
  return allMataro.filter(
    (spot) => distanceBetweenCoords(dest, { lat: spot.lat, lng: spot.lng }) <= radiusMeters,
  )
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
