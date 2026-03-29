// client/src/pages/Home/Home.js

import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../utils/api';
import { useAuth } from '../../context/AuthContext';
import ProductCard from '../../components/ProductCard/ProductCard';
import './Home.css';

export default function Home() {
  const { user } = useAuth();
  const [featured, setFeatured] = useState([]);
  const [loading, setLoading]   = useState(true);

  useEffect(() => {
    api.get('/products').then(({ data }) => {
      setFeatured(data.slice(0, 4)); // Show first 4 as featured
      setLoading(false);
    });
  }, []);

  return (
    <div className="home">
      {/* ── Hero ──────────────────────────────────────────────────── */}
      <section className="hero">
        <div className="container hero-inner">
          <div className="hero-text fade-up">
            <span className="badge badge-accent hero-badge">New Arrivals 2024</span>
            <h1 className="page-title hero-title">
              Discover Products<br />You'll <span className="accent-text">Love</span>
            </h1>
            <p className="hero-subtitle">
              Shop the latest trends in electronics, fashion, accessories, and more.
              Free shipping on orders above ₹999.
            </p>
            <div className="hero-actions">
              <Link to="/products" className="btn btn-primary hero-cta">
                Shop Now →
              </Link>
              {!user && (
                <Link to="/register" className="btn btn-outline">
                  Create Account
                </Link>
              )}
            </div>
          </div>
          <div className="hero-graphic fade-in">
            <div className="hero-blob" />
            <img
              src="https://images.unsplash.com/photo-1483985988355-763728e1935b?w=600"
              alt="Shopping"
              className="hero-image"
            />
          </div>
        </div>
      </section>

      {/* ── Features strip ────────────────────────────────────────── */}
      <section className="features-strip">
        <div className="container features-grid">
          {[
            { icon: '🚚', label: 'Free Shipping', desc: 'On orders above ₹999' },
            { icon: '🔄', label: 'Easy Returns',  desc: '30-day hassle-free returns' },
            { icon: '🔒', label: 'Secure Payment',desc: 'SSL encrypted checkout' },
            { icon: '🎧', label: '24/7 Support',  desc: 'Always here to help' },
          ].map((f) => (
            <div key={f.label} className="feature-item">
              <span className="feature-icon">{f.icon}</span>
              <div>
                <strong>{f.label}</strong>
                <p>{f.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Featured Products ──────────────────────────────────────── */}
      <section className="container section">
        <div className="section-header">
          <h2 className="page-title" style={{ fontSize: '32px' }}>Featured Products</h2>
          <Link to="/products" className="btn btn-outline">View All</Link>
        </div>

        {loading ? (
          <div className="loading-center"><div className="spinner" /></div>
        ) : (
          <div className="products-grid fade-up">
            {featured.map((p) => <ProductCard key={p.p_id} product={p} />)}
          </div>
        )}
      </section>

      {/* ── CTA Banner ────────────────────────────────────────────── */}
      <section className="cta-banner">
        <div className="container cta-inner">
          <h2>Ready to start shopping?</h2>
          {user ? (
            <>
              <p>Welcome back! Explore our latest products.</p>
              <Link to="/products" className="btn btn-primary">Browse Products</Link>
            </>
          ) : (
            <>
              <p>Create your free account and get 10% off your first order.</p>
              <Link to="/register" className="btn btn-primary">Get Started</Link>
            </>
          )}
        </div>
      </section>
    </div>
  );
}
