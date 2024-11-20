// src/App.js
import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import Navbar from './app/components/navbar/Navbar';
import Footer from './app/components/layout/footer/Footer';
import AppRoutes from './routes/AppRoutes';
import AppProviders from './app/components/providers/AppProviders'; // Importamos AppProviders
import { CartServiceProvider } from './app/components/services/cart/CartService';  // Ajusta la ruta si es necesario


function App() {
  return (
    <Router>
      <AppProviders>
        <CartServiceProvider> {/* Aquí envolvemos la app con el CartProvider */}
          <Navbar />
          <main>
            <AppRoutes />
          </main>
          <Footer />
        </CartServiceProvider>
      </AppProviders>
    </Router>
  );
}

export default App;
