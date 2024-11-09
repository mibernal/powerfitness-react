import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import Navbar from './app/components/navbar/Navbar';
import Footer from './app/components/layout/footer/Footer';
import AppRoutes from './routes/AppRoutes';
import AppProviders from './app/components/providers/AppProviders'; // Importamos AppProviders

function App() {
  return (
    <Router>
      <AppProviders>
        <Navbar />
        <main>
          <AppRoutes />
        </main>
        <Footer />
      </AppProviders>
    </Router>
  );
}

export default App;
