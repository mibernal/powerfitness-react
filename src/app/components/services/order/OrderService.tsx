//src\app\components\services\order\OrderService.tsx
import React, { createContext, useContext, ReactNode } from 'react';
import { getFirestore, collection, addDoc, getDocs, query, where } from 'firebase/firestore';

// Definición de tipos para un pedido
interface Order {
  numero_pedido?: string;
  estado?: string;
  email?: string;
  [key: string]: any;
}

interface OrderContextType {
  createOrder: (order: Order) => Promise<string>;
  getOrder: (orderNumber: string) => Promise<Order | null>;
  getUserOrdersByEmail: (email: string) => Promise<Order[]>;
  getUserAddresses: (email: string) => Promise<any[]>;
  getAllOrders: () => Promise<Order[]>;
}

const OrderContext = createContext<OrderContextType | undefined>(undefined);

export const OrderProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const db = getFirestore();
  const ordersCollection = collection(db, 'pedidos');
  const addressCollection = collection(db, 'direcciones');

  const createOrder = async (order: Order): Promise<string> => {
    const numeroPedido = generateOrderNumber();
    order.numero_pedido = numeroPedido;
    order.estado = 'pendiente';

    try {
      await addDoc(ordersCollection, order);
      return numeroPedido;
    } catch (error) {
      console.error('Error creating order:', error);
      throw error;
    }
  };

  const getOrder = async (orderNumber: string): Promise<Order | null> => {
    try {
      const q = query(ordersCollection, where('numero_pedido', '==', orderNumber));
      const snapshot = await getDocs(q);
      const details = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Order[];
      return details[0] || null;
    } catch (error) {
      console.error('Error fetching order details:', error);
      return null;
    }
  };

  const getUserOrdersByEmail = async (email: string): Promise<Order[]> => {
    try {
      const q = query(ordersCollection, where('email', '==', email));
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Order[];
    } catch (error) {
      console.error('Error fetching user orders:', error);
      return [];
    }
  };

  const getUserAddresses = async (email: string): Promise<any[]> => {
    try {
      const q = query(addressCollection, where('email', '==', email));
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
      console.error('Error fetching user addresses:', error);
      return [];
    }
  };

  const getAllOrders = async (): Promise<Order[]> => {
    try {
      const snapshot = await getDocs(ordersCollection);
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Order[];
    } catch (error) {
      console.error('Error fetching all orders:', error);
      return [];
    }
  };

  const generateOrderNumber = (): string => {
    const timestamp = new Date().getTime();
    const random = Math.floor(Math.random() * 1000);
    return `ORDER-${timestamp}-${random}`;
  };

  return (
    <OrderContext.Provider
      value={{
        createOrder,
        getOrder,
        getUserOrdersByEmail,
        getUserAddresses,
        getAllOrders,
      }}
    >
      {children}
    </OrderContext.Provider>
  );
};

export const useOrder = () => {
  const context = useContext(OrderContext);
  if (!context) {
    throw new Error('useOrder must be used within an OrderProvider');
  }
  return context;
};

// Asigna el objeto a una variable antes de exportarlo
const OrderService = { OrderProvider, useOrder };

export default OrderService;