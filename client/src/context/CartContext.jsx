// client/src/context/CartContext.js
// Manages cart state globally — syncs with backend when user is logged in

import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../utils/api';
import { useAuth } from './AuthContext';
import toast from 'react-hot-toast';

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const { user } = useAuth();
  const [cartItems, setCartItems] = useState([]);
  const [cartLoading, setCartLoading] = useState(false);

  // Fetch cart from server when user logs in
  useEffect(() => {
    if (user && user.role !== 'admin') fetchCart();
    else setCartItems([]);
  }, [user]);

  async function fetchCart() {
    try {
      setCartLoading(true);
      const { data } = await api.get('/cart');
      setCartItems(data);
    } catch (err) {
      console.error('Cart fetch failed:', err);
    } finally {
      setCartLoading(false);
    }
  }

  async function addToCart(p_id, quantity = 1) {
    try {
      await api.post('/cart', { p_id, quantity });
      await fetchCart();
      toast.success('Added to cart!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to add to cart');
    }
  }

  async function removeFromCart(cart_id) {
    try {
      await api.delete(`/cart/${cart_id}`);
      setCartItems((prev) => prev.filter((i) => i.cart_id !== cart_id));
      toast.success('Removed from cart');
    } catch (err) {
      toast.error('Failed to remove item');
    }
  }

  async function clearCart() {
    try {
      await api.delete('/cart');
      setCartItems([]);
    } catch (err) {
      console.error('Clear cart failed:', err);
    }
  }

  const cartCount = cartItems.reduce((sum, i) => sum + i.quantity, 0);
  const cartTotal = cartItems.reduce((sum, i) => sum + parseFloat(i.amount || 0), 0);

  return (
    <CartContext.Provider value={{ cartItems, cartLoading, cartCount, cartTotal, addToCart, removeFromCart, clearCart, fetchCart }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used inside CartProvider');
  return ctx;
}
