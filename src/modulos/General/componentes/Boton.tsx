import React from 'react';

/**
 * Propiedades del componente `Boton` compartido.
 */
export interface PropiedadesBoton extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /** Variante visual sobria adaptada al sistema Anti-IA Look */
  variante?: 'primario' | 'secundario' | 'contorno';
  /** Tamaño del botón */
  tamano?: 'pequeno' | 'mediano' | 'grande';
  /** Ocupar el 100% del contenedor padre */
  anchoCompleto?: boolean;
}

/**
 * Componente de botón estándar para toda la plataforma.
 *
 * MENTORING JUNIOR:
 * Observa que NO usamos `rounded-full` ni sombras difuminadas (`shadow-lg`) ni gradientes.
 * Usamos `rounded-sm` (esquinas de 2px) y bordes sólidos de 1px para lograr una estética
 * editorial y técnica ("Anti-IA Look"). Además, las clases `bg-primario`,
 * `hover:bg-primarioHover` y `active:bg-primarioActivo` consumen las variables CSS
 * calculadas con `calc()`.
 */
export const Boton: React.FC<PropiedadesBoton> = ({
  children,
  variante = 'primario',
  tamano = 'mediano',
  anchoCompleto = false,
  className = '',
  disabled = false,
  ...restoPropiedades
}) => {
  const clasesBase =
    'inline-flex items-center justify-center font-medium transition-colors duration-150 rounded-sm border focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-primario disabled:opacity-50 disabled:cursor-not-allowed';

  const clasesPorVariante: Record<NonNullable<PropiedadesBoton['variante']>, string> = {
    primario:
      'bg-primario text-white border-primario hover:bg-primarioHover active:bg-primarioActivo',
    secundario:
      'bg-fondoSecundario text-tinta border-bordeTono hover:bg-primario hover:text-white active:bg-primarioActivo',
    contorno:
      'bg-superficie text-tinta border-gray-300 hover:border-primario hover:bg-fondoSecundario active:bg-gray-100'
  };

  const clasesPorTamano: Record<NonNullable<PropiedadesBoton['tamano']>, string> = {
    pequeno: 'px-3 py-1.5 text-xs gap-1.5',
    mediano: 'px-4 py-2.5 text-sm gap-2',
    grande: 'px-6 py-3 text-base gap-2.5'
  };

  const claseAncho = anchoCompleto ? 'w-full' : '';

  return (
    <button
      className={`${clasesBase} ${clasesPorVariante[variante]} ${clasesPorTamano[tamano]} ${claseAncho} ${className}`}
      disabled={disabled}
      {...restoPropiedades}
    >
      {children}
    </button>
  );
};
