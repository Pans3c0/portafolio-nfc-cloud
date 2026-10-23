import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight, Wifi, Check } from 'lucide-react';
import { DemoComercialNFC } from '../interfaces/portafolio';

export interface PropiedadesTarjetaDemoModulo {
  demo: DemoComercialNFC;
}

/**
 * Tarjeta que presenta un módulo de demostración comercial y la URL exacta
 * pensada para grabarse con herramientas como NFC Tools en una etiqueta NTAG213/215.
 */
export const TarjetaDemoModulo: React.FC<PropiedadesTarjetaDemoModulo> = ({ demo }) => {
  const estiloMuestraColor: React.CSSProperties = {
    backgroundColor: `hsl(${demo.colorMuestraHSL.tono}, ${demo.colorMuestraHSL.saturacion}%, ${demo.colorMuestraHSL.luminosidad}%)`
  };

  return (
    <article className="bg-superficie border border-bordeSutil rounded-sm p-6 flex flex-col justify-between hover:border-gray-400 transition-colors">
      <div>
        <div className="flex items-center justify-between gap-2 pb-4 border-b border-bordeSutil">
          <span className="text-xs font-mono uppercase tracking-wider text-tintaSuave">
            {demo.sectorNegocio}
          </span>
          <div className="flex items-center gap-2">
            <span
              className="w-3.5 h-3.5 rounded-sm border border-black/20"
              style={estiloMuestraColor}
              title="Color primario HSL del módulo"
            />
            <span className="text-[11px] font-mono text-tintaSuave">
              HSL({demo.colorMuestraHSL.tono}, {demo.colorMuestraHSL.saturacion}%,{' '}
              {demo.colorMuestraHSL.luminosidad}%)
            </span>
          </div>
        </div>

        <h3 className="text-lg font-bold text-tinta mt-4">{demo.titulo}</h3>
        <p className="text-sm text-tintaSuave mt-2 leading-relaxed">
          {demo.resumenFuncional}
        </p>

        <ul className="mt-4 space-y-2 border-t border-bordeSutil pt-4">
          {demo.caracteristicasClave.map((caracteristica, indice) => (
            <li key={indice} className="flex items-start gap-2 text-xs text-tinta">
              <Check className="w-3.5 h-3.5 text-tinta shrink-0 mt-0.5" />
              <span>{caracteristica}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="mt-6 pt-4 border-t border-bordeSutil space-y-3">
        <div className="bg-lienzo border border-bordeSutil rounded-sm px-3 py-2 flex items-center justify-between gap-2">
          <div className="flex items-center gap-1.5 text-[11px] font-mono text-tintaSuave truncate">
            <Wifi className="w-3.5 h-3.5 text-tinta shrink-0" />
            <span className="truncate">{demo.urlEtiquetaNFC}</span>
          </div>
          <span className="text-[10px] font-mono uppercase px-1.5 py-0.5 bg-superficie border border-gray-300 rounded-sm text-tinta shrink-0">
            URI NFC
          </span>
        </div>

        <Link
          to={demo.rutaDemo}
          className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-medium bg-tinta text-white rounded-sm hover:bg-gray-800 transition-colors"
        >
          <span>Abrir Demo Interactiva</span>
          <ArrowUpRight className="w-4 h-4" />
        </Link>
      </div>
    </article>
  );
};
