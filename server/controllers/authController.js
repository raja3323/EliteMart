// server/controllers/authController.js
// Handles user registration, login, and admin login

const pool = require('../db/pool');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Helper: generate a signed JWT token
function generateToken(payload) {
  return jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  });
}

// POST /api/auth/register
async function register(req, res, next) {
  try {
    const { name, city, mobile, user_name, pass, address, gender, email_id } = req.body;

    // Check if username or email already exists
    const existing = await pool.query(
      'SELECT user_id FROM users WHERE user_name=$1 OR email_id=$2',
      [user_name, email_id]
    );
    if (existing.rows.length > 0) {
      return res.status(409).json({ message: 'Username or email already taken.' });
    }

    // Hash password before saving
    const hashedPass = await bcrypt.hash(pass, 10);

    const result = await pool.query(
      `INSERT INTO users (name, city, mobile, user_name, pass, address, gender, email_id)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8) RETURNING user_id, user_name, email_id`,
      [name, city, mobile, user_name, hashedPass, address, gender, email_id]
    );

    const user = result.rows[0];
    const token = generateToken({ id: user.user_id, user_name: user.user_name, role: 'user' });

    res.status(201).json({ message: 'Registered successfully!', token, user });
  } catch (err) {
    next(err);
  }
}

// POST /api/auth/login
async function login(req, res, next) {
  try {
    const { user_name, pass } = req.body;

    const result = await pool.query('SELECT * FROM users WHERE user_name=$1', [user_name]);
    const user = result.rows[0];

    if (!user) return res.status(404).json({ message: 'User not found.' });

    const isMatch = await bcrypt.compare(pass, user.pass);
    if (!isMatch) return res.status(401).json({ message: 'Invalid credentials.' });

    const token = generateToken({ id: user.user_id, user_name: user.user_name, role: 'user' });

    // Don't send the password back!
    const { pass: _, ...safeUser } = user;
    res.json({ message: 'Login successful!', token, user: safeUser });
  } catch (err) {
    next(err);
  }
}

// POST /api/auth/admin/login
async function adminLogin(req, res, next) {
  try {
    const { admin_name, admin_pass } = req.body;

    const result = await pool.query('SELECT * FROM admin WHERE admin_name=$1', [admin_name]);
    const admin = result.rows[0];

    if (!admin) return res.status(404).json({ message: 'Admin not found.' });

    const isMatch = await bcrypt.compare(admin_pass, admin.admin_pass);
    if (!isMatch) return res.status(401).json({ message: 'Invalid admin credentials.' });

    const token = generateToken({ id: admin.admin_id, admin_name: admin.admin_name, role: 'admin' });

    res.json({ message: 'Admin login successful!', token });
  } catch (err) {
    next(err);
  }
}

module.exports = { register, login, adminLogin };
