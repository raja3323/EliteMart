// server/controllers/feedbackController.js

const pool = require('../db/pool');

// POST /api/feedback
async function submitFeedback(req, res, next) {
  try {
    const { comment, amount, quantity, email_id } = req.body;
    const result = await pool.query(
      'INSERT INTO feedback (comment, amount, quantity, email_id) VALUES ($1,$2,$3,$4) RETURNING *',
      [comment, amount, quantity, email_id]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    next(err);
  }
}

// GET /api/feedback  — Admin only
async function getAllFeedback(req, res, next) {
  try {
    const result = await pool.query(
      `SELECT f.*, u.name FROM feedback f
       LEFT JOIN users u ON f.email_id = u.email_id
       ORDER BY f.f_id DESC`
    );
    res.json(result.rows);
  } catch (err) {
    next(err);
  }
}

module.exports = { submitFeedback, getAllFeedback };
