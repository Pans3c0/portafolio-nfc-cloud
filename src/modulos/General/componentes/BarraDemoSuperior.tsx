import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ArrowLeft, Layers, Box, Scissors, Utensils } from 'lucide-react';

/**
 * Barra superior técnica de navegación entre el Portafolio, el Catálogo 3D y las Demos NFC.
 *
 * MENTORING JUNIOR:
 * Cuando vendas e independices un módulo para un cliente final (por ejemplo, solo
 * la carpeta `Peluqueria/`), puedes prescindir de esta barra en `App.tsx` para que
 * el cliente final vea únicamente su negocio. Durante la fase de demostración comercial
 * con etiquetas NFC, te permite saltar rápidamente entre módulos frente al cliente.
 */
export const BarraDemoSuperior: React.FC = () => {
  const ubicacion = useLocation();

  // Ocultamos la barra superior en la web de Bar & Café Ron Damón (/restaurante)
  // para presentarla como prototipo 100% independiente al cliente.
  if (ubicacion.pathname.startsWith('/restaurante')) {
    return null;
  }

  const enlacesNavegacion = [
    { ruta: '/', etiqueta: 'Portafolio Principal', icono: Layers },
    { ruta: '/catalogo-3d', etiqueta: 'Catálogo 3D', icono: Box },
    { ruta: '/peluqueria', etiqueta: 'Demo Peluquería (NFC)', icono: Scissors },
    { ruta: '/restaurante', etiqueta: 'Demo Restaurante (NFC)', icono: Utensils }
  ];

  return (
    <nav
      aria-label="Navegación de plataforma de demostraciones"
      className="bg-tinta text-white border-b border-gray-800 text-xs"
    >
      <div className="max-w-5xl mx-auto px-4 sm:px-6 h-10 flex items-center justify-between gap-4 overflow-x-auto">
        <div className="flex items-center gap-2 shrink-0">
          <span className="inline-block w-2 h-2 rounded-sm bg-emerald-400" />
          <span className="font-mono uppercase tracking-wider text-[11px] text-gray-300">
            Arquitectura Modular White-Label
          </span>
        </div>

        <div className="flex items-center gap-1 shrink-0">
          {ubicacion.pathname !== '/' && (
            <Link
              to="/"
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-sm text-gray-300 hover:text-white hover:bg-gray-800 mr-1 transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Inicio</span>
            </Link>
          )}

          {enlacesNavegacion.map((enlace) => {
            const Icono = enlace.icono;
            const estaActivo = ubicacion.pathname === enlace.ruta;

            return (
              <Link
                key={enlace.ruta}
                to={enlace.ruta}
                className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-sm transition-colors ${
                  estaActivo
                    ? 'bg-white text-tinta font-medium'
                    : 'text-gray-300 hover:text-white hover:bg-gray-800'
                }`}
              >
                <Icono className="w-3.5 h-3.5" />
                <span>{enlace.etiqueta}</span>
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
};
