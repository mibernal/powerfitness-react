// src/app/components/services/brand/BrandService.tsx
import { useState, useEffect, useCallback } from 'react';
import {
  getFirestore,
  collection,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  orderBy,
  query,
  CollectionReference,
} from 'firebase/firestore';
import { Brand } from '../../../models/brand.model';

const BrandService = () => {
  const [brands, setBrands] = useState<Brand[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const firestore = getFirestore();
  const collectionRef = collection(firestore, 'brands') as CollectionReference<Brand>;

  // Función para obtener las marcas
  const fetchBrands = useCallback(async () => {
    setLoading(true);
    try {
      const querySnapshot = await getDocs(query(collectionRef, orderBy('brand')));
      setBrands(querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Brand[]);
    } catch (err) {
      console.error('Error fetching brands:', err);
      setError('Error fetching brands');
    } finally {
      setLoading(false);
    }
  }, [collectionRef]);

  useEffect(() => {
    fetchBrands();
  }, [fetchBrands]);

  // Función para crear una nueva marca
  const createBrand = async (brand: Omit<Brand, 'id'>) => {
    setError(null); // Reset error before API call
    try {
      setLoading(true);
      const newBrandRef = await addDoc(collectionRef, brand);
      setBrands(prevBrands => [...prevBrands, { ...brand, id: newBrandRef.id }]);
    } catch (err) {
      console.error('Error creating brand:', err);
      setError('Error creating brand');
    } finally {
      setLoading(false);
    }
  };

  // Función para actualizar una marca
  const updateBrand = async (brand: Brand) => {
    try {
      setLoading(true);
      await updateDoc(doc(collectionRef, brand.id!), { ...brand });
      setBrands(prevBrands => prevBrands.map(b => (b.id === brand.id ? { ...b, ...brand } : b)));
    } catch (err) {
      console.error('Error updating brand:', err);
      setError('Error updating brand');
    } finally {
      setLoading(false);
    }
  };

  // Función para eliminar una marca
  const deleteBrand = async (brandId: string) => {
    try {
      setLoading(true);
      await deleteDoc(doc(collectionRef, brandId));
      setBrands(prevBrands => prevBrands.filter(b => b.id !== brandId));
    } catch (err) {
      console.error('Error deleting brand:', err);
      setError('Error deleting brand');
    } finally {
      setLoading(false);
    }
  };

  return {
    brands,
    loading,
    error,
    fetchBrands,  // Ahora fetchBrands está dentro del objeto retornado por el servicio
    createBrand,
    updateBrand,
    deleteBrand,
  };
};

export default BrandService;
