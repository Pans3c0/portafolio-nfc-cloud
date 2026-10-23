import datosPortafolioJson from '../datos/datosPortafolio.json';
import { PerfilIngeniero } from '../interfaces/portafolio';

/**
 * Obtiene la información general del portafolio y la lista de demos NFC disponibles.
 *
 * MENTORING JUNIOR - PATRÓN REPOSITORIO:
 * Aunque los datos del portafolio están en un archivo JSON local, las vistas no deben
 * hacer `import datos from '../datos/datosPortafolio.json'`. Al pasar por esta función:
 * 1. Aseguramos que el retorno cumple estrictamente la interfaz `PerfilIngeniero`.
 * 2. Si mañana quieres gestionar tu portafolio desde un panel CMS o Supabase, solo
 *    modificas este archivo y `VistaPortafolio.tsx` sigue funcionando intacta.
 *
 * ---------------------------------------------------------------------------
 * GUÍA DE MIGRACIÓN A BASE DE DATOS REAL (PARA PROGRAMADOR JUNIOR):
 * ---------------------------------------------------------------------------
 * Opción A: Usando `fetch` hacia una API REST propia
 * ```ts
 * export async function obtenerDatosPortafolio(): Promise<PerfilIngeniero> {
 *   const respuesta = await fetch('https://api.tudominio.com/v1/portafolio');
 *   if (!respuesta.ok) {
 *     throw new Error('No se pudo cargar la información del portafolio');
 *   }
 *   const datos: PerfilIngeniero = await respuesta.json();
 *   return datos;
 * }
 * ```
 *
 * Opción B: Usando el cliente oficial de Supabase
 * ```ts
 * import { supabase } from '../../General/utilidades/clienteSupabase';
 *
 * export async function obtenerDatosPortafolio(): Promise<PerfilIngeniero> {
 *   const { data, error } = await supabase
 *     .from('portafolio_configuracion')
 *     .select('*, demos_disponibles(*)')
 *     .single();
 *
 *   if (error) throw error;
 *   return data as PerfilIngeniero;
 * }
 * ```
 */
export function obtenerDatosPortafolio(): PerfilIngeniero {
  return datosPortafolioJson as PerfilIngeniero;
}
