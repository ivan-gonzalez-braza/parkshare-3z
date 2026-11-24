export interface AparcamientoBase {
  id: string;
  nombre: string;
  tipo: "pago_subterraneo" | "gratuito_superficie" | "rotacion_gratuita_limitada";
  gratuito: boolean;
  capacidad: number | null;
  direccion: string;
  coordenadas: { lat: number; lng: number };
  caracteristicas: string[];
}

export interface PuntoCalzada {
  punto_id: string;
  lat: number;
  lng: number;
  orientacion: "cordon" | "bateria";
  capacidad_estimada_plazas: number;
}

export interface TramoCalzada {
  id_tramo: string;
  calle: string;
  tipo: string;
  gratuito: boolean;
  puntos_estacionamiento: PuntoCalzada[];
}

export const APARCAMIENTOS_MATARO: AparcamientoBase[] = [
  {
    id: "pumsa_tereses",
    nombre: "Pàrquing Plaça de les Tereses (PUMSA)",
    tipo: "pago_subterraneo",
    gratuito: false,
    capacidad: null,
    direccion: "Plaça de les Tereses, 42",
    coordenadas: { lat: 41.53912, lng: 2.44356 },
    caracteristicas: ["Rotación", "Abonados", "Recarga eléctrica"]
  },
  {
    id: "pumsa_parc_central",
    nombre: "Pàrquing PUMSA Parc Central-Recinte Firal",
    tipo: "pago_subterraneo",
    gratuito: false,
    capacidad: null,
    direccion: "Camí de la Geganta, 2",
    coordenadas: { lat: 41.53854, lng: 2.44781 },
    caracteristicas: ["Rotación", "Recinte Firal"]
  },
  {
    id: "solar_varador",
    nombre: "Passeig Marítim - Varador",
    tipo: "gratuito_superficie",
    gratuito: true,
    capacidad: 160,
    direccion: "Passeig Marítim (Antiguo Club Náutico)",
    coordenadas: { lat: 41.53321, lng: 2.45123 },
    caracteristicas: ["Solar provisional", "Exterior"]
  },
  {
    id: "solar_triangle_molins",
    nombre: "Aparcamiento Triangle Molins",
    tipo: "gratuito_superficie",
    gratuito: true,
    capacidad: 350,
    direccion: "Confluencia Rieres de Cirera y Figuera Major",
    coordenadas: { lat: 41.5489, lng: 2.4354 },
    caracteristicas: ["Gran capacidad", "Zona norte"]
  },
  {
    id: "solar_les_valls",
    nombre: "Aparcamiento Les Valls (Hospital)",
    tipo: "gratuito_superficie",
    gratuito: true,
    capacidad: 305,
    direccion: "Carrer de Galícia, 213",
    coordenadas: { lat: 41.5512, lng: 2.4398 },
    caracteristicas: ["Antiguas pistas de conducir", "Servicio hospital"]
  }
];

export const TRAMOS_CALZADA_MATARO: TramoCalzada[] = [
  {
    id_tramo: "calzada_puig_cadafalch_norte",
    calle: "Avinguda de Puig i Cadafalch",
    tipo: "zona_blanca_calzada",
    gratuito: true,
    puntos_estacionamiento: [
      { punto_id: "puig_01", lat: 41.5489, lng: 2.4439, orientacion: "cordon", capacidad_estimada_plazas: 3 },
      { punto_id: "puig_02", lat: 41.5491, lng: 2.4442, orientacion: "bateria", capacidad_estimada_plazas: 4 }
    ]
  },
  {
    id_tramo: "calzada_carrer_girona",
    calle: "Carrer de Girona",
    tipo: "zona_blanca_calzada",
    gratuito: true,
    puntos_estacionamiento: [
      { punto_id: "girona_01", lat: 41.5461, lng: 2.4351, orientacion: "cordon", capacidad_estimada_plazas: 5 },
      { punto_id: "girona_02", lat: 41.5469, lng: 2.4358, orientacion: "cordon", capacidad_estimada_plazas: 4 }
    ]
  }
];
