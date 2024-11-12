// src/app/components/checkout/Checkout.tsx
import React, { useEffect, useState } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { Product } from '../../models/product.model';
import CartService from '../services/cart/CartService';
import { useLocation } from '../services/location/LocationService';
import { useOrder } from '../services/order/OrderService';

type FormData = {
  numero_documento: string;
  email: string;
  nombres: string;
  apellidos: string;
  departamento: string;
  ciudad: string;
  direccion_envio: string;
  complemento?: string;
  celular: string;
  notas?: string;
  fecha: string;
  numero_pedido?: string;
  estado?: string;
  productos: Array<{
    brand?: string;
    category?: string;
    description: string;
    discount?: number;
    id: string;
    nombre: string;
    precio: number;
    cantidad: number;
    size: string[];   // Cambiado para aceptar un array de strings
    flavor: string[]; // Cambiado para aceptar un array de strings
  }>;
};

const Checkout: React.FC = () => {
  const { register, handleSubmit, formState: { errors }, setValue, watch } = useForm<FormData>();
  const navigate = useNavigate();
  const cartService = new CartService();  // Instanciamos CartService correctamente
  const { getProducts, getTotal, removeProduct } = cartService;
  const { departments, getCitiesByDepartment } = useLocation();
  const { createOrder } = useOrder();
  const [products, setProducts] = useState<Product[]>([]);
  const [total, setTotal] = useState<number>(0);
  const [cities, setCities] = useState<string[]>([]);
  const [simularPago, setSimularPago] = useState(false);

  useEffect(() => {
    const productsList = getProducts();
    const totalAmount = getTotal();
    setProducts(productsList);
    setTotal(totalAmount);
  }, [getProducts, getTotal]);  // Se actualiza cuando los productos del carrito cambian

  useEffect(() => {
    const departamento = watch("departamento");
    if (departamento) {
      // Llama a la función que ya no retorna un valor
      getCitiesByDepartment(departamento);
    } else {
      setCities([]); // Limpia las ciudades si no hay departamento seleccionado
    }
  }, [watch("departamento"), getCitiesByDepartment]);
  
  const onSubmit: SubmitHandler<FormData> = async (data) => {
    // Aquí los productos se toman directamente del carrito
    data.productos = products.map(product => ({
      brand: product.brand || '',
      category: product.category || '',
      description: product.description,
      discount: product.discount || 0,
      id: product.id || '',
      nombre: product.name,
      precio: product.price,
      cantidad: product.quantity,
      size: product.sizes, // Se deja el array de 'sizes' como está
      flavor: product.flavors, // Se deja el array de 'flavors' como está
    }));

    try {
      const orderId = await createOrder(data);
      console.log('Pedido guardado exitosamente. ID del pedido:', orderId);
      if (simularPago) {
        simularPagoExitoso();
      } else {
        navigate('/exito-pedido');
      }
    } catch (error) {
      console.error('Error al guardar el pedido:', error);
    }
  };

  const simularPagoExitoso = () => {
    console.log('Pago simulado exitosamente.');
  };

  const handleRemoveProduct = (productId: string) => {
    removeProduct(productId);
    const updatedProducts = getProducts();
    setProducts(updatedProducts);
    setTotal(getTotal());
  };

  return (
    <div className="checkout-container">
      <div className="checkout-form">
        <h2>Checkout</h2>
        <form onSubmit={handleSubmit(onSubmit)}>
          {/* Formulario */}
        </form>
      </div>

      <div className="payment-summary">
        <h2>Resumen de pedido</h2>
        {products.map((product) => (
          <div key={product.id} className="product-item">
            <img src={product.imageUrls[0]} alt={product.name} />
            <div className="product-details">
              <h3>{product.name}</h3>
              <p>{product.description}</p>
              <p>Precio: ${product.price}</p>
            </div>
            <button onClick={() => handleRemoveProduct(product.id)}>Eliminar</button>
          </div>
        ))}
        <div className="total">
          <p>Total: ${total}</p>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
