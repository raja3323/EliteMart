import React from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import './ProductCard.css';

export default function ProductCard({ product }) {
  const { addToCart } = useCart();
  const { user } = useAuth();
  const { p_id, p_name, p_desc, category, price, p_image, p_quantity } = product;

  function handleAddToCart(e) {
    e.preventDefault(); // Prevent navigating to detail page
    if (!user) return;
    addToCart(p_id, 1);
  }

  return (
    <Link to={`/products/${p_id}`} className="product-card card">
      <div className="product-card-image-wrap">
        <img
          src={p_image || 'https://via.placeholder.com/400x300?text=No+Image'}
          alt={p_name}
          className="product-card-image"
        />
        <span className="product-card-category badge badge-accent">{category}</span>
      </div>

      <div className="product-card-body">
        <h3 className="product-card-name">{p_name}</h3>
        <p className="product-card-desc">{p_desc}</p>

        <div className="product-card-footer">
          <span className="product-card-price">₹{parseFloat(price).toLocaleString('en-IN')}</span>
          {p_quantity > 0 ? (
            <button
              className="btn btn-primary product-card-btn"
              onClick={handleAddToCart}
              disabled={!user}
            >
              Add to Cart
            </button>
          ) : (
            <span className="badge badge-gray">Out of Stock</span>
          )}
        </div>
      </div>
    </Link>
  );
}
