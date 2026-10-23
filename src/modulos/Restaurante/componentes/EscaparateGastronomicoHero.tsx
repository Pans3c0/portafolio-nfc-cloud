import React from 'react';
import {
  Flame,
  UtensilsCrossed,
  CalendarCheck,
  MapPin,
  Clock,
  Phone,
  Star,
  MessageCircle,
  ExternalLink
} from 'lucide-react';
import {
  ConfiguracionRestaurante,
  PlatoCarta
} from '../interfaces/restaurante';

export interface PropiedadesEscaparateGastronomicoHero {
  configuracion: ConfiguracionRestaurante;
  platosDestacados: PlatoCarta[];
  alPulsarMirarCarta: () => void;
  alPulsarReservarMesa: () => void;
  alSeleccionarPlatoDirecto: (plato: PlatoCarta) => void;
}

/**
 * Cabecera y escaparate principal de Bar & Café Ron Damón (Gijón-Sur).
 *
 * MENTORING JUNIOR - CONVERSIÓN LOCAL + GOOGLE MAPS:
 * 1. Muestra de inmediato la prueba social real de Google Maps (`4,9 ★ · 433 reseñas`)
 *    y el rango de precio (`10-20 € por persona`), generando confianza instantánea.
 * 2. Integra la ilustración de Don Ramón comiendo una burger sobre tarjeta blanca limpia.
 * 3. Conecta con el flujo real del negocio: Ver Carta Digital, Reservar Mesa o Pedir por WhatsApp.
 */
export const EscaparateGastronomicoHero: React.FC<
  PropiedadesEscaparateGastronomicoHero
