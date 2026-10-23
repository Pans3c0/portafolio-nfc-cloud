import React from 'react';
import { ShieldAlert, Search, X } from 'lucide-react';
import {
  AlergenoAlimentario,
  CategoriaPlato
} from '../interfaces/restaurante';

export interface PropiedadesFiltroCarta {
  textoBusquedaPlato: string;
  alCambiarBusquedaPlato: (texto: string) => void;
  categoriaActiva: CategoriaPlato;
  alCambiarCategoria: (categoria: CategoriaPlato) => void;
  alergenosExcluidos: AlergenoAlimentario[];
  alAlternarAlergeno: (alergeno: AlergenoAlimentario) => void;
}

const CATEGORIAS_CARTA: CategoriaPlato[] = [
  'Todas',
  'Hamburguesas',
  'Perritos XL',
  'Pizzas 28cm',
  'Para Picar',
  'Bebidas'
];

const LISTA_ALERGENOS: AlergenoAlimentario[] = [
  'Gluten',
  'Lactosa',
  'Huevo',
  'Mostaza'
];

/**
 * Componente de filtrado triple para la carta digital NFC:
 * 1) Buscador rápido de hamburguesas, perritos XL, pizzas 28cm, tequeños o ingredientes.
 * 2) Por sección de la carta.
 * 3) Por exclusión de alérgenos alimentarios.
 */
export const FiltroCarta: React.FC<PropiedadesFiltroCarta> = ({
  textoBusquedaPlato,
  alCambiarBusquedaPlato,
  categoriaActiva,
  alCambiarCategoria,
  alergenosExcluidos,
  alAlternarAlergeno
}) => {
  return (
    <div className="bg-superficie border border-bordeSutil rounded-sm p-4 space-y-4">
      {/* Buscador de Platos e Ingredientes */}
      <div className="relative">
        <Search className="w-4 h-4 text-tintaSuave absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
        <input
          type="search"
          value={textoBusquedaPlato}
          onChange={(e) => alCambiarBusquedaPlato(e.target.value)}
          placeholder="Buscar plato o ingrediente (ej: Ron Damón, Chavo, Pizza, Tequeños, Salchipapas, Coca Cola)..."
          aria-label="Buscar plato en la carta"
          className="w-full pl-9 pr-8 py-2 text-xs sm:text-sm bg-lienzo border border-gray-300 rounded-sm text-tinta focus:outline-none focus:border-primario"
        />
        {textoBusquedaPlato && (
          <button
            type="button"
            onClick={() => alCambiarBusquedaPlato('')}
            className="absolute right-2.5 top-1/2 -translate-y-1/2 text-tintaSuave hover:text-tinta"
            aria-label="Limpiar búsqueda"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Filtro de Categoría Deslizable en Móvil */}
      <div className="flex items-center gap-2 overflow-x-auto ocultar-barra-scroll pb-0.5">
        <span className="text-xs font-mono uppercase tracking-wider text-tintaSuave mr-1 shrink-0">
          Sección:
        </span>
        {CATEGORIAS_CARTA.map((categoria) => {
          const esActiva = categoriaActiva === categoria;
          return (
            <button
              key={categoria}
              type="button"
              onClick={() => alCambiarCategoria(categoria)}
              className={`shrink-0 px-3 py-1.5 text-xs font-semibold rounded-sm border transition-colors ${
                esActiva
                  ? 'bg-primario text-white border-primario'
                  : 'bg-lienzo text-tinta border-gray-300 hover:border-primario'
              }`}
            >
              {categoria}
            </button>
          );
        })}
      </div>

      {/* Filtro de Exclusión de Alérgenos */}
      <div className="pt-3 border-t border-bordeSutil flex flex-wrap items-center gap-2">
        <div className="flex items-center gap-1.5 text-xs font-mono uppercase tracking-wider text-tintaSuave mr-2">
          <ShieldAlert className="w-3.5 h-3.5 text-primario" />
          <span>Ocultar con:</span>
        </div>

        {LISTA_ALERGENOS.map((alergeno) => {
          const estaExcluido = alergenosExcluidos.includes(alergeno);
          return (
            <button
              key={alergeno}
              type="button"
              onClick={() => alAlternarAlergeno(alergeno)}
              className={`px-2.5 py-1 text-xs font-mono rounded-sm border transition-colors ${
                estaExcluido
                  ? 'bg-tinta text-white border-tinta'
                  : 'bg-superficie text-tintaSuave border-gray-300 hover:border-tinta'
              }`}
            >
              {estaExcluido ? `✕ Sin ${alergeno}` : alergeno}
            </button>
          );
        })}
      </div>
    </div>
  );
};
