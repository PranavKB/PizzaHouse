import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import ItemMenu from './pages/ItemMenu';
import CheckoutPage from './pages/CheckoutPage';
import RegisterUser from './components/Login/RegisterUser';
import ForgotPassword from './components/Login/ForgotPassword';
import ResetPassword from './components/Login/ResetPassword';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import UserTypes from './pages/admin/UserTypes';
import Offers from './pages/offers/Offers';
import ItemOfferMapper from './pages/offers/ItemOfferMapper';
import PrevOrders from './pages/PrevOrders';
import ItemList from './pages/admin/itemList/ItemList';

const App: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return !!localStorage.getItem('token');
  });

  const role = localStorage.getItem('role');

  const reDirectTo = () => {
    if (role === 'Admin') {
      return <Navigate to="/offers" />;
    }
    return <Navigate to="/menu" />;
  };

  return (
    <>
      <Router>
        <Routes>
          <Route
            path="/"
            element={
              isAuthenticated
                ? reDirectTo()
                : <LoginPage setIsAuthenticated={setIsAuthenticated} />
            }
          />

          <Route
            path="/login"
            element={
              isAuthenticated
                ? reDirectTo()
                : <LoginPage setIsAuthenticated={setIsAuthenticated} />
            }
          />

          <Route
            path="/menu"
            element={
              isAuthenticated && role !== 'Admin'
                ? <ItemMenu setIsAuthenticated={setIsAuthenticated} />
                : <Navigate to="/" />
            }
          />

          <Route path="/register" element={<RegisterUser />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="/reset-password" element={<ResetPassword />} />

          <Route
            path="/userTypes"
            element={
              isAuthenticated && role === 'Admin'
                ? <UserTypes setIsAuthenticated={setIsAuthenticated} />
                : <Navigate to="/" />
            }
          />

          <Route
            path="/offers"
            element={
              isAuthenticated && role === 'Admin'
                ? <Offers setIsAuthenticated={setIsAuthenticated} />
                : <Navigate to="/login" />
            }
          />
          <Route
            path="/item-offer-mapper"
            element={
              isAuthenticated && role === 'Admin'
                ? <ItemOfferMapper setIsAuthenticated={setIsAuthenticated} />
                : <Navigate to="/" />
            }
          />
          <Route
            path="/item-list"
            element={
              isAuthenticated && role === 'Admin'
                ? <ItemList setIsAuthenticated={setIsAuthenticated} />
                : <Navigate to="/" />
            }
          />
          <Route path="/order-history" element={
            isAuthenticated && role !== 'Admin' ? <PrevOrders /> : <Navigate to="/login" />
          } />

          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </Router>
      <ToastContainer />
    </>
  );
};


export default App;


