// src/app/components/services/cart/CartService.tsx
import { Product } from '../../../models/product.model';

interface CartProduct extends Product {
  quantity: number;
}

class CartService {
  private products: CartProduct[];

  constructor() {
    this.products = [];
  }

  // Obtener todos los productos
  getProducts(): CartProduct[] {
    return this.products;
  }

  // Agregar un producto
  addProduct(product: Product): void {
    const existingProduct = this.products.find((p) => p.id === product.id);

    if (existingProduct) {
      // Incrementar cantidad si el producto ya existe
      this.products = this.products.map((p) =>
        p.id === product.id
          ? { ...p, quantity: p.quantity + 1 }
          : p
      );
    } else {
      // Agregar nuevo producto con cantidad inicial de 1
      this.products = [...this.products, { ...product, quantity: 1 }];
    }
  }

  // Eliminar un producto
  removeProduct(productId: string): void {
    this.products = this.products.filter((p) => p.id !== productId);
  }

  // Limpiar el carrito
  clearCart(): void {
    this.products = [];
  }

  // Obtener el total
  getTotal(): number {
    return this.products.reduce(
      (acc, product) => acc + (product.price || 0) * product.quantity,
      0
    );
  }

  // Actualizar un producto en el carrito
  updateProduct(productId: string, updates: Partial<CartProduct>): void {
    this.products = this.products.map((p) =>
      p.id === productId ? { ...p, ...updates } : p
    );
  }
}

export default CartService;
