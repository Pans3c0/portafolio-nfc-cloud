import React, { useEffect, useRef, useState } from 'react';
import {
  Utensils,
  CalendarCheck,
  CheckCircle2,
  Star,
  MessageCircle,
  MapPin,
  Sparkles
} from 'lucide-react';
import {
  obtenerConfiguracionRestaurante,
  obtenerPlatosCarta,
  filtrarPlatosCarta,
  obtenerDatosTurnosRestaurante,
  crearReservaMesaEnMemoria
} from '../servicios/servicioRestaurante';
import {
  AlergenoAlimentario,
  CategoriaPlato,
  ConfiguracionRestaurante,
  PlatoCarta,
  ReservaMesaRegistrada
} from '../interfaces/restaurante';
import { aplicarTemaCliente } from '../../General/utilidades/aplicarTemaCliente';
import { actualizarMetadatosSEO } from '../../General/utilidades/actualizarMetadatosSEO';
import { Boton } from '../../General/componentes/Boton';
import { Modal } from '../../General/componentes/Modal';
import { EscaparateGastronomicoHero } from '../componentes/EscaparateGastronomicoHero';
import { FiltroCarta } from '../componentes/FiltroCarta';
import { TarjetaPlato } from '../componentes/TarjetaPlato';
import { FormularioReservaMesa } from '../componentes/FormularioReservaMesa';

/**
 * Vista principal del módulo comercial de Restaurante adaptada con los datos reales
 * de Bar & Café Ron Damón (C. Cataluña, 54, Gijón-Sur, Asturias).
 */
