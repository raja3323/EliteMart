// server/controllers/productController.js
// CRUD operations for products + search/filter

const pool = require('../db/pool');

// GET 
async function getAllProducts(req, res, next) {
  try {
    const { category, search } = req.query;
    let query = 'SELECT * FROM products WHERE 1=1';
    const params = [];

    if (category) {
      params.push(category);
      query += ` AND category = $${params.length}`;
    }
    if (search) {
      params.push(`%${search}%`);
      query += ` AND (p_name ILIKE $${params.length} OR p_desc ILIKE $${params.length})`;
    }

    query += ' ORDER BY p_id DESC';
    const result = await pool.query(query, params);
    res.json(result.rows);
  } catch (err) {
    next(err);
  }
}

// GET /api/products/:id
async function getProductById(req, res, next) {
  try {
    const result = await pool.query('SELECT * FROM products WHERE p_id=$1', [req.params.id]);
    if (!result.rows[0]) return res.status(404).json({ message: 'Product not found.' });
    res.json(result.rows[0]);
  } catch (err) {
    next(err);
  }
}

// POST /api/products  — Admin only
async function createProduct(req, res, next) {
  try {
    const { p_name, p_desc, category, price, p_quantity, p_image } = req.body;
    const result = await pool.query(
      `INSERT INTO products (p_name, p_desc, category, price, p_quantity, p_image)
       VALUES ($1,$2,$3,$4,$5,$6) RETURNING *`,
      [p_name, p_desc, category, price, p_quantity, p_image]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    next(err);
  }
}

// PUT /api/products/:id  — Admin only
async function updateProduct(req, res, next) {
  try {
    const { p_name, p_desc, category, price, p_quantity, p_image } = req.body;
    const result = await pool.query(
      `UPDATE products SET p_name=$1, p_desc=$2, category=$3, price=$4,
       p_quantity=$5, p_image=$6 WHERE p_id=$7 RETURNING *`,
      [p_name, p_desc, category, price, p_quantity, p_image, req.params.id]
    );
    if (!result.rows[0]) return res.status(404).json({ message: 'Product not found.' });
    res.json(result.rows[0]);
  } catch (err) {
    next(err);
  }
}

// DELETE /api/products/:id  — Admin only
async function deleteProduct(req, res, next) {
  try {
    await pool.query('DELETE FROM products WHERE p_id=$1', [req.params.id]);
    res.json({ message: 'Product deleted.' });
  } catch (err) {
    next(err);
  }
}

module.exports = { getAllProducts, getProductById, createProduct, updateProduct, deleteProduct };
