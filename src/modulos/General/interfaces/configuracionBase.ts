/**
 * @file configuracionBase.ts
 * @description Contratos TypeScript base compartidos por todos los módulos White-Label.
 *
 * MENTORING JUNIOR:
 * Definir una interfaz base para la configuración del cliente garantiza que cualquier
 * módulo comercial (Peluquería, Restaurante, Clínica, Gimnasio...) tenga exactamente
 * la misma estructura mínima para el motor de temas HSL y la cabecera del negocio.
 */

/**
 * Representa los tres componentes del modelo de color HSL.
 * Se almacenan como números para validar rangos fácilmente y aplicarlos a CSS.
 */
export interface ColorHSLCliente {
  /** Grados en el círculo cromático (0 - 360). Ej: 25 = terracota, 150 = verde oliva */
  tono: number;
  /** Porcentaje de saturación (0 - 100). Recomendado entre 20 y 65 para estética sobria */
  saturacion: number;
  /** Porcentaje de luminosidad base (0 - 100). Recomendado entre 20 y 38 para buen contraste con texto blanco */
  luminosidad: number;
}

/**
 * Propiedades comunes que todo archivo `configuracionCliente.json` debe incluir.
 */
export interface ConfiguracionBaseCliente {
  identificadorCliente: string;
  nombreComercial: string;
  eslogan: string;
  descripcionCorta: string;
  inicialesLogo: string;
  urlLogo?: string;
  direccionFisica: string;
  telefonoContacto: string;
  horarioAtencion: string;
  codigoEtiquetaNFC: string;
  colorBaseHSL: ColorHSLCliente;
}
