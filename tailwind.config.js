/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      /**
       * MENTORING JUNIOR - SISTEMA DE COLORES DINÁMICOS WHITE-LABEL:
       * En lugar de usar colores fijos de Tailwind (como bg-blue-600), registramos
       * colores semánticos que leen nuestras variables CSS en `:root`.
       * Esas variables utilizan `hsl()` y `calc()` en `variables.css` para calcular
       * automáticamente los estados hover, active y fondos secundarios a partir
       * de los 3 valores HSL de `configuracionCliente.json`.
       */
      colors: {
        lienzo: '#f9fafb',
        superficie: '#ffffff',
        tinta: '#111827',
        tintaSuave: '#4b5563',
        bordeSutil: '#e5e7eb',
        primario: 'var(--color-primario)',
        primarioHover: 'var(--color-primario-hover)',
        primarioActivo: 'var(--color-primario-activo)',
        fondoSecundario: 'var(--color-fondo-secundario)',
        bordeTono: 'var(--color-borde-tono)'
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        serifCatalogo: ['"Playfair Display"', '"Cormorant Garamond"', 'Georgia', 'serif'],
        manuscrita: ['"Dancing Script"', 'cursive'],
        mono: ['ui-monospace', 'SFMono-Regular', 'Menlo', 'Monaco', 'Consolas', 'monospace']
      }
    }
  },
  plugins: []
};
