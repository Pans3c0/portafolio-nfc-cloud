import React, { useState } from 'react';
import { Calendar, Users } from 'lucide-react';
import {
  ReservaMesaRegistrada,
  TurnoMesa
} from '../interfaces/restaurante';
import { Boton } from '../../General/componentes/Boton';

export interface PropiedadesFormularioReservaMesa {
  fechasDisponibles: { fechaISO: string; etiquetaDia: string }[];
  turnosBase: TurnoMesa[];
  reservasOcupadas: ReservaMesaRegistrada[];
  capacidadMaxima: number;
  alConfirmarReserva: (
    datosReserva: Omit<ReservaMesaRegistrada, 'idReserva'>
  ) => void;
}

/**
 * Formulario interactivo para reservar mesa por fecha, turno, zona y número de comensales.
 */
export const FormularioReservaMesa: React.FC<
  PropiedadesFormularioReservaMesa
> = ({
  fechasDisponibles,
  turnosBase,
  reservasOcupadas,
  capacidadMaxima,
  alConfirmarReserva
}) => {
  const [fechaSeleccionada, setFechaSeleccionada] = useState<string>(
    fechasDisponibles[0].fechaISO
  );
  const [turnoSeleccionado, setTurnoSeleccionado] = useState<TurnoMesa | null>(
    null
  );
  const [numeroComensales, setNumeroComensales] = useState<number>(2);
  const [nombreCliente, setNombreCliente] = useState<string>('');
  const [telefonoCliente, setTelefonoCliente] = useState<string>('');
  const [observacionesAlergias, setObservacionesAlergias] =
    useState<string>('');

  const estaTurnoOcupado = (turno: TurnoMesa): boolean => {
    return reservasOcupadas.some(
      (reserva) =>
        reserva.fechaISO === fechaSeleccionada &&
        reserva.hora === turno.hora &&
        reserva.zona === turno.zona
    );
  };

  const manejarEnvioFormulario = (evento: React.FormEvent) => {
    evento.preventDefault();
    if (!turnoSeleccionado || !nombreCliente.trim() || !telefonoCliente.trim()) {
      return;
    }

    alConfirmarReserva({
      fechaISO: fechaSeleccionada,
      hora: turnoSeleccionado.hora,
      zona: turnoSeleccionado.zona,
      numeroComensales,
      nombreCliente: nombreCliente.trim(),
      telefonoCliente: telefonoCliente.trim(),
      observacionesAlergias: observacionesAlergias.trim() || undefined
    });

    setTurnoSeleccionado(null);
    setNombreCliente('');
    setTelefonoCliente('');
    setObservacionesAlergias('');
  };

  return (
    <form onSubmit={manejarEnvioFormulario} className="space-y-4 text-xs">
      {/* Selección de Fecha */}
      <div>
        <span className="flex items-center gap-1.5 font-mono uppercase tracking-wider text-tintaSuave mb-2">
          <Calendar className="w-3.5 h-3.5 text-primario" />
          <span>1. Día de la Reserva</span>
        </span>
        <div className="grid grid-cols-3 gap-2">
          {fechasDisponibles.map((dia) => {
            const esActivo = dia.fechaISO === fechaSeleccionada;
            return (
              <button
                key={dia.fechaISO}
                type="button"
                onClick={() => {
                  setFechaSeleccionada(dia.fechaISO);
                  setTurnoSeleccionado(null);
                }}
                className={`py-2 px-2 font-medium rounded-sm border transition-colors ${
                  esActivo
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

      {/* Selección de Turno y Zona */}
      <div className="pt-3 border-t border-bordeSutil">
        <span className="block font-mono uppercase tracking-wider text-tintaSuave mb-2">
          2. Turno y Ubicación de Mesa
        </span>
        <div className="space-y-2">
          {turnosBase.map((turno) => {
            const ocupado = estaTurnoOcupado(turno);
            const seleccionado = turnoSeleccionado?.idTurno === turno.idTurno;

            return (
              <button
                key={turno.idTurno}
                type="button"
                disabled={ocupado}
                onClick={() => setTurnoSeleccionado(turno)}
                className={`w-full p-2.5 rounded-sm border text-left flex items-center justify-between transition-colors ${
                  ocupado
                    ? 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed line-through'
                    : seleccionado
                      ? 'bg-fondoSecundario border-primario text-tinta font-semibold'
                      : 'bg-lienzo border-gray-300 text-tinta hover:border-primario'
                }`}
              >
                <div>
                  <span className="font-mono font-bold">{turno.hora} h</span>
                  <span className="mx-2 text-gray-400">·</span>
                  <span>{turno.zona}</span>
                </div>
                <span className="text-[11px] font-mono text-tintaSuave">
                  {ocupado ? 'Completo' : turno.etiquetaTurno}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Número de comensales y Contacto */}
      <div className="pt-3 border-t border-bordeSutil grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label
            htmlFor="campo-comensales"
            className="flex items-center gap-1 font-medium text-tinta mb-1"
          >
            <Users className="w-3.5 h-3.5 text-primario" />
            <span>Comensales (máx. {capacidadMaxima})</span>
          </label>
          <input
            id="campo-comensales"
            type="number"
            min={1}
            max={capacidadMaxima}
            value={numeroComensales}
            onChange={(e) => setNumeroComensales(Number(e.target.value))}
            className="w-full px-3 py-2 font-mono bg-lienzo border border-gray-300 rounded-sm text-tinta focus:outline-none focus:border-primario"
          />
        </div>

        <div>
          <label
            htmlFor="campo-telefono-restaurante"
            className="block font-medium text-tinta mb-1"
          >
            Teléfono de contacto
          </label>
          <input
            id="campo-telefono-restaurante"
            type="tel"
            required
            placeholder="Ej: 655 987 321"
            value={telefonoCliente}
            onChange={(e) => setTelefonoCliente(e.target.value)}
            className="w-full px-3 py-2 font-mono bg-lienzo border border-gray-300 rounded-sm text-tinta focus:outline-none focus:border-primario"
          />
        </div>
      </div>

      <div>
        <label
          htmlFor="campo-nombre-restaurante"
          className="block font-medium text-tinta mb-1"
        >
          Nombre del titular de la reserva
        </label>
        <input
          id="campo-nombre-restaurante"
          type="text"
          required
          placeholder="Ej: Laura Valiente"
          value={nombreCliente}
          onChange={(e) => setNombreCliente(e.target.value)}
          className="w-full px-3 py-2 bg-lienzo border border-gray-300 rounded-sm text-tinta focus:outline-none focus:border-primario"
        />
      </div>

      <div>
        <label
          htmlFor="campo-alergias-restaurante"
          className="block font-medium text-tinta mb-1"
        >
          Notas de alérgenos o intolerancias para cocina (opcional)
        </label>
        <input
          id="campo-alergias-restaurante"
          type="text"
          placeholder="Ej: 1 comensal celíaco"
          value={observacionesAlergias}
          onChange={(e) => setObservacionesAlergias(e.target.value)}
          className="w-full px-3 py-2 bg-lienzo border border-gray-300 rounded-sm text-tinta focus:outline-none focus:border-primario"
        />
      </div>

      <Boton
        type="submit"
        variante="primario"
        anchoCompleto
        disabled={!turnoSeleccionado || !nombreCliente.trim() || !telefonoCliente.trim()}
      >
        {turnoSeleccionado
          ? `Confirmar Mesa (${turnoSeleccionado.hora} h · ${turnoSeleccionado.zona})`
          : 'Selecciona un turno disponible arriba'}
      </Boton>
    </form>
  );
};
