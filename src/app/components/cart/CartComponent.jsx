//src\app\components\cart\CartComponent.jsx

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSnackbar } from 'notistack';
import  CartService  from '../services/cart/CartService';

const Cart = () => {  
  const [products, setProducts] = useState([]);
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const { getProducts, removeProduct } = CartService(); // Utiliza el servicio del carrito

  useEffect(() => {
    setProducts(getProducts()); // Obtén los productos del carrito
  }, [getProducts]);

  const getTotal = () => products.reduce((acc, product) => acc + product.price * (product.quantity || 1), 0); // Multiplica por la cantidad si está definida

  const handleRemoveProduct = (productId) => { // Cambia el parámetro a productId
    removeProduct(productId); // Elimina el producto usando su ID
    setProducts(getProducts()); // Actualiza los productos en el estado
    enqueueSnackbar('Producto eliminado del carrito.', { variant: 'info', autoHideDuration: 3000 }); // Mensaje de notificación
  };

  const formatPrice = (price) => price.toLocaleString('es-ES'); // Formato de precio

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
          {products.map((product, index) => (
            <div key={index} className="product">
              <img src={product.imageUrl[0]} alt={product.name} />
              <h3>{product.name}</h3>
              <p>{product.description}</p>
              <p>Tamaño: {product.selectedSize || 'N/A'}</p>
              <p>Sabor: {product.selectedFlavor || 'N/A'}</p>
              <p>Precio: ${formatPrice(product.price)}</p>
              <p>Cantidad: {product.quantity || 1}</p> {/* Muestra la cantidad */}
              <button onClick={() => handleRemoveProduct(product.id)}>Eliminar</button> {/* Usa el ID del producto */}
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
