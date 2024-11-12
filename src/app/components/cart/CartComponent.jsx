// src/app/components/cart/CartComponent.jsx

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSnackbar } from 'notistack';
import CartService from '../services/cart/CartService';

// Instancia de CartService
const cartService = new CartService();

const Cart = () => {  
  const [products, setProducts] = useState([]);
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    // Obtiene los productos del carrito al montar el componente
    setProducts(cartService.getProducts());
  }, []);

  const getTotal = () => 
    products.reduce((acc, product) => acc + (product.price || 0) * (product.quantity || 1), 0);

  const handleRemoveProduct = (productId) => {
    // Elimina el producto usando su ID y actualiza el estado
    cartService.removeProduct(productId);
    setProducts(cartService.getProducts());
    enqueueSnackbar('Producto eliminado del carrito.', { variant: 'info', autoHideDuration: 3000 });
  };

  const formatPrice = (price) => price.toLocaleString('es-ES');

  const completePurchase = () => {
    const isSuccess = true; // Simulación de éxito

    if (isSuccess) {
      navigate('/checkout'); // Redirige a la página de pago
    } else {
      enqueueSnackbar('Ha ocurrido un error al completar la compra. Por favor, inténtalo de nuevo.', { variant: 'error', autoHideDuration: 3000 });
    }
  };

  return (
    <div className="cart">
      <h2>Carrito de compras</h2>
      {products.length > 0 ? (
        <div className="products">
          {products.map((product) => (
            <div key={product.id} className="product">
              <img src={product.imageUrl[0]} alt={product.name} />
              <h3>{product.name}</h3>
              <p>{product.description}</p>
              <p>Tamaño: {product.selectedSize || 'N/A'}</p>
              <p>Sabor: {product.selectedFlavor || 'N/A'}</p>
              <p>Precio: ${formatPrice(product.price)}</p>
              <p>Cantidad: {product.quantity || 1}</p>
              <button onClick={() => handleRemoveProduct(product.id)}>Eliminar</button>
            </div>
          ))}
          <div className="total">
            <p>Total: ${formatPrice(getTotal())}</p>
            <button onClick={completePurchase}>Finalizar Pago</button>
          </div>
        </div>
      ) : (
        <p>Tu carrito de compras está vacío.</p>
      )}
    </div>
  );
};

export default Cart;
