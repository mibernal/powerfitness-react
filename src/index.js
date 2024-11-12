// index.js
import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';  // Archivo de estilos globales
import App from './App';
import 'bootstrap/dist/css/bootstrap.min.css';


// Crear el root element una sola vez
const rootElement = document.getElementById('root');
if (!rootElement) throw new Error("Root element not found");

// Montar el componente principal App bajo el AuthProvider
const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
      <App />
  </React.StrictMode>
);
