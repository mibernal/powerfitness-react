import React, { useEffect, useState, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import { ProductService } from '../../services/product/ProductService';
import { useCartService } from '../../services/cart/CartService';
import {
  Card,
  CardContent,
  CardMedia,
  Button,
  Typography,
  Select,
  MenuItem,
  FormControl,
} from '@mui/material';
import './ProductList.scss';

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [productCategories, setProductCategories] = useState([]);
  const [selectedFilters, setSelectedFilters] = useState({
    size: '',
    flavor: '',
    category: '',
    sortOrder: 'popularity',
  });
  const [confirmationMessage, setConfirmationMessage] = useState('');

  const location = useLocation();
  const { addProduct } = useCartService();
  const { getProducts, getProductCategories } = ProductService();

  const sortOptions = [
    { value: 'popularity', label: 'Popularidad' },
    { value: 'averageRating', label: 'Puntuación media' },
    { value: 'latestAdded', label: 'Últimos agregados' },
    { value: 'lowToHigh', label: 'Precio bajo a alto' },
    { value: 'highToLow', label: 'Precio alto a bajo' },
    { value: 'atoz', label: 'De la A a la Z' },
  ];

  // Fetch products and categories with error handling
  const fetchProducts = useCallback(async () => {
    try {
      const fetchedProducts = await getProducts();
      setProducts(fetchedProducts);
      setFilteredProducts(fetchedProducts);

      const categories = await getProductCategories();
      setProductCategories(categories);
    } catch (error) {
      console.error('Error fetching products or categories:', error);
      setConfirmationMessage('Hubo un problema al cargar los productos o categorías.');
    }
  }, [getProducts, getProductCategories]);

  // Apply selected filters to the product list
  const applyFilters = useCallback(() => {
    const { category, sortOrder, size, flavor } = selectedFilters;
    let updatedProducts = [...products];

    if (category) {
      updatedProducts = updatedProducts.filter((product) => product.category === category);
    }

    if (size) {
      updatedProducts = updatedProducts.filter((product) => product.sizes?.includes(size));
    }

    if (flavor) {
      updatedProducts = updatedProducts.filter((product) => product.flavors?.includes(flavor));
    }

    updatedProducts.sort((a, b) => {
      switch (sortOrder) {
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

    setFilteredProducts(updatedProducts);
  }, [products, selectedFilters]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const category = queryParams.get('category');
    if (category) {
      setSelectedFilters((prev) => ({ ...prev, category }));
    }
  }, [location]);

  useEffect(() => {
    applyFilters();
  }, [applyFilters]);

  const handleAddProduct = (product) => {
    const { flavor, size } = selectedFilters;

    // Verificar si los filtros coinciden con las opciones disponibles del producto
    if ((product.flavors?.length > 0 && !flavor) || (product.sizes?.length > 0 && !size)) {
      setConfirmationMessage('Selecciona un tamaño o sabor.');
      return;
    }

    // Verificar que el sabor y el tamaño estén disponibles antes de agregar al carrito
    if (product.flavors?.includes(flavor) && product.sizes?.includes(size)) {
      addProduct({ ...product, flavor, size });
      setConfirmationMessage(`Producto agregado al carrito: ${product.name}`);
    } else {
      setConfirmationMessage('El sabor o tamaño seleccionado no está disponible.');
    }
  };

  const resetFilters = () => {
    setSelectedFilters({
      size: '',
      flavor: '',
      category: '',
      sortOrder: 'popularity',
    });
    setFilteredProducts(products);
  };

  return (
    <div className="product-list container">
      <div className="product-filters">
        <FormControl variant="outlined" className="filter-select">
          <Select
            value={selectedFilters.sortOrder}
            onChange={(e) =>
              setSelectedFilters((prev) => ({
                ...prev,
                sortOrder: e.target.value,
              }))
            }
          >
            {sortOptions.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <FormControl variant="outlined" className="filter-select">
          <Select
            value={selectedFilters.category}
            onChange={(e) =>
              setSelectedFilters((prev) => ({
                ...prev,
                category: e.target.value,
              }))
            }
          >
            <MenuItem value="">Todas las categorías</MenuItem>
            {productCategories.map((category) => (
              <MenuItem key={category} value={category}>
                {category}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <Button variant="contained" onClick={resetFilters}>
          Reiniciar Filtros
        </Button>
      </div>

      <div className="product-grid row">
        {filteredProducts.length ? (
          filteredProducts.map((product) => (
            <div key={product.id} className="col-md-4">
              <Card>
                <CardMedia
                  component="img"
                  alt={product.name}
                  image={Array.isArray(product.imageUrls) ? product.imageUrls[0] : product.imageUrls || ''}
                  title={product.name}
                />
                <CardContent>
                  <Typography variant="h6">{product.name}</Typography>
                  <Typography variant="body2">{product.description}</Typography>
                  <Typography variant="body1">${product.price}</Typography>

                  {/* Mostrar sabores solo si están disponibles */}
                  <FormControl variant="outlined" className="filter-select">
                    {Array.isArray(product.flavors) && product.flavors.length > 0 && (
                      <Select
                        value={selectedFilters.flavor || ''}
                        onChange={(e) => {
                          const selectedFlavor = e.target.value;
                          // Validar que el sabor seleccionado esté disponible
                          if (product.flavors.includes(selectedFlavor)) {
                            setSelectedFilters((prev) => ({
                              ...prev,
                              flavor: selectedFlavor,
                            }));
                          } else {
                            setSelectedFilters((prev) => ({
                              ...prev,
                              flavor: '',
                            }));
                          }
                        }}
                      >
                        {product.flavors.map((flavor) => (
                          <MenuItem key={flavor} value={flavor}>
                            {flavor}
                          </MenuItem>
                        ))}
                      </Select>
                    )}
                  </FormControl>

                  {/* Mostrar tamaños solo si están disponibles */}
                  <FormControl variant="outlined" className="filter-select">
                    {Array.isArray(product.sizes) && product.sizes.length > 0 && (
                      <Select
                        value={selectedFilters.size || ''}
                        onChange={(e) =>
                          setSelectedFilters((prev) => ({
                            ...prev,
                            size: e.target.value,
                          }))
                        }
                      >
                        {product.sizes.map((size) => (
                          <MenuItem key={size} value={size}>
                            {size}
                          </MenuItem>
                        ))}
                      </Select>
                    )}
                  </FormControl>

                  <Button onClick={() => handleAddProduct(product)}>Agregar al carrito</Button>
                </CardContent>
              </Card>
            </div>
          ))
        ) : (
          <Typography variant="h6">No se encontraron productos</Typography>
        )}
      </div>
      {confirmationMessage && <div className="confirmation-message">{confirmationMessage}</div>}
    </div>
  );
};

export default ProductList;
