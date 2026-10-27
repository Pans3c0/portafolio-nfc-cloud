import React, { useEffect, useRef, useState } from 'react';
import { ChevronLeft, ChevronRight, Hand } from 'lucide-react';
import {
  ConfiguracionCatalogo3D,
  Figura3D,
  FiltrosActivosCatalogo3D
} from '../interfaces/figura3D';
import {
  obtenerConfiguracionCatalogo3D,
  obtenerFiguras3D,
  filtrarYOrdenarCatalogo3D,
  agruparEnVistasDeCuatro
} from '../servicios/servicioCatalogo3D';
import { FiltroMateriales } from '../componentes/FiltroMateriales';
import { TarjetaFigura3D } from '../componentes/TarjetaFigura3D';
import { ModalDetalleFigura3D } from '../componentes/ModalDetalleFigura3D';
import { aplicarTemaCliente } from '../../General/utilidades/aplicarTemaCliente';
import { actualizarMetadatosSEO } from '../../General/utilidades/actualizarMetadatosSEO';

const FILTROS_INICIALES: FiltrosActivosCatalogo3D = {
  textoBusqueda: '',
  categoria: 'Todas',
  soloDisponibles: false,
  ordenarPor: 'destacados'
};

/**
 * Icono decorativo de estrella de 4 puntas fiel al encabezado editorial de referencia.
 */
const EstrellaEditorialSVG: React.FC<{ className?: string }> = ({
  className = 'w-5 h-5'
}) => (
  <svg
    viewBox="0 0 24 24"
    fill="currentColor"
    className={className}
    aria-hidden="true"
  >
    <path d="M12 1L14.6 9.4L23 12L14.6 14.6L12 23L9.4 14.6L1 12L9.4 9.4L12 1Z" />
  </svg>
);

/**
 * Vista principal del Catálogo de Objetos 3D con estética editorial Crema / Topo,
 * buscador y filtros en tiempo real, paginación táctil deslizable de 4 en 4 (2×2)
 * y modal con selector de variantes (Pack vs. 1 Unidad) + suplemento NFC.
 */
