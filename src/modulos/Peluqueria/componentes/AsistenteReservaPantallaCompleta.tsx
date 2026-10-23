import React, { useEffect, useState } from 'react';
import {
  X,
  ArrowLeft,
  ArrowRight,
  Check,
  UserCheck,
  Calendar,
  Clock,
  CheckCircle2,
  Sparkles
} from 'lucide-react';
import {
  EspecialistaPeluqueria,
  FranjaHorariaEstado,
  ReservaRegistradaPeluqueria,
  ServicioPeluqueria
} from '../interfaces/peluqueria';
import { TarjetaServicio } from './TarjetaServicio';
import { Boton } from '../../General/componentes/Boton';

export interface PropiedadesAsistenteReservaPantallaCompleta {
  estaAbierto: boolean;
  alCerrar: () => void;
  nombreNegocio: string;
  servicios: ServicioPeluqueria[];
  especialistas: EspecialistaPeluqueria[];
  fechasDisponibles: {
    fechaISO: string;
    etiquetaDia: string;
    nombreDiaCorto: string;
    numeroDia: string;
  }[];
  servicioInicialSeleccionado: ServicioPeluqueria;
  estiloInspiracionOpcional: string | null;
  obtenerFranjasPorFecha: (fechaISO: string) => FranjaHorariaEstado[];
  alConfirmarReservaFinal: (
    datosReserva: Omit<ReservaRegistradaPeluqueria, 'idReserva'>
  ) => ReservaRegistradaPeluqueria;
}

type PasoAsistente = 1 | 2 | 3 | 4 | 5;

/**
 * Asistente de reserva a pantalla completa (`100dvh`) diseñado con enfoque Mobile-First.
 *
 * MENTORING JUNIOR - UX MÓVIL PARA ETIQUETAS NFC:
 * Cuando un usuario escanea un NFC en la peluquería o desde Instagram en su teléfono,
 * los formularios largos con scroll vertical generan abandono. Un asistente paso a paso
 * a pantalla completa (Wizard) con los botones de avance fijos en la zona inferior del
 * pulgar ("Thumb Zone") multiplica la tasa de conversión.
 */
export const AsistenteReservaPantallaCompleta: React.FC<
  PropiedadesAsistenteReservaPantallaCompleta
