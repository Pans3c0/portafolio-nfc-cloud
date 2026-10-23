import React, { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { BarraDemoSuperior } from './modulos/General/componentes/BarraDemoSuperior';

/**
 * MENTORING JUNIOR - CODE SPLITTING POR DOMINIO DE NEGOCIO (LAZY LOADING):
 * ---------------------------------------------------------------------------
 * Usando `lazy()` de React dividimos el bundle de producción en fragmentos independientes
 * por cada módulo (`Portafolio`, `Catalogo3D`, `Peluqueria`, `Restaurante`).
 *
 * ¿Por qué es clave para tus etiquetas NFC y Cloudflare Pages?
 * Cuando un cliente de la Peluquería escanea el chip NFC (`/peluqueria`), su teléfono
 * descarga ÚNICAMENTE el código y JSON de la Peluquería (~5 KB), sin descargar las fotos
 * ni los datos del Restaurante ni del Catálogo 3D. Así puedes tener 20 demos distintas
 * dentro de la misma multi-app sin penalizar jamás la velocidad de carga móvil.
 */
const VistaPortafolio = lazy(() =>
  import('./modulos/Portafolio/vistas/VistaPortafolio').then((m) => ({
    default: m.VistaPortafolio
  }))
);

const VistaCatalogo3D = lazy(() =>
  import('./modulos/Catalogo3D/vistas/VistaCatalogo3D').then((m) => ({
    default: m.VistaCatalogo3D
  }))
);

const VistaPeluqueria = lazy(() =>
  import('./modulos/Peluqueria/vistas/VistaPeluqueria').then((m) => ({
    default: m.VistaPeluqueria
  }))
);

const VistaRestaurante = lazy(() =>
  import('./modulos/Restaurante/vistas/VistaRestaurante').then((m) => ({
    default: m.VistaRestaurante
  }))
);

export const App: React.FC = () => {
  return (
    <BrowserRouter>
      <div className="min-h-screen flex flex-col bg-lienzo text-tinta">
        <BarraDemoSuperior />
        <div className="flex-1">
          <Suspense
            fallback={
              <div className="min-h-[60vh] flex items-center justify-center text-xs font-mono uppercase tracking-wider text-tintaSuave">
                Cargando módulo...
              </div>
            }
          >
            <Routes>
              <Route path="/" element={<VistaPortafolio />} />
              <Route path="/catalogo-3d" element={<VistaCatalogo3D />} />
              <Route path="/peluqueria" element={<VistaPeluqueria />} />
              <Route path="/restaurante" element={<VistaRestaurante />} />
              {/* Cualquier ruta desconocida redirige limpiamente al Portafolio */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </Suspense>
        </div>
      </div>
    </BrowserRouter>
  );
};

export default App;
