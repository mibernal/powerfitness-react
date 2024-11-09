//src\routes\AppRoutes.js:
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from '../app/components/home/HomeComponent';
import ProductList from '../app/components/products/product-list/ProductList';
import ProductDetail from '../app/components/products/product-detail/ProductDetail';
import Cart from '../app/components/cart/CartComponent';
import Contact from '../app/components/contact/Contact';
import LoginForm from '../app/components/auth/login-form/login-form';
import RegistrationForm from '../app/components/auth/registration-form/registration-form';
import Nosotros from '../app/components/nosotros/Nosotros';
import ProductManagement from '../app/components/product-management/ProductManagement';
import ProductImport from '../app/components/product-import/ProductImport';
import UserPanel from '../app/components/user-panel/UserPanel';

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/products" element={<ProductList />} />
      <Route path="/products/:id" element={<ProductDetail />} />
      <Route path="/cart" element={<Cart />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="/nosotros" element={<Nosotros />} />
      <Route path="/login" element={<LoginForm />} />
      <Route path="/register" element={<RegistrationForm />} />
      <Route path="/product-management" element={<ProductManagement />} />
      <Route path="/product-import" element={<ProductImport />} />
      <Route path="/user-panel" element={<UserPanel />} />
    </Routes>
  );
};

export default AppRoutes;
