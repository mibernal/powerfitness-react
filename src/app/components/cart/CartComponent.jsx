// src/app/components/cart/CartComponent.jsx

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSnackbar } from 'notistack';
import { useCartService } from '../services/cart/CartService'; // Utilizamos el hook de contexto

const Cart = () => {  
  const [products, setProducts] = useState([]);
  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();
  const { products: cartProducts, removeProduct, getTotal } = useCartService(); // Usamos el hook `useCartService`

  // Actualiza el estado con los productos del carrito cuando se monta el componente
  useEffect(() => {
    setProducts(cartProducts);
  }, [cartProducts]); // Dependencia de cartProducts para actualizar el estado correctamente

  const handleRemoveProduct = (productId) => {
    removeProduct(productId);  // Llamamos a la función de eliminación del contexto
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
