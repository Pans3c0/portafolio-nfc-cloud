import React, { useEffect, useState } from 'react';
import {
  X,
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  Wifi,
  Check,
  Palette,
  Package,
  MessageCircle
} from 'lucide-react';
import { Figura3D, VarianteProducto3D } from '../interfaces/figura3D';
import { calcularPrecioFinalProducto3D } from '../servicios/servicioCatalogo3D';

export interface PropiedadesModalDetalleFigura3D {
  figura: Figura3D | null;
  simboloMoneda: string;
  telefonoWhatsApp?: string;
  alCerrar: () => void;
}

/**
 * Modal de ficha de producto orientado 100% a cliente final:
 * - Sin datos técnicos innecesarios (cero micras, cero gramos, cero tiempos de máquina).
 * - Selector de Variantes / Unidades sueltas (`variantes`): al elegir una opción (ej. "1 Ud. Gatito Fantasma"),
 *   se actualiza automáticamente el precio y la fotografía principal mostrada en la galería.
 * - Opción interactiva de agregar Chip NFC (`opcionNFC`): suma automáticamente el suplemento al precio total.
 */
export const ModalDetalleFigura3D: React.FC<
  PropiedadesModalDetalleFigura3D
> = ({ figura, simboloMoneda, telefonoWhatsApp = '34689113710', alCerrar }) => {
  const [indiceImagenActiva, setIndiceImagenActiva] = useState<number>(0);
  const [varianteSeleccionada, setVarianteSeleccionada] =
    useState<VarianteProducto3D | null>(null);
  const [incluirNFC, setIncluirNFC] = useState<boolean>(false);
  const [colorSeleccionado, setColorSeleccionado] = useState<string>('');
  const [coordenadaToqueInicioX, setCoordenadaToqueInicioX] = useState<
    number | null
  >(null);

  useEffect(() => {
    if (figura) {
      const primeraVariante =
        figura.variantes && figura.variantes.length > 0
          ? figura.variantes[0]
          : null;

      setVarianteSeleccionada(primeraVariante);
      setIncluirNFC(false);
      setColorSeleccionado(figura.coloresDisponibles?.[0] ?? '');

      if (primeraVariante?.idImagenAsociada) {
        const indiceAsociado = figura.galeriaImagenes.findIndex(
          (img) => img.idImagen === primeraVariante.idImagenAsociada
        );
        setIndiceImagenActiva(indiceAsociado >= 0 ? indiceAsociado : 0);
      } else {
        setIndiceImagenActiva(0);
      }
    }
  }, [figura]);

  useEffect(() => {
    const manejarEscape = (evento: KeyboardEvent) => {
      if (evento.key === 'Escape') {
        alCerrar();
      }
    };

    if (figura) {
      document.addEventListener('keydown', manejarEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', manejarEscape);
      document.body.style.overflow = 'unset';
    };
  }, [figura, alCerrar]);

  if (!figura) {
    return null;
  }

  const totalImagenes = figura.galeriaImagenes.length;
  const imagenActual =
    figura.galeriaImagenes[indiceImagenActiva] ?? figura.galeriaImagenes[0];

  const precioTotalActualizado = calcularPrecioFinalProducto3D(
    figura,
    varianteSeleccionada,
    incluirNFC
  );

  /**
   * Al seleccionar una opción del producto (ej. "1 Ud. Fantasmita Tímido" o "Pack Familia"),
   * actualizamos la variante activa y cambiamos automáticamente la imagen de la galería
   * para mostrar exactamente esa figura o pack.
   */
  const manejarSeleccionVariante = (variante: VarianteProducto3D) => {
    setVarianteSeleccionada(variante);

    if (variante.idImagenAsociada) {
      const indiceEncontrado = figura.galeriaImagenes.findIndex(
        (img) => img.idImagen === variante.idImagenAsociada
      );
      if (indiceEncontrado !== -1) {
        setIndiceImagenActiva(indiceEncontrado);
      }
    }
  };

  const irImagenAnterior = () => {
    setIndiceImagenActiva((previo) =>
      previo === 0 ? totalImagenes - 1 : previo - 1
    );
  };

  const irImagenSiguiente = () => {
    setIndiceImagenActiva((previo) =>
      previo === totalImagenes - 1 ? 0 : previo + 1
    );
  };

  const manejarInicioToque = (evento: React.TouchEvent) => {
    setCoordenadaToqueInicioX(evento.touches[0].clientX);
  };

  const manejarFinToque = (evento: React.TouchEvent) => {
    if (coordenadaToqueInicioX === null) return;
    const diferenciaX =
      coordenadaToqueInicioX - evento.changedTouches[0].clientX;
    if (Math.abs(diferenciaX) > 40) {
      if (diferenciaX > 0) {
        irImagenSiguiente();
      } else {
        irImagenAnterior();
      }
    }
    setCoordenadaToqueInicioX(null);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-3 sm:p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="titulo-detalle-producto-3d"
      onClick={alCerrar}
    >
      <div
        className="w-full max-w-3xl bg-[#efebe1] border-2 border-[#b5a895] rounded-md overflow-hidden max-h-[92vh] flex flex-col"
        onClick={(evento) => evento.stopPropagation()}
      >
        {/* Cabecera Limpia del Modal */}
        <div className="flex items-center justify-between px-4 sm:px-6 py-3.5 bg-white border-b border-[#d8cebe]">
          <div>
            <span className="text-[11px] font-medium uppercase tracking-wider text-[#8c7f6f]">
              {figura.categoria}
            </span>
            <h2
              id="titulo-detalle-producto-3d"
              className="text-base sm:text-xl font-bold text-[#5a5043]"
            >
              {figura.nombre}
            </h2>
          </div>

          <button
            type="button"
            onClick={alCerrar}
            className="p-1.5 text-[#756857] hover:text-[#3d352c] border border-[#d8cebe] rounded-sm bg-[#f7f4ee]"
            aria-label="Cerrar ventana"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Contenido Principal Deslizable */}
        <div className="p-4 sm:p-6 overflow-y-auto grid grid-cols-1 md:grid-cols-12 gap-6">
          {/* Columna Izquierda: Galería de Fotos Sincronizada con la Opción Elegida (6 cols) */}
          <div className="md:col-span-6 space-y-3">
            <div
              className="relative bg-white p-2.5 border border-[#cfc4b4] rounded-sm"
              onTouchStart={manejarInicioToque}
              onTouchEnd={manejarFinToque}
            >
              <div className="relative aspect-square w-full overflow-hidden bg-[#eae4da]">
                {imagenActual && (
                  <img
                    src={imagenActual.urlImagen}
                    alt={imagenActual.tituloVista ?? figura.nombre}
                    className="w-full h-full object-cover"
                  />
                )}

                <span className="absolute top-2.5 right-2.5 px-2.5 py-0.5 text-[11px] font-medium bg-white/95 text-[#5a5043] border border-[#c8bca9] rounded-full">
                  Foto {indiceImagenActiva + 1} de {totalImagenes}
                </span>

                {totalImagenes > 1 && (
                  <>
                    <button
                      type="button"
                      onClick={irImagenAnterior}
                      className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/90 text-[#5a5043] border border-[#b5a895] flex items-center justify-center hover:bg-white"
                      aria-label="Foto anterior"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={irImagenSiguiente}
                      className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/90 text-[#5a5043] border border-[#b5a895] flex items-center justify-center hover:bg-white"
                      aria-label="Foto siguiente"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </>
                )}
              </div>

              {imagenActual?.tituloVista && (
                <div className="pt-2.5 pb-0.5 px-1 text-center">
                  <p className="text-xs font-semibold text-[#5a5043]">
                    {imagenActual.tituloVista}
                  </p>
                </div>
              )}
            </div>

            {/* Tira de Miniaturas */}
            {totalImagenes > 1 && (
              <div className="grid grid-cols-6 gap-1.5">
                {figura.galeriaImagenes.map((imagen, indice) => {
                  const esActiva = indice === indiceImagenActiva;
                  return (
                    <button
                      key={imagen.idImagen}
                      type="button"
                      onClick={() => setIndiceImagenActiva(indice)}
                      className={`p-0.5 bg-white rounded-sm border-2 transition-all ${
                        esActiva
                          ? 'border-[#8f816d] scale-105'
                          : 'border-transparent opacity-70 hover:opacity-100'
                      }`}
                    >
                      <div className="aspect-square w-full overflow-hidden bg-[#eae4da]">
                        <img
                          src={imagen.urlImagen}
                          alt={imagen.tituloVista ?? `${figura.nombre} ${indice + 1}`}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Columna Derecha: Precio Dinámico, Selector de Pack/Unidades y Opción NFC (6 cols) */}
          <div className="md:col-span-6 flex flex-col justify-between space-y-4">
            <div className="space-y-4">
              {/* Bloque de Precio Dinámico que se actualiza en tiempo real */}
              <div className="bg-white border-2 border-[#b5a895] rounded-md p-4 flex items-center justify-between gap-3">
                <div>
                  <span className="block text-[11px] uppercase font-medium text-[#8c7f6f]">
                    Precio según tu selección
                  </span>
                  <div className="mt-1 flex items-center gap-2">
                    <span className="inline-block bg-[#b0a392] text-white font-bold text-lg px-4 py-0.5 rounded-full border border-[#9c8e7c]">
                      {precioTotalActualizado} {simboloMoneda}
                    </span>
                    {incluirNFC && (
                      <span className="text-[11px] font-medium text-[#6e6253] bg-[#f7f4ee] border border-[#cfc4b4] px-2 py-0.5 rounded-full">
                        NFC incluido
                      </span>
                    )}
                  </div>
                </div>

                <span
                  className={`inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium rounded-sm border ${
                    figura.disponibleEnStock
                      ? 'bg-[#f3f7f0] text-[#3b593f] border-[#b7cfb9]'
                      : 'bg-[#f7f4ee] text-[#756857] border-[#cfc4b4]'
                  }`}
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>
                    {figura.disponibleEnStock ? 'Disponible' : 'Bajo pedido'}
                  </span>
                </span>
              </div>

              {/* Descripción limpia para el cliente */}
              <div className="bg-white border border-[#cfc4b4] rounded-md p-3.5">
                <p className="text-xs sm:text-sm text-[#4a4238] leading-relaxed">
                  {figura.descripcion}
                </p>
              </div>

              {/* Selector de Opciones / Variantes (Pack completo vs 1 Unidad con foto propia) */}
              {figura.variantes && figura.variantes.length > 0 && (
                <div className="bg-white border border-[#cfc4b4] rounded-md p-3.5 space-y-2.5">
                  <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#6e6253]">
                    <Package className="w-4 h-4 text-[#8f816d]" />
                    <span>Elige tu opción o personaje:</span>
                  </div>

                  <div className="space-y-2">
                    {figura.variantes.map((variante) => {
                      const estaElegida =
                        varianteSeleccionada?.idVariante ===
                        variante.idVariante;
                      return (
                        <button
                          key={variante.idVariante}
                          type="button"
                          onClick={() => manejarSeleccionVariante(variante)}
                          className={`w-full p-2.5 rounded-sm border text-left flex items-center justify-between gap-2 transition-colors ${
                            estaElegida
                              ? 'bg-[#f4efe6] border-2 border-[#8f816d] text-[#4a4238]'
                              : 'bg-[#faf8f5] border-[#dcd3c4] text-[#5c5246] hover:border-[#b0a392]'
                          }`}
                        >
                          <div className="min-w-0">
                            <div className="flex items-center gap-1.5">
                              <span
                                className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 ${
                                  estaElegida
                                    ? 'bg-[#8f816d] border-[#8f816d] text-white'
                                    : 'border-[#b5a895] bg-white'
                                }`}
                              >
                                {estaElegida && <Check className="w-2.5 h-2.5" />}
                              </span>
                              <span className="text-xs font-bold truncate">
                                {variante.nombre}
                              </span>
                            </div>
                            {variante.detalle && (
                              <p className="text-[11px] text-[#8c7f6f] pl-5 mt-0.5">
                                {variante.detalle}
                              </p>
                            )}
                          </div>

                          <span className="text-xs font-bold text-[#5a5043] bg-white border border-[#cfc4b4] px-2.5 py-1 rounded-full shrink-0">
                            {variante.precio} {simboloMoneda}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Opción Seleccionable para Agregar Chip NFC y actualizar el precio */}
              {figura.opcionNFC?.disponible && (
                <div className="bg-white border border-[#cfc4b4] rounded-md p-3.5">
                  <button
                    type="button"
                    onClick={() => setIncluirNFC((previo) => !previo)}
                    className={`w-full p-3 rounded-sm border text-left flex items-start justify-between gap-3 transition-colors ${
                      incluirNFC
                        ? 'bg-[#f4efe6] border-2 border-[#8f816d]'
                        : 'bg-[#faf8f5] border-[#dcd3c4] hover:border-[#b0a392]'
                    }`}
                  >
                    <div className="flex items-start gap-2.5">
                      <div
                        className={`w-5 h-5 mt-0.5 rounded-sm border flex items-center justify-center shrink-0 transition-colors ${
                          incluirNFC
                            ? 'bg-[#8f816d] border-[#8f816d] text-white'
                            : 'bg-white border-[#b5a895]'
                        }`}
                      >
                        {incluirNFC && <Check className="w-3.5 h-3.5" />}
                      </div>

                      <div>
                        <div className="flex items-center gap-1.5 text-xs font-bold text-[#4a4238]">
                          <Wifi className="w-3.5 h-3.5 text-[#8f816d]" />
                          <span>
                            {figura.opcionNFC.etiqueta ??
                              'Agregar Chip NFC Inteligente'}
                          </span>
                        </div>
                        {figura.opcionNFC.descripcion && (
                          <p className="text-[11px] text-[#7e7160] mt-1 leading-snug">
                            {figura.opcionNFC.descripcion}
                          </p>
                        )}
                      </div>
                    </div>

                    <span className="text-xs font-bold text-white bg-[#b0a392] px-2.5 py-1 rounded-full shrink-0">
                      +{figura.opcionNFC.precioExtra} {simboloMoneda}
                    </span>
                  </button>
                </div>
              )}

              {/* Selector Opcional de Color (Solo se pinta si existe en el JSON) */}
              {figura.coloresDisponibles &&
                figura.coloresDisponibles.length > 0 && (
                  <div className="bg-white border border-[#cfc4b4] rounded-md p-3.5 space-y-2">
                    <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#6e6253]">
                      <Palette className="w-3.5 h-3.5 text-[#8f816d]" />
                      <span>Tono: {colorSeleccionado}</span>
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {figura.coloresDisponibles.map((color) => {
                        const activo = color === colorSeleccionado;
                        return (
                          <button
                            key={color}
                            type="button"
                            onClick={() => setColorSeleccionado(color)}
                            className={`px-3 py-1 text-xs rounded-full border transition-colors ${
                              activo
                                ? 'bg-[#8f816d] text-white border-[#7d705e] font-medium'
                                : 'bg-[#f7f4ee] text-[#5c5246] border-[#cfc4b4] hover:border-[#8f816d]'
                            }`}
                          >
                            {color}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}
            </div>

            {/* Botones de Acción: Pedir por WhatsApp con opciones + Cerrar */}
            <div className="space-y-2 pt-1">
              <a
                href={`https://wa.me/${telefonoWhatsApp}?text=${encodeURIComponent(
                  `¡Hola Samuel! Quiero encargar "${figura.nombre}":\n• Opción: ${
                    varianteSeleccionada ? varianteSeleccionada.nombre : 'Estándar'
                  }\n• Chip NFC: ${incluirNFC ? 'Sí (+3 €)' : 'No'}${
                    colorSeleccionado ? `\n• Tono: ${colorSeleccionado}` : ''
                  }\n• Precio Total: ${precioTotalActualizado} ${simboloMoneda}`
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3 px-4 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs sm:text-sm rounded-sm transition-colors flex items-center justify-center gap-2 shadow-sm"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Pedir esta combinación por WhatsApp ({precioTotalActualizado} {simboloMoneda})</span>
              </a>

              <button
                type="button"
                onClick={alCerrar}
                className="w-full py-2 px-4 bg-[#f4f0e8] hover:bg-[#eae3d5] text-[#5c5040] text-xs font-semibold rounded-sm border border-[#cfc4b4] transition-colors"
              >
                Seguir viendo el catálogo
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