export const VistaRestaurante: React.FC = () => {
  const [configuracion] = useState<ConfiguracionRestaurante>(() =>
    obtenerConfiguracionRestaurante()
  );
  const [platos] = useState<PlatoCarta[]>(() => obtenerPlatosCarta());
  const [datosTurnos] = useState(() => obtenerDatosTurnosRestaurante());

  const [reservasMesa, setReservasMesa] = useState<ReservaMesaRegistrada[]>(
    () => datosTurnos.reservasMesaOcupadas
  );

  const [textoBusquedaPlato, setTextoBusquedaPlato] = useState<string>('');
  const [categoriaActiva, setCategoriaActiva] =
    useState<CategoriaPlato>('Todas');
  const [alergenosExcluidos, setAlergenosExcluidos] = useState<
    AlergenoAlimentario[]
  >([]);

  const [platoEnDetalleModal, setPlatoEnDetalleModal] =
    useState<PlatoCarta | null>(null);
  const [modalReservaAbierto, setModalReservaAbierto] =
    useState<boolean>(false);
  const [ultimaReservaConfirmada, setUltimaReservaConfirmada] =
    useState<ReservaMesaRegistrada | null>(null);

  const seccionCartaRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    aplicarTemaCliente(configuracion.colorBaseHSL);
    actualizarMetadatosSEO({
      tituloPagina: `${configuracion.nombreComercial} en Gijón · Carta Digital, Perritos XL, Burgers y Pizzas`,
      descripcionMeta: `${configuracion.nombreComercial} en ${configuracion.direccionFisica}. Valoración ${configuracion.valoracionMediaGoogle}★ (${configuracion.totalResenasGoogle} reseñas). Perritos Gigantes 24cm, Hamburguesas, Salchipapas Jirafales, Tequeños, Pizzas 28cm y Cócteles.`,
      jsonLdSchema: {
        '@context': 'https://schema.org',
        '@type': 'Restaurant',
        name: configuracion.nombreComercial,
        description: configuracion.descripcionCorta,
        telephone: configuracion.telefonoContacto,
        priceRange: configuracion.rangoPrecioPersona,
        servesCuisine: [
          'Hamburguesas',
          'Perritos Calientes Gigantes XL',
          'Pizzas',
          'Comida Venezolana y Latina',
          'Salchipapas',
          'Tequeños',
          'Cócteles'
        ],
        address: {
          '@type': 'PostalAddress',
          streetAddress: 'Calle Cataluña, 54, Gijón-Sur',
          addressLocality: 'Gijón',
          addressRegion: 'Asturias',
          postalCode: '33210',
          addressCountry: 'ES'
        },
        aggregateRating: {
          '@type': 'AggregateRating',
          ratingValue: String(configuracion.valoracionMediaGoogle),
          reviewCount: String(configuracion.totalResenasGoogle),
          bestRating: '5'
        }
      }
    });
  }, [configuracion]);

  const desplazarHaciaCartaProductos = () => {
    if (seccionCartaRef.current) {
      seccionCartaRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }
  };

  const manejarAlternarAlergeno = (alergeno: AlergenoAlimentario) => {
    setAlergenosExcluidos((previos) =>
      previos.includes(alergeno)
        ? previos.filter((item) => item !== alergeno)
        : [...previos, alergeno]
    );
  };

  const platosDestacadosPortada = platos.filter(
    (plato) => plato.destacadoEnPortada
  );

  const platosVisibles = filtrarPlatosCarta(
    platos,
    categoriaActiva,
    alergenosExcluidos,
    textoBusquedaPlato
  );

  const manejarNuevaReservaMesa = (
    datosEntrada: Omit<ReservaMesaRegistrada, 'idReserva'>
  ) => {
    const nuevaReserva = crearReservaMesaEnMemoria(datosEntrada);
    setReservasMesa((previas) => [...previas, nuevaReserva]);
    setModalReservaAbierto(false);
    setUltimaReservaConfirmada(nuevaReserva);
  };

  const construirUrlWhatsappPlato = (plato: PlatoCarta) => {
    const mensaje = `¡Hola ${configuracion.nombreComercial}! Vi en la Carta Digital el producto *${plato.nombre}* (${plato.precioEuros.toFixed(2).replace('.', ',')} €) y me gustaría pedirlo / consultar.`;
    return `https://wa.me/${configuracion.whatsappPedidos}?text=${encodeURIComponent(mensaje)}`;
  };

  const construirUrlWhatsappReserva = (reserva: ReservaMesaRegistrada) => {
    const mensaje = `¡Hola ${configuracion.nombreComercial}! Quiero confirmar mi reserva de mesa:\n• Localizador: ${reserva.idReserva}\n• Nombre: ${reserva.nombreCliente}\n• Fecha y Hora: ${reserva.fechaISO} a las ${reserva.hora} h\n• Personas: ${reserva.numeroComensales}\n• Zona: ${reserva.zona}`;
    return `https://wa.me/${configuracion.whatsappPedidos}?text=${encodeURIComponent(mensaje)}`;
  };

  return (
    <div className="min-h-screen bg-lienzo text-tinta pb-24">
      {/* 1. Cabecera Unificada con Don Ramón comiendo su Burger, Datos Reales de Gijón y Favoritos */}
      <EscaparateGastronomicoHero
        configuracion={configuracion}
        platosDestacados={platosDestacadosPortada}
        alPulsarMirarCarta={desplazarHaciaCartaProductos}
        alPulsarReservarMesa={() => setModalReservaAbierto(true)}
        alSeleccionarPlatoDirecto={(plato) => setPlatoEnDetalleModal(plato)}
      />

      {/* 2. Sección de Carta Digital Interactiva */}
      <main
        ref={seccionCartaRef}
        id="carta-digital-productos"
        className="max-w-5xl mx-auto px-4 sm:px-6 py-8 space-y-8 scroll-mt-4"
      >
        {/* Nota del Propietario sobre Cócteles (Mojito, Cosmopolitan, Margarita, Daiquiri, Mango Loco) */}
        <div className="bg-fondoSecundario border border-bordeTono rounded-sm p-3.5 sm:p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
          <div className="flex items-start sm:items-center gap-2 text-tinta">
            <Sparkles className="w-4 h-4 text-primario shrink-0 mt-0.5 sm:mt-0" />
            <span>{configuracion.notaCoctelesPropietario}</span>
          </div>
          <span className="font-mono text-[11px] text-primario font-semibold shrink-0">
            Abierto hasta las 01:30 / 02:30 AM
          </span>
        </div>

        {/* Buscador de Platos, Categorías y Exclusión de Alérgenos */}
        <FiltroCarta
          textoBusquedaPlato={textoBusquedaPlato}
          alCambiarBusquedaPlato={setTextoBusquedaPlato}
          categoriaActiva={categoriaActiva}
          alCambiarCategoria={setCategoriaActiva}
          alergenosExcluidos={alergenosExcluidos}
          alAlternarAlergeno={manejarAlternarAlergeno}
        />

        {/* Cuadrícula Visual de Platos de la Carta */}
        <section className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
            <div className="flex items-center gap-2">
              <Utensils className="w-4 h-4 text-primario" />
              <h2 className="text-base sm:text-lg font-black uppercase text-tinta">
                Carta Digital · {configuracion.nombreComercial}
              </h2>
            </div>
            <span className="text-xs font-mono text-tintaSuave">
              {platosVisibles.length} productos mostrados ·{' '}
              {configuracion.notaServicioMesa}
            </span>
          </div>

          {platosVisibles.length === 0 ? (
            <div className="bg-superficie border border-bordeSutil rounded-sm p-8 text-center space-y-3">
              <p className="text-sm font-medium text-tinta">
                No hay platos o bebidas que coincidan con los filtros seleccionados.
              </p>
              <Boton
                variante="contorno"
                tamano="pequeno"
                onClick={() => {
                  setTextoBusquedaPlato('');
                  setCategoriaActiva('Todas');
                  setAlergenosExcluidos([]);
                }}
              >
                Restablecer toda la carta
              </Boton>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
              {platosVisibles.map((plato) => (
                <TarjetaPlato
                  key={plato.id}
                  plato={plato}
                  alSeleccionarPlato={(item) => setPlatoEnDetalleModal(item)}
                />
              ))}
            </div>
          )}
        </section>

        {/* 3. Sección de Prueba Social Real (Reseñas de Google Maps 4,9 ★ · 433 reseñas) */}
        <section
          aria-label="Reseñas verificadas en Google Maps"
          className="pt-6 border-t border-bordeSutil space-y-4"
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-2">
                <Star className="w-4 h-4 fill-amber-400 text-amber-500" />
                <h2 className="text-base sm:text-lg font-black uppercase text-tinta">
                  Lo que dice la Vecindad en Google Maps (
                  {configuracion.valoracionMediaGoogle.toFixed(1).replace('.', ',')}{' '}
                  ★ · {configuracion.totalResenasGoogle} reseñas)
                </h2>
              </div>
              <p className="text-xs text-tintaSuave mt-0.5">
                C. Cataluña, 54, Gijón-Sur · Zona de bar, terraza exterior y barra
              </p>
            </div>

            <a
              href={configuracion.urlGoogleMaps}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 bg-superficie hover:bg-fondoSecundario text-tinta border border-gray-300 rounded-sm text-xs font-mono font-semibold inline-flex items-center gap-1.5 self-start sm:self-auto transition-colors"
            >
              <MapPin className="w-3.5 h-3.5 text-primario" />
              <span>Ver ficha en Google Maps</span>
            </a>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {configuracion.resenasDestacadas.map((resena, indice) => (
              <article
                key={indice}
                className="bg-superficie border border-bordeSutil rounded-sm p-4 flex flex-col justify-between space-y-3"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-0.5 text-amber-500">
                      {Array.from({ length: resena.estrellas }).map((_, i) => (
                        <Star
                          key={i}
                          className="w-3.5 h-3.5 fill-amber-400 text-amber-500"
                        />
                      ))}
                    </div>
                    <span className="text-[10px] font-mono text-tintaSuave">
                      {resena.etiqueta}
                    </span>
                  </div>
                  <p className="text-xs text-tinta leading-relaxed italic">
                    &ldquo;{resena.comentario}&rdquo;
                  </p>
                </div>
                <span className="text-[11px] font-mono font-bold text-tinta pt-2 border-t border-gray-100">
                  — {resena.autor}
                </span>
              </article>
            ))}
          </div>
        </section>
      </main>

      {/* Barra Estratégica Fija en Móvil (Carta, Reserva y WhatsApp Directo) */}
      <div className="fixed bottom-0 inset-x-0 z-40 bg-tinta/95 border-t border-gray-800 p-2.5 sm:hidden flex items-center gap-2">
        <button
          type="button"
          onClick={desplazarHaciaCartaProductos}
          className="flex-1 py-3 px-2.5 bg-primario text-white font-black text-xs uppercase tracking-wider rounded-sm inline-flex items-center justify-center gap-1.5"
        >
          <Utensils className="w-3.5 h-3.5" />
          <span>Carta ({platos.length})</span>
        </button>
        <button
          type="button"
          onClick={() => setModalReservaAbierto(true)}
          className="py-3 px-3 bg-white text-tinta font-bold text-xs uppercase tracking-wider rounded-sm inline-flex items-center justify-center gap-1.5"
        >
          <CalendarCheck className="w-3.5 h-3.5 text-primario" />
          <span>Reservar</span>
        </button>
        <a
          href={`https://wa.me/${configuracion.whatsappPedidos}`}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Pedir por WhatsApp"
          className="py-3 px-3 bg-emerald-700 text-white font-bold text-xs uppercase tracking-wider rounded-sm inline-flex items-center justify-center gap-1"
        >
          <MessageCircle className="w-3.5 h-3.5" />
          <span>WhatsApp</span>
        </a>
      </div>

      {/* Modal de Ficha Ampliada de un Plato o Bebida */}
      <Modal
        estaAbierto={platoEnDetalleModal !== null}
        alCerrar={() => setPlatoEnDetalleModal(null)}
        titulo={platoEnDetalleModal?.nombre ?? ''}
        subtitulo={platoEnDetalleModal?.categoria ?? ''}
      >
        {platoEnDetalleModal && (
          <div className="space-y-4 text-xs">
            <div
              className={`aspect-[16/10] w-full overflow-hidden rounded-sm border border-gray-300 ${
                platoEnDetalleModal.categoria === 'Bebidas'
                  ? 'bg-white p-4'
                  : 'bg-gray-100'
              }`}
            >
              <img
                src={platoEnDetalleModal.urlImagen}
                alt={platoEnDetalleModal.nombre}
                className={`w-full h-full ${
                  platoEnDetalleModal.categoria === 'Bebidas'
                    ? 'object-contain'
                    : 'object-cover'
                }`}
              />
            </div>

            <div className="flex items-center justify-between bg-lienzo border border-bordeSutil p-3 rounded-sm">
              <span className="text-tintaSuave font-mono uppercase">
                Precio (IVA incl.)
              </span>
              <span className="text-base font-mono font-bold text-tinta">
                {platoEnDetalleModal.precioEuros.toFixed(2).replace('.', ',')} €
              </span>
            </div>

            <p className="text-xs sm:text-sm text-tinta leading-relaxed">
              {platoEnDetalleModal.descripcionIngredientes}
            </p>

            {platoEnDetalleModal.alergenos.length > 0 && (
              <div className="pt-2 border-t border-bordeSutil flex items-center justify-between">
                <span className="text-tintaSuave font-mono">Alérgenos:</span>
                <span className="font-mono font-semibold text-tinta">
                  {platoEnDetalleModal.alergenos.join(', ')}
                </span>
              </div>
            )}

            <div className="flex flex-wrap justify-end gap-2 pt-2">
              <Boton
                variante="contorno"
                onClick={() => setPlatoEnDetalleModal(null)}
              >
                Seguir viendo la carta
              </Boton>
              <a
                href={construirUrlWhatsappPlato(platoEnDetalleModal)}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white font-semibold text-xs rounded-sm inline-flex items-center gap-1.5 transition-colors"
              >
                <MessageCircle className="w-3.5 h-3.5" />
                <span>Pedir por WhatsApp</span>
              </a>
              <Boton
                variante="primario"
                onClick={() => {
                  setPlatoEnDetalleModal(null);
                  setModalReservaAbierto(true);
                }}
              >
                Reservar Mesa
              </Boton>
            </div>
          </div>
        )}
      </Modal>

      {/* Modal con Formulario de Reserva de Mesa */}
      <Modal
        estaAbierto={modalReservaAbierto}
        alCerrar={() => setModalReservaAbierto(false)}
        titulo={`Reservar Mesa en ${configuracion.nombreComercial}`}
        subtitulo="C. Cataluña, 54 (Gijón-Sur) · Salón, Terraza o Barra"
      >
        <FormularioReservaMesa
          fechasDisponibles={datosTurnos.fechasDisponibles}
          turnosBase={datosTurnos.turnosBase}
          reservasOcupadas={reservasMesa}
          capacidadMaxima={configuracion.capacidadMaximaPorReserva}
          alConfirmarReserva={manejarNuevaReservaMesa}
        />
      </Modal>

      {/* Modal de Confirmación de Reserva Registrada (Con envío directo al WhatsApp del local) */}
      <Modal
        estaAbierto={ultimaReservaConfirmada !== null}
        alCerrar={() => setUltimaReservaConfirmada(null)}
        titulo="Reserva de Mesa Registrada"
        subtitulo={`Localizador: ${ultimaReservaConfirmada?.idReserva ?? ''}`}
      >
        {ultimaReservaConfirmada && (
          <div className="space-y-4 text-xs">
            <div className="flex items-start gap-3 p-3 bg-fondoSecundario border border-bordeTono rounded-sm">
              <CheckCircle2 className="w-5 h-5 text-primario shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-tinta">
                  Mesa para {ultimaReservaConfirmada.numeroComensales}{' '}
                  comensales en {configuracion.nombreComercial}.
                </p>
                <p className="text-tintaSuave mt-0.5">
                  Turno de las {ultimaReservaConfirmada.hora} h en{' '}
                  {ultimaReservaConfirmada.zona}.
                </p>
              </div>
            </div>

            <div className="bg-lienzo border border-bordeSutil rounded-sm p-4 space-y-2">
              <div className="flex justify-between">
                <span className="text-tintaSuave">Titular:</span>
                <span className="font-medium text-tinta">
                  {ultimaReservaConfirmada.nombreCliente}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-tintaSuave">Ubicación:</span>
                <span className="font-medium text-tinta">
                  {ultimaReservaConfirmada.zona}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-tintaSuave">Fecha y Hora:</span>
                <span className="font-mono font-semibold text-tinta">
                  {ultimaReservaConfirmada.fechaISO} ·{' '}
                  {ultimaReservaConfirmada.hora} h
                </span>
              </div>
            </div>

            <div className="flex flex-wrap justify-end gap-2">
              <Boton
                variante="contorno"
                onClick={() => setUltimaReservaConfirmada(null)}
              >
                Volver a la Carta
              </Boton>
              <a
                href={construirUrlWhatsappReserva(ultimaReservaConfirmada)}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white font-semibold text-xs rounded-sm inline-flex items-center gap-1.5 transition-colors"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Enviar confirmación por WhatsApp al local</span>
              </a>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};
