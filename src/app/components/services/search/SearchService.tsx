// src/app/components/services/search/SearchService.tsx

import { useEffect, useState } from 'react';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { firestore } from '../../../../environments/firebaseConfig'; // Ruta correcta

// Interfaces para los resultados de búsqueda
export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  quantity: number;
  stock: number;
  discount: number;
  flavors: string[];
  sizes: string[];
  currentImageIndex: number;
  imageUrls: string[];
  dateAdded?: Date;
  brand?: string;
  category?: string;
}

export interface Category {
  id: string;
  name: string;
}

export interface SearchResults {
  products: Product[];
  categories: Category[];
}

interface SearchHookResults extends SearchResults {
  loading: boolean;
}

// Hook para realizar la búsqueda
export const useSearch = (searchQuery: string): SearchHookResults => {
  const [results, setResults] = useState<SearchResults>({ products: [], categories: [] });
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    // Función para obtener los resultados de búsqueda
    const fetchResults = async () => {
      if (searchQuery) {
        setLoading(true);
        try {
          const lowerCaseQuery = searchQuery.toLowerCase();
          const productsRef = collection(firestore, 'products');
          const categoriesRef = collection(firestore, 'categories');

          const productsQuery = query(
            productsRef,
            where('name', '>=', lowerCaseQuery),
            where('name', '<=', lowerCaseQuery + '\uf8ff')
          );

          const categoriesQuery = query(
            categoriesRef,
            where('name', '>=', lowerCaseQuery),
            where('name', '<=', lowerCaseQuery + '\uf8ff')
          );

          // Ejecutamos las consultas para productos y categorías
          const [productsSnapshot, categoriesSnapshot] = await Promise.all([
            getDocs(productsQuery),
            getDocs(categoriesQuery),
          ]);

          // Mapeamos los productos con todos los campos necesarios
          const products = productsSnapshot.docs.map((doc) => {
            const data = doc.data();
            return {
              id: doc.id,
              name: data.name,
              description: data.description || '', // Asegúrate de asignar valores predeterminados si el campo no existe
              price: data.price || 0,
              quantity: data.quantity || 0,
              stock: data.stock || 0,
              discount: data.discount || 0,
              flavors: data.flavors || [],
              sizes: data.sizes || [],
              currentImageIndex: data.currentImageIndex || 0,
              imageUrls: data.imageUrls || [],
              dateAdded: data.dateAdded ? new Date(data.dateAdded) : undefined,
              brand: data.brand || '',
              category: data.category || ''
            };
          });

          // Mapeamos las categorías
          const categories = categoriesSnapshot.docs.map((doc) => ({ id: doc.id, name: doc.data().name }));

          setResults({ products, categories });
        } catch (error) {
          console.error('Error fetching search results:', error);
        } finally {
          setLoading(false);
        }
      } else {
        setResults({ products: [], categories: [] }); // Resultados vacíos si no hay búsqueda
      }
    };

    fetchResults(); // Llamada a la función para obtener los resultados

  }, [searchQuery]); // Ejecutar cada vez que searchQuery cambie

  return { ...results, loading };
};
