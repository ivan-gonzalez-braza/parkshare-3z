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

// Ubicación por defecto si el navegador no tiene GPS activado (Centro de Mataró)
export const USER_POSITION: Coords = { lat: 41.5391, lng: 2.4445 }

export const SPOTS: Spot[] = [
  // Parkings subterráneos de pago (PUMSA)
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

  // Solares y aparcamientos gratuitos en superficie
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

  // Tramos en calzada (zona blanca y plazas urbanas en Mataró)
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
    details: '
