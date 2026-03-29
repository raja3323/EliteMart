// client/src/pages/Auth/Login.js

import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';
import './Auth.css';

export function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm]       = useState({ user_name: '', pass: '' });
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    try {
      await login(form.user_name, form.pass);
      toast.success('Welcome back! 👋');
      navigate('/');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-card card fade-up">
        <div className="auth-header">
          <h1 className="auth-logo">Elite<span>Mart</span></h1>
          <h2 className="auth-title">Welcome back</h2>
          <p className="auth-subtitle">Sign in to your account</p>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label className="form-label">Username</label>
            <input
              className="form-input"
              placeholder="your_username"
              value={form.user_name}
              onChange={(e) => setForm({ ...form, user_name: e.target.value })}
              required
            />
          </div>
          <div className="form-group">
            <label className="form-label">Password</label>
            <input
              type="password"
              className="form-input"
              placeholder="••••••••"
              value={form.pass}
              onChange={(e) => setForm({ ...form, pass: e.target.value })}
              required
            />
          </div>

          <button type="submit" className="btn btn-primary auth-submit" disabled={loading}>
            {loading ? 'Signing in…' : 'Sign In'}
          </button>
        </form>

        <p className="auth-switch">
          Don't have an account? <Link to="/register">Sign up</Link>
        </p>
        <p className="auth-switch" style={{ marginTop: 4 }}>
          Admin? <Link to="/admin/login">Admin Login →</Link>
        </p>
      </div>
    </div>
  );
}

// ── Register ──────────────────────────────────────────────────────────────────

export function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm]       = useState({
    name: '', city: '', mobile: '', user_name: '',
    pass: '', address: '', gender: 'Male', email_id: ''
  });
  const [loading, setLoading] = useState(false);

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    try {
      await register(form);
      toast.success('Account created! 🎉');
      navigate('/');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-card auth-card-wide card fade-up">
        <div className="auth-header">
          <h1 className="auth-logo">Elite<span>Mart</span></h1>
          <h2 className="auth-title">Create account</h2>
          <p className="auth-subtitle">Join thousands of happy shoppers</p>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="auth-grid">
            {[
              { name: 'name',      label: 'Full Name',  placeholder: 'Aarav Sharma' },
              { name: 'email_id',  label: 'Email',      placeholder: 'you@example.com',  type: 'email' },
              { name: 'user_name', label: 'Username',   placeholder: 'aarav_s' },
              { name: 'mobile',    label: 'Mobile',     placeholder: '9876543210' },
              { name: 'city',      label: 'City',       placeholder: 'Delhi' },
            ].map((f) => (
              <div className="form-group" key={f.name}>
                <label className="form-label">{f.label}</label>
                <input
                  name={f.name}
                  type={f.type || 'text'}
                  className="form-input"
                  placeholder={f.placeholder}
                  value={form[f.name]}
                  onChange={handleChange}
                  required
                />
              </div>
            ))}

            <div className="form-group">
              <label className="form-label">Gender</label>
              <select name="gender" className="form-input" value={form.gender} onChange={handleChange}>
                <option>Male</option>
                <option>Female</option>
                <option>Other</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Address</label>
            <textarea
              name="address"
              className="form-input"
              rows={2}
              placeholder="Street, City, State"
              value={form.address}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Password</label>
            <input
              name="pass"
              type="password"
              className="form-input"
              placeholder="Min. 8 characters"
              value={form.pass}
              onChange={handleChange}
              required
              minLength={8}
            />
          </div>

          <button type="submit" className="btn btn-primary auth-submit" disabled={loading}>
            {loading ? 'Creating account…' : 'Create Account'}
          </button>
        </form>

        <p className="auth-switch">Already have an account? <Link to="/login">Sign in</Link></p>
      </div>
    </div>
  );
}

// ── Admin Login ───────────────────────────────────────────────────────────────

export function AdminLogin() {
  const { adminLogin } = useAuth();
  const navigate = useNavigate();
  const [form, setForm]       = useState({ admin_name: '', admin_pass: '' });
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    try {
      await adminLogin(form.admin_name, form.admin_pass);
      toast.success('Admin logged in!');
      navigate('/admin');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Admin login failed.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-card card fade-up">
        <div className="auth-header">
          <span className="admin-badge">🛡 Admin Portal</span>
          <h2 className="auth-title">Admin Login</h2>
          <p className="auth-subtitle">Restricted access only</p>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label className="form-label">Admin Name</label>
            <input
              className="form-input"
              value={form.admin_name}
              onChange={(e) => setForm({ ...form, admin_name: e.target.value })}
              required
            />
          </div>
          <div className="form-group">
            <label className="form-label">Password</label>
            <input
              type="password"
              className="form-input"
              value={form.admin_pass}
              onChange={(e) => setForm({ ...form, admin_pass: e.target.value })}
              required
            />
          </div>
          <button type="submit" className="btn btn-primary auth-submit" disabled={loading}>
            {loading ? 'Logging in…' : 'Login as Admin'}
          </button>
        </form>

        <p className="auth-switch"><Link to="/login">← Back to user login</Link></p>
      </div>
    </div>
  );
}
