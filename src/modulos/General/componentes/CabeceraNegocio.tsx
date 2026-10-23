import React from 'react';
import { MapPin, Phone, Clock, Wifi } from 'lucide-react';
import { ConfiguracionBaseCliente } from '../interfaces/configuracionBase';

export interface PropiedadesCabeceraNegocio {
  configuracion: ConfiguracionBaseCliente;
  accionDerecha?: React.ReactNode;
}

/**
 * Cabecera institucional White-Label que se alimenta 100% del archivo
 * `configuracionCliente.json` del módulo activo.
 *
 * MENTORING JUNIOR:
 * Al separar esta cabecera en `General`, tanto la Peluquería como el Restaurante
 * (o cualquier módulo futuro) mantienen una jerarquía visual impecable y consistente,
 * cambiando automáticamente su identidad mediante el JSON del cliente.
 */
export const CabeceraNegocio: React.FC<PropiedadesCabeceraNegocio> = ({
  configuracion,
  accionDerecha
}) => {
  return (
    <header className="bg-superficie border-b border-bordeSutil">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex items-start gap-4">
            <div
              className="w-12 h-12 rounded-sm bg-primario text-white flex items-center justify-center font-mono text-base font-bold tracking-wider shrink-0 border border-primario"
              aria-hidden="true"
            >
              {configuracion.inicialesLogo}
            </div>

            <div>
              <div className="flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center gap-1 px-2 py-0.5 text-[11px] font-mono uppercase tracking-wider bg-fondoSecundario text-tinta border border-bordeTono rounded-sm">
                  <Wifi className="w-3 h-3" />
                  NFC ID: {configuracion.codigoEtiquetaNFC}
                </span>
                <span className="text-xs font-mono text-tintaSuave">
                  HSL({configuracion.colorBaseHSL.tono}, {configuracion.colorBaseHSL.saturacion}%,{' '}
                  {configuracion.colorBaseHSL.luminosidad}%)
                </span>
              </div>

              <h1 className="text-2xl font-bold tracking-tight text-tinta mt-1">
                {configuracion.nombreComercial}
              </h1>
              <p className="text-sm font-medium text-tintaSuave">
                {configuracion.eslogan}
              </p>
            </div>
          </div>

          {accionDerecha && <div className="shrink-0">{accionDerecha}</div>}
        </div>

        <p className="mt-4 text-sm text-tintaSuave max-w-3xl leading-relaxed">
          {configuracion.descripcionCorta}
        </p>

        <div className="mt-5 pt-4 border-t border-bordeSutil grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs text-tintaSuave">
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-primario shrink-0" />
            <span>{configuracion.direccionFisica}</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-primario shrink-0" />
            <span>{configuracion.horarioAtencion}</span>
          </div>
          <div className="flex items-center gap-2">
            <Phone className="w-4 h-4 text-primario shrink-0" />
            <span className="font-mono">{configuracion.telefonoContacto}</span>
          </div>
        </div>
      </div>
    </header>
  );
};
