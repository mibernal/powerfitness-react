//src\app\components\checkout\Checkout.tsx:
import React, { useEffect, useState } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { Product } from '../../models/product.model';
import  CartService  from '../services/cart/CartService';
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
    size?: string;
    flavor?: string;
  }>;
};

const Checkout: React.FC = () => {
  const { register, handleSubmit, formState: { errors }, setValue, watch } = useForm<FormData>();
  const navigate = useNavigate();
  const { getProducts, getTotal, removeProduct } = new  CartService();
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
  }, [getProducts, getTotal]);

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
    data.productos = products.map(product => ({
      brand: product.brand || '',
      category: product.category || '',
      description: product.description,
      discount: product.discount || 0,
      id: product.id || '',
      nombre: product.name,
      precio: product.price,
      cantidad: product.quantity,
      size: '',
      flavor: '',
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
          <div className="form-group">
            <label htmlFor="numero_documento">Número de documento:</label>
            <input type="text" {...register("numero_documento", { required: "Campo requerido" })} />
            {errors.numero_documento && <span>{errors.numero_documento.message}</span>}
          </div>
          <div className="form-group">
            <label htmlFor="email">Email:</label>
            <input type="email" {...register("email", { required: "Campo requerido", pattern: /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,4}$/i })} />
            {errors.email && <span>{errors.email.message || "Email inválido"}</span>}
          </div>
          <div className="form-group">
            <label htmlFor="nombres">Nombres:</label>
            <input type="text" {...register("nombres", { required: "Campo requerido" })} />
            {errors.nombres && <span>{errors.nombres.message}</span>}
          </div>
          <div className="form-group">
            <label htmlFor="apellidos">Apellidos:</label>
            <input type="text" {...register("apellidos", { required: "Campo requerido" })} />
            {errors.apellidos && <span>{errors.apellidos.message}</span>}
          </div>
          <div className="form-group">
            <label htmlFor="departamento">Departamento:</label>
            <select {...register("departamento", { required: "Campo requerido" })}>
              <option value="">Seleccione un departamento</option>
              {departments.map((department) => (
                <option key={department} value={department}>{department}</option>
              ))}
            </select>
            {errors.departamento && <span>{errors.departamento.message}</span>}
          </div>
          <div className="form-group">
            <label htmlFor="ciudad">Ciudad:</label>
            <select {...register("ciudad", { required: "Campo requerido" })}>
              <option value="">Seleccione una ciudad</option>
              {cities.map((ciudad) => (
                <option key={ciudad} value={ciudad}>{ciudad}</option>
              ))}
            </select>
            {errors.ciudad && <span>{errors.ciudad.message}</span>}
          </div>
          <button type="submit">Realizar pedido</button>
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