> = ({
  estaAbierto,
  alCerrar,
  nombreNegocio,
  servicios,
  especialistas,
  fechasDisponibles,
  servicioInicialSeleccionado,
  estiloInspiracionOpcional,
  obtenerFranjasPorFecha,
  alConfirmarReservaFinal
}) => {
  const [pasoActual, setPasoActual] = useState<PasoAsistente>(1);
  const [servicioElegido, setServicioElegido] = useState<ServicioPeluqueria>(
    servicioInicialSeleccionado
  );
  const [especialistaElegido, setEspecialistaElegido] =
    useState<EspecialistaPeluqueria>(especialistas[0]);
  const [fechaElegida, setFechaElegida] = useState<string>(
    fechasDisponibles[0]?.fechaISO ?? ''
  );
  const [horaElegida, setHoraElegida] = useState<string | null>(null);
  const [nombreCliente, setNombreCliente] = useState<string>('');
  const [telefonoCliente, setTelefonoCliente] = useState<string>('');
  const [reservaCompletada, setReservaCompletada] =
    useState<ReservaRegistradaPeluqueria | null>(null);

  useEffect(() => {
    if (estaAbierto) {
      setServicioElegido(servicioInicialSeleccionado);
      setPasoActual(1);
      setReservaCompletada(null);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [estaAbierto, servicioInicialSeleccionado]);

  if (!estaAbierto) {
    return null;
  }

  const franjasHorariasDelDia = obtenerFranjasPorFecha(fechaElegida);
  const etiquetaFechaLegible =
    fechasDisponibles.find((d) => d.fechaISO === fechaElegida)?.etiquetaDia ??
    fechaElegida;

  const porcentajeProgreso =
    pasoActual === 5 ? 100 : Math.round((pasoActual / 4) * 100);

  const manejarEnvioReserva = (evento: React.FormEvent) => {
    evento.preventDefault();
    if (!horaElegida || !nombreCliente.trim() || !telefonoCliente.trim()) {
      return;
    }

    const creada = alConfirmarReservaFinal({
      fechaISO: fechaElegida,
      hora: horaElegida,
      idServicio: servicioElegido.id,
      idEspecialista: especialistaElegido.idEspecialista,
      nombreCliente: nombreCliente.trim(),
      telefonoCliente: telefonoCliente.trim()
    });

    setReservaCompletada(creada);
    setPasoActual(5);
  };

  return (
    <div
      className="fixed inset-0 z-50 h-[100dvh] w-full bg-lienzo flex flex-col overflow-hidden"
      role="dialog"
      aria-modal="true"
      aria-label="Asistente paso a paso de reserva"
    >
      {/* Cabecera Superior Fija con Barra de Progreso */}
      <header className="bg-superficie border-b border-bordeSutil shrink-0">
        <div className="max-w-2xl mx-auto px-4 py-3 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5 min-w-0">
            {pasoActual > 1 && pasoActual < 5 && (
              <button
                type="button"
                onClick={() =>
                  setPasoActual((previo) => (previo - 1) as PasoAsistente)
                }
                className="p-1.5 rounded-sm border border-gray-300 bg-lienzo text-tinta hover:border-primario"
                aria-label="Volver al paso anterior"
              >
                <ArrowLeft className="w-4 h-4" />
              </button>
            )}
            <div className="truncate">
              <span className="block text-[10px] font-mono uppercase tracking-wider text-tintaSuave">
                {pasoActual === 5
                  ? 'Reserva Confirmada'
                  : `Paso ${pasoActual} de 4 · ${nombreNegocio}`}
              </span>
              <h2 className="text-sm sm:text-base font-bold text-tinta truncate">
                {pasoActual === 1 && '1. Selecciona tu Servicio'}
                {pasoActual === 2 && '2. Elige tu Profesional'}
                {pasoActual === 3 && '3. Fecha y Hora Disponible'}
                {pasoActual === 4 && '4. Confirma tus Datos'}
                {pasoActual === 5 && '¡Tu Cita está Reservada!'}
              </h2>
            </div>
          </div>

          <button
            type="button"
            onClick={alCerrar}
            className="p-2 rounded-sm border border-gray-300 bg-lienzo text-tintaSuave hover:text-tinta"
            aria-label="Cerrar asistente de reserva"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Barra de progreso lineal limpia */}
        <div className="w-full h-1 bg-gray-200">
          <div
            className="h-full bg-primario transition-all duration-300"
            style={{ width: `${porcentajeProgreso}%` }}
          />
        </div>
      </header>

      {/* Área Central con Scroll Independiente */}
      <div className="flex-1 overflow-y-auto px-4 py-5">
        <div className="max-w-2xl mx-auto space-y-5">
          {/* Píldora de estilo de corte seleccionado en el Lookbook (si aplica) */}
          {estiloInspiracionOpcional && pasoActual < 5 && (
            <div className="bg-fondoSecundario border border-bordeTono rounded-sm px-3.5 py-2.5 flex items-center justify-between gap-2 text-xs">
              <div className="flex items-center gap-2 text-tinta">
                <Sparkles className="w-4 h-4 text-primario shrink-0" />
                <span>
                  Estilo de referencia elegido:{' '}
                  <strong>{estiloInspiracionOpcional}</strong>
                </span>
              </div>
              <span className="font-mono text-tintaSuave">
                {servicioElegido.precioEuros} €
              </span>
            </div>
          )}

          {/* PASO 1: SELECCIÓN DE SERVICIO */}
          {pasoActual === 1 && (
            <div className="space-y-3">
              <p className="text-xs text-tintaSuave">
                Elige el servicio que deseas realizar hoy. Todos incluyen lavado
                y asesoramiento personalizado.
              </p>
              <div className="grid grid-cols-1 gap-3">
                {servicios.map((servicio) => (
                  <TarjetaServicio
                    key={servicio.id}
                    servicio={servicio}
                    estaSeleccionado={servicioElegido.id === servicio.id}
                    alSeleccionar={(elegido) => setServicioElegido(elegido)}
                  />
                ))}
              </div>
            </div>
          )}

          {/* PASO 2: SELECCIÓN DE ESPECIALISTA */}
          {pasoActual === 2 && (
            <div className="space-y-3">
              <p className="text-xs text-tintaSuave">
                Selecciona con qué miembro de nuestro equipo prefieres reservar
                tu sesión de <strong>{servicioElegido.nombre}</strong>:
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {especialistas.map((esp) => {
                  const activo =
                    especialistaElegido.idEspecialista === esp.idEspecialista;
                  return (
                    <button
                      key={esp.idEspecialista}
                      type="button"
                      onClick={() => setEspecialistaElegido(esp)}
                      className={`p-4 rounded-sm border text-left flex items-start gap-3.5 transition-colors ${
                        activo
                          ? 'bg-fondoSecundario border-primario'
                          : 'bg-superficie border-bordeSutil hover:border-gray-400'
                      }`}
                    >
                      <div className="w-11 h-11 rounded-sm bg-primario text-white font-mono text-sm font-bold flex items-center justify-center shrink-0">
                        {esp.iniciales}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between gap-2">
                          <h3 className="text-sm font-bold text-tinta truncate">
                            {esp.nombre}
                          </h3>
                          {activo && (
                            <Check className="w-4 h-4 text-primario shrink-0" />
                          )}
                        </div>
                        <p className="text-xs text-tintaSuave mt-0.5">
                          {esp.cargo}
                        </p>
                        <span className="inline-block mt-2 text-[11px] font-mono text-tintaSuave bg-lienzo border border-gray-300 px-2 py-0.5 rounded-sm">
                          +{esp.experienciaAnos} años exp.
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* PASO 3: SELECCIÓN DE DÍA Y HORA */}
          {pasoActual === 3 && (
            <div className="space-y-5">
              {/* Tarjetas grandes de Día para pulsar cómodamente con el pulgar */}
              <div>
                <span className="flex items-center gap-1.5 text-xs font-mono uppercase tracking-wider text-tintaSuave mb-2.5">
                  <Calendar className="w-3.5 h-3.5 text-primario" />
                  <span>Selecciona el Día</span>
                </span>
                <div className="grid grid-cols-4 gap-2">
                  {fechasDisponibles.map((dia) => {
                    const esDiaActivo = dia.fechaISO === fechaElegida;
                    return (
                      <button
                        key={dia.fechaISO}
                        type="button"
                        onClick={() => {
                          setFechaElegida(dia.fechaISO);
                          setHoraElegida(null);
                        }}
                        className={`py-3 px-2 rounded-sm border flex flex-col items-center justify-center transition-colors ${
                          esDiaActivo
                            ? 'bg-primario text-white border-primario'
                            : 'bg-superficie text-tinta border-gray-300 hover:border-primario'
                        }`}
                      >
                        <span className="text-[10px] font-mono uppercase opacity-80">
                          {dia.nombreDiaCorto}
                        </span>
                        <span className="text-lg font-bold font-mono leading-tight mt-0.5">
                          {dia.numeroDia}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Cuadrícula de Horas Libres */}
              <div className="bg-superficie border border-bordeSutil rounded-sm p-4">
                <div className="flex items-center justify-between mb-3">
                  <span className="flex items-center gap-1.5 text-xs font-mono uppercase tracking-wider text-tintaSuave">
                    <Clock className="w-3.5 h-3.5 text-primario" />
                    <span>Horas para el {etiquetaFechaLegible}</span>
                  </span>
                  <span className="text-[11px] font-mono text-tintaSuave">
                    {franjasHorariasDelDia.filter((f) => f.estaDisponible).length}{' '}
                    libres
                  </span>
                </div>

                <div className="grid grid-cols-3 sm:grid-cols-5 gap-2.5">
                  {franjasHorariasDelDia.map((franja) => {
                    const seleccionada = horaElegida === franja.hora;
                    if (!franja.estaDisponible) {
                      return (
                        <button
                          key={franja.hora}
                          type="button"
                          disabled
                          className="py-3 text-xs font-mono bg-gray-100 text-gray-400 border border-gray-200 rounded-sm line-through cursor-not-allowed"
                        >
                          {franja.hora}
                        </button>
                      );
                    }
                    return (
                      <button
                        key={franja.hora}
                        type="button"
                        onClick={() => setHoraElegida(franja.hora)}
                        className={`py-3 text-xs font-mono font-semibold rounded-sm border transition-colors ${
                          seleccionada
                            ? 'bg-primario text-white border-primario'
                            : 'bg-lienzo text-tinta border-gray-300 hover:border-primario'
                        }`}
                      >
                        {franja.hora}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* PASO 4: DATOS DEL CLIENTE Y RESUMEN DE CITA */}
          {pasoActual === 4 && (
            <form
              id="formulario-paso-final-peluqueria"
              onSubmit={manejarEnvioReserva}
              className="space-y-4"
            >
              {/* Resumen de la Cita estilo Pase */}
              <div className="bg-superficie border border-bordeSutil rounded-sm p-4 space-y-2.5 text-xs">
                <div className="flex items-center justify-between pb-2 border-b border-bordeSutil">
                  <span className="font-mono uppercase text-tintaSuave">
                    Resumen de tu Reserva
                  </span>
                  <span className="font-mono font-bold text-sm text-tinta">
                    {servicioElegido.precioEuros.toFixed(2)} €
                  </span>
                </div>

                <div className="flex justify-between">
                  <span className="text-tintaSuave">Servicio:</span>
                  <span className="font-semibold text-tinta">
                    {servicioElegido.nombre} ({servicioElegido.duracionMinutos}{' '}
                    min)
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-tintaSuave">Profesional:</span>
                  <span className="font-medium text-tinta">
                    {especialistaElegido.nombre}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-tintaSuave">Fecha y hora:</span>
                  <span className="font-mono font-bold text-primario">
                    {etiquetaFechaLegible} · {horaElegida} h
                  </span>
                </div>
              </div>

              {/* Campos de Contacto Optimizados para Móvil */}
              <div className="bg-superficie border border-bordeSutil rounded-sm p-4 space-y-4">
                <div>
                  <label
                    htmlFor="input-nombre-movil"
                    className="block text-xs font-semibold text-tinta mb-1.5"
                  >
                    Tu Nombre y Apellidos
                  </label>
                  <input
                    id="input-nombre-movil"
                    type="text"
                    required
                    autoComplete="name"
                    placeholder="Ej: Alejandro Vega"
                    value={nombreCliente}
                    onChange={(e) => setNombreCliente(e.target.value)}
                    className="w-full px-3.5 py-3 text-sm bg-lienzo border border-gray-300 rounded-sm text-tinta focus:outline-none focus:border-primario"
                  />
                </div>

                <div>
                  <label
                    htmlFor="input-telefono-movil"
                    className="block text-xs font-semibold text-tinta mb-1.5"
                  >
                    Teléfono Móvil (Para recordatorio de cita)
                  </label>
                  <input
                    id="input-telefono-movil"
                    type="tel"
                    inputMode="tel"
                    required
                    autoComplete="tel"
                    placeholder="Ej: 612 345 678"
                    value={telefonoCliente}
                    onChange={(e) => setTelefonoCliente(e.target.value)}
                    className="w-full px-3.5 py-3 text-sm font-mono bg-lienzo border border-gray-300 rounded-sm text-tinta focus:outline-none focus:border-primario"
                  />
                </div>
              </div>
            </form>
          )}

          {/* PASO 5: PANTALLA FINAL DE ÉXITO */}
          {pasoActual === 5 && reservaCompletada && (
            <div className="bg-superficie border border-bordeSutil rounded-sm p-6 text-center space-y-5">
              <div className="w-12 h-12 rounded-sm bg-fondoSecundario border border-bordeTono text-primario mx-auto flex items-center justify-center">
                <CheckCircle2 className="w-6 h-6" />
              </div>

              <div>
                <span className="inline-block px-2.5 py-0.5 text-xs font-mono bg-lienzo border border-gray-300 rounded-sm text-tinta">
                  LOCALIZADOR: {reservaCompletada.idReserva}
                </span>
                <h3 className="text-xl font-bold text-tinta mt-2">
                  ¡Nos vemos el {etiquetaFechaLegible} a las{' '}
                  {reservaCompletada.hora} h!
                </h3>
                <p className="text-xs text-tintaSuave mt-1">
                  Hemos bloqueado tu hueco con {especialistaElegido.nombre}.
                </p>
              </div>

              <div className="bg-lienzo border border-bordeSutil rounded-sm p-4 text-left text-xs space-y-2">
                <div className="flex justify-between">
                  <span className="text-tintaSuave">Cliente:</span>
                  <span className="font-semibold text-tinta">
                    {reservaCompletada.nombreCliente}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-tintaSuave">Servicio:</span>
                  <span className="font-medium text-tinta">
                    {servicioElegido.nombre}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-tintaSuave">Importe a abonar en salón:</span>
                  <span className="font-mono font-bold text-tinta">
                    {servicioElegido.precioEuros.toFixed(2)} €
                  </span>
                </div>
              </div>

              <Boton variante="primario" anchoCompleto onClick={alCerrar}>
                Volver al Lookbook de la Peluquería
              </Boton>
            </div>
          )}
        </div>
      </div>

      {/* Barra Inferior Fija en Zona del Pulgar (Thumb-Zone) para Pasos 1 a 4 */}
      {pasoActual < 5 && (
        <footer className="bg-superficie border-t border-bordeSutil p-4 shrink-0">
          <div className="max-w-2xl mx-auto flex items-center justify-between gap-3">
            <div className="text-xs">
              <span className="block text-tintaSuave truncate max-w-[160px] sm:max-w-xs">
                {servicioElegido.nombre}
              </span>
              <span className="font-mono font-bold text-sm text-tinta">
                {servicioElegido.precioEuros.toFixed(2)} € ·{' '}
                {servicioElegido.duracionMinutos} min
              </span>
            </div>

            {pasoActual === 1 && (
              <Boton
                variante="primario"
                onClick={() => setPasoActual(2)}
                className="px-6"
              >
                <span>Elegir Profesional</span>
                <ArrowRight className="w-4 h-4" />
              </Boton>
            )}

            {pasoActual === 2 && (
              <Boton
                variante="primario"
                onClick={() => setPasoActual(3)}
                className="px-6"
              >
                <span>Ver Horas Libres</span>
                <ArrowRight className="w-4 h-4" />
              </Boton>
            )}

            {pasoActual === 3 && (
              <Boton
                variante="primario"
                disabled={!horaElegida}
                onClick={() => setPasoActual(4)}
                className="px-6"
              >
                <span>
                  {horaElegida
                    ? `Continuar (${horaElegida} h)`
                    : 'Elige una hora'}
                </span>
                <ArrowRight className="w-4 h-4" />
              </Boton>
            )}

            {pasoActual === 4 && (
              <Boton
                type="submit"
                form="formulario-paso-final-peluqueria"
                variante="primario"
                disabled={!nombreCliente.trim() || !telefonoCliente.trim()}
                className="px-6"
              >
                <UserCheck className="w-4 h-4" />
                <span>Confirmar Reserva</span>
              </Boton>
            )}
          </div>
        </footer>
      )}
    </div>
  );
};
