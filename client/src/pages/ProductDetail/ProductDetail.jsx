// client/src/pages/ProductDetail/ProductDetail.js

import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../utils/api';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import './ProductDetail.css';

export default function ProductDetail() {
  const { id } = useParams();
  const { user } = useAuth();
  const { addToCart } = useCart();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [qty, setQty]         = useState(1);

  useEffect(() => {
    api.get(`/products/${id}`)
      .then(({ data }) => { setProduct(data); setLoading(false); })
      .catch(() => { setLoading(false); });
  }, [id]);

  if (loading) return <div className="loading-center"><div className="spinner" /></div>;
  if (!product) return <div className="container page-wrapper"><p>Product not found.</p></div>;

  const { p_name, p_desc, category, price, p_image, p_quantity } = product;

  return (
    <div className="page-wrapper">
      <div className="container product-detail-layout">
        {/* Image */}
        <div className="product-detail-image-wrap">
          <img
            src={p_image || 'https://via.placeholder.com/600?text=No+Image'}
            alt={p_name}
            className="product-detail-image"
          />
        </div>

        {/* Info */}
        <div className="product-detail-info fade-up">
          <span className="badge badge-accent">{category}</span>
          <h1 className="page-title" style={{ marginTop: 12 }}>{p_name}</h1>
          <p className="product-detail-price">₹{parseFloat(price).toLocaleString('en-IN')}</p>
          <p className="product-detail-desc">{p_desc}</p>

          <div className="divider" />

          {p_quantity > 0 ? (
            <>
              <div className="product-detail-stock">
                <span className="badge badge-green">✓ In Stock ({p_quantity} left)</span>
              </div>

              {/* Qty selector */}
              <div className="qty-selector">
                <button className="qty-btn" onClick={() => setQty(Math.max(1, qty - 1))}>−</button>
                <span className="qty-value">{qty}</span>
                <button className="qty-btn" onClick={() => setQty(Math.min(p_quantity, qty + 1))}>+</button>
              </div>

              <div className="product-detail-actions">
                {user ? (
                  <>
                    <button
                      className="btn btn-primary"
                      onClick={() => addToCart(product.p_id, qty)}
                    >
                      Add to Cart
                    </button>
                    <button
                      className="btn btn-outline"
                      onClick={() => { addToCart(product.p_id, qty); navigate('/cart'); }}
                    >
                      Buy Now
                    </button>
                  </>
                ) : (
                  <button className="btn btn-primary" onClick={() => navigate('/login')}>
                    Login to Purchase
                  </button>
                )}
              </div>
            </>
          ) : (
            <span className="badge badge-gray" style={{ fontSize: 14, padding: '8px 16px' }}>
              Out of Stock
            </span>
          )}

          <div className="divider" />

          <div className="product-detail-meta">
            <div><strong>Category:</strong> {category}</div>
            <div><strong>Availability:</strong> {p_quantity > 0 ? 'In Stock' : 'Out of Stock'}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
