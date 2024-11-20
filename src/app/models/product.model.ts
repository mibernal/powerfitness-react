//src\app\models\product.model.ts:

export interface Product {
  id: string;                // Identificador único del producto
  name: string;              // Nombre del producto
  description: string;       // Descripción del producto
  price: number;             // Precio del producto
  quantity: number;          // Cantidad disponible en el carrito
  stock: number;             // Stock disponible del producto
  discount: number;          // Descuento aplicado al producto (porcentaje o valor)
  flavors: string[];         // Lista de sabores disponibles (si aplica)
  sizes: string[];           // Lista de tamaños disponibles (si aplica)
  currentImageIndex: number; // Índice de la imagen que se muestra actualmente
  imageUrls: string[];       // URLs de las imágenes del producto
  dateAdded?: Date;          // Fecha en que se agregó el producto (opcional)
  brand?: string;            // Marca del producto (opcional)
  category?: string;         // Categoría del producto (opcional)
  isAvailable?: boolean;     // Indica si el producto está disponible para su compra (opcional)
  rating?: number;           // Calificación promedio del producto (opcional)
}
