// src/app/components/home/HomeComponent.jsx
import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Slider from 'react-slick';
import { ProductService } from '../services/product/ProductService';  // Corregir la importación
import  BrandService  from '../services/brand/BrandService';  // Asegúrate de que sea el hook adecuado
import './HomeComponent.scss';

const HomeComponent = () => {
  const [products, setProducts] = useState([]);
  const [brands, setBrands] = useState([]);
  const slickRef = useRef(null);
  const navigate = useNavigate();

  const carouselConfig = {
    slidesToShow: Math.min(brands.length, 5),
    slidesToScroll: 1,
    dots: true,
    arrows: true,
    autoplay: true,
    autoplaySpeed: 3000,
    infinite: true,
  };

  const { fetchBrands, brandsData } = BrandService(); // Asegúrate de que fetchBrands y brandsData sean correctos

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const productService = new ProductService(); // Asegurarte que ProductService se usa correctamente
        const fetchedProducts = await productService.getProducts();
        setProducts(fetchedProducts.slice(0, 6)); // Mostrar solo los primeros 6 productos
      } catch (error) {
        console.error('Error fetching products:', error); // Manejo de errores
      }
    };

    fetchProducts();  // Llamar para obtener los productos
    if (fetchBrands) {
      fetchBrands();  // Llamar para obtener las marcas
    }
  }, [fetchBrands]); // Este efecto se dispara cuando fetchBrands cambia

  useEffect(() => {
    if (brandsData) {
      setBrands(brandsData);  // Si las marcas están disponibles, las guardamos en el estado
    }
  }, [brandsData]);

  const viewProductDetails = (productId) => {
    navigate(`/products/${productId}`); // Redirigir al detalle del producto
  };

  const formatPrice = (price) => {
    return `$${price.toFixed(2)}`;  // Formatear el precio correctamente
  };

  return (
    <main>
      <section className="py-5 bg-light">
        <div className="container">
          <h1 className="text-center mb-5">Bienvenido a PowerFitness</h1>
          <div className="carousel-container">
            <Slider {...carouselConfig} ref={slickRef}>
              {brands.map((brand) => (
                <div key={brand.id} className="carousel-item">
                  <img src={brand.image[0]} alt={brand.name} className="brand-logo" />
                </div>
              ))}
            </Slider>
          </div>
          <h2 className="text-center mb-5">Productos en Oferta</h2>
          <div className="row">
            {products.map((product) => (
              <div key={product.id} className="col-lg-4 col-md-6 col-sm-12 mb-4">
                <div className="card shadow-sm">
                  <img src={product.imageUrl} alt={product.name} className="card-img-top" />
                  <div className="card-body">
                    <h3 className="card-title">{product.name}</h3>
                    <p className="card-text">{product.description}</p>
                    <div className="d-flex justify-content-between align-items-center">
                      <div className="btn-group">
                        <button type="button" className="btn btn-primary" onClick={() => viewProductDetails(product.id)}>
                          Ver más
                        </button>
                      </div>
                      <small className="text-muted">
                        {formatPrice(product.price)}  {/* Formatear el precio */}
                      </small>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
};

export default HomeComponent;
