import { ColorHSLCliente } from '../interfaces/configuracionBase';

/**
 * Inyecta los valores HSL del cliente activo en las variables CSS del elemento `:root`.
 *
 * MENTORING JUNIOR - ¿POR QUÉ INYECTAR VARIABLES EN `:root` DESDE TYPESCRIPT?
 * En lugar de pasar el color por `props` a 40 componentes distintos (lo que se conoce
 * como "Prop Drilling"), actualizamos únicamente las 3 variables maestras en el nodo
 * raíz del documento (`document.documentElement`). Inmediatamente, el motor CSS del
 * navegador recalcula `--color-primario`, `--color-primario-hover`,
 * `--color-primario-activo` y `--color-fondo-secundario` usando `calc()` sin
 * provocar re-renderizados innecesarios en React.
 *
 * @param colorHSL Objeto con tono (0-360), saturacion (0-100) y luminosidad (0-100).
 */
export function aplicarTemaCliente(colorHSL: ColorHSLCliente): void {
  const elementoRaiz = document.documentElement;

  elementoRaiz.style.setProperty('--color-tono', String(colorHSL.tono));
  elementoRaiz.style.setProperty('--color-saturacion', `${colorHSL.saturacion}%`);
  elementoRaiz.style.setProperty('--color-luminosidad', `${colorHSL.luminosidad}%`);
}

/**
 * Restaura el tema sobrio por defecto cuando el usuario regresa al Portafolio principal
 * o al Catálogo 3D.
 */
export function restaurarTemaPorDefecto(): void {
  aplicarTemaCliente({
    tono: 215,
    saturacion: 25,
    luminosidad: 24
  });
}
