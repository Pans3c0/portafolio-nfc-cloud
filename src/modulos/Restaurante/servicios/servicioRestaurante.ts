import configuracionClienteJson from '../datos/configuracionCliente.json';
import reservasJson from '../datos/reservas.json';
import {
  AlergenoAlimentario,
  CategoriaPlato,
  ConfiguracionRestaurante,
  DatosRestauranteJSON,
  PlatoCarta,
  ReservaMesaRegistrada,
  TurnoMesa
} from '../interfaces/restaurante';

/**
 * Normaliza las rutas de imágenes locales de `public/assets/Restaurante/...`
 * para asegurar que siempre se sirvan desde `/assets/Restaurante/...`.
 */
export function normalizarRutaImagenRestaurante(urlOriginal: string): string {
  if (
    urlOriginal.startsWith('http://') ||
    urlOriginal.startsWith('https://')
  ) {
    return urlOriginal;
  }

  const sinPrefijosRelativos = urlOriginal
    .replace(/^(\/?\.\.\/)+/, '/')
    .replace(/^\/?public\//, '/');

  return sinPrefijosRelativos.startsWith('/')
    ? sinPrefijosRelativos
    : `/${sinPrefijosRelativos}`;
}

/**
 * Obtiene la configuración White-Label del restaurante (nombre, colores HSL, textos de manifiesto).
 *
 * ---------------------------------------------------------------------------
 * GUÍA DE MIGRACIÓN A BASE DE DATOS REAL (PARA PROGRAMADOR JUNIOR):
 * ---------------------------------------------------------------------------
 * 1) Con `fetch` (API REST):
 * ```ts
 * export async function obtenerConfiguracionRestaurante(idRestaurante: string): Promise<ConfiguracionRestaurante> {
 *   const respuesta = await fetch(`https://api.tudominio.com/restaurantes/${idRestaurante}/configuracion`);
 *   if (!respuesta.ok) throw new Error('No se pudo cargar la configuración del restaurante');
 *   return await respuesta.json();
 * }
 * ```
 *
 * 2) Con `Supabase`:
 * ```ts
 * import { supabase } from '../../General/utilidades/clienteSupabase';
 *
 * export async function obtenerConfiguracionRestaurante(idRestaurante: string): Promise<ConfiguracionRestaurante> {
 *   const { data, error } = await supabase
 *     .from('configuracion_restaurante')
 *     .select('*')
 *     .eq('identificadorCliente', idRestaurante)
 *     .single();
 *
 *   if (error) throw error;
 *   return data as ConfiguracionRestaurante;
 * }
 * ```
 */
export function obtenerConfiguracionRestaurante(): ConfiguracionRestaurante {
  const config = configuracionClienteJson as ConfiguracionRestaurante;
  return {
    ...config,
    urlImagenMascota: normalizarRutaImagenRestaurante(config.urlImagenMascota)
  };
}

/**
 * Obtiene todos los platos de la carta digital del restaurante con rutas de imagen normalizadas.
 *
 * ---------------------------------------------------------------------------
 * GUÍA DE MIGRACIÓN A BASE DE DATOS REAL (PARA PROGRAMADOR JUNIOR):
 * ---------------------------------------------------------------------------
 * Con `Supabase`:
 * ```ts
 * export async function obtenerPlatosCarta(): Promise<PlatoCarta[]> {
 *   const { data, error } = await supabase
 *     .from('platos_carta')
 *     .select('*')
 *     .eq('disponibleHoy', true)
 *     .order('categoria', { ascending: true });
 *
 *   if (error) throw error;
 *   return data as PlatoCarta[];
 * }
 * ```
 */
export function obtenerPlatosCarta(): PlatoCarta[] {
  const datos = reservasJson as DatosRestauranteJSON;
  return datos.platosCarta.map((plato) => ({
    ...plato,
    urlImagen: normalizarRutaImagenRestaurante(plato.urlImagen)
  }));
}

/**
 * Filtra los platos de la carta por búsqueda de texto, categoría gastronómica y
 * excluye aquellos que contengan cualquiera de los alérgenos marcados por el comensal.
 */
export function filtrarPlatosCarta(
  platos: PlatoCarta[],
  categoriaActiva: CategoriaPlato,
  alergenosExcluidos: AlergenoAlimentario[],
  textoBusqueda: string = ''
): PlatoCarta[] {
  const terminoLimpio = textoBusqueda.trim().toLowerCase();

  return platos.filter((plato) => {
    const coincideTexto =
      terminoLimpio === '' ||
      plato.nombre.toLowerCase().includes(terminoLimpio) ||
      plato.descripcionIngredientes.toLowerCase().includes(terminoLimpio) ||
      plato.categoria.toLowerCase().includes(terminoLimpio);

    const coincideCategoria =
      categoriaActiva === 'Todas' || plato.categoria === categoriaActiva;

    const contieneAlergenoRestringido = plato.alergenos.some((alergeno) =>
      alergenosExcluidos.includes(alergeno)
    );

    return (
      coincideTexto && coincideCategoria && !contieneAlergenoRestringido
    );
  });
}

/**
 * Obtiene las fechas y turnos de reserva de mesas del restaurante.
 */
export function obtenerDatosTurnosRestaurante(): {
  fechasDisponibles: DatosRestauranteJSON['fechasDisponibles'];
  turnosBase: TurnoMesa[];
  reservasMesaOcupadas: ReservaMesaRegistrada[];
} {
  const datos = reservasJson as DatosRestauranteJSON;
  return {
    fechasDisponibles: datos.fechasDisponibles,
    turnosBase: datos.turnosBase,
    reservasMesaOcupadas: datos.reservasMesaOcupadas
  };
}

/**
 * Registra una nueva reserva de mesa.
 */
export function crearReservaMesaEnMemoria(
  nuevaReserva: Omit<ReservaMesaRegistrada, 'idReserva'>
): ReservaMesaRegistrada {
  return {
    ...nuevaReserva,
    idReserva: `MESA-${String(Date.now()).slice(-5)}`
  };
}
