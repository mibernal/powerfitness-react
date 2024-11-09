// src/app/components/user-panel/UserPanel.jsx
import React, { useEffect, useState, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { useSnackbar } from 'notistack';
import { useAuth } from '../services/auth/AuthService';
import { useOrder } from '../services/order/OrderService';

const UserPanel = () => {
  const { enqueueSnackbar } = useSnackbar();
  const [selectedModule, setSelectedModule] = useState('profile');
  const { register, handleSubmit, setValue, formState: { errors }, watch } = useForm();
  const passwordForm = useForm({ mode: 'onChange' });
  const { currentUser, updateUserProfile, changeUserPassword, logout } = useAuth();
  const { getUserOrdersByEmail, getAllOrders, getOrder } = useOrder();
  const [userOrders, setUserOrders] = useState([]);
  const [orderDetails, setOrderDetails] = useState(null);
  const [userAddresses, setUserAddresses] = useState([]);

  const loadUserOrders = useCallback(async () => {
    try {
      const orders = await getUserOrdersByEmail(currentUser.email);
      setUserOrders(orders.map(order => ({ ...order, showDetails: false })));
    } catch (error) {
      enqueueSnackbar('Error al cargar los pedidos', { variant: 'error' });
    }
  }, [currentUser.email, enqueueSnackbar, getUserOrdersByEmail]);

  const loadUserAddresses = useCallback(async () => {
    try {
      const allOrders = await getAllOrders();
      const addresses = allOrders.filter(order => order.email === currentUser.email)
        .map(order => ({
          direccion: order.direccion_envio,
          ciudad: order.ciudad,
          departamento: order.departamento
        }));
      setUserAddresses(addresses);
    } catch (error) {
      enqueueSnackbar('Error al cargar las direcciones', { variant: 'error' });
    }
  }, [currentUser.email, enqueueSnackbar, getAllOrders]);

  useEffect(() => {
    if (currentUser) {
      setValue('name', currentUser.displayName || '');
      setValue('email', currentUser.email || '');
      loadUserOrders();
      loadUserAddresses();
    }
  }, [currentUser, setValue, loadUserOrders, loadUserAddresses]);

  useEffect(() => {
    const subscription = watch((value) => {
      if (value.name && value.name.length < 3) {
        enqueueSnackbar('El nombre debe tener al menos 3 caracteres', { variant: 'warning' });
      }
    });
    return () => subscription.unsubscribe();
  }, [watch, enqueueSnackbar]);

  const viewOrderDetails = async (order) => {
    const updatedOrders = userOrders.map(o =>
      o.numero_pedido === order.numero_pedido ? { ...o, showDetails: !o.showDetails } : o
    );
    setUserOrders(updatedOrders);

    if (updatedOrders.find(o => o.numero_pedido === order.numero_pedido).showDetails) {
      try {
        const details = await getOrder(order.numero_pedido);
        setOrderDetails(details);
      } catch (error) {
        enqueueSnackbar('Error al cargar los detalles del pedido', { variant: 'error' });
      }
    } else {
      setOrderDetails(null);
    }
  };

  const handleUpdateProfile = async (data) => {
    try {
      await updateUserProfile(data.name, data.email);
      enqueueSnackbar('Perfil actualizado exitosamente', { variant: 'success' });
    } catch {
      enqueueSnackbar('Error al actualizar el perfil', { variant: 'error' });
    }
  };

  const handleChangePassword = async (data) => {
    if (data.newPassword !== data.confirmPassword) {
      enqueueSnackbar('Las contraseñas no coinciden', { variant: 'error' });
      return;
    }
    try {
      await changeUserPassword(data.currentPassword, data.newPassword);
      enqueueSnackbar('Contraseña actualizada', { variant: 'success' });
    } catch {
      enqueueSnackbar('Error al actualizar la contraseña', { variant: 'error' });
    }
  };

  return (
    <div className="container">
      <div className="menu">
        <ul className="menu-items">
          <li onClick={() => setSelectedModule('profile')}>Perfil</li>
          <li onClick={() => setSelectedModule('password')}>Cambiar Contraseña</li>
          <li onClick={() => setSelectedModule('orders')}>Pedidos</li>
          <li onClick={() => setSelectedModule('addresses')}>Direcciones</li>
          <li onClick={() => setSelectedModule('logout')}>Salir</li>
        </ul>
      </div>

      <div className="content">
        {selectedModule === 'profile' && (
          <form onSubmit={handleSubmit(handleUpdateProfile)}>
            <h2>Perfil</h2>
            <div>
              <label>Nombre</label>
              <input {...register('name', { required: true })} />
              {errors.name && <span>Este campo es obligatorio</span>}
            </div>
            <div>
              <label>Email</label>
              <input {...register('email', { required: true })} />
              {errors.email && <span>Este campo es obligatorio</span>}
            </div>
            <button type="submit">Actualizar Perfil</button>
          </form>
        )}

        {selectedModule === 'password' && (
          <form onSubmit={passwordForm.handleSubmit(handleChangePassword)}>
            <h2>Cambiar Contraseña</h2>
            <div>
              <label>Contraseña Actual</label>
              <input type="password" {...passwordForm.register('currentPassword', { required: true })} />
            </div>
            <div>
              <label>Nueva Contraseña</label>
              <input type="password" {...passwordForm.register('newPassword', { required: true, minLength: 6 })} />
            </div>
            <div>
              <label>Confirmar Contraseña</label>
              <input type="password" {...passwordForm.register('confirmPassword', { required: true })} />
            </div>
            <button type="submit">Actualizar Contraseña</button>
          </form>
        )}
        
        {selectedModule === 'orders' && (
          <div>
            <h2>Pedidos</h2>
            {userOrders.map(order => (
              <div key={order.numero_pedido}>
                <p>Pedido {order.numero_pedido}</p>
                <button onClick={() => viewOrderDetails(order)}>Ver Detalle</button>
                {order.showDetails && orderDetails && (
                  <div>
                    {orderDetails.productos.map(product => (
                      <div key={product.id}>
                        <p>Producto: {product.nombre}</p>
                        <p>Precio: {product.precio}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {selectedModule === 'addresses' && (
          <div>
            <h2>Direcciones</h2>
            {userAddresses.map((address, index) => (
              <div key={index}>
                <p>Dirección: {address.direccion}</p>
                <p>Ciudad: {address.ciudad}</p>
              </div>
            ))}
          </div>
        )}

        {selectedModule === 'logout' && (
          <button onClick={logout}>Salir</button>
        )}
      </div>
    </div>
  );
};

export default UserPanel;
