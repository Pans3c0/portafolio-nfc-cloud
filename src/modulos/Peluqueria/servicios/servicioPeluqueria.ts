import configuracionClienteJson from '../datos/configuracionCliente.json';
import reservasJson from '../datos/reservas.json';
import {
  ConfiguracionPeluqueria,
  CorteMuestraGaleria,
  DatosReservasPeluqueria,
  FranjaHorariaEstado,
  ReservaRegistradaPeluqueria,
  ServicioPeluqueria
} from '../interfaces/peluqueria';

/**
 * Obtiene la configuración White-Label del cliente de Peluquería (nombre, colores HSL, horarios).
 *
 * ---------------------------------------------------------------------------
 * GUÍA DE MIGRACIÓN A BASE DE DATOS REAL (PARA PROGRAMADOR JUNIOR):
 * ---------------------------------------------------------------------------
 * 1) Refactorización con `fetch` hacia tu API REST:
 * ```ts
 * export async function obtenerConfiguracionPeluqueria(idCliente: string): Promise<ConfiguracionPeluqueria> {
 *   const respuesta = await fetch(`https://api.tudominio.com/peluquerias/${idCliente}/configuracion`);
 *   if (!respuesta.ok) {
 *     throw new Error('Error al cargar la configuración de la peluquería');
 *   }
 *   return await respuesta.json();
 * }
 * ```
 *
 * 2) Refactorización con el cliente de `Supabase`:
 * ```ts
 * import { supabase } from '../../General/utilidades/clienteSupabase';
 *
 * export async function obtenerConfiguracionPeluqueria(idCliente: string): Promise<ConfiguracionPeluqueria> {
 *   const { data, error } = await supabase
 *     .from('configuracion_peluqueria')
 *     .select('*, especialistasActivos:especialistas_peluqueria(*)')
 *     .eq('identificadorCliente', idCliente)
 *     .single();
 *
 *   if (error) throw error;
 *   return data as ConfiguracionPeluqueria;
 * }
 * ```
 */
export function obtenerConfiguracionPeluqueria(): ConfiguracionPeluqueria {
  return configuracionClienteJson as ConfiguracionPeluqueria;
}

/**
 * Obtiene la galería de cortes de pelo (Lookbook) para mostrar en la pantalla inicial.
 *
 * MENTORING JUNIOR:
 * Para poner tus propias fotografías de cortes de pelo, solo tienes que guardar tus
 * fotos en `public/cortes/` (ej. `public/cortes/fade-01.webp`) y actualizar el campo
 * `urlImagen` en `src/modulos/Peluqueria/datos/reservas.json`.
 *
 * ---------------------------------------------------------------------------
 * GUÍA DE MIGRACIÓN A BASE DE DATOS REAL (PARA PROGRAMADOR JUNIOR):
 * ---------------------------------------------------------------------------
 * Con `Supabase Storage` + tabla `galeria_cortes`:
 * ```ts
 * export async function obtenerGaleriaCortesPeluqueria(): Promise<CorteMuestraGaleria[]> {
 *   const { data, error } = await supabase
 *     .from('galeria_cortes')
 *     .select('*')
 *     .order('orden', { ascending: true });
 *   if (error) throw error;
 *   return data as CorteMuestraGaleria[];
 * }
 * ```
 */
export function obtenerGaleriaCortesPeluqueria(): CorteMuestraGaleria[] {
  const datos = reservasJson as DatosReservasPeluqueria;
  return datos.galeriaCortes;
}

/**
 * Obtiene el catálogo de servicios ofrecidos por la peluquería.
 *
 * ---------------------------------------------------------------------------
 * GUÍA DE MIGRACIÓN A BASE DE DATOS REAL (PARA PROGRAMADOR JUNIOR):
 * ---------------------------------------------------------------------------
 * 1) Con `fetch`:
 * ```ts
 * export async function obtenerServiciosPeluqueria(): Promise<ServicioPeluqueria[]> {
 *   const respuesta = await fetch('https://api.tudominio.com/peluquerias/servicios');
 *   return await respuesta.json();
 * }
 * ```
 *
 * 2) Con `Supabase`:
 * ```ts
 * export async function obtenerServiciosPeluqueria(): Promise<ServicioPeluqueria[]> {
 *   const { data, error } = await supabase
 *     .from('servicios_peluqueria')
 *     .select('*')
 *     .eq('activo', true)
 *     .order('precioEuros', { ascending: true });
 *
 *   if (error) throw error;
 *   return data as ServicioPeluqueria[];
 * }
 * ```
 */
