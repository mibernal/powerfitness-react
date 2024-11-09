// src/app/components/products/product-list/ProductList.jsx
import React, { useEffect, useState, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import ProductService from '../../services/product/ProductService';
import useCart from '../../services/cart/CartService';
import './ProductList.scss';

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [productCategories, setProductCategories] = useState([]);
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedFlavor, setSelectedFlavor] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [confirmationMessage, setConfirmationMessage] = useState('');
  const [selectedSortOrder, setSelectedSortOrder] = useState('popularity');

  const location = useLocation();
  const { addProduct } = useCart();

  const sortOptions = [
    { value: 'popularity', label: 'Popularidad' },
    { value: 'averageRating', label: 'Puntuación media' },
    { value: 'latestAdded', label: 'Últimos agregados' },
    { value: 'lowToHigh', label: 'Precio bajo a alto' },
    { value: 'highToLow', label: 'Precio alto a bajo' },
    { value: 'atoz', label: 'De la A a la Z' },
  ];

  const filterProductsByCategory = useCallback((category) => {
    setSelectedCategory(category);
    const filtered = products.filter(product =>
      !category || product.category === category
    );
    setFilteredProducts(filtered);
  }, [products]);

  useEffect(() => {
    const fetchProducts = async () => {
      const fetchedProducts = await ProductService.getProducts();
      setProducts(fetchedProducts);
      setFilteredProducts(fetchedProducts);

      const categories = await ProductService.getProductCategories();
      setProductCategories(categories);
    };

    fetchProducts();
  }, []);

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const category = queryParams.get('category');
    if (category) {
      filterProductsByCategory(category);
    }
  }, [location, filterProductsByCategory]);

  const sortProducts = () => {
    const sortedProducts = [...filteredProducts].sort((a, b) => {
      switch (selectedSortOrder) {
        case 'popularity':
          return (b.popularity || 0) - (a.popularity || 0);
        case 'averageRating':
          return (b.averageRating || 0) - (a.averageRating || 0);
        case 'latestAdded':
          return new Date(b.dateAdded) - new Date(a.dateAdded);
        case 'lowToHigh':
          return a.price - b.price;
        case 'highToLow':
          return b.price - a.price;
        case 'atoz':
          return a.name.localeCompare(b.name);
        default:
          return 0;
      }
    });
    setFilteredProducts(sortedProducts);
  };

  const handleAddProduct = (product) => {
    if ((product.flavors?.length > 0 && !selectedFlavor) || (product.sizes?.length > 0 && !selectedSize)) {
      setConfirmationMessage('Selecciona un tamaño o sabor');
      return;
    }
    addProduct(product);
    setConfirmationMessage(`Producto agregado al carrito: ${product.name}`);
  };

  const resetFilters = () => {
    setSelectedSize('');
    setSelectedFlavor('');
    setSelectedCategory('');
    setFilteredProducts(products);
  };

  return (
    <div className="container">
      <div className="row">
        <div className="col-12">
          <label htmlFor="sortOrder">Ordenar por:</label>
          <select id="sortOrder" value={selectedSortOrder} onChange={(e) => {
            setSelectedSortOrder(e.target.value);
            sortProducts();
          }}>
            {sortOptions.map(option => (
              <option key={option.value} value={option.value}>{option.label}</option>
            ))}
          </select>
          <label htmlFor="categoryFilter">Filtrar por categoría:</label>
          <select id="categoryFilter" value={selectedCategory} onChange={(e) => filterProductsByCategory(e.target.value)}>
            <option value="">Todas las categorías</option>
            {productCategories.map(category => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>
          <button onClick={resetFilters}>Reiniciar Filtros</button>
        </div>
      </div>
      <div className="row">
        {filteredProducts.map(product => (
          <div key={product.id} className="col-md-4 col-sm-6 col-lg-3">
            <div className="product">
              <h3>{product.name}</h3>
              <p>{product.description}</p>
              <p>${product.price.toFixed(2)}</p>
              <button onClick={() => handleAddProduct(product)}>Añadir al Carrito</button>
            </div>
          </div>
        ))}
      </div>
      {confirmationMessage && <div className="confirmation">{confirmationMessage}</div>}
    </div>
  );
};

export default ProductList;