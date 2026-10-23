import React from 'react';
import { Clock, Check } from 'lucide-react';
import { ServicioPeluqueria } from '../interfaces/peluqueria';

export interface PropiedadesTarjetaServicio {
  servicio: ServicioPeluqueria;
  estaSeleccionado: boolean;
  alSeleccionar: (servicio: ServicioPeluqueria) => void;
}

/**
 * Componente que muestra un servicio individual de peluquería.
 *
 * MENTORING JUNIOR:
 * Cuando el servicio está seleccionado, usamos las variables CSS dinámicas
 * (`border-primario`, `bg-fondoSecundario`) para resaltar la selección con el tono
 * exacto de la marca del cliente sin usar sombras difuminadas.
 */
export const TarjetaServicio: React.FC<PropiedadesTarjetaServicio> = ({
  servicio,
  estaSeleccionado,
  alSeleccionar
}) => {
  return (
    <button
      type="button"
      onClick={() => alSeleccionar(servicio)}
      className={`w-full text-left p-4 rounded-sm border transition-colors flex flex-col justify-between gap-3 ${
        estaSeleccionado
          ? 'bg-fondoSecundario border-primario'
          : 'bg-superficie border-bordeSutil hover:border-gray-400'
      }`}
    >
      <div className="w-full">
        <div className="flex items-start justify-between gap-2">
          <div>
            <span className="text-[11px] font-mono uppercase tracking-wider text-tintaSuave">
              {servicio.categoria}
            </span>
            <h3 className="text-sm font-bold text-tinta mt-0.5">
              {servicio.nombre}
            </h3>
          </div>

          <span className="text-sm font-mono font-bold text-tinta shrink-0">
            {servicio.precioEuros.toFixed(2)} €
          </span>
        </div>

        <p className="text-xs text-tintaSuave mt-2 leading-relaxed">
          {servicio.descripcion}
        </p>
      </div>

      <div className="w-full pt-3 border-t border-bordeSutil flex items-center justify-between text-xs">
        <div className="flex items-center gap-1.5 font-mono text-tintaSuave">
          <Clock className="w-3.5 h-3.5 text-primario" />
          <span>{servicio.duracionMinutos} min</span>
        </div>

        <span
          className={`inline-flex items-center gap-1 font-medium ${
            estaSeleccionado ? 'text-primario font-semibold' : 'text-tintaSuave'
          }`}
        >
          {estaSeleccionado ? (
            <>
              <Check className="w-3.5 h-3.5" />
              <span>Seleccionado</span>
            </>
          ) : (
            <span>Elegir servicio</span>
          )}
        </span>
      </div>
    </button>
  );
};