export const VistaCatalogo3D: React.FC = () => {
  const [configuracion] = useState<ConfiguracionCatalogo3D>(() =>
    obtenerConfiguracionCatalogo3D()
  );
  const [listaFiguras] = useState<Figura3D[]>(() => obtenerFiguras3D());
  const [filtros, setFiltros] =
    useState<FiltrosActivosCatalogo3D>(FILTROS_INICIALES);
  const [indicePaginaActiva, setIndicePaginaActiva] = useState<number>(0);
  const [figuraSeleccionada, setFiguraSeleccionada] =
    useState<Figura3D | null>(null);

  const contenedorCarruselRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    aplicarTemaCliente(configuracion.colorBaseHSL);
    actualizarMetadatosSEO({
      tituloPagina: `${configuracion.nombreComercial} · Catálogo de Objetos 3D`,
      descripcionMeta: configuracion.descripcionCorta
    });
  }, [configuracion]);

  const figurasFiltradas = filtrarYOrdenarCatalogo3D(listaFiguras, filtros);
  const paginasDeCuatro = agruparEnVistasDeCuatro(
    figurasFiltradas,
    configuracion.itemsPorPaginaVista
  );

  const manejarActualizacionFiltros = (
    nuevosFiltros: FiltrosActivosCatalogo3D
  ) => {
    setFiltros(nuevosFiltros);
    setIndicePaginaActiva(0);
    if (contenedorCarruselRef.current) {
      contenedorCarruselRef.current.scrollTo({ left: 0, behavior: 'smooth' });
    }
  };

  const manejarLimpiarFiltros = () => {
    manejarActualizacionFiltros(FILTROS_INICIALES);
  };

  const irAPaginaDeCuatro = (nuevoIndice: number) => {
    const totalPaginas = paginasDeCuatro.length;
    if (nuevoIndice < 0 || nuevoIndice >= totalPaginas) return;

    setIndicePaginaActiva(nuevoIndice);
    const contenedor = contenedorCarruselRef.current;
    if (contenedor) {
      const anchoVista = contenedor.clientWidth;
      contenedor.scrollTo({
        left: anchoVista * nuevoIndice,
        behavior: 'smooth'
      });
    }
  };

  const manejarScrollCarrusel = () => {
    const contenedor = contenedorCarruselRef.current;
    if (!contenedor || contenedor.clientWidth === 0) return;

    const paginaCalculada = Math.round(
      contenedor.scrollLeft / contenedor.clientWidth
    );
    if (
      paginaCalculada !== indicePaginaActiva &&
      paginaCalculada >= 0 &&
      paginaCalculada < paginasDeCuatro.length
    ) {
      setIndicePaginaActiva(paginaCalculada);
    }
  };

  return (
    <div className="min-h-screen bg-[#efebe1] text-[#4a4238] py-4 sm:py-8 px-2 sm:px-6">
      <div className="max-w-3xl mx-auto bg-[#efebe1] rounded-2xl border border-[#dcd3c4] pt-6 sm:pt-10 pb-8 px-3 sm:px-8">
        {/* Encabezado Editorial: "✦ Conocé nuestro ✦" + "CATÁLOGO" */}
        <header className="text-center mb-6 sm:mb-8 select-none">
          <div className="inline-flex items-center justify-center gap-3 sm:gap-5 text-[#9c8e7c]">
            <EstrellaEditorialSVG className="w-4 h-4 sm:w-5 sm:h-5 -mt-3" />
            <span className="font-manuscrita text-3xl sm:text-5xl text-[#7a6e5d] leading-none">
              {configuracion.subtituloEditorial}
            </span>
            <EstrellaEditorialSVG className="w-4 h-4 sm:w-5 sm:h-5 -mt-3" />
          </div>

          <h1 className="font-serifCatalogo text-4xl sm:text-6xl md:text-7xl font-extrabold uppercase tracking-wider text-[#b0a392] -mt-1 sm:-mt-2">
            {configuracion.tituloEditorial}
          </h1>

          <p className="text-[11px] sm:text-xs font-medium text-[#7e7160] mt-2 max-w-lg mx-auto">
            {configuracion.eslogan}
          </p>

          {/* Banner de contacto directo para encargos personalizados */}
          <div className="mt-4 inline-flex items-center gap-2 px-3.5 py-1.5 bg-white/90 border border-[#cfc4b4] rounded-full text-xs text-[#5c5040] shadow-2xs">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>Pedidos directos y encargos 3D personalizados</span>
            <span className="text-[#8f816d] font-bold">· WhatsApp: {configuracion.telefonoContacto}</span>
          </div>
        </header>

        {/* Buscador y Filtros orientados a cliente final */}
        <div className="mb-6">
          <FiltroMateriales
            filtros={filtros}
            alActualizarFiltros={manejarActualizacionFiltros}
            alLimpiarFiltros={manejarLimpiarFiltros}
            totalResultados={figurasFiltradas.length}
            totalPaginasDeCuatro={paginasDeCuatro.length}
          />
        </div>

        {/* Controles Superiores de Deslizamiento 4 en 4 */}
        {paginasDeCuatro.length > 0 && (
          <div className="flex items-center justify-between gap-2 mb-3 px-1">
            <div className="inline-flex items-center gap-1.5 text-[11px] text-[#7a6e5d]">
              <Hand className="w-3.5 h-3.5 text-[#9c8e7c]" />
              <span>
                Desliza hacia la izquierda para ver de 4 en 4 ·{' '}
                <strong className="text-[#4a4238]">
                  Vista {indicePaginaActiva + 1} de {paginasDeCuatro.length}
                </strong>
              </span>
            </div>

            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => irAPaginaDeCuatro(indicePaginaActiva - 1)}
                disabled={indicePaginaActiva === 0}
                className="p-1.5 rounded-sm bg-white border border-[#cfc4b4] text-[#5c5246] hover:border-[#8f816d] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                aria-label="Ver los 4 productos anteriores"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => irAPaginaDeCuatro(indicePaginaActiva + 1)}
                disabled={indicePaginaActiva >= paginasDeCuatro.length - 1}
                className="p-1.5 rounded-sm bg-white border border-[#cfc4b4] text-[#5c5246] hover:border-[#8f816d] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                aria-label="Ver los 4 productos siguientes"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* Carrusel Horizontal Deslizable de 4 en 4 (Cuadrícula 2×2 por cada vista) */}
        {paginasDeCuatro.length === 0 ? (
          <div className="bg-white/80 border border-[#cfc4b4] rounded-md p-10 text-center space-y-3 my-4">
            <p className="text-sm font-semibold text-[#5a5043]">
              No hemos encontrado productos que coincidan con tu búsqueda.
            </p>
            <button
              type="button"
              onClick={manejarLimpiarFiltros}
              className="px-4 py-2 text-xs font-medium bg-[#8f816d] text-white rounded-full hover:bg-[#7d705e] transition-colors"
            >
              Ver todo el catálogo
            </button>
          </div>
        ) : (
          <div
            ref={contenedorCarruselRef}
            onScroll={manejarScrollCarrusel}
            className="flex overflow-x-auto snap-x snap-mandatory scroll-smooth ocultar-barra-scroll -mx-1 px-1"
          >
            {paginasDeCuatro.map((grupoDeCuatro, indiceVista) => (
              <div
                key={`vista-cuatro-${indiceVista}`}
                className="w-full shrink-0 snap-center px-1 sm:px-2"
              >
                <div className="grid grid-cols-2 gap-x-3 gap-y-5 sm:gap-x-7 sm:gap-y-8">
                  {grupoDeCuatro.map((figura) => (
                    <TarjetaFigura3D
                      key={figura.id}
                      figura={figura}
                      simboloMoneda={configuracion.simboloMoneda}
                      telefonoWhatsApp={configuracion.whatsappPedidos ?? '34689113710'}
                      alSeleccionarProducto={(item) =>
                        setFiguraSeleccionada(item)
                      }
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Indicadores inferiores de página */}
        {paginasDeCuatro.length > 1 && (
          <div className="mt-6 flex flex-col items-center gap-3">
            <div className="flex items-center justify-center gap-2">
              {paginasDeCuatro.map((_, indice) => {
                const esActiva = indice === indicePaginaActiva;
                return (
                  <button
                    key={`punto-pagina-${indice}`}
                    type="button"
                    onClick={() => irAPaginaDeCuatro(indice)}
                    className={`h-2.5 rounded-full transition-all ${
                      esActiva
                        ? 'w-8 bg-[#8f816d]'
                        : 'w-2.5 bg-[#cfc4b4] hover:bg-[#b0a392]'
                    }`}
                    aria-label={`Ir a la vista ${indice + 1}`}
                  />
                );
              })}
            </div>

            <div className="flex items-center gap-3 text-xs">
              <button
                type="button"
                onClick={() => irAPaginaDeCuatro(indicePaginaActiva - 1)}
                disabled={indicePaginaActiva === 0}
                className="px-3.5 py-1.5 rounded-full bg-white border border-[#b5a895] text-[#6e6253] font-medium disabled:opacity-40"
              >
                ← 4 anteriores
              </button>
              <button
                type="button"
                onClick={() => irAPaginaDeCuatro(indicePaginaActiva + 1)}
                disabled={indicePaginaActiva >= paginasDeCuatro.length - 1}
                className="px-3.5 py-1.5 rounded-full bg-[#b0a392] text-white border border-[#9c8e7c] font-medium disabled:opacity-40"
              >
                Siguientes 4 →
              </button>
            </div>
          </div>
        )}

        {/* Doble línea horizontal inferior característica del diseño de referencia */}
        <footer className="mt-8 pt-4">
          <div className="border-t-2 border-b-2 border-[#b5a895] h-2 w-full" />
          <div className="mt-3 flex flex-col sm:flex-row items-center justify-between gap-2 text-[11px] text-[#7e7160] text-center sm:text-left">
            <span>{configuracion.notaPieCatalogo}</span>
            <span className="font-mono">{configuracion.telefonoContacto}</span>
          </div>
        </footer>
      </div>

      {/* Modal con Selector de Opciones (Pack/Unidad) + Opción NFC + Galería */}
      <ModalDetalleFigura3D
        figura={figuraSeleccionada}
        simboloMoneda={configuracion.simboloMoneda}
        telefonoWhatsApp={configuracion.whatsappPedidos ?? '34689113710'}
        alCerrar={() => setFiguraSeleccionada(null)}
      />
    </div>
  );
};
