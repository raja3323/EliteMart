// client/src/pages/Orders/Orders.js

import React, { useEffect, useState } from 'react';
import api from '../../utils/api';
import './Orders.css';

export default function Orders() {
  const [orders, setOrders]   = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/orders')
      .then(({ data }) => { setOrders(data); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  if (loading) return <div className="loading-center"><div className="spinner" /></div>;

  return (
    <div className="page-wrapper">
      <div className="container">
        <h1 className="page-title" style={{ marginBottom: 32 }}>My Orders</h1>

        {orders.length === 0 ? (
          <div className="empty-state">
            <div style={{ fontSize: 64 }}>📦</div>
            <h3>No orders yet</h3>
            <p>Your order history will appear here once you make a purchase.</p>
          </div>
        ) : (
          <div className="orders-list">
            {orders.map((order) => (
              <div key={order.order_id} className="order-card card fade-up">
                <div className="order-card-header">
                  <div>
                    <span className="order-id">Order #{order.order_id}</span>
                    <span className="order-date">
                      {new Date(order.order_date).toLocaleDateString('en-IN', {
                        year: 'numeric', month: 'long', day: 'numeric'
                      })}
                    </span>
                  </div>
                  <span className="badge badge-green">Confirmed</span>
                </div>

                <div className="order-card-body">
                  <img
                    src={order.p_image || 'https://via.placeholder.com/80'}
                    alt={order.p_name}
                    className="order-product-img"
                  />
                  <div className="order-product-info">
                    <h3>{order.p_name}</h3>
                    <p>Qty: {order.quantity}</p>
                    <p className="order-ship-addr">📍 {order.shipp_addr}</p>
                  </div>
                  <div className="order-amount-block">
                    <strong className="order-amount">₹{parseFloat(order.amount).toLocaleString('en-IN')}</strong>
                    <span className="badge badge-accent">{order.pay_mode || 'Paid'}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
