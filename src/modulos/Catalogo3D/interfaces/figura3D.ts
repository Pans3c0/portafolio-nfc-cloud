/**
 * @file figura3D.ts
 * @description Contratos TypeScript limpios orientados a cliente final para el Catálogo 3D.
 *
 * MENTORING JUNIOR - DISEÑO DE INTERFACES PARA CLIENTE FINAL (B2C / B2B):
 * Hemos eliminado todos los datos técnicos de ingeniería (altura de capa, porcentaje de
 * relleno, tolerancias en micras, gramos o tiempos de máquina) que no aportan valor al
 * comprador final.
 *
 * Además, las propiedades de personalización (`variantes`, `opcionNFC`, `coloresDisponibles`)
 * son OPCIONALES (`?`). Si las omites en `catalogoFiguras.json` para un producto simple,
 * la interfaz simplemente ocultará esa sección sin dar ningún error.
 */

import { ConfiguracionBaseCliente } from '../../General/interfaces/configuracionBase';

export type CategoriaObjeto3D =
  | 'Todas'
  | 'Colección Halloween & Otoño'
  | 'Accesorios y Mascotas';

export type CriterioOrdenacionCatalogo =
  | 'destacados'
  | 'precio-ascendente'
  | 'precio-descendente';

export interface ImagenGaleriaProducto3D {
  idImagen: string;
  tituloVista?: string;
  urlImagen: string;
}

/**
 * Representa una opción o formato seleccionable dentro de un producto o pack
 * (por ejemplo: "Pack Familia Completa", "1 Ud. Fantasmita Tímido", "1 Ud. Gatito").
 * Al seleccionarla, cambia automáticamente el precio base y la foto mostrada.
 */
export interface VarianteProducto3D {
  idVariante: string;
  nombre: string;
  precio: number;
  /** ID de la imagen de `galeriaImagenes` que debe mostrarse al elegir esta opción */
  idImagenAsociada?: string;
  /** Descripción breve opcional de lo que incluye esta variante */
  detalle?: string;
}

/**
 * Configuración opcional para permitir al cliente añadir un chip NFC integrado
 * a cualquier figura o pack, sumando automáticamente su suplemento al precio.
 */
export interface ConfiguracionExtraNFC {
  disponible: boolean;
  precioExtra: number;
  etiqueta?: string;
  descripcion?: string;
}

export interface Figura3D {
  id: string;
  nombre: string;
  resumenCortoTarjeta: string;
  textoDisponibilidadTarjeta?: string;
  categoria: Exclude<CategoriaObjeto3D, 'Todas'>;
  precioReferenciaEuros: number;
  disponibleEnStock: boolean;
  unidadesDisponibles?: number;
  descripcion: string;
  galeriaImagenes: ImagenGaleriaProducto3D[];
  /** Lista opcional de variantes (Pack completo, unidades sueltas, tamaños...) */
  variantes?: VarianteProducto3D[];
  /** Configuración opcional para añadir chip NFC con actualización de precio en vivo */
  opcionNFC?: ConfiguracionExtraNFC;
  /** Lista opcional de colores si el producto permite elegir tono */
  coloresDisponibles?: string[];
}

export interface ConfiguracionCatalogo3D extends ConfiguracionBaseCliente {
  subtituloEditorial: string;
  tituloEditorial: string;
  simboloMoneda: string;
  itemsPorPaginaVista: number;
  notaPieCatalogo: string;
  whatsappPedidos?: string;
}

export interface FiltrosActivosCatalogo3D {
  textoBusqueda: string;
  categoria: CategoriaObjeto3D;
  soloDisponibles: boolean;
  ordenarPor: CriterioOrdenacionCatalogo;
}
