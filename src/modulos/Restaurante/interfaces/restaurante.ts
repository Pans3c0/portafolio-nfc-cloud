import { ConfiguracionBaseCliente } from '../../General/interfaces/configuracionBase';

export type CategoriaPlato =
  | 'Todas'
  | 'Hamburguesas'
  | 'Perritos XL'
  | 'Pizzas 28cm'
  | 'Para Picar'
  | 'Bebidas';

export type AlergenoAlimentario =
  | 'Gluten'
  | 'Lactosa'
  | 'Frutos Secos'
  | 'Marisco'
  | 'Huevo'
  | 'Soja'
  | 'Mostaza';

export type ZonaRestaurante =
  | 'Zona de Bar / Salón'
  | 'Terraza Exterior'
  | 'Asientos en Barra';

export interface ResenaGoogleRestaurante {
  autor: string;
  comentario: string;
  estrellas: number;
  etiqueta: string;
}

export interface ConfiguracionRestaurante extends ConfiguracionBaseCliente {
  notaServicioMesa: string;
  capacidadMaximaPorReserva: number;
  urlImagenMascota: string;
  etiquetaPromoSuperior: string;
  manifiestoTitular: string;
  manifiestoSubtitulo: string;
  textoBotonMirarCarta: string;
  valoracionMediaGoogle: number;
  totalResenasGoogle: number;
  rangoPrecioPersona: string;
  whatsappPedidos: string;
  urlGoogleMaps: string;
  urlFacebook: string;
  modalidadesServicio: string[];
  notaCoctelesPropietario: string;
  resenasDestacadas: ResenaGoogleRestaurante[];
}

export interface PlatoCarta {
  id: string;
  nombre: string;
  descripcionIngredientes: string;
  categoria: Exclude<CategoriaPlato, 'Todas'>;
  precioEuros: number;
  alergenos: AlergenoAlimentario[];
  urlImagen: string;
  etiquetaSticker?: string;
  destacadoEnPortada?: boolean;
}

export interface TurnoMesa {
  idTurno: string;
  hora: string;
  etiquetaTurno: 'Comida / Tarde' | 'Cena' | 'Madrugada (Late Night)';
  zona: ZonaRestaurante;
  mesasDisponibles: number;
}

export interface ReservaMesaRegistrada {
  idReserva: string;
  fechaISO: string;
  hora: string;
  zona: ZonaRestaurante;
  numeroComensales: number;
  nombreCliente: string;
  telefonoCliente: string;
  observacionesAlergias?: string;
}

export interface DatosRestauranteJSON {
  platosCarta: PlatoCarta[];
  fechasDisponibles: {
    fechaISO: string;
    etiquetaDia: string;
  }[];
  turnosBase: TurnoMesa[];
  reservasMesaOcupadas: ReservaMesaRegistrada[];
}
