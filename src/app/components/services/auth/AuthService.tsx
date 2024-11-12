// src/app/components/services/auth/AuthService.tsx
import React, { createContext, useEffect, useState, useContext, ReactNode } from 'react';
import { auth, firestore } from '../../../../environments/firebaseConfig';
import { User, signInWithPopup, GoogleAuthProvider, FacebookAuthProvider, onAuthStateChanged, createUserWithEmailAndPassword, signOut, updateProfile, updateEmail, reauthenticateWithCredential, EmailAuthProvider, updatePassword } from 'firebase/auth';
import { doc, updateDoc } from 'firebase/firestore';

interface AuthContextType {
  user: User | null;
  signUpWithEmailAndPassword: (email: string, password: string) => Promise<User>;
  signInWithGoogle: () => Promise<User>;
  signInWithFacebook: () => Promise<User>;
  signOutUser: () => Promise<void>;
  updateUserProfile: (name: string, email: string) => Promise<void>;
  changeUserPassword: (currentPassword: string, newPassword: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (authUser) => setUser(authUser));
    return () => unsubscribe();
  }, []);

  const signUpWithEmailAndPassword = async (email: string, password: string) => {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    setUser(userCredential.user);
    return userCredential.user;
  };

  const signInWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    const userCredential = await signInWithPopup(auth, provider);
    setUser(userCredential.user);
    return userCredential.user;
  };

  const signInWithFacebook = async () => {
    const provider = new FacebookAuthProvider();
    const userCredential = await signInWithPopup(auth, provider);
    setUser(userCredential.user);
    return userCredential.user;
  };

  const signOutUser = async () => {
    await signOut(auth);
    setUser(null);
  };

  const updateUserProfile = async (name: string, email: string) => {
    if (!user) throw new Error('User not authenticated');
    const userDocRef = doc(firestore, 'users', user.uid);
    await updateDoc(userDocRef, { name, email });
    await updateProfile(user, { displayName: name });
    await updateEmail(user, email);
    setUser({ ...user, displayName: name, email });
  };

  const changeUserPassword = async (currentPassword: string, newPassword: string) => {
    if (!user) throw new Error('User not authenticated');
    const credential = EmailAuthProvider.credential(user.email || '', currentPassword);
    await reauthenticateWithCredential(user, credential);
    await updatePassword(user, newPassword);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        signUpWithEmailAndPassword,
        signInWithGoogle,
        signInWithFacebook,
        signOutUser,
        updateUserProfile,
        changeUserPassword,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
