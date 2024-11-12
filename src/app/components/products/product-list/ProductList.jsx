// src/app/components/products/product-list/ProductList.jsx
// src/app/components/products/product-list/ProductList.jsx
import React, { useEffect, useState, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import ProductService from '../../services/product/ProductService';
import useCart from '../../services/cart/CartService';
import { Card, CardContent, CardMedia, Button, Typography, Select, MenuItem, FormControl } from '@mui/material';
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
  const { addProduct } = useCart();  // Usar el hook aquí

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
    setFilteredProducts(products.filter(product => !category || product.category === category));
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
    addProduct({ ...product, flavor: selectedFlavor, size: selectedSize }); // Asegurar que el tamaño y sabor se guarden
    setConfirmationMessage(`Producto agregado al carrito: ${product.name}`);
  };  

  const resetFilters = () => {
    setSelectedSize('');
    setSelectedFlavor('');
    setSelectedCategory('');
    setFilteredProducts(products);
  };

  return (
    <div className="product-list container">
      <div className="product-filters">
        <FormControl variant="outlined" className="filter-select">
          <Select value={selectedSortOrder} onChange={(e) => { setSelectedSortOrder(e.target.value); sortProducts(); }}>
            {sortOptions.map(option => (
              <MenuItem key={option.value} value={option.value}>{option.label}</MenuItem>
            ))}
          </Select>
        </FormControl>
        <FormControl variant="outlined" className="filter-select">
          <Select value={selectedCategory} onChange={(e) => filterProductsByCategory(e.target.value)}>
            <MenuItem value="">Todas las categorías</MenuItem>
            {productCategories.map(category => (
              <MenuItem key={category} value={category}>{category}</MenuItem>
            ))}
          </Select>
        </FormControl>
        <Button variant="contained" onClick={resetFilters}>Reiniciar Filtros</Button>
      </div>

      <div className="product-grid row">
        {filteredProducts.map(product => (
          <div key={product.id} className="col-md-4 col-sm-6 col-lg-3">
            <Card className="product-card">
              <CardMedia
                component="img"
                height="200"
                image={product.image || 'default-image.jpg'}
                alt={product.name}
              />
              <CardContent>
                <Typography variant="h6" component="div" className="product-title">
                  {product.name}
                </Typography>
                <Typography variant="body2" color="textSecondary" className="product-description">
                  {product.description}
                </Typography>
                <Typography variant="h6" className="product-price">
                  ${product.price.toFixed(2)}
                </Typography>
                <Button variant="contained" color="primary" onClick={() => handleAddProduct(product)}>
                  Añadir al Carrito
                </Button>
              </CardContent>
            </Card>
          </div>
        ))}
      </div>

      {confirmationMessage && <div className="confirmation-message">{confirmationMessage}</div>}
    </div>
  );
};

export default ProductList;