> = ({
  configuracion,
  platosDestacados,
  alPulsarMirarCarta,
  alPulsarReservarMesa,
  alSeleccionarPlatoDirecto
}) => {
  const urlWhatsappDirecto = `https://wa.me/${configuracion.whatsappPedidos}?text=${encodeURIComponent(
    `¡Hola ${configuracion.nombreComercial}! Estoy viendo vuestra Carta Digital y quería hacer un pedido / consulta.`
  )}`;

  return (
    <header className="bg-superficie border-b border-bordeSutil">
      {/* Cinta Superior con Ubicación Gijón-Sur, Horario Nocturno y Nota Google */}
      <div className="bg-primario text-white px-4 py-1.5 text-[11px] font-mono uppercase tracking-widest text-center flex items-center justify-center gap-2">
        <Flame className="w-3.5 h-3.5 shrink-0" />
        <span className="truncate">{configuracion.etiquetaPromoSuperior}</span>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6 sm:py-10 space-y-6 sm:space-y-8">
        {/* Bloque Principal: Identidad + Don Ramón comiendo su Burger */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-center">
          {/* Columna Izquierda: Datos reales de Google Maps, Titular y Botones (7 cols en PC) */}
          <div className="lg:col-span-7 space-y-4 text-left order-2 lg:order-1">
            {/* Insignia de Reseñas Google Maps + Rango Precio + Modalidades */}
            <div className="flex flex-wrap items-center gap-2">
              <a
                href={configuracion.urlGoogleMaps}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-amber-50 border border-amber-300 rounded-sm text-xs font-mono font-bold text-tinta hover:border-primario transition-colors"
              >
                <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-500" />
                <span>
                  {configuracion.valoracionMediaGoogle.toFixed(1).replace('.', ',')}
                </span>
                <span className="text-tintaSuave font-normal">
                  ({configuracion.totalResenasGoogle} reseñas en Google)
                </span>
              </a>

              <span className="px-2.5 py-1 bg-lienzo border border-gray-300 rounded-sm text-xs font-mono text-tinta">
                {configuracion.rangoPrecioPersona} / persona
              </span>

              <div className="flex flex-wrap items-center gap-1">
                {configuracion.modalidadesServicio.map((modalidad) => (
                  <span
                    key={modalidad}
                    className="px-2 py-0.5 bg-fondoSecundario border border-bordeTono rounded-sm text-[10px] font-mono uppercase text-primario font-semibold"
                  >
                    {modalidad}
                  </span>
                ))}
              </div>
            </div>

            <div className="space-y-1.5">
              <h1 className="text-3xl sm:text-5xl font-black uppercase tracking-tight text-tinta leading-[1.05]">
                {configuracion.manifiestoTitular}{' '}
                <span className="text-primario block sm:inline">
                  {configuracion.manifiestoSubtitulo}
                </span>
              </h1>
              <p className="text-xs sm:text-sm text-tintaSuave max-w-xl leading-relaxed pt-1">
                {configuracion.descripcionCorta}
              </p>
            </div>

            {/* Dirección en Gijón-Sur, Horario hasta la madrugada y Teléfono */}
            <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-tintaSuave pt-1">
              <a
                href={configuracion.urlGoogleMaps}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 hover:text-primario underline-offset-2 hover:underline font-medium text-tinta"
              >
                <MapPin className="w-3.5 h-3.5 text-primario shrink-0" />
                <span>{configuracion.direccionFisica}</span>
                <ExternalLink className="w-3 h-3 text-tintaSuave" />
              </a>
              <span className="inline-flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-primario shrink-0" />
                {configuracion.horarioAtencion}
              </span>
              <a
                href={`tel:${configuracion.telefonoContacto.replace(/\s+/g, '')}`}
                className="inline-flex items-center gap-1.5 font-mono font-semibold text-tinta hover:text-primario"
              >
                <Phone className="w-3.5 h-3.5 text-primario shrink-0" />
                {configuracion.telefonoContacto}
              </a>
            </div>

            {/* Botones de Acción Estratégica (Ver Carta, Reservar Mesa y Pedir por WhatsApp) */}
            <div className="pt-2 flex flex-col sm:flex-row flex-wrap items-stretch sm:items-center gap-2.5">
              <button
                type="button"
                onClick={alPulsarMirarCarta}
                className="px-5 py-3.5 bg-primario hover:bg-primarioHover active:bg-primarioActivo text-white font-black text-xs sm:text-sm uppercase tracking-wider rounded-sm inline-flex items-center justify-center gap-2 transition-colors"
              >
                <UtensilsCrossed className="w-4 h-4" />
                <span>{configuracion.textoBotonMirarCarta}</span>
              </button>

              <button
                type="button"
                onClick={alPulsarReservarMesa}
                className="px-4 py-3.5 bg-lienzo hover:bg-fondoSecundario text-tinta border border-gray-300 font-bold text-xs sm:text-sm uppercase tracking-wider rounded-sm inline-flex items-center justify-center gap-2 transition-colors"
              >
                <CalendarCheck className="w-4 h-4 text-primario" />
                <span>Reservar Mesa</span>
              </button>

              <a
                href={urlWhatsappDirecto}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-3.5 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs sm:text-sm uppercase tracking-wider rounded-sm inline-flex items-center justify-center gap-2 transition-colors"
              >
                <MessageCircle className="w-4 h-4" />
                <span>WhatsApp Pedidos</span>
              </a>
            </div>
          </div>

          {/* Columna Derecha: Ilustración de Don Ramón comiendo su Burger (5 cols en PC) */}
          <div className="lg:col-span-5 order-1 lg:order-2">
            <div className="bg-white border border-bordeSutil rounded-sm p-3 sm:p-4 flex flex-col items-center justify-center">
              <div className="w-full max-w-[320px] sm:max-w-[380px] lg:max-w-full aspect-[16/10] flex items-center justify-center overflow-hidden bg-white">
                <img
                  src={configuracion.urlImagenMascota}
                  alt={`${configuracion.nombreComercial} - Don Ramón disfrutando su burger`}
                  className="w-full h-full object-contain object-center"
                />
              </div>
              <div className="w-full pt-2.5 mt-2 border-t border-gray-100 flex items-center justify-between text-[11px] font-mono text-tintaSuave">
                <span className="font-bold text-tinta uppercase">
                  {configuracion.nombreComercial} · Gijón
                </span>
                <span className="text-primario font-semibold">
                  ¡Aquí te atendemos como en casa!
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Tira Limpia de Platos Destacados en Google Maps */}
        <div className="pt-5 border-t border-bordeSutil space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono uppercase tracking-wider font-bold text-tinta">
              Platos Más Populares en Google Maps (Pulsa para ver detalle)
            </span>
            <button
              type="button"
              onClick={alPulsarMirarCarta}
              className="text-xs font-mono text-primario hover:underline font-semibold"
            >
              Ver los 13 productos ↓
            </button>
          </div>

          <div className="flex sm:grid sm:grid-cols-3 md:grid-cols-6 gap-3 overflow-x-auto ocultar-barra-scroll pb-1">
            {platosDestacados.slice(0, 6).map((plato) => (
              <button
                key={plato.id}
                type="button"
                onClick={() => alSeleccionarPlatoDirecto(plato)}
                className="group shrink-0 w-36 sm:w-auto text-left bg-lienzo border border-bordeSutil hover:border-primario rounded-sm overflow-hidden transition-colors flex flex-col justify-between"
              >
                <div className="relative aspect-[4/3] w-full overflow-hidden bg-gray-100 border-b border-bordeSutil">
                  <img
                    src={plato.urlImagen}
                    alt={plato.nombre}
                    loading="lazy"
                    className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-300"
                  />
                  <span className="absolute bottom-1.5 right-1.5 px-1.5 py-0.5 text-[10px] font-mono font-bold bg-tinta/90 text-white rounded-sm">
                    {plato.precioEuros.toFixed(2).replace('.', ',')} €
                  </span>
                </div>
                <div className="p-2">
                  <span className="block text-[9px] font-mono uppercase text-tintaSuave truncate">
                    {plato.categoria}
                  </span>
                  <span className="block text-[11px] font-bold text-tinta line-clamp-1 uppercase mt-0.5">
                    {plato.nombre}
                  </span>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </header>
  );
};
