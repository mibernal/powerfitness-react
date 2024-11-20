import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Product } from '../../../models/product.model';

interface CartProduct extends Product {
  quantity: number;
  flavor?: string;
  size?: string;
}

interface CartContextType {
  products: CartProduct[];
  addProduct: (product: Product, flavor?: string, size?: string) => void;
  removeProduct: (productId: string, flavor?: string, size?: string) => void;
  getTotal: () => number;
  clearCart: () => void;
}

const CartServiceContext = createContext<CartContextType | undefined>(undefined);

export const CartServiceProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [cart, setCart] = useState<CartProduct[]>([]);

  // Optimización de la función addProduct
  const addProduct = (product: Product, flavor?: string, size?: string) => {
    const existingProduct = cart.find((p) => p.id === product.id && p.flavor === flavor && p.size === size);
    if (existingProduct) {
      setCart(cart.map((p) => p.id === product.id && p.flavor === flavor && p.size === size
        ? { ...p, quantity: p.quantity + 1 }
        : p));
    } else {
      setCart((prevCart) => [...prevCart, { ...product, quantity: 1, flavor, size }]);
    }
  };

  const removeProduct = (productId: string, flavor?: string, size?: string) => {
    setCart((prevCart) => prevCart.filter((p) => p.id !== productId || p.flavor !== flavor || p.size !== size));
  };

  const getTotal = () => {
    return cart.reduce((acc, product) => acc + (product.price || 0) * product.quantity, 0);
  };

  const clearCart = () => {
    setCart([]);
  };

  return (
    <CartServiceContext.Provider value={{ products: cart, addProduct, removeProduct, getTotal, clearCart }}>
      {children}
    </CartServiceContext.Provider>
  );
};

export const useCartService = (): CartContextType => {
  const context = useContext(CartServiceContext);
  if (!context) {
    throw new Error('useCartService must be used within a CartServiceProvider');
  }
  return context;
};
