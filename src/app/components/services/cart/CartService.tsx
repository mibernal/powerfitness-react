// src/app/components/services/cart/CartService.tsx
<<<<<<< HEAD
=======

>>>>>>> 0b3effc46d45b006412e8081938d3ea8cd4ad128
//import { useState } from 'react';
import { Product } from '../../../models/product.model';

interface CartProduct extends Product {
  quantity: number;
}

export default class CartService {
  private cart: CartProduct[] = [];

  constructor() {
    this.cart = [];  // Inicializa el carrito vacío
  }

  // Método para agregar productos al carrito
  addProduct(product: Product) {
    const existingProduct = this.cart.find((p) => p.id === product.id);
    if (existingProduct) {
      // Actualizamos la cantidad en lugar de crear un nuevo producto
      this.cart = this.cart.map(p => p.id === product.id ? { ...p, quantity: p.quantity + 1 } : p);
    } else {
      // Agregamos un nuevo producto con cantidad inicial de 1
      this.cart = [...this.cart, { ...product, quantity: 1 }];
    }
  }

  // Método para eliminar un producto del carrito
  removeProduct(productId: string) {
    this.cart = this.cart.filter((p) => p.id !== productId);
  }

  // Método para vaciar el carrito
  clearCart() {
    this.cart = [];
  }

  // Método para obtener los productos del carrito
  getProducts() {
    return this.cart;
  }

  // Método para obtener el total de la compra
  getTotal() {
    return this.cart.reduce((acc, product) => acc + (product.price || 0) * product.quantity, 0);
  }
}
