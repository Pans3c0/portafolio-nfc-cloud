import React from 'react';
import { Images, MessageCircle } from 'lucide-react';
import { Figura3D } from '../interfaces/figura3D';

export interface PropiedadesTarjetaFigura3D {
  figura: Figura3D;
  simboloMoneda: string;
  telefonoWhatsApp?: string;
  alSeleccionarProducto: (figura: Figura3D) => void;
}

/**
 * Tarjeta editorial en tonos crema y tierra orientada a cliente final.
 * Incluye acceso a opciones de producto y botón directo para pedir por WhatsApp.
 */
export const TarjetaFigura3D: React.FC<PropiedadesTarjetaFigura3D> = ({
  figura,
  simboloMoneda,
  telefonoWhatsApp = '34689113710',
  alSeleccionarProducto
}) => {
  const imagenPrincipal = figura.galeriaImagenes[0];

  const mensajeWhatsApp = encodeURIComponent(
    `¡Hola Samuel! Estoy viendo tu Catálogo 3D y me interesa el producto "${figura.nombre}" (${figura.precioReferenciaEuros} ${simboloMoneda}). ¿Está disponible para encargo?`
  );
  const urlWhatsApp = `https://wa.me/${telefonoWhatsApp}?text=${mensajeWhatsApp}`;

  return (
    <article className="group flex flex-col items-center pb-2 h-full justify-between">
      <div className="w-full text-center">
        {/* Marco Blanco Estilo Polaroid con click para abrir modal */}
        <button
          type="button"
          onClick={() => alSeleccionarProducto(figura)}
          className="w-full text-center focus:outline-none cursor-pointer"
          aria-label={`Ver opciones y fotos de ${figura.nombre}`}
        >
          <div className="bg-white p-2 sm:p-3 border border-[#dcd4c6] transition-transform duration-200 group-hover:-translate-y-0.5">
            <div className="relative aspect-[4/5] w-full overflow-hidden bg-[#eae4da]">
              {imagenPrincipal && (
                <img
                  src={imagenPrincipal.urlImagen}
                  alt={figura.nombre}
                  loading="lazy"
                  className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-300"
                />
              )}

              {/* Estado de stock */}
              <span
                className={`absolute top-2 left-2 px-2 py-0.5 text-[10px] font-medium rounded-sm border ${
                  figura.disponibleEnStock
                    ? 'bg-white/95 text-[#5a5043] border-[#c8bca9]'
                    : 'bg-[#4a4238]/90 text-white border-[#4a4238]'
                }`}
              >
                {figura.disponibleEnStock ? 'En stock' : 'Bajo pedido'}
              </span>

              {/* Contador de fotos */}
              {figura.galeriaImagenes.length > 1 && (
                <span className="absolute top-2 right-2 inline-flex items-center gap-1 px-1.5 py-0.5 text-[10px] font-medium bg-white/90 text-[#5a5043] border border-[#c8bca9] rounded-sm">
                  <Images className="w-3 h-3" />
                  <span>{figura.galeriaImagenes.length}</span>
                </span>
              )}
            </div>
          </div>

          {/* Etiqueta superpuesta con título, descripción y píldora de precio */}
          <div className="relative z-10 -mt-7 sm:-mt-9 mx-1.5 sm:mx-4 bg-white border-2 border-[#b5a895] rounded-md px-2 sm:px-3.5 pt-2 sm:pt-3 pb-4 sm:pb-5 transition-colors group-hover:border-[#8f816d]">
            <h3 className="text-xs sm:text-base font-bold text-[#756857] leading-snug line-clamp-1">
              {figura.nombre}
            </h3>

            <p className="text-[10px] sm:text-xs text-[#8c7f6f] mt-0.5 leading-tight line-clamp-1">
              {figura.resumenCortoTarjeta}
            </p>

            {figura.textoDisponibilidadTarjeta && (
              <p className="text-[10px] sm:text-xs text-[#8c7f6f] leading-tight line-clamp-1">
                {figura.textoDisponibilidadTarjeta}
              </p>
            )}

            {/* Píldora del Precio debajo de cada ítem */}
            <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 bg-[#b0a392] group-hover:bg-[#8f816d] text-white font-bold text-[11px] sm:text-xs px-3.5 sm:px-5 py-0.5 rounded-full border border-[#9c8e7c] tracking-wide transition-colors whitespace-nowrap">
              {figura.precioReferenciaEuros} {simboloMoneda}
            </div>
          </div>
        </button>
      </div>

      {/* Botones de acción directa: Ver Opciones + Pedir por WhatsApp */}
      <div className="w-full mt-5 px-1.5 sm:px-4 flex flex-col gap-1.5">
        <button
          type="button"
          onClick={() => alSeleccionarProducto(figura)}
          className="w-full py-1.5 px-2 bg-[#f4f0e8] hover:bg-[#eae3d5] text-[#5c5040] text-[11px] sm:text-xs font-semibold rounded-sm border border-[#cfc4b4] transition-colors"
        >
          Ver opciones y fotos
        </button>

        <a
          href={urlWhatsApp}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full py-1.5 px-2 bg-emerald-700 hover:bg-emerald-800 text-white text-[11px] sm:text-xs font-bold rounded-sm inline-flex items-center justify-center gap-1.5 transition-colors shadow-xs"
          aria-label={`Pedir ${figura.nombre} por WhatsApp`}
        >
          <MessageCircle className="w-3.5 h-3.5" />
          <span>Pedir por WhatsApp</span>
        </a>
      </div>
    </article>
  );
};
