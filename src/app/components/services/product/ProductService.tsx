// src/app/components/services/product/ProductService.tsx
import { getFirestore, collection, getDocs, addDoc, updateDoc, deleteDoc, doc, query, where, orderBy, getDoc, Firestore, CollectionReference } from 'firebase/firestore';
import CsvParserService from '../../../services/csv-parser.service';

interface Product {
  id?: string;
  name: string;
  category?: string;
  size?: string;
  flavors?: string[];
  price: number;
}

class ProductService {
  firestore: Firestore;
  collectionRef: CollectionReference<Product>;
  csvParserService: CsvParserService;

  constructor() {
    this.firestore = getFirestore();
    this.collectionRef = collection(this.firestore, 'productos') as CollectionReference<Product>;
    this.csvParserService = new CsvParserService();
  }

  // Método para formatear precios
  formatPrice(price: number): string {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(price);
  }

  // Método para importar productos desde CSV
  async importProductsFromCSV(file: File): Promise<void> {
    try {
      await this.csvParserService.importProductsFromCSV(file);
    } catch (error) {
      console.error('Error importing products from CSV:', error);
      throw new Error('Error importing products from CSV');
    }
  }

  // Obtener todos los productos
  async getProducts(): Promise<Product[]> {
    try {
      const q = query(this.collectionRef, orderBy('name'));
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })) as Product[];
    } catch (error) {
      console.error('Error fetching products:', error);
      return [];
    }
  }

  // Obtener categorías de productos
  async getProductCategories(): Promise<string[]> {
    try {
      const q = query(this.collectionRef);
      const querySnapshot = await getDocs(q);
      const categories = new Set<string>();

      querySnapshot.docs.forEach((doc) => {
        const product = doc.data();
        if (product.category) categories.add(product.category);
      });

      return Array.from(categories);
    } catch (error) {
      console.error('Error fetching product categories:', error);
      return [];
    }
  }

  // Obtener un producto por su ID
  async getProductById(id: string): Promise<Product | null> {
    try {
      const productDocRef = doc(this.collectionRef, id);
      const productDoc = await getDoc(productDocRef);
      if (productDoc.exists()) {
        return { id: productDoc.id, ...productDoc.data() } as Product;
      } else {
        throw new Error('Product not found');
      }
    } catch (error) {
      console.error('Error fetching product by ID:', error);
      return null;
    }
  }

  // Crear un nuevo producto
  async createProduct(product: Omit<Product, 'id'>): Promise<Product> {
    try {
      const newProductRef = await addDoc(this.collectionRef, product);
      return { ...product, id: newProductRef.id };
    } catch (error) {
      console.error('Error creating product:', error);
      throw new Error('Error creating product');
    }
  }

  // Actualizar producto
  async updateProduct(product: Product): Promise<void> {
    try {
      if (!product.id) throw new Error("Product ID is required for update.");

      const productDocRef = doc(this.collectionRef, product.id);
      await updateDoc(productDocRef, {
        name: product.name,
        category: product.category,
        size: product.size,
        flavors: product.flavors,
        price: product.price,
      });
      console.log('Product updated');
    } catch (error) {
      console.error('Error updating product:', error);
      throw new Error('Error updating product');
    }
  }

  // Eliminar producto
  async deleteProduct(id: string): Promise<void> {
    try {
      const productDocRef = doc(this.collectionRef, id);
      await deleteDoc(productDocRef);
      console.log('Product deleted');
    } catch (error) {
      console.error('Error deleting product:', error);
      throw new Error('Error deleting product');
    }
  }

  // Obtener marcas de productos
  async getBrands(): Promise<{ id: string; name: string }[]> {
    try {
      const brandsRef = collection(this.firestore, 'brands');
      const q = query(brandsRef, orderBy('name'));
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })) as { id: string; name: string }[];
    } catch (error) {
      console.error('Error fetching brands:', error);
      return [];
    }
  }

  // Filtrar productos por un campo
  async filterProducts(field: keyof Product, value?: string): Promise<Product[]> {
    try {
      const q = value
        ? query(this.collectionRef, where(field, '==', value), orderBy('name'))
        : query(this.collectionRef, orderBy('name'));

      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })) as Product[];
    } catch (error) {
      console.error(`Error filtering products by ${field}:`, error);
      return [];
    }
  }

  // Filtrar productos por categoría
  async filterProductsByCategory(category: string): Promise<Product[]> {
    return this.filterProducts('category', category);
  }

  // Filtrar productos por tamaño
  async filterProductsBySize(selectedSize: string): Promise<Product[]> {
    return this.filterProducts('size', selectedSize);
  }

  // Filtrar productos por sabor
  async filterProductsByFlavor(selectedFlavor: string): Promise<Product[]> {
    try {
      const q = selectedFlavor
        ? query(this.collectionRef, where('flavors', 'array-contains', selectedFlavor), orderBy('name'))
        : query(this.collectionRef, orderBy('name'));

      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })) as Product[];
    } catch (error) {
      console.error('Error filtering products by flavor:', error);
      return [];
    }
  }
}

export default ProductService;
