import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import { AuthProvider, useAuth } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { ItemsProvider } from './context/ItemsContext';

import LoginPage from './pages/LoginPage';
import ItemMenu from './pages/ItemMenu';
import CheckoutPage from './pages/CheckoutPage';
import RegisterUser from './components/Login/RegisterUser';
import ForgotPassword from './components/Login/ForgotPassword';
import ResetPassword from './components/Login/ResetPassword';
import UserTypes from './pages/admin/UserTypes';
import Offers from './pages/offers/Offers';
import ItemOfferMapper from './pages/offers/ItemOfferMapper';
import PrevOrders from './pages/PrevOrders';
import ItemList from './pages/admin/itemList/ItemList';

const AuthenticatedApp: React.FC = () => {
  const { isAuthenticated, user } = useAuth();

  if (!isAuthenticated) return <Navigate to="/login" />;

  const isAdmin = user?.role === 'Admin';
  const isCustomer = user?.role === 'Customer';

  return (
    <CartProvider>
      <ItemsProvider>
        <Routes>
          <Route path="/" element={isAdmin ? <Navigate to="/item-list" /> : <Navigate to="/menu" />} />
          <Route path="/menu" element={isCustomer ? <ItemMenu /> : <Navigate to="/login" />} />
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="/userTypes" element={isAdmin ? <UserTypes /> : <Navigate to="/login" />} />
          <Route path="/offers" element={isAdmin ? <Offers /> : <Navigate to="/login" />} />
          <Route path="/item-offer-mapper" element={isAdmin ? <ItemOfferMapper /> : <Navigate to="/login" />} />
          <Route path="/item-list" element={isAdmin ? <ItemList /> : <Navigate to="/login" />} />
          <Route path="/order-history" element={isCustomer ? <PrevOrders /> : <Navigate to="/login" />} />
          <Route path="*" element={isAdmin ? <Navigate to="/item-list" /> : <Navigate to="/menu" />}  />
        </Routes>
      </ItemsProvider>
    </CartProvider>
  );
};

const UnauthenticatedApp: React.FC = () => (
  <Routes>
    <Route path="/login" element={<LoginPage />} />
    <Route path="/register" element={<RegisterUser />} />
    <Route path="/forgot-password" element={<ForgotPassword />} />
    <Route path="/reset-password" element={<ResetPassword />} />
    <Route path="*" element={<Navigate to="/login" />} />
  </Routes>
);

const App: React.FC = () => {
  return (
    <AuthProvider>
      <Router>
        <AppRouter />
      </Router>
      <ToastContainer />
    </AuthProvider>
  );
};

const AppRouter: React.FC = () => {
  const { isAuthenticated } = useAuth();

  return isAuthenticated ? <AuthenticatedApp /> : <UnauthenticatedApp />;
};

export default App;
