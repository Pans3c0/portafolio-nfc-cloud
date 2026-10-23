/**
 * @file peluqueria.ts
 * @description Tipados TypeScript exactos para el dominio de negocio de Peluquería y Barbería.
 *
 * MENTORING JUNIOR:
 * Este archivo vive dentro de `src/modulos/Peluqueria/interfaces/` y NO en una carpeta
 * global `src/types/`. Incluye tanto la estructura de la galería de cortes de pelo
 * (Lookbook) como los pasos del asistente de reserva a pantalla completa para móvil.
 */

import { ConfiguracionBaseCliente } from '../../General/interfaces/configuracionBase';

export interface EspecialistaPeluqueria {
  idEspecialista: string;
  nombre: string;
  cargo: string;
  experienciaAnos: number;
  iniciales: string;
}

export interface ConfiguracionPeluqueria extends ConfiguracionBaseCliente {
  notaPoliticaCancelacion: string;
  textoBotonPrincipalReserva: string;
  subtituloGaleriaCortes: string;
  especialistasActivos: EspecialistaPeluqueria[];
}

export interface CorteMuestraGaleria {
  idCorte: string;
  nombreEstilo: string;
  etiquetaTendencia: string;
  descripcionCorta: string;
  /**
   * URL o ruta local (ej. "/cortes/mi-foto-1.jpg") que el propietario puede
   * reemplazar fácilmente en `reservas.json` con sus propios trabajos.
   */
  urlImagen: string;
  idServicioAsociado: string;
  acabadoRecomendado: string;
}

export interface ServicioPeluqueria {
  id: string;
  nombre: string;
  categoria: 'Corte y Estilo' | 'Ritual Barba' | 'Tratamiento Capilar';
  duracionMinutos: number;
  precioEuros: number;
  descripcion: string;
}

export interface ReservaRegistradaPeluqueria {
  idReserva: string;
  fechaISO: string;
  hora: string;
  idServicio: string;
  idEspecialista: string;
  nombreCliente: string;
  telefonoCliente: string;
}

export interface DatosReservasPeluqueria {
  fechasDisponibles: {
    fechaISO: string;
    etiquetaDia: string;
    nombreDiaCorto: string;
    numeroDia: string;
  }[];
  franjasHorariasBase: string[];
  galeriaCortes: CorteMuestraGaleria[];
  servicios: ServicioPeluqueria[];
  reservasOcupadas: ReservaRegistradaPeluqueria[];
}

export interface FranjaHorariaEstado {
  hora: string;
  estaDisponible: boolean;
}
