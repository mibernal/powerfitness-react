// src/environments/firebaseConfig.ts
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { getDatabase } from 'firebase/database';
import { getAnalytics } from 'firebase/analytics';

const firebaseConfig = {
  apiKey: "AIzaSyC7lNchfaIu0WJBH_NX_IntXd0qm8tNMnw",
  authDomain: "powerfitness-401b2.firebaseapp.com",
  databaseURL: "https://powerfitness-401b2-default-rtdb.firebaseio.com",
  projectId: "powerfitness-401b2",
  storageBucket: "powerfitness-401b2.appspot.com",
  messagingSenderId: "534897882835",
  appId: "1:534897882835:web:02da64f36c53c76d3c0626",
  measurementId: "G-WBLEXHV6N3"
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);

// Exportar los servicios de Firebase
export const auth = getAuth(app);
export const firestore = getFirestore(app);
export const storage = getStorage(app);
export const database = getDatabase(app);
export const analytics = getAnalytics(app);

// Exporta para usar en otros archivos
export default app;