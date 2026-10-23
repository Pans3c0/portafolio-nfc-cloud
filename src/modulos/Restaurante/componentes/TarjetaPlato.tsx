import React from 'react';
import { PlatoCarta } from '../interfaces/restaurante';

export interface PropiedadesTarjetaPlato {
  plato: PlatoCarta;
  alSeleccionarPlato?: (plato: PlatoCarta) => void;
}

/**
 * Ficha visual y gastronómica de un plato o bebida en la carta digital del restaurante.
 * Ajusta automáticamente el encuadre (`object-contain` sobre fondo blanco para botes de bebida,
 * `object-cover` para platos gastronómicos).
 */
export const TarjetaPlato: React.FC<PropiedadesTarjetaPlato> = ({
  plato,
  alSeleccionarPlato
}) => {
  const esBebida = plato.categoria === 'Bebidas';

  return (
    <article
      onClick={() => alSeleccionarPlato && alSeleccionarPlato(plato)}
      className="group bg-superficie border border-bordeSutil rounded-sm overflow-hidden flex flex-col justify-between hover:border-primario transition-colors cursor-pointer"
    >
      <div>
        {/* Fotografía del Producto */}
        <div
          className={`relative aspect-[16/10] w-full overflow-hidden border-b border-bordeSutil ${
            esBebida ? 'bg-white p-3' : 'bg-gray-100'
          }`}
        >
          <img
            src={plato.urlImagen}
            alt={plato.nombre}
            loading="lazy"
            className={`w-full h-full object-center group-hover:scale-105 transition-transform duration-300 ${
              esBebida ? 'object-contain' : 'object-cover'
            }`}
          />

          {plato.etiquetaSticker && (
            <span className="absolute top-2.5 left-2.5 px-2.5 py-1 text-[10px] font-mono font-bold uppercase tracking-wider bg-primario text-white rounded-sm">
              {plato.etiquetaSticker}
            </span>
          )}

          <span className="absolute bottom-2.5 right-2.5 px-3 py-1 text-sm font-mono font-bold bg-tinta text-white rounded-sm">
            {plato.precioEuros.toFixed(2).replace('.', ',')} €
          </span>
        </div>

        <div className="p-4">
          <span className="text-[10px] font-mono uppercase tracking-wider text-primario font-semibold">
            {plato.categoria}
          </span>

          <h3 className="text-base font-black text-tinta mt-1 leading-snug uppercase">
            {plato.nombre}
          </h3>

          <p className="text-xs text-tintaSuave mt-1.5 leading-relaxed">
            {plato.descripcionIngredientes}
          </p>
        </div>
      </div>

      {plato.alergenos.length > 0 && (
        <div className="px-4 py-2.5 border-t border-bordeSutil bg-lienzo flex items-center justify-between gap-2 text-[11px]">
          <span className="font-mono text-tintaSuave">Alérgenos:</span>
          <div className="flex flex-wrap gap-1">
            {plato.alergenos.map((alergeno) => (
              <span
                key={alergeno}
                className="font-mono px-2 py-0.5 bg-superficie border border-gray-300 text-tinta rounded-sm text-[10px]"
              >
                {alergeno}
              </span>
            ))}
          </div>
        </div>
      )}
    </article>
  );
};
