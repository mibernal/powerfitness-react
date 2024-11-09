// AppProviders.js
import React from 'react';
import { AuthProvider } from '../services/auth/AuthService'; // Proveedor de autenticación
import ErrorBoundary from '../../../ErrorBoundary'; // Componente de captura de errores
import { ThemeProvider } from 'styled-components'; // Proveedor de tema global
import { GlobalStyle } from '../../../styles/global'; // Estilos globales
import { theme } from '../../../styles/theme'; // Tema global

const AppProviders = ({ children }) => {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <ThemeProvider theme={theme}>
          <GlobalStyle />
          {children}
        </ThemeProvider>
      </AuthProvider>
    </ErrorBoundary>
  );
};

export default AppProviders;
