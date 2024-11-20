// src/app/components/services/product/ProductService.tsx
import {  
  collection, 
  getDocs, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  query, 
  where, 
  orderBy, 
  getDoc, 
  Firestore, 
  CollectionReference 
} from 'firebase/firestore';
import CsvParserService from '../../../services/csv-parser.service';
import { Product } from '../../../models/product.model'; // Importa el tipo Product desde el modelo
import { firestore } from '../../../../environments/firebaseConfig';

export function ProductService() {  
  const firestoreInstance: Firestore = firestore;
  const collectionRef: CollectionReference = collection(firestoreInstance, 'productos');
  const csvParserService = new CsvParserService();

  // Método para formatear precios
  const formatPrice = (price: number): string => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(price);
  };

  // Método para importar productos desde un archivo CSV
  const importProductsFromCSV = async (file: File): Promise<void> => {
    try {
      await csvParserService.importProductsFromCSV(file);
    } catch (error) {
      console.error('Error importing products from CSV:', error);
      throw new Error('Error importing products from CSV');
    }
  };

  // Obtener productos con paginación (si es necesario)
  const getProducts = async (): Promise<Product[]> => {
    try {
      const q = query(collectionRef, orderBy('name'));
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })) as Product[];
    } catch (error) {
      console.error('Error fetching products:', error);
      return [];
    }
  };

  // Obtener categorías de productos
  const getProductCategories = async (): Promise<string[]> => {
    try {
      const q = query(collectionRef);
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
  };

  // Obtener un producto por ID
  const getProductById = async (id: string): Promise<Product | null> => {
    try {
      const productDocRef = doc(collectionRef, id);
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
  };

  // Crear un nuevo producto
  const createProduct = async (product: Omit<Product, 'id'>): Promise<Product> => {
    try {
      const newProductRef = await addDoc(collectionRef, product);
      return { ...product, id: newProductRef.id };
    } catch (error) {
      console.error('Error creating product:', error);
      throw new Error('Error creating product');
    }
  };

  // Actualizar un producto
  const updateProduct = async (product: Product): Promise<void> => {
    try {
      if (!product.id) throw new Error("Product ID is required for update.");
      const productDocRef = doc(collectionRef, product.id);
      await updateDoc(productDocRef, {
        name: product.name,
        category: product.category,
        sizes: product.sizes,
        flavors: product.flavors,
        price: product.price,
      });
      console.log('Product updated');
    } catch (error) {
      console.error('Error updating product:', error);
      throw new Error('Error updating product');
    }
  };

  // Eliminar un producto
  const deleteProduct = async (id: string): Promise<void> => {
    try {
      const productDocRef = doc(collectionRef, id);
      await deleteDoc(productDocRef);
      console.log('Product deleted');
    } catch (error) {
      console.error('Error deleting product:', error);
      throw new Error('Error deleting product');
    }
  };

  // Obtener marcas
  const getBrands = async (): Promise<{ id: string; name: string }[]> => {
    try {
      const brandsRef = collection(firestoreInstance, 'brands');
      const q = query(brandsRef, orderBy('name'));
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })) as { id: string; name: string }[];
    } catch (error) {
      console.error('Error fetching brands:', error);
      return [];
    }
  };

  // Filtrar productos por campo
  const filterProducts = async (field: keyof Product, value?: string): Promise<Product[]> => {
    try {
      const q = value
        ? query(collectionRef, where(field, '==', value), orderBy('name'))
        : query(collectionRef, orderBy('name'));

      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })) as Product[];
    } catch (error) {
      console.error(`Error filtering products by ${field}:`, error);
      return [];
    }
  };

  // Filtrar productos por categoría
  const filterProductsByCategory = async (category: string): Promise<Product[]> => {
    return filterProducts('category', category);
  };

  // Filtrar productos por tamaño
  const filterProductsBySize = async (selectedSize: string): Promise<Product[]> => {
    return filterProducts('sizes', selectedSize);
  };

  // Filtrar productos por sabor
  const filterProductsByFlavor = async (selectedFlavor: string): Promise<Product[]> => {
    try {
      const q = selectedFlavor
        ? query(collectionRef, where('flavors', 'array-contains', selectedFlavor), orderBy('name'))
        : query(collectionRef, orderBy('name'));

      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })) as Product[];
    } catch (error) {
      console.error('Error filtering products by flavor:', error);
      return [];
    }
  };

  return {
    formatPrice,
    importProductsFromCSV,
    getProducts,
    getProductCategories,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct,
    getBrands,
    filterProducts,
    filterProductsByCategory,
    filterProductsBySize,
    filterProductsByFlavor,
  };
}
