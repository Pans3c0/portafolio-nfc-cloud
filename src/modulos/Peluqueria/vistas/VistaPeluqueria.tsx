import React, { useEffect, useState } from 'react';
import { CalendarCheck, Scissors, Clock, ShieldCheck } from 'lucide-react';
import {
  obtenerConfiguracionPeluqueria,
  obtenerGaleriaCortesPeluqueria,
  obtenerServiciosPeluqueria,
  obtenerDatosInicialesAgenda,
  calcularDisponibilidadHoraria,
  crearReservaEnMemoria
} from '../servicios/servicioPeluqueria';
import {
  ConfiguracionPeluqueria,
  CorteMuestraGaleria,
  ReservaRegistradaPeluqueria,
  ServicioPeluqueria
} from '../interfaces/peluqueria';
import { aplicarTemaCliente } from '../../General/utilidades/aplicarTemaCliente';
import { actualizarMetadatosSEO } from '../../General/utilidades/actualizarMetadatosSEO';
import { CabeceraNegocio } from '../../General/componentes/CabeceraNegocio';
import { Boton } from '../../General/componentes/Boton';
import { GaleriaCortesPeluqueria } from '../componentes/GaleriaCortesPeluqueria';
import { AsistenteReservaPantallaCompleta } from '../componentes/AsistenteReservaPantallaCompleta';

/**
 * Vista principal del módulo comercial de Peluquería.
 *
 * MENTORING JUNIOR - EXPERIENCIA MOBILE-FIRST PARA ETIQUETAS NFC:
 * 1. Al entrar, el cliente ve el Lookbook visual de cortes de pelo (`GaleriaCortesPeluqueria`).
 * 2. Tiene un botón de llamada a la acción tanto en la cabecera como fijo en la barra
 *    inferior del móvil que lanza `AsistenteReservaPantallaCompleta`, guiándole paso
 *    a paso a pantalla completa (`100dvh`) sin distracciones.
 */
