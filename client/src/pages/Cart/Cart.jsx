// client/src/pages/Cart/Cart.js

import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import './Cart.css';

export default function Cart() {
  const { cartItems, cartTotal, removeFromCart, cartLoading } = useCart();
  const navigate = useNavigate();

  if (cartLoading) return <div className="loading-center"><div className="spinner" /></div>;

  if (cartItems.length === 0) {
    return (
      <div className="page-wrapper">
        <div className="container">
          <div className="empty-state">
            <div style={{ fontSize: 64 }}>🛒</div>
            <h3>Your cart is empty</h3>
            <p>Looks like you haven't added anything yet.</p>
            <Link to="/products" className="btn btn-primary" style={{ marginTop: 20 }}>
              Browse Products
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="page-wrapper">
      <div className="container">
        <h1 className="page-title" style={{ marginBottom: 32 }}>Shopping Cart</h1>

        <div className="cart-layout">
          {/* Items */}
          <div className="cart-items">
            {cartItems.map((item) => (
              <div key={item.cart_id} className="cart-item card">
                <img
                  src={item.p_image || 'https://via.placeholder.com/100'}
                  alt={item.p_name}
                  className="cart-item-image"
                />
                <div className="cart-item-info">
                  <h3 className="cart-item-name">{item.p_name}</h3>
                  <p className="cart-item-price">
                    ₹{parseFloat(item.price).toLocaleString('en-IN')} × {item.quantity}
                  </p>
                </div>
                <div className="cart-item-right">
                  <strong className="cart-item-total">
                    ₹{parseFloat(item.amount).toLocaleString('en-IN')}
                  </strong>
                  <button
                    className="btn btn-ghost cart-remove"
                    onClick={() => removeFromCart(item.cart_id)}
                  >
                    🗑 Remove
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Summary */}
          <div className="cart-summary card">
            <h2 className="summary-title">Order Summary</h2>
            <div className="divider" />

            <div className="summary-row">
              <span>Subtotal ({cartItems.length} items)</span>
              <span>₹{cartTotal.toLocaleString('en-IN')}</span>
            </div>
            <div className="summary-row">
              <span>Shipping</span>
              <span className="text-green">{cartTotal >= 999 ? 'Free' : '₹99'}</span>
            </div>
            <div className="divider" />
            <div className="summary-row summary-total">
              <span>Total</span>
              <span>₹{(cartTotal + (cartTotal >= 999 ? 0 : 99)).toLocaleString('en-IN')}</span>
            </div>

            <button
              className="btn btn-primary checkout-btn"
              onClick={() => navigate('/checkout')}
            >
              Proceed to Checkout →
            </button>
            <Link to="/products" className="btn btn-ghost" style={{ width: '100%', justifyContent: 'center' }}>
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
