// src/app/components/services/auth/AuthService.tsx
import React, { createContext, useEffect, useState, useContext, ReactNode } from 'react';
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';
import { firestore } from '../../../../environments/firebaseConfig';
import { doc, updateDoc } from 'firebase/firestore';

// Definición de tipos para el contexto de autenticación
interface AuthContextType {
  user: firebase.User | null;
  signUpWithEmailAndPassword: (email: string, password: string) => Promise<firebase.auth.UserCredential>;
  signInWithGoogle: () => Promise<firebase.auth.UserCredential>;
  signInWithFacebook: () => Promise<firebase.auth.UserCredential>;
  signOut: () => Promise<void>;
  updateUserProfile: (name: string, email: string) => Promise<void>;
  changeUserPassword: (currentPassword: string, newPassword: string) => Promise<void>;
}

// Creación del contexto de autenticación
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Proveedor de contexto de autenticación
export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<firebase.User | null>(null);

  // Monitoreo del estado de autenticación del usuario
  useEffect(() => {
    const unsubscribe = firebase.auth().onAuthStateChanged((authUser) => {
      setUser(authUser);
    });
    return () => unsubscribe();
  }, []);

  // Función de registro con email y contraseña
  const signUpWithEmailAndPassword = async (email: string, password: string) => {
    try {
      return await firebase.auth().createUserWithEmailAndPassword(email, password);
    } catch (error) {
      console.error('Error during sign up with email and password:', error);
      throw error;
    }
  };

  // Función de inicio de sesión con Google
  const signInWithGoogle = async () => {
    const provider = new firebase.auth.GoogleAuthProvider();
    try {
      return await firebase.auth().signInWithPopup(provider);
    } catch (error) {
      console.error('Error during Google sign in:', error);
      throw error;
    }
  };

  // Función de inicio de sesión con Facebook
  const signInWithFacebook = async () => {
    const provider = new firebase.auth.FacebookAuthProvider();
    try {
      return await firebase.auth().signInWithPopup(provider);
    } catch (error) {
      console.error('Error during Facebook sign in:', error);
      throw error;
    }
  };

  // Función para cerrar sesión
  const signOut = async () => {
    try {
      await firebase.auth().signOut();
      setUser(null);
    } catch (error) {
      console.error('Error during sign out:', error);
      throw error;
    }
  };

  // Función para actualizar el perfil del usuario en Firebase y Firestore
  const updateUserProfile = async (name: string, email: string) => {
    if (!user) throw new Error('User not authenticated');
    try {
      // Referencia al documento del usuario en Firestore
      const userDocRef = doc(firestore, 'users', user.uid);

      // Actualización de los datos en Firestore y Firebase Auth
      await updateDoc(userDocRef, { name, email });
      await user.updateProfile({ displayName: name });
      await user.updateEmail(email);

      // Actualiza el estado del usuario
      setUser({ ...user, displayName: name, email });
    } catch (error) {
      console.error('Error updating user profile:', error);
      throw error;
    }
  };

  // Función para cambiar la contraseña del usuario
  const changeUserPassword = async (currentPassword: string, newPassword: string) => {
    if (!user) throw new Error('User not authenticated');
    try {
      // Autenticación con las credenciales actuales antes de actualizar la contraseña
      const credential = firebase.auth.EmailAuthProvider.credential(user.email || '', currentPassword);
      await user.reauthenticateWithCredential(credential);
      await user.updatePassword(newPassword);
    } catch (error) {
      console.error('Error changing user password:', error);
      throw error;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        signUpWithEmailAndPassword,
        signInWithGoogle,
        signInWithFacebook,
        signOut,
        updateUserProfile,
        changeUserPassword,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// Hook personalizado para acceder al contexto de autenticación
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