export function obtenerServiciosPeluqueria(): ServicioPeluqueria[] {
  const datos = reservasJson as DatosReservasPeluqueria;
  return datos.servicios;
}

/**
 * Obtiene las fechas habilitadas y las reservas iniciales del archivo JSON local.
 *
 * ---------------------------------------------------------------------------
 * GUÍA DE MIGRACIÓN A BASE DE DATOS REAL (PARA PROGRAMADOR JUNIOR):
 * ---------------------------------------------------------------------------
 * En producción con `Supabase`, consultarías las reservas de una fecha concreta así:
 * ```ts
 * export async function obtenerReservasPorFecha(fechaISO: string): Promise<ReservaRegistradaPeluqueria[]> {
 *   const { data, error } = await supabase
 *     .from('reservas_peluqueria')
 *     .select('*')
 *     .eq('fechaISO', fechaISO);
 *
 *   if (error) throw error;
 *   return data as ReservaRegistradaPeluqueria[];
 * }
 * ```
 */
export function obtenerDatosInicialesAgenda(): {
  fechasDisponibles: DatosReservasPeluqueria['fechasDisponibles'];
  franjasHorariasBase: string[];
  reservasOcupadas: ReservaRegistradaPeluqueria[];
} {
  const datos = reservasJson as DatosReservasPeluqueria;
  return {
    fechasDisponibles: datos.fechasDisponibles,
    franjasHorariasBase: datos.franjasHorariasBase,
    reservasOcupadas: datos.reservasOcupadas
  };
}

/**
 * Calcula qué horas están libres u ocupadas para una fecha concreta.
 */
export function calcularDisponibilidadHoraria(
  fechaISO: string,
  franjasBase: string[],
  reservasActuales: ReservaRegistradaPeluqueria[]
): FranjaHorariaEstado[] {
  const horasOcupadasEnFecha = new Set(
    reservasActuales
      .filter((reserva) => reserva.fechaISO === fechaISO)
      .map((reserva) => reserva.hora)
  );

  return franjasBase.map((hora) => ({
    hora,
    estaDisponible: !horasOcupadasEnFecha.has(hora)
  }));
}

/**
 * Crea un nuevo registro de reserva de cita.
 *
 * ---------------------------------------------------------------------------
 * GUÍA DE MIGRACIÓN A BASE DE DATOS REAL (PARA PROGRAMADOR JUNIOR):
 * ---------------------------------------------------------------------------
 * 1) Con `fetch` (petición POST a una API REST):
 * ```ts
 * export async function registrarNuevaReservaPeluqueria(
 *   datosEntrada: Omit<ReservaRegistradaPeluqueria, 'idReserva'>
 * ): Promise<ReservaRegistradaPeluqueria> {
 *   const respuesta = await fetch('https://api.tudominio.com/peluquerias/reservas', {
 *     method: 'POST',
 *     headers: { 'Content-Type': 'application/json' },
 *     body: JSON.stringify(datosEntrada)
 *   });
 *   if (!respuesta.ok) throw new Error('La franja horaria ya no está disponible');
 *   return await respuesta.json();
 * }
 * ```
 *
 * 2) Con `Supabase` (inserción directa en tabla PostgreSQL con políticas RLS):
 * ```ts
 * export async function registrarNuevaReservaPeluqueria(
 *   datosEntrada: Omit<ReservaRegistradaPeluqueria, 'idReserva'>
 * ): Promise<ReservaRegistradaPeluqueria> {
 *   const { data, error } = await supabase
 *     .from('reservas_peluqueria')
 *     .insert([datosEntrada])
 *     .select()
 *     .single();
 *
 *   if (error) throw error;
 *   return data as ReservaRegistradaPeluqueria;
 * }
 * ```
 */
export function crearReservaEnMemoria(
  datosEntrada: Omit<ReservaRegistradaPeluqueria, 'idReserva'>
): ReservaRegistradaPeluqueria {
  return {
    ...datosEntrada,
    idReserva: `CITA-${String(Date.now()).slice(-5)}`
  };
}
