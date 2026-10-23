import React from 'react';
import { Search, X, CheckCircle2, ArrowUpDown } from 'lucide-react';
import {
  CategoriaObjeto3D,
  CriterioOrdenacionCatalogo,
  FiltrosActivosCatalogo3D
} from '../interfaces/figura3D';

export interface PropiedadesFiltroCatalogo3D {
  filtros: FiltrosActivosCatalogo3D;
  alActualizarFiltros: (nuevosFiltros: FiltrosActivosCatalogo3D) => void;
  alLimpiarFiltros: () => void;
  totalResultados: number;
  totalPaginasDeCuatro: number;
}

const CATEGORIAS_DISPONIBLES: CategoriaObjeto3D[] = [
  'Todas',
  'Colección Halloween & Otoño',
  'Decoración y Hogar',
  'Soportes NFC',
  'Escritorio y Orden'
];

/**
 * Barra de búsqueda y filtrado pensada 100% para cliente final (sin jerga técnica de impresión).
 */
export const FiltroMateriales: React.FC<PropiedadesFiltroCatalogo3D> = ({
  filtros,
  alActualizarFiltros,
  alLimpiarFiltros,
  totalResultados,
  totalPaginasDeCuatro
}) => {
  const hayFiltrosActivos =
    filtros.textoBusqueda.trim() !== '' ||
    filtros.categoria !== 'Todas' ||
    filtros.soloDisponibles ||
    filtros.ordenarPor !== 'destacados';

  return (
    <section
      aria-label="Buscador y filtros del catálogo"
      className="bg-white/85 border border-[#cfc4b4] rounded-md p-3.5 sm:p-4 space-y-3"
    >
      {/* Fila 1: Barra de búsqueda + Toggle de Disponibilidad + Orden de precio */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-[#8c7f6f] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="search"
            value={filtros.textoBusqueda}
            onChange={(evento) =>
              alActualizarFiltros({
                ...filtros,
                textoBusqueda: evento.target.value
              })
            }
            placeholder="Buscar figura, pack, fantasmita, calabaza, soporte NFC..."
            aria-label="Buscar producto en el catálogo"
            className="w-full pl-9 pr-8 py-2 text-xs sm:text-sm bg-[#f7f4ee] border border-[#cfc4b4] rounded-sm text-[#4a4238] placeholder-[#9c8f7f] focus:outline-none focus:border-[#8c7f6f]"
          />
          {filtros.textoBusqueda && (
            <button
              type="button"
              onClick={() =>
                alActualizarFiltros({ ...filtros, textoBusqueda: '' })
              }
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#8c7f6f] hover:text-[#4a4238] p-0.5"
              aria-label="Borrar búsqueda"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() =>
              alActualizarFiltros({
                ...filtros,
                soloDisponibles: !filtros.soloDisponibles
              })
            }
            className={`flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-medium rounded-sm border transition-colors ${
              filtros.soloDisponibles
                ? 'bg-[#8f816d] text-white border-[#7d705e]'
                : 'bg-[#f7f4ee] text-[#5c5246] border-[#cfc4b4] hover:border-[#8f816d]'
            }`}
          >
            <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
            <span>En stock</span>
          </button>

          <div className="relative flex items-center">
            <ArrowUpDown className="w-3.5 h-3.5 text-[#8c7f6f] absolute left-2.5 pointer-events-none" />
            <select
              aria-label="Ordenar por precio"
              value={filtros.ordenarPor}
              onChange={(evento) =>
                alActualizarFiltros({
                  ...filtros,
                  ordenarPor: evento.target.value as CriterioOrdenacionCatalogo
                })
              }
              className="pl-7 pr-3 py-2 text-xs bg-[#f7f4ee] border border-[#cfc4b4] rounded-sm text-[#5c5246] focus:outline-none focus:border-[#8f816d]"
            >
              <option value="destacados">Destacados</option>
              <option value="precio-ascendente">Menor precio</option>
              <option value="precio-descendente">Mayor precio</option>
            </select>
          </div>
        </div>
      </div>

      {/* Fila 2: Categorías deslizables horizontalmente en móvil */}
      <div className="flex items-center gap-1.5 overflow-x-auto ocultar-barra-scroll pb-0.5">
        {CATEGORIAS_DISPONIBLES.map((categoria) => {
          const activa = filtros.categoria === categoria;
          return (
            <button
              key={categoria}
              type="button"
              onClick={() => alActualizarFiltros({ ...filtros, categoria })}
              className={`shrink-0 px-3 py-1 text-xs font-medium rounded-full border transition-colors ${
                activa
                  ? 'bg-[#9e907e] text-white border-[#8c7e6c]'
                  : 'bg-[#f7f4ee] text-[#6e6253] border-[#d8cebe] hover:border-[#9e907e]'
              }`}
            >
              {categoria}
            </button>
          );
        })}
      </div>

      {/* Fila inferior: Contador de vistas de 4 en 4 */}
      <div className="pt-2 border-t border-[#e6dfd3] flex items-center justify-between gap-2 text-[11px] text-[#786b5b]">
        <span>
          Mostrando <strong className="text-[#4a4238]">{totalResultados}</strong>{' '}
          {totalResultados === 1 ? 'producto' : 'productos'} en{' '}
          <strong className="text-[#4a4238]">{totalPaginasDeCuatro}</strong>{' '}
          {totalPaginasDeCuatro === 1 ? 'vista' : 'vistas de 4'}
        </span>

        {hayFiltrosActivos && (
          <button
            type="button"
            onClick={alLimpiarFiltros}
            className="underline font-medium text-[#6e6253] hover:text-[#3d352c]"
          >
            Ver todo
          </button>
        )}
      </div>
    </section>
  );
};
