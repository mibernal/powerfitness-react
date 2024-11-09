// src/app/components/HomeComponent.jsx
import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Slider from 'react-slick';
import ProductService from '../services/product/ProductService';  // Asegúrate de que esta importación sea correcta
import { BrandService } from '../services/brand/BrandService';
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

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const products = await ProductService.getProducts();  // Aquí estamos llamando al método estático de ProductService
        setProducts(products.slice(0, 6));
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };

    const fetchBrands = async () => {
      try {
        const brands = await BrandService.getBrands();  // Asegúrate de que BrandService esté bien importado
        setBrands(brands);
      } catch (error) {
        console.error('Error fetching brands:', error);
      }
    };

    fetchProducts();
    fetchBrands();
  }, []);

  const viewProductDetails = (productId) => {
    navigate(`/products/${productId}`);
  };

  // **Fix 1: Missing formatPrice function**
  // Assuming the formatPrice function resides in ProductService
  const formatPrice = (price) => {
    return `$${price.toFixed(2)}`; // Format price with currency symbol and 2 decimals
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
                  <img src={brand.image[0]} alt={brand.brand} className="brand-logo" />
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
                        {/* Fix 2: Use the formatPrice function */}
                        {formatPrice(product.price)}
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
