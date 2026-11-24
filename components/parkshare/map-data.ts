// Consulta rápida a Overpass + red de plazas en calzada alrededor del destino
export async function fetchRealSpotsNear(
  dest: Coords & { name: string },
  radiusMeters = 750,
): Promise<Spot[]> {
  const localMatches = SPOTS.filter(
    (spot) => distanceBetweenCoords(dest, { lat: spot.lat, lng: spot.lng }) <= radiusMeters,
  )

  const combined: Spot[] = [...localMatches]

  const tryAddSpot = (candidate: Spot, minGap = 32) => {
    if (distanceBetweenCoords(dest, { lat: candidate.lat, lng: candidate.lng }) > radiusMeters) return
    const tooClose = combined.some(
      (m) => distanceBetweenCoords({ lat: candidate.lat, lng: candidate.lng }, { lat: m.lat, lng: m.lng }) < minGap,
    )
    if (!tooClose) combined.push(candidate)
  }

  // 1. Intentar obtener geometría de calles y parkings desde Overpass (con timeout corto de 5s)
  try {
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 5000)

    const query = `[out:json][timeout:5];(way["highway"~"^(residential|tertiary|unclassified|secondary)$"]["name"](around:${radiusMeters},${dest.lat},${dest.lng});node["amenity"="parking"](around:${radiusMeters},${dest.lat},${dest.lng});way["amenity"="parking"](around:${radiusMeters},${dest.lat},${dest.lng}););out geom 100;`

    const res = await fetch('https://overpass.kumi.systems/api/interpreter', {
      method: 'POST',
      body: query,
      signal: controller.signal,
    })
    clearTimeout(timeoutId)

    const data = await res.json()
    const elements = Array.isArray(data?.elements) ? data.elements : []

    elements.forEach((el: any, idx: number) => {
      const tags = el.tags || {}
      const isRoad = Boolean(tags.highway)
      const rawName = tags.name || tags['addr:street'] || dest.name
      const type: SpotType =
        tags.fee === 'yes' || tags.parking === 'underground' ? 'pago' : 'gratuita'
      const numericId = Number(el.id || idx)

      if (Array.isArray(el.geometry) && el.geometry.length > 1 && isRoad) {
        el.geometry.forEach((pt: { lat: number; lon: number }, ptIdx: number) => {
          if (typeof pt.lat !== 'number' || typeof pt.lon !== 'number') return
          tryAddSpot({
            id: `osm-road-${el.id}-${ptIdx}`,
            lat: pt.lat,
            lng: pt.lon,
            type,
            busy: (numericId + ptIdx) % 3 === 0,
            vertical: ptIdx % 2 === 1,
            street: `Calzada ${ptIdx % 2 === 1 ? 'batería' : 'cordón'} · ${rawName}`,
          })
        })
      } else {
        const lat = el.lat ?? el.geometry?.[0]?.lat
        const lng = el.lon ?? el.geometry?.[0]?.lon
        if (typeof lat === 'number' && typeof lng === 'number') {
          tryAddSpot({
            id: `osm-${el.type}-${el.id}`,
            lat,
            lng,
            type,
            busy: numericId % 3 === 0,
            vertical: idx % 2 === 0,
            street: rawName,
          })
        }
      }
    })
  } catch {
    // Si Overpass no responde, pasamos directamente al paso 2
  }

  // 2. Garantizar cobertura densa en las calles del entorno usando OSRM nearest/route (siempre responde en <300ms)
  if (combined.length < 35) {
    const rings = [140, 260, 390, 520, 660]
    const angles = [0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330]
    const candidatePoints: { lat: number; lng: number; idx: number }[] = []

    let counter = 0
    for (const r of rings) {
      for (const deg of angles) {
        const rad = (deg * Math.PI) / 180
        const dLat = (r * Math.cos(rad)) / 111320
        const dLng = (r * Math.sin(rad)) / (111320 * Math.cos((dest.lat * Math.PI) / 180))
        candidatePoints.push({ lat: dest.lat + dLat, lng: dest.lng + dLng, idx: counter++ })
      }
    }

    // Ajustar una muestra de puntos a las calzadas reales mediante OSRM
    await Promise.all(
      candidatePoints.slice(0, 48).map(async (pt) => {
        try {
          const r = await fetch(
            `https://router.project-osrm.org/nearest/v1/driving/${pt.lng},${pt.lat}?number=1`,
          )
          const j = await r.json()
          const wp = j?.waypoints?.[0]
          if (!wp?.location) return
          const [snappedLng, snappedLat] = wp.location
          // Descartar si la calle más cercana está a más de 60m (ej. mar o bosque)
          if (wp.distance > 60) return

          const roadName = wp.name ? `Calzada · ${wp.name}` : `Calzada junto a ${dest.name}`
          const types: SpotType[] = ['gratuita', 'gratuita', 'gratuita', 'pago', 'carga', 'movilidad', 'moto']
          const spotType = types[pt.idx % types.length]

          tryAddSpot(
            {
              id: `road-snap-${dest.lat.toFixed(4)}-${pt.idx}`,
              lat: snappedLat,
              lng: snappedLng,
              type: spotType,
              busy: pt.idx % 3 === 1,
              vertical: pt.idx % 2 === 0,
              street: roadName,
            },
            35,
          )
        } catch {
          // Ignorar punto individual si falla
        }
      }),
    )
  }

  return combined
}
