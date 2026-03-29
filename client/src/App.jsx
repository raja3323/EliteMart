
import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

// Context Providers
import { AuthProvider, useAuth } from './context/AuthContext';
import { CartProvider }          from './context/CartContext';
import { ThemeProvider }         from './context/ThemeContext';

// Layout
import Navbar from './components/Navbar/Navbar';
import Footer from './components/Footer/Footer';

// Pages
import Home          from './pages/Home/Home';
import Products      from './pages/Products/Products';
import ProductDetail from './pages/ProductDetail/ProductDetail';
import Cart          from './pages/Cart/Cart';
import Checkout      from './pages/Checkout/Checkout';
import Orders        from './pages/Orders/Orders';
import Admin         from './pages/Admin/Admin';
import { Login, Register, AdminLogin } from './pages/Auth/Auth';

// Global styles
import './styles/global.css';

// Route guard — redirects to /login if user is not authenticated
function PrivateRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) return <div className="loading-center"><div className="spinner" /></div>;
  return user ? children : <Navigate to="/login" />;
}

function AppRoutes() {
  return (
    <>
      <Navbar />
      <Routes>
        {/* Public */}
        <Route path="/"            element={<Home />} />
        <Route path="/products"    element={<Products />} />
        <Route path="/products/:id" element={<ProductDetail />} />
        <Route path="/login"       element={<Login />} />
        <Route path="/register"    element={<Register />} />
        <Route path="/admin/login" element={<AdminLogin />} />

        {/* Protected */}
        <Route path="/cart"     element={<PrivateRoute><Cart /></PrivateRoute>} />
        <Route path="/checkout" element={<PrivateRoute><Checkout /></PrivateRoute>} />
        <Route path="/orders"   element={<PrivateRoute><Orders /></PrivateRoute>} />
        <Route path="/admin"    element={<PrivateRoute><Admin /></PrivateRoute>} />

        {/* 404 fallback */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
      <Footer />
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <AuthProvider>
          <CartProvider>
            <AppRoutes />
            <Toaster
              position="top-right"
              toastOptions={{
                style: {
                  background: 'var(--bg-card)',
                  color: 'var(--text-primary)',
                  border: '1px solid var(--border)',
                  fontFamily: 'var(--font-body)',
                  fontSize: '14px',
                },
              }}
            />
          </CartProvider>
        </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
}
