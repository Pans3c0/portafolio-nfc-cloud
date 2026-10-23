import React, { useEffect } from 'react';
import { X } from 'lucide-react';

/**
 * Propiedades del componente `Modal`.
 */
export interface PropiedadesModal {
  /** Controla si el modal está visible en pantalla */
  estaAbierto: boolean;
  /** Función que se ejecuta al cerrar el modal */
  alCerrar: () => void;
  /** Título mostrado en la barra superior del modal */
  titulo: string;
  /** Subtítulo opcional técnico o descriptivo */
  subtitulo?: string;
  /** Contenido interno del modal */
  children: React.ReactNode;
}

/**
 * Modal reutilizable con diseño minimalista de bordes limpios.
 *
 * MENTORING JUNIOR:
 * Incluye soporte para cerrar con la tecla `Escape` y bloquea el scroll del `body`
 * mientras está abierto para evitar que el fondo se desplace en teléfonos móviles
 * cuando un cliente abre el modal tras escanear una etiqueta NFC.
 */
export const Modal: React.FC<PropiedadesModal> = ({
  estaAbierto,
  alCerrar,
  titulo,
  subtitulo,
  children
}) => {
  useEffect(() => {
    const manejarTeclaEscape = (evento: KeyboardEvent) => {
      if (evento.key === 'Escape') {
        alCerrar();
      }
    };

    if (estaAbierto) {
      document.addEventListener('keydown', manejarTeclaEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', manejarTeclaEscape);
      document.body.style.overflow = 'unset';
    };
  }, [estaAbierto, alCerrar]);

  if (!estaAbierto) {
    return null;
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="titulo-modal"
      onClick={alCerrar}
    >
      <div
        className="w-full max-w-lg bg-superficie border border-gray-300 rounded-sm overflow-hidden"
        onClick={(evento) => evento.stopPropagation()}
      >
        <div className="flex items-start justify-between px-6 py-4 border-b border-bordeSutil bg-lienzo">
          <div>
            <h2 id="titulo-modal" className="text-base font-semibold text-tinta">
              {titulo}
            </h2>
            {subtitulo && (
              <p className="text-xs text-tintaSuave mt-0.5">{subtitulo}</p>
            )}
          </div>
          <button
            type="button"
            onClick={alCerrar}
            className="p-1 text-tintaSuave hover:text-tinta border border-transparent hover:border-gray-300 rounded-sm transition-colors"
            aria-label="Cerrar ventana"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-6 max-h-[80vh] overflow-y-auto">{children}</div>
      </div>
    </div>
  );
};
