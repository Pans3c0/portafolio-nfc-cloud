import React from 'react';
import ReactDOM from 'react-dom/client';
import { App } from './App';
import './modulos/General/estilos/variables.css';

/**
 * Punto de entrada principal de React.
 * Monta la aplicación en el nodo `#raiz` definido en `index.html`.
 */
const elementoRaiz = document.getElementById('raiz');

if (!elementoRaiz) {
  throw new Error(
    'No se encontró el contenedor #raiz en index.html. Verifica la plantilla HTML.'
  );
}

ReactDOM.createRoot(elementoRaiz).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
