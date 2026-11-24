// Consulta en tiempo real a OpenStreetMap y reparte plazas a lo largo de TODA la geometría de las calzadas
export async function fetchRealSpotsNear(
  dest: Coords & { name: string },
  radiusMeters = 750,
): Promise<Spot[]> {
  const localMatches = SPOTS.filter(
    (spot) => distanceBetweenCoords(dest, { lat: spot.lat, lng: spot.lng }) <= radiusMeters,
  )

  try {
    const query = `
      [out:json][timeout:15];
      (
        node["amenity"="parking"](around:${radiusMeters},${dest.lat},${dest.lng});
        way["amenity"="parking"](around:${radiusMeters},${dest.lat},${dest.lng});
        node["amenity"="charging_station"](around:${radiusMeters},${dest.lat},${dest.lng});
        node["amenity"="motorcycle_parking"](around:${radiusMeters},${dest.lat},${dest.lng});
        way["highway"~"^(residential|tertiary|unclassified|living_street|secondary)$"]["name"](around:${radiusMeters},${dest.lat},${dest.lng});
      );
      out geom 180;
    `
    const res = await fetch('https://overpass-api.de/api/interpreter', {
      method: 'POST',
      body: query,
    })
    const data = await res.json()
    const elements = Array.isArray(data?.elements) ? data.elements : []

    const combined: Spot[] = [...localMatches]

    const tryAddSpot = (candidate: Spot) => {
      if (distanceBetweenCoords(dest, { lat: candidate.lat, lng: candidate.lng }) > radiusMeters) return
      // Separación de 18 metros para poblar toda la calle sin solapar iconos
      const tooClose = combined.some(
        (m) => distanceBetweenCoords({ lat: candidate.lat, lng: candidate.lng }, { lat: m.lat, lng: m.lng }) < 18,
      )
      if (!tooClose) combined.push(candidate)
    }

    elements.forEach((el: any, idx: number) => {
      const tags = el.tags || {}
      const laneValues = [
        tags['parking:lane:both'],
        tags['parking:lane:left'],
        tags['parking:lane:right'],
        tags['parking:both'],
        tags['parking:left'],
        tags['parking:right'],
      ]
        .filter(Boolean)
        .join(' ')
        .toLowerCase()

      if (laneValues.includes('no_parking') || laneValues.includes('no_stopping') || laneValues === 'no') {
        return
      }

      const isRoadSegment = Boolean(tags.highway)
      const isPerpendicular =
        laneValues.includes('perpendicular') ||
        laneValues.includes('diagonal') ||
        tags.parking === 'street_side'

      let type: SpotType = 'gratuita'
      if (tags.amenity === 'charging_station') type = 'carga'
      else if (tags.amenity === 'motorcycle_parking') type = 'moto'
      else if (
        tags.fee === 'yes' ||
        tags.parking === 'underground' ||
        tags.parking === 'multi-storey' ||
        laneValues.includes('ticket') ||
        laneValues.includes('meter')
      ) {
        type = 'pago'
      } else if (tags['capacity:disabled'] && !tags.capacity) {
        type = 'movilidad'
      }

      const rawName = tags.name || tags['addr:street']
      const streetName = isRoadSegment && rawName
        ? `${isPerpendicular ? 'Calzada batería' : 'Calzada cordón'} · ${rawName}`
        : rawName || `Zona aparcamiento · ${dest.name}`

      const numericId = Number(el.id || idx)

      // Si es una calle con varios puntos (geometry), generamos plazas a lo largo de todo su recorrido
      if (Array.isArray(el.geometry) && el.geometry.length > 1 && isRoadSegment) {
        el.geometry.forEach((pt: { lat: number; lon: number }, ptIdx: number) => {
          if (typeof pt.lat !== 'number' || typeof pt.lon !== 'number') return
          const busy = (numericId + ptIdx) % 3 === 0
          tryAddSpot({
            id: `osm-road-${el.id}-${ptIdx}`,
            lat: pt.lat,
            lng: pt.lon,
            type,
            busy,
            vertical: isPerpendicular || ptIdx % 2 === 1,
            street: streetName,
          })
        })
        return
      }

      // Si es un nodo puntual o el perímetro de un parking
      const lat = el.lat ?? el.geometry?.[0]?.lat
      const lng = el.lon ?? el.geometry?.[0]?.lon
      if (typeof lat !== 'number' || typeof lng !== 'number') return

      tryAddSpot({
        id: `osm-${el.type}-${el.id}`,
        lat,
        lng,
        type,
        busy: numericId % 3 === 0,
        vertical: isPerpendicular || idx % 3 === 1,
        street: streetName,
        capacity: tags.capacity ? Number(tags.capacity) : undefined,
      })
    })

    return combined
  } catch {
    return localMatches
  }
}
