//src\app\components\nosotros\Nosotros.js

import React from 'react';
import './Nosotros.scss';

const Nosotros = () => {
  return (
    <section className="nosotros-section">
      <div className="container">
        <h2 className="nosotros-title">Bienvenidos a PowerFitness</h2>
        <p className="nosotros-description">
          En nuestro compromiso por ayudarte a alcanzar tus objetivos de manera eficiente y segura, te ofrecemos una amplia variedad de productos y servicios especializados en el ámbito deportivo.
        </p>
        <p className="nosotros-description">
          Nos especializamos en la venta de suplementos deportivos de alta calidad, entre los que destacan nuestra selección de proteínas, pre-entrenamientos, quemadores de grasa, vitaminas y minerales, así como accesorios de entrenamiento y ropa deportiva. Contamos con las mejores marcas del mercado para garantizarte los resultados que esperas, sin comprometer tu salud ni seguridad. Todos nuestros productos son seleccionados cuidadosamente y sometidos a rigurosos controles de calidad para garantizar que cumplen con los estándares más exigentes.
        </p>
        <p className="nosotros-description">
          Además, en PowerFitness no solo te ofrecemos productos de calidad, sino también asesoramiento personalizado para que puedas elegir los suplementos deportivos que mejor se adapten a tus necesidades y objetivos. Nos enfocamos en entender tus necesidades específicas para ofrecerte recomendaciones personalizadas y así puedas alcanzar tus metas de forma más efectiva.
        </p>
        <p className="nosotros-description">
          En definitiva, en PowerFitness estamos comprometidos en ser tu aliado en el camino hacia una vida más saludable y activa, ofreciéndote siempre los mejores productos y servicios para que puedas alcanzar tus metas de forma eficiente y segura. No dudes en visitar nuestra tienda virtual y comprobar por ti mismo la calidad de nuestra oferta.
        </p>
        <a className="nosotros-button" href="/product-list">Explora nuestros productos</a>
      </div>
    </section>
  );
}

export default Nosotros;
