const pool = require('../db/pool');

// GET
async function getCart(req, res, next) {
  try {
    const { user_name } = req.user;
    const result = await pool.query(
      `SELECT c.*, p.p_name, p.p_image, p.price
       FROM add_to_cart c
       JOIN products p ON c.p_id = p.p_id
       WHERE c.user_name = $1`,
      [user_name]
    );
    res.json(result.rows);
  } catch (err) {
    next(err);
  }
}

// POST 
async function addToCart(req, res, next) {
  try {
    const { user_name } = req.user;
    const { p_id, quantity } = req.body;

    
    const product = await pool.query('SELECT price FROM products WHERE p_id=$1', [p_id]);
    if (!product.rows[0]) return res.status(404).json({ message: 'Product not found.' });

    const amount = product.rows[0].price * quantity;

    // If already in cart, update quantity
    const existing = await pool.query(
      'SELECT cart_id FROM add_to_cart WHERE user_name=$1 AND p_id=$2',
      [user_name, p_id]
    );

    if (existing.rows.length > 0) {
      const updated = await pool.query(
        'UPDATE add_to_cart SET quantity=quantity+$1, amount=amount+$2 WHERE cart_id=$3 RETURNING *',
        [quantity, amount, existing.rows[0].cart_id]
      );
      return res.json(updated.rows[0]);
    }

    const result = await pool.query(
      'INSERT INTO add_to_cart (quantity, amount, user_name, p_id) VALUES ($1,$2,$3,$4) RETURNING *',
      [quantity, amount, user_name, p_id]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    next(err);
  }
}

// DELETE 
async function removeFromCart(req, res, next) {
  try {
    const { user_name } = req.user;
    await pool.query(
      'DELETE FROM add_to_cart WHERE cart_id=$1 AND user_name=$2',
      [req.params.cart_id, user_name]
    );
    res.json({ message: 'Item removed from cart.' });
  } catch (err) {
    next(err);
  }
}

// DELETE
async function clearCart(req, res, next) {
  try {
    const { user_name } = req.user;
    await pool.query('DELETE FROM add_to_cart WHERE user_name=$1', [user_name]);
    res.json({ message: 'Cart cleared.' });
  } catch (err) {
    next(err);
  }
}

module.exports = { getCart, addToCart, removeFromCart, clearCart };
