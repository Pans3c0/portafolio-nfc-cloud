import configuracionClienteJson from '../datos/configuracionCliente.json';
import catalogoFigurasJson from '../datos/catalogoFiguras.json';
import {
  ConfiguracionCatalogo3D,
  Figura3D,
  FiltrosActivosCatalogo3D,
  VarianteProducto3D
} from '../interfaces/figura3D';

/**
 * Normaliza cualquier ruta de imagen local para que siempre apunte correctamente
 * a la raíz estática de Vite / Cloudflare Pages (`/assets/...`).
 *
 * MENTORING JUNIOR - ¿CÓMO FUNCIONA LA CARPETA `public/` EN VITE?
 * Todo archivo guardado en `public/assets/Catalogo3D/...` se sirve directamente desde
 * `/assets/Catalogo3D/...` en el navegador. Si por error escribes en el JSON una ruta
 * relativa como `/../../assets/...` o `public/assets/...`, esta función la corrige
 * automáticamente para que las imágenes nunca aparezcan rotas.
 */
export function normalizarRutaImagenCatalogo(urlOriginal: string): string {
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
 * Obtiene la configuración estética y White-Label del Catálogo 3D.
 *
 * ---------------------------------------------------------------------------
 * GUÍA DE MIGRACIÓN A BASE DE DATOS REAL (PARA PROGRAMADOR JUNIOR):
 * ---------------------------------------------------------------------------
 * 1) Con `fetch` hacia una API REST:
 * ```ts
 * export async function obtenerConfiguracionCatalogo3D(idTienda: string): Promise<ConfiguracionCatalogo3D> {
 *   const respuesta = await fetch(`https://api.tudominio.com/v1/catalogos/${idTienda}/configuracion`);
 *   if (!respuesta.ok) throw new Error('No se pudo cargar la configuración del catálogo');
 *   return await respuesta.json();
 * }
 * ```
 *
 * 2) Con el cliente oficial de `Supabase`:
 * ```ts
 * import { supabase } from '../../General/utilidades/clienteSupabase';
 *
 * export async function obtenerConfiguracionCatalogo3D(idTienda: string): Promise<ConfiguracionCatalogo3D> {
 *   const { data, error } = await supabase
 *     .from('configuracion_catalogos')
 *     .select('*')
 *     .eq('identificadorCliente', idTienda)
 *     .single();
 *   if (error) throw error;
 *   return data as ConfiguracionCatalogo3D;
 * }
 * ```
 */
export function obtenerConfiguracionCatalogo3D(): ConfiguracionCatalogo3D {
  return configuracionClienteJson as ConfiguracionCatalogo3D;
}

/**
 * Obtiene la colección completa de productos del catálogo 3D con sus rutas de imagen
 * normalizadas y listas para renderizar.
 *
 * ---------------------------------------------------------------------------
 * GUÍA DE MIGRACIÓN A BASE DE DATOS REAL (PARA PROGRAMADOR JUNIOR):
 * ---------------------------------------------------------------------------
 * Con el cliente de `Supabase` (incluyendo galería de imágenes y variantes de precio):
 * ```ts
 * export async function obtenerFiguras3D(): Promise<Figura3D[]> {
 *   const { data, error } = await supabase
 *     .from('figuras_3d')
 *     .select('*, galeriaImagenes:imagenes_figura_3d(*), variantes:variantes_figura_3d(*)')
 *     .order('id', { ascending: true });
 *
 *   if (error) throw error;
 *   return data as Figura3D[];
 * }
 * ```
 */
export function obtenerFiguras3D(): Figura3D[] {
  const figurasCrudas = catalogoFigurasJson as Figura3D[];

  return figurasCrudas.map((figura) => ({
    ...figura,
    galeriaImagenes: figura.galeriaImagenes.map((imagen) => ({
      ...imagen,
      urlImagen: normalizarRutaImagenCatalogo(imagen.urlImagen)
    }))
  }));
}

/**
 * Calcula el precio final dinámico de un producto según la variante escogida
 * (ej. Pack Familia Completa vs. 1 Unidad suelta) y si el cliente ha marcado
 * la casilla de añadir Chip NFC.
 */
export function calcularPrecioFinalProducto3D(
  figura: Figura3D,
  varianteActiva: VarianteProducto3D | null,
  incluirExtraNFC: boolean
): number {
  const precioBase = varianteActiva
    ? varianteActiva.precio
    : figura.precioReferenciaEuros;

  const suplementoNFC =
    incluirExtraNFC && figura.opcionNFC?.disponible
      ? figura.opcionNFC.precioExtra
      : 0;

  return Number((precioBase + suplementoNFC).toFixed(2));
}

/**
 * Filtra y ordena los objetos del catálogo según el texto de búsqueda, categoría,
 * disponibilidad en stock y criterio de ordenación.
 */
export function filtrarYOrdenarCatalogo3D(
  figuras: Figura3D[],
  filtros: FiltrosActivosCatalogo3D
): Figura3D[] {
  const terminoLimpio = filtros.textoBusqueda.trim().toLowerCase();

  const resultadoFiltrado = figuras.filter((figura) => {
    const coincideTexto =
      terminoLimpio === '' ||
      figura.nombre.toLowerCase().includes(terminoLimpio) ||
      figura.descripcion.toLowerCase().includes(terminoLimpio) ||
      figura.resumenCortoTarjeta.toLowerCase().includes(terminoLimpio) ||
      (figura.variantes?.some((v) =>
        v.nombre.toLowerCase().includes(terminoLimpio)
      ) ??
        false);

    const coincideCategoria =
      filtros.categoria === 'Todas' || figura.categoria === filtros.categoria;

    const coincideDisponibilidad =
      !filtros.soloDisponibles || figura.disponibleEnStock;

    return coincideTexto && coincideCategoria && coincideDisponibilidad;
  });

  if (filtros.ordenarPor === 'precio-ascendente') {
    return [...resultadoFiltrado].sort(
      (a, b) => a.precioReferenciaEuros - b.precioReferenciaEuros
    );
  }

  if (filtros.ordenarPor === 'precio-descendente') {
    return [...resultadoFiltrado].sort(
      (a, b) => b.precioReferenciaEuros - a.precioReferenciaEuros
    );
  }

  return resultadoFiltrado;
}

/**
 * Divide el listado de productos en bloques de 4 elementos (`Figura3D[][]`) para
 * alimentar el carrusel horizontal deslizable de 4 en 4 (cuadrícula 2×2 por vista).
 */
export function agruparEnVistasDeCuatro(
  figuras: Figura3D[],
  itemsPorVista: number = 4
): Figura3D[][] {
  const paginas: Figura3D[][] = [];
  for (let indice = 0; indice < figuras.length; indice += itemsPorVista) {
    paginas.push(figuras.slice(indice, indice + itemsPorVista));
  }
  return paginas;
}
