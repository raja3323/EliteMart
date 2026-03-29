// client/src/pages/Admin/Admin.js

import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../utils/api';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';
import './Admin.css';

const TABS = ['Dashboard', 'Products', 'Orders', 'Feedback'];

export default function Admin() {
  const { isAdmin } = useAuth();
  const navigate    = useNavigate();
  const [tab, setTab]           = useState('Dashboard');
  const [products, setProducts] = useState([]);
  const [orders, setOrders]     = useState([]);
  const [feedback, setFeedback] = useState([]);
  const [loading, setLoading]   = useState(false);

  // Redirect non-admins
  useEffect(() => {
    if (!isAdmin) navigate('/login');
  }, [isAdmin]);

  useEffect(() => {
    if (tab === 'Products') fetchProducts();
    if (tab === 'Orders')   fetchOrders();
    if (tab === 'Feedback') fetchFeedback();
  }, [tab]);

  async function fetchProducts() {
    setLoading(true);
    const { data } = await api.get('/products');
    setProducts(data);
    setLoading(false);
  }

  async function fetchOrders() {
    setLoading(true);
    try {
      const { data } = await api.get('/orders/all');
      setOrders(data);
    } catch { toast.error('Failed to load orders'); }
    setLoading(false);
  }

  async function fetchFeedback() {
    setLoading(true);
    try {
      const { data } = await api.get('/feedback');
      setFeedback(data);
    } catch { toast.error('Failed to load feedback'); }
    setLoading(false);
  }

  async function deleteProduct(id) {
    if (!window.confirm('Delete this product?')) return;
    await api.delete(`/products/${id}`);
    toast.success('Product deleted');
    fetchProducts();
  }

  return (
    <div className="page-wrapper">
      <div className="container">
        <div className="admin-header">
          <h1 className="page-title">Admin Dashboard</h1>
          <span className="badge badge-accent">🛡 Admin</span>
        </div>

        {/* Tabs */}
        <div className="admin-tabs">
          {TABS.map((t) => (
            <button
              key={t}
              className={`admin-tab ${tab === t ? 'active' : ''}`}
              onClick={() => setTab(t)}
            >
              {t}
            </button>
          ))}
        </div>

        {/* ── Dashboard overview ──────────────────────────────────── */}
        {tab === 'Dashboard' && (
          <div className="admin-stats fade-up">
            {[
              { label: 'Total Products', value: products.length || '—', icon: '📦' },
              { label: 'Total Orders',   value: orders.length || '—',   icon: '🛒' },
              { label: 'Feedback Items', value: feedback.length || '—', icon: '💬' },
            ].map((s) => (
              <div key={s.label} className="stat-card card">
                <span className="stat-icon">{s.icon}</span>
                <div>
                  <p className="stat-label">{s.label}</p>
                  <p className="stat-value">{s.value}</p>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ── Products tab ─────────────────────────────────────────── */}
        {tab === 'Products' && (
          <div className="fade-up">
            {loading ? (
              <div className="loading-center"><div className="spinner" /></div>
            ) : (
              <div className="admin-table-wrap card">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>ID</th><th>Name</th><th>Category</th>
                      <th>Price</th><th>Stock</th><th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {products.map((p) => (
                      <tr key={p.p_id}>
                        <td>#{p.p_id}</td>
                        <td>
                          <div className="admin-product-name">
                            <img src={p.p_image} alt={p.p_name} className="admin-product-thumb" />
                            {p.p_name}
                          </div>
                        </td>
                        <td><span className="badge badge-accent">{p.category}</span></td>
                        <td>₹{parseFloat(p.price).toLocaleString('en-IN')}</td>
                        <td>{p.p_quantity}</td>
                        <td>
                          <button
                            className="btn btn-ghost"
                            style={{ color: 'var(--accent)', fontSize: 13 }}
                            onClick={() => deleteProduct(p.p_id)}
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* ── Orders tab ───────────────────────────────────────────── */}
        {tab === 'Orders' && (
          <div className="fade-up">
            {loading ? (
              <div className="loading-center"><div className="spinner" /></div>
            ) : (
              <div className="admin-table-wrap card">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>Order ID</th><th>Customer</th><th>Product</th>
                      <th>Qty</th><th>Amount</th><th>Pay Mode</th><th>Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.map((o) => (
                      <tr key={o.order_id}>
                        <td>#{o.order_id}</td>
                        <td>{o.customer_name}</td>
                        <td>{o.p_name}</td>
                        <td>{o.quantity}</td>
                        <td>₹{parseFloat(o.amount).toLocaleString('en-IN')}</td>
                        <td><span className="badge badge-green">{o.pay_mode || 'N/A'}</span></td>
                        <td>{new Date(o.order_date).toLocaleDateString('en-IN')}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* ── Feedback tab ─────────────────────────────────────────── */}
        {tab === 'Feedback' && (
          <div className="feedback-list fade-up">
            {loading ? (
              <div className="loading-center"><div className="spinner" /></div>
            ) : feedback.length === 0 ? (
              <div className="empty-state"><h3>No feedback yet</h3></div>
            ) : (
              feedback.map((f) => (
                <div key={f.f_id} className="feedback-card card">
                  <div className="feedback-meta">
                    <strong>{f.name || f.email_id}</strong>
                    <span className="badge badge-gray">#{f.f_id}</span>
                  </div>
                  <p className="feedback-comment">{f.comment}</p>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
}
