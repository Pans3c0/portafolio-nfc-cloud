import React from 'react';
import { Calendar, Clock } from 'lucide-react';
import { FranjaHorariaEstado } from '../interfaces/peluqueria';

export interface PropiedadesSelectorHoras {
  fechasDisponibles: { fechaISO: string; etiquetaDia: string }[];
  fechaSeleccionada: string;
  alCambiarFecha: (nuevaFechaISO: string) => void;
  franjasHorarias: FranjaHorariaEstado[];
  horaSeleccionada: string | null;
  alSeleccionarHora: (hora: string) => void;
}

/**
 * Selector interactivo de día y franja horaria para citas de peluquería.
 *
 * MENTORING JUNIOR:
 * Las horas ocupadas se deshabilitan (`disabled`) con una estética clara de línea
 * tachada para que el usuario entienda al instante por qué no puede pulsarlas.
 */
export const SelectorHoras: React.FC<PropiedadesSelectorHoras> = ({
  fechasDisponibles,
  fechaSeleccionada,
  alCambiarFecha,
  franjasHorarias,
  horaSeleccionada,
  alSeleccionarHora
}) => {
  return (
    <div className="bg-superficie border border-bordeSutil rounded-sm p-5 space-y-5">
      {/* Selector de Día */}
      <div>
        <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-tintaSuave mb-3">
          <Calendar className="w-4 h-4 text-primario" />
          <span>1. Selecciona el Día</span>
        </div>

        <div className="grid grid-cols-3 gap-2">
          {fechasDisponibles.map((dia) => {
            const esDiaActivo = dia.fechaISO === fechaSeleccionada;
            return (
              <button
                key={dia.fechaISO}
                type="button"
                onClick={() => alCambiarFecha(dia.fechaISO)}
                className={`py-2.5 px-3 text-xs font-medium rounded-sm border transition-colors text-center ${
                  esDiaActivo
                    ? 'bg-primario text-white border-primario'
                    : 'bg-lienzo text-tinta border-gray-300 hover:border-primario'
                }`}
              >
                {dia.etiquetaDia}
              </button>
            );
          })}
        </div>
      </div>

      {/* Selector de Franja Horaria */}
      <div className="pt-4 border-t border-bordeSutil">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-tintaSuave">
            <Clock className="w-4 h-4 text-primario" />
            <span>2. Franjas Horarias</span>
          </div>

          <div className="flex items-center gap-3 text-[11px] text-tintaSuave">
            <span className="inline-flex items-center gap-1">
              <span className="w-2.5 h-2.5 border border-gray-400 bg-superficie inline-block rounded-sm" />
              Libre
            </span>
            <span className="inline-flex items-center gap-1">
              <span className="w-2.5 h-2.5 bg-gray-200 inline-block rounded-sm" />
              Ocupada
            </span>
          </div>
        </div>

        <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
          {franjasHorarias.map((franja) => {
            const esHoraActiva = horaSeleccionada === franja.hora;

            if (!franja.estaDisponible) {
              return (
                <button
                  key={franja.hora}
                  type="button"
                  disabled
                  className="py-2 px-2 text-xs font-mono bg-gray-100 text-gray-400 border border-gray-200 rounded-sm line-through cursor-not-allowed"
                  title="Franja horaria reservada"
                >
                  {franja.hora}
                </button>
              );
            }

            return (
              <button
                key={franja.hora}
                type="button"
                onClick={() => alSeleccionarHora(franja.hora)}
                className={`py-2 px-2 text-xs font-mono font-medium rounded-sm border transition-colors ${
                  esHoraActiva
                    ? 'bg-primario text-white border-primario'
                    : 'bg-superficie text-tinta border-gray-300 hover:border-primario hover:bg-fondoSecundario'
                }`}
              >
                {franja.hora}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
