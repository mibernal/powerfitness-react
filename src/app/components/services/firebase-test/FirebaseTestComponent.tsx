// FirebaseTestComponent.tsx
import React, { useEffect, useState } from 'react';
import { getFirestore, collection, getDocs } from 'firebase/firestore';
import { initializeApp } from 'firebase/app';
import { firebaseConfig } from './firebaseConfig'; // Import your Firebase configuration

const FirebaseTestComponent: React.FC = () => {
  const [products, setProducts] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Initialize Firebase
    const app = initializeApp(firebaseConfig);
    const firestore = getFirestore(app);

    const fetchProducts = async () => {
      try {
        console.log('Conectando a Firebase...');
        // Fetch data from Firestore
        const querySnapshot = await getDocs(collection(firestore, 'products'));
        const productsArray: any[] = [];
        querySnapshot.forEach((doc) => {
          productsArray.push({ id: doc.id, ...doc.data() });
          console.log(doc.id, ' => ', doc.data());
        });
        setProducts(productsArray);
        console.log('Conectado a Firebase!');
      } catch (err) {
        console.error('Error de conexión:', err);
        setError('Error de conexión: ' + err);
      }
    };

    fetchProducts();
  }, []);

  return (
    <div>
      <p>firebase-test works!</p>
      {error && <p>{error}</p>}
      <ul>
        {products.map((product) => (
          <li key={product.id}>
            {product.name} {/* Adjust according to your product fields */}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default FirebaseTestComponent;
