// client/src/pages/Products/Products.js

import React, { useEffect, useState } from 'react';
import api from '../../utils/api';
import ProductCard from '../../components/ProductCard/ProductCard';
import './Products.css';

const CATEGORIES = ['All', 'Electronics', 'Footwear', 'Accessories', 'Sports', 'Fashion'];

export default function Products() {
  const [products, setProducts]   = useState([]);
  const [loading, setLoading]     = useState(true);
  const [search, setSearch]       = useState('');
  const [category, setCategory]   = useState('All');

  useEffect(() => {
    fetchProducts();
  }, [category]);

  async function fetchProducts() {
    setLoading(true);
    try {
      const params = {};
      if (category !== 'All') params.category = category;
      const { data } = await api.get('/products', { params });
      setProducts(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  // Client-side search filter
  const filtered = products.filter((p) =>
    p.p_name.toLowerCase().includes(search.toLowerCase()) ||
    p.p_desc?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="page-wrapper">
      <div className="container">
        {/* Header */}
        <div className="products-header">
          <div>
            <h1 className="page-title">Products</h1>
            <p className="page-subtitle">{filtered.length} items found</p>
          </div>

          {/* Search */}
          <input
            type="text"
            className="form-input products-search"
            placeholder="🔍  Search products..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* Category Tabs */}
        <div className="category-tabs">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              className={`category-tab ${category === cat ? 'active' : ''}`}
              onClick={() => setCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Grid */}
        {loading ? (
          <div className="loading-center"><div className="spinner" /></div>
        ) : filtered.length === 0 ? (
          <div className="empty-state">
            <div style={{ fontSize: 48 }}>🔍</div>
            <h3>No products found</h3>
            <p>Try a different search or category.</p>
          </div>
        ) : (
          <div className="products-grid fade-up">
            {filtered.map((p) => <ProductCard key={p.p_id} product={p} />)}
          </div>
        )}
      </div>
    </div>
  );
}
