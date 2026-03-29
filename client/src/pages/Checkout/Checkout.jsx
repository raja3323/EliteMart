// client/src/pages/Checkout/Checkout.js

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../utils/api';
import { useCart } from '../../context/CartContext';
import toast from 'react-hot-toast';
import './Checkout.css';

export default function Checkout() {
  const { cartItems, cartTotal, clearCart } = useCart();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    shipp_addr: '',
    pay_mode: 'card',
    h_name: '',
    card_no: '',
    exp_month: '',
    exp_year: '',
  });
  const [loading, setLoading] = useState(false);

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!form.shipp_addr) return toast.error('Please enter a shipping address.');
    if (form.pay_mode === 'card' && (!form.card_no || !form.h_name)) {
      return toast.error('Please fill in card details.');
    }

    setLoading(true);
    try {
      await api.post('/orders', form);
      toast.success('🎉 Order placed successfully!');
      await clearCart();
      navigate('/orders');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Checkout failed. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  const shipping = cartTotal >= 999 ? 0 : 99;
  const grandTotal = cartTotal + shipping;

  return (
    <div className="page-wrapper">
      <div className="container">
        <h1 className="page-title" style={{ marginBottom: 32 }}>Checkout</h1>

        <div className="checkout-layout">
          {/* Form */}
          <form className="checkout-form" onSubmit={handleSubmit}>
            {/* Shipping */}
            <div className="checkout-section card">
              <h2 className="checkout-section-title">📦 Shipping Information</h2>
              <div className="form-group">
                <label className="form-label">Shipping Address *</label>
                <textarea
                  name="shipp_addr"
                  className="form-input"
                  rows={3}
                  placeholder="Street, City, State, ZIP"
                  value={form.shipp_addr}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            {/* Payment */}
            <div className="checkout-section card">
              <h2 className="checkout-section-title">💳 Payment Method</h2>

              <div className="pay-mode-tabs">
                {['card', 'upi', 'cod'].map((mode) => (
                  <button
                    key={mode}
                    type="button"
                    className={`pay-tab ${form.pay_mode === mode ? 'active' : ''}`}
                    onClick={() => setForm({ ...form, pay_mode: mode })}
                  >
                    {mode === 'card' ? '💳 Card' : mode === 'upi' ? '📱 UPI' : '💵 Cash on Delivery'}
                  </button>
                ))}
              </div>

              {form.pay_mode === 'card' && (
                <div className="card-fields fade-up">
                  <div className="form-group">
                    <label className="form-label">Cardholder Name *</label>
                    <input
                      name="h_name"
                      className="form-input"
                      placeholder="Full name on card"
                      value={form.h_name}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Card Number *</label>
                    <input
                      name="card_no"
                      className="form-input"
                      placeholder="1234 5678 9012 3456"
                      maxLength={19}
                      value={form.card_no}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="card-fields-row">
                    <div className="form-group">
                      <label className="form-label">Expiry Month</label>
                      <input
                        name="exp_month"
                        className="form-input"
                        placeholder="MM"
                        maxLength={2}
                        value={form.exp_month}
                        onChange={handleChange}
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Expiry Year</label>
                      <input
                        name="exp_year"
                        className="form-input"
                        placeholder="YYYY"
                        maxLength={4}
                        value={form.exp_year}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                </div>
              )}

              {form.pay_mode === 'upi' && (
                <div className="form-group fade-up" style={{ marginTop: 16 }}>
                  <label className="form-label">UPI ID</label>
                  <input name="upi_id" className="form-input" placeholder="yourname@upi" />
                </div>
              )}

              {form.pay_mode === 'cod' && (
                <p className="cod-note fade-up">
                  💵 You'll pay in cash when your order is delivered.
                </p>
              )}
            </div>

            <button type="submit" className="btn btn-primary checkout-submit" disabled={loading}>
              {loading ? 'Placing Order…' : `Place Order · ₹${grandTotal.toLocaleString('en-IN')}`}
            </button>
          </form>

          {/* Order summary sidebar */}
          <div className="checkout-summary card">
            <h2 className="summary-title">Order Summary</h2>
            <div className="divider" />
            {cartItems.map((item) => (
              <div key={item.cart_id} className="checkout-item">
                <img src={item.p_image} alt={item.p_name} className="checkout-item-img" />
                <div className="checkout-item-info">
                  <p className="checkout-item-name">{item.p_name}</p>
                  <p className="checkout-item-qty">Qty: {item.quantity}</p>
                </div>
                <strong>₹{parseFloat(item.amount).toLocaleString('en-IN')}</strong>
              </div>
            ))}
            <div className="divider" />
            <div className="summary-row"><span>Subtotal</span><span>₹{cartTotal.toLocaleString('en-IN')}</span></div>
            <div className="summary-row"><span>Shipping</span><span>{shipping === 0 ? 'Free' : `₹${shipping}`}</span></div>
            <div className="divider" />
            <div className="summary-row summary-total">
              <span>Total</span>
              <span>₹{grandTotal.toLocaleString('en-IN')}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
