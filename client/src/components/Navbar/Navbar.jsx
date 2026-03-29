// client/src/components/Navbar/Navbar.js

import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import { useTheme } from '../../context/ThemeContext';
import './Navbar.css';

export default function Navbar() {
  const { user, logout, isAdmin } = useAuth();
  const { cartCount } = useCart();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  function handleLogout() {
    logout();
    navigate('/');
    setMenuOpen(false);
  }

  return (
    <nav className="navbar">
      <div className="navbar-inner container">
        {/* Logo */}
        <Link to="/" className="navbar-logo">
          Elite<span>Mart</span>
        </Link>

        {/* Desktop Links */}
        <div className="navbar-links">
          <Link to="/products">Products</Link>
          {user && !isAdmin && <Link to="/orders">My Orders</Link>}
          {isAdmin && <Link to="/admin">Admin</Link>}
        </div>

        {/* Actions */}
        <div className="navbar-actions">
          {/* Dark mode toggle */}
          <button className="btn btn-ghost icon-btn" onClick={toggleTheme} title="Toggle theme">
            {theme === 'dark' ? '☀️' : '🌙'}
          </button>

          {/* Cart */}
          {user && !isAdmin && (
            <Link to="/cart" className="cart-btn">
              🛒
              {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
            </Link>
          )}

          {/* Auth */}
          {user ? (
            <div className="user-menu">
              <button className="user-avatar" onClick={() => setMenuOpen(!menuOpen)}>
                {(user.name || user.admin_name || 'U')[0].toUpperCase()}
              </button>
              {menuOpen && (
                <div className="dropdown">
                  <p className="dropdown-name">{user.name || user.admin_name}</p>
                  <button onClick={handleLogout}>Sign Out</button>
                </div>
              )}
            </div>
          ) : (
            <>
              <Link to="/login" className="btn btn-ghost">Login</Link>
              <Link to="/register" className="btn btn-primary">Sign Up</Link>
            </>
          )}
        </div>

        {/* Mobile hamburger */}
        <button className="hamburger" onClick={() => setMenuOpen(!menuOpen)}>☰</button>
      </div>
    </nav>
  );
}