export const VistaPeluqueria: React.FC = () => {
  const [configuracion] = useState<ConfiguracionPeluqueria>(() =>
    obtenerConfiguracionPeluqueria()
  );
  const [galeriaCortes] = useState<CorteMuestraGaleria[]>(() =>
    obtenerGaleriaCortesPeluqueria()
  );
  const [servicios] = useState<ServicioPeluqueria[]>(() =>
    obtenerServiciosPeluqueria()
  );
  const [datosAgenda] = useState(() => obtenerDatosInicialesAgenda());

  const [reservasOcupadas, setReservasOcupadas] = useState<
    ReservaRegistradaPeluqueria[]
  >(() => datosAgenda.reservasOcupadas);

  const [asistenteAbierto, setAsistenteAbierto] = useState<boolean>(false);
  const [servicioPreseleccionado, setServicioPreseleccionado] =
    useState<ServicioPeluqueria>(servicios[0]);
  const [estiloInspiracion, setEstiloInspiracion] = useState<string | null>(
    null
  );

  useEffect(() => {
    aplicarTemaCliente(configuracion.colorBaseHSL);
    actualizarMetadatosSEO({
      tituloPagina: `${configuracion.nombreComercial} · Reserva de Citas Online`,
      descripcionMeta: configuracion.descripcionCorta
    });
  }, [configuracion]);

  const abrirReservaGeneral = () => {
    setEstiloInspiracion(null);
    setServicioPreseleccionado(servicios[0]);
    setAsistenteAbierto(true);
  };

  const abrirReservaDesdeCorte = (
    idServicioAsociado: string,
    nombreEstilo: string
  ) => {
    const servicioEncontrado =
      servicios.find((s) => s.id === idServicioAsociado) ?? servicios[0];
    setServicioPreseleccionado(servicioEncontrado);
    setEstiloInspiracion(nombreEstilo);
    setAsistenteAbierto(true);
  };

  const manejarConfirmacionReserva = (
    datosEntrada: Omit<ReservaRegistradaPeluqueria, 'idReserva'>
  ): ReservaRegistradaPeluqueria => {
    const nuevaReserva = crearReservaEnMemoria(datosEntrada);
    setReservasOcupadas((previas) => [...previas, nuevaReserva]);
    return nuevaReserva;
  };

  return (
    <div className="min-h-screen bg-lienzo text-tinta pb-24">
      <CabeceraNegocio
        configuracion={configuracion}
        accionDerecha={
          <Boton
            variante="primario"
            tamano="grande"
            onClick={abrirReservaGeneral}
          >
            <CalendarCheck className="w-4 h-4" />
            <span>{configuracion.textoBotonPrincipalReserva}</span>
          </Boton>
        }
      />

      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-8 space-y-10">
        {/* Banda Destacada de Reserva Rápida Móvil */}
        <section className="bg-superficie border border-bordeSutil rounded-sm p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-primario">
              <Clock className="w-3.5 h-3.5" />
              <span>Reserva en menos de 30 segundos</span>
            </div>
            <h2 className="text-base sm:text-lg font-bold text-tinta">
              ¿Listo para tu próximo cambio de imagen?
            </h2>
            <p className="text-xs text-tintaSuave">
              {configuracion.notaPoliticaCancelacion}
            </p>
          </div>

          <Boton
            variante="primario"
            onClick={abrirReservaGeneral}
            className="shrink-0"
          >
            <Scissors className="w-4 h-4" />
            <span>Iniciar Reserva Paso a Paso</span>
          </Boton>
        </section>

        {/* Galería de Cortes de Pelo (Lookbook personalizable por el propietario) */}
        <GaleriaCortesPeluqueria
          cortes={galeriaCortes}
          servicios={servicios}
          subtituloSeccion={configuracion.subtituloGaleriaCortes}
          alElegirCorteParaReserva={abrirReservaDesdeCorte}
        />

        {/* Resumen de Tarifas Transparentes */}
        <section className="bg-superficie border border-bordeSutil rounded-sm p-5 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-bordeSutil">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-primario" />
              <h2 className="text-base font-bold text-tinta">
                Tarifas y Servicios del Salón
              </h2>
            </div>
            <span className="text-xs font-mono text-tintaSuave">
              IVA Incluido
            </span>
          </div>

          <div className="divide-y divide-bordeSutil">
            {servicios.map((servicio) => (
              <div
                key={servicio.id}
                className="py-3 flex items-center justify-between gap-4 text-xs sm:text-sm"
              >
                <div>
                  <span className="font-semibold text-tinta">
                    {servicio.nombre}
                  </span>
                  <span className="block text-xs text-tintaSuave">
                    {servicio.duracionMinutos} min · {servicio.descripcion}
                  </span>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  <span className="font-mono font-bold text-tinta">
                    {servicio.precioEuros.toFixed(2)} €
                  </span>
                  <Boton
                    variante="contorno"
                    tamano="pequeno"
                    onClick={() => {
                      setServicioPreseleccionado(servicio);
                      setEstiloInspiracion(null);
                      setAsistenteAbierto(true);
                    }}
                  >
                    Reservar
                  </Boton>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>

      {/* Barra Fija Inferior en Móvil para Lanzar la Reserva a Pantalla Completa */}
      <div className="fixed bottom-0 inset-x-0 z-40 bg-superficie/95 border-t border-gray-300 p-3 sm:hidden">
        <Boton
          variante="primario"
          anchoCompleto
          tamano="grande"
          onClick={abrirReservaGeneral}
        >
          <CalendarCheck className="w-4 h-4" />
          <span>{configuracion.textoBotonPrincipalReserva} (Paso a Paso)</span>
        </Boton>
      </div>

      {/* Asistente Paso a Paso a Pantalla Completa (100dvh) */}
      <AsistenteReservaPantallaCompleta
        estaAbierto={asistenteAbierto}
        alCerrar={() => setAsistenteAbierto(false)}
        nombreNegocio={configuracion.nombreComercial}
        servicios={servicios}
        especialistas={configuracion.especialistasActivos}
        fechasDisponibles={datosAgenda.fechasDisponibles}
        servicioInicialSeleccionado={servicioPreseleccionado}
        estiloInspiracionOpcional={estiloInspiracion}
        obtenerFranjasPorFecha={(fechaISO) =>
          calcularDisponibilidadHoraria(
            fechaISO,
            datosAgenda.franjasHorariasBase,
            reservasOcupadas
          )
        }
        alConfirmarReservaFinal={manejarConfirmacionReserva}
      />
    </div>
  );
};
