import React from 'react';
import './Footer.scss'; // Asegúrate de que la ruta es correcta

const Footer = () => {
  return (
    <footer className="footer bg-dark text-white py-5">
      <div className="container">
        <div className="row">
          <div className="col-md-4">
            <h4>PowerFitness</h4>
            <p>Tienda de artículos deportivos en Bogotá, Colombia. Envíos a todo el país.</p>
            <p>Teléfono: +573124193753</p>
            <a
              href="https://api.whatsapp.com/send?phone=573124193753"
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-whatsapp"
            >
              <i className="fab fa-whatsapp"></i> Contáctanos por WhatsApp
            </a>
          </div>
          <div className="col-md-4">
            <h4>Enlaces</h4>
            <ul className="list-unstyled">
              <li><a href="/">Inicio</a></li>
              <li><a href="/categorias">Categorías</a></li>
              <li><a href="/product-list">Productos</a></li>
              <li><a href="/nosotros">Nosotros</a></li>
              <li><a href="/descuentos">Descuentos</a></li>
              <li><a href="/contact">Contacto</a></li>
            </ul>
          </div>
          <div className="col-md-4">
            <h4>Síguenos</h4>
            <ul className="list-unstyled social-icons">
              <li>
                <a
                  href="https://www.facebook.com/PowerFitness"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <i className="fab fa-facebook"></i>
                </a>
              </li>
              <li>
                <a
                  href="https://twitter.com/PowerFitness"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <i className="fab fa-twitter"></i>
                </a>
              </li>
              <li>
                <a
                  href="https://www.instagram.com/PowerFitness"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <i className="fab fa-instagram"></i>
                </a>
              </li>
            </ul>
          </div>
        </div>
        <hr />
        <p className="text-muted small mb-0">© 2023 PowerFitness</p>
      </div>
    </footer>
  );
};

export default Footer;
