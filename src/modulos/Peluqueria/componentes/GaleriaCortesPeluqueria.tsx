import React from 'react';
import { Scissors, Sparkles, ArrowUpRight } from 'lucide-react';
import {
  CorteMuestraGaleria,
  ServicioPeluqueria
} from '../interfaces/peluqueria';

export interface PropiedadesGaleriaCortesPeluqueria {
  cortes: CorteMuestraGaleria[];
  servicios: ServicioPeluqueria[];
  subtituloSeccion: string;
  alElegirCorteParaReserva: (idServicioAsociado: string, nombreEstilo: string) => void;
}

/**
 * Lookbook visual de cortes de pelo y estilos de barbería.
 *
 * MENTORING JUNIOR:
 * Este componente está diseñado para que el cliente que escanea la etiqueta NFC
 * vea inmediatamente la calidad visual del salón antes de reservar. Si pulsa sobre
 * cualquier corte, abrimos directamente el asistente de reserva a pantalla completa
 * con el servicio correspondiente ya preseleccionado.
 */
export const GaleriaCortesPeluqueria: React.FC<
  PropiedadesGaleriaCortesPeluqueria
> = ({
  cortes,
  servicios,
  subtituloSeccion,
  alElegirCorteParaReserva
}) => {
  const obtenerPrecioServicio = (idServicio: string): number | null => {
    const encontrado = servicios.find((s) => s.id === idServicio);
    return encontrado ? encontrado.precioEuros : null;
  };

  return (
    <section aria-label="Galería de cortes de pelo" className="space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 pb-3 border-b border-bordeSutil">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-mono uppercase tracking-wider text-primario">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Lookbook & Trabajos del Salón</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-tinta mt-0.5">
            Nuestros Cortes y Estilos Destacados
          </h2>
          <p className="text-xs text-tintaSuave mt-0.5">{subtituloSeccion}</p>
        </div>

        <span className="text-[11px] font-mono text-tintaSuave bg-superficie border border-bordeSutil px-2.5 py-1 rounded-sm self-start sm:self-auto">
          {cortes.length} estilos en catálogo
        </span>
      </div>

      {/* Cuadrícula responsive: 2 columnas en móvil para ver varios cortes de un vistazo, 3 en escritorio */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-5">
        {cortes.map((corte) => {
          const precioAsociado = obtenerPrecioServicio(corte.idServicioAsociado);

          return (
            <article
              key={corte.idCorte}
              className="group bg-superficie border border-bordeSutil rounded-sm overflow-hidden flex flex-col justify-between hover:border-primario transition-colors"
            >
              <div>
                <div className="relative aspect-[4/5] w-full overflow-hidden bg-gray-200">
                  <img
                    src={corte.urlImagen}
                    alt={corte.nombreEstilo}
                    loading="lazy"
                    className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-300"
                  />

                  <span className="absolute top-2 left-2 px-2 py-0.5 text-[10px] font-mono uppercase tracking-wider bg-superficie/95 text-tinta border border-gray-300 rounded-sm">
                    {corte.etiquetaTendencia}
                  </span>

                  {precioAsociado !== null && (
                    <span className="absolute bottom-2 right-2 px-2 py-0.5 text-xs font-mono font-bold bg-tinta/90 text-white rounded-sm">
                      {precioAsociado} €
                    </span>
                  )}
                </div>

                <div className="p-3 sm:p-4">
                  <h3 className="text-xs sm:text-sm font-bold text-tinta leading-snug">
                    {corte.nombreEstilo}
                  </h3>
                  <p className="text-[11px] sm:text-xs text-tintaSuave mt-1 leading-relaxed line-clamp-2">
                    {corte.descripcionCorta}
                  </p>
                  <p className="hidden sm:block text-[11px] font-mono text-tintaSuave mt-2 pt-2 border-t border-bordeSutil">
                    Acabado: {corte.acabadoRecomendado}
                  </p>
                </div>
              </div>

              <div className="px-3 pb-3 sm:px-4 sm:pb-4">
                <button
                  type="button"
                  onClick={() =>
                    alElegirCorteParaReserva(
                      corte.idServicioAsociado,
                      corte.nombreEstilo
                    )
                  }
                  className="w-full py-2 px-2.5 text-[11px] sm:text-xs font-medium bg-fondoSecundario hover:bg-primario text-tinta hover:text-white border border-bordeTono hover:border-primario rounded-sm transition-colors inline-flex items-center justify-center gap-1.5"
                >
                  <Scissors className="w-3.5 h-3.5 shrink-0" />
                  <span className="truncate">Reservar este corte</span>
                  <ArrowUpRight className="w-3.5 h-3.5 shrink-0" />
                </button>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
};
