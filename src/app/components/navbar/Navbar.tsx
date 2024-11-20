// src/app/components/navbar/Navbar.jsx
import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCartService } from '../services/cart/CartService';  // Corregir importación
import { ProductService } from '../services/product/ProductService'; // Asegúrate de que esté correctamente importado
import { useAuth } from '../services/auth/AuthService';

const Navbar: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState<string>(''); // Tipado explícito de búsqueda
  const [cartItemCount, setCartItemCount] = useState<number>(0); // Tipado explícito de cuenta de carrito
  const [productCategories, setProductCategories] = useState<string[]>([]); // Tipado explícito de categorías
  const { user } = useAuth();
  const navigate = useNavigate();
  const { products } = useCartService(); // Accede a los productos del carrito

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const productService = ProductService();  // Crear instancia de ProductService
        const categories = await productService.getProductCategories();
        setProductCategories(categories);
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };

    fetchCategories();

    // Actualiza el contador de productos en el carrito
    setCartItemCount(products.reduce((total, product) => total + product.quantity, 0));
  }, [products]); // Este efecto se ejecutará cada vez que los productos del carrito cambien

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) navigate(`/search?query=${searchQuery}`);
  };

  const handleCategoryClick = (category: string) => {
    navigate(`/product-list?category=${category}`);
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light">
      <div className="container-fluid">
        <Link className="navbar-brand" to="/">PowerFitness</Link>
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNavDropdown" aria-controls="navbarNavDropdown" aria-expanded="false" aria-label="Toggle navigation">
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNavDropdown">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            <li className="nav-item">
              <Link className="nav-link" to="/">Inicio</Link>
            </li>
            <li className="nav-item dropdown">
              <button className="nav-link dropdown-toggle" id="navbarDropdownMenuLink" data-bs-toggle="dropdown" aria-expanded="false">
                Categorías
              </button>
              <ul className="dropdown-menu" aria-labelledby="navbarDropdownMenuLink">
                {productCategories.map((category) => (
                  <li key={category}>
                    <button className="dropdown-item" onClick={() => handleCategoryClick(category)}>
                      {category}
                    </button>
                  </li>
                ))}
              </ul>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/product-list">Productos</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/nosotros">Nosotros</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/sale">Ofertas!</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/contact">Contacto</Link>
            </li>
          </ul>
          <form className="d-flex" onSubmit={handleSearch}>
            <input
              className="form-control me-2"
              type="search"
              placeholder="Buscar"
              aria-label="Buscar"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button className="btn btn-outline-success" type="submit">Buscar</button>
          </form>
          <ul className="navbar-nav mb-2 mb-lg-0">
            {user ? (
              <li className="nav-item">
                <Link className="nav-link" to="/profile">Mi Perfil</Link>
              </li>
            ) : (
              <>
                <li className="nav-item">
                  <Link className="nav-link" to="/login-form">Iniciar Sesión</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/register">Registro</Link>
                </li>
              </>
            )}
            <li className="nav-item">
              <Link className="nav-link" to="/cart">
                <span className="bi bi-cart"></span>
                <span className="cart-items">{cartItemCount}</span>
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
