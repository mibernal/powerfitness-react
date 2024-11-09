// src/components/Contact/Contact.js
import React from 'react';
import './contact.scss';

const Contact = () => {
  return (
    <div className="container">
      <h1>Contáctanos</h1>
      <div className="row">
        <div className="col-md-6">
          <h3>Ubicación</h3>
          <p>Estamos ubicados en Bogotá y hacemos envíos a todo el país.</p>
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3976.062868153577!2d-74.0646823842646!3d4.697542342809965!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8e3f8a84ce4b3719%3A0xeb13a526a824c6b4!2sBogot%C3%A1%2C%20Colombia!5e0!3m2!1sen!2sus!4v1620354656928!5m2!1sen!2sus"
            width="100%"
            height="350"
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
            title="Google Map"
          ></iframe>
        </div>
        <div className="col-md-6">
          <h3>Contáctanos</h3>
          <form>
            <div className="form-group">
              <label htmlFor="name">Nombre</label>
              <input type="text" className="form-control" id="name" placeholder="Ingresa tu nombre" />
            </div>
            <div className="form-group">
              <label htmlFor="email">Correo electrónico</label>
              <input type="email" className="form-control" id="email" placeholder="Ingresa tu correo electrónico" />
            </div>
            <div className="form-group">
              <label htmlFor="message">Mensaje</label>
              <textarea className="form-control" id="message" rows="5" placeholder="Ingresa tu mensaje"></textarea>
            </div>
            <button type="submit" className="btn btn-primary">Enviar mensaje</button>
          </form>
          <div className="mt-4">
            <p>También puedes contactarnos por:</p>
            <ul>
              <li><a href="https://wa.me/573124193753"><i className="fab fa-whatsapp mr-2"></i>+57 3124193753</a></li>
              <li><a href="mailto:contacto@powerfitness.com"><i className="far fa-envelope mr-2"></i>contacto@powerfitness.com</a></li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
