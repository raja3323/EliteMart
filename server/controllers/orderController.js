const pool = require('../db/pool');

// GET 
async function getUserOrders(req, res, next) {
  try {
    const { user_name } = req.user;
    const result = await pool.query(
      `SELECT o.*, p.p_name, p.p_image, pay.pay_mode
       FROM orders o
       JOIN products p ON o.p_id = p.p_id
       LEFT JOIN payment pay ON o.pay_id = pay.pay_id
       WHERE o.user_name = $1
       ORDER BY o.order_date DESC`,
      [user_name]
    );
    res.json(result.rows);
  } catch (err) {
    next(err);
  }
}

// POST 
async function placeOrder(req, res, next) {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    const { user_name } = req.user;
    const { shipp_addr, pay_mode, h_name, card_no, exp_month, exp_year } = req.body;

    
    const cartResult = await client.query(
      `SELECT c.*, p.price, p.p_quantity
       FROM add_to_cart c JOIN products p ON c.p_id=p.p_id
       WHERE c.user_name=$1`,
      [user_name]
    );

    if (cartResult.rows.length === 0) {
      return res.status(400).json({ message: 'Cart is empty.' });
    }

    const totalAmount = cartResult.rows.reduce((sum, item) => sum + parseFloat(item.amount), 0);

    
    const payResult = await client.query(
      `INSERT INTO payment (pay_mode, amount, card_no, h_name, exp_month, exp_year, user_name)
       VALUES ($1,$2,$3,$4,$5,$6,$7) RETURNING pay_id`,
      [pay_mode, totalAmount, card_no || null, h_name || null, exp_month || null, exp_year || null, user_name]
    );
    const pay_id = payResult.rows[0].pay_id;

    
    for (const item of cartResult.rows) {
      await client.query(
        `INSERT INTO orders (user_name, p_id, pay_id, shipp_addr, quantity, amount)
         VALUES ($1,$2,$3,$4,$5,$6)`,
        [user_name, item.p_id, pay_id, shipp_addr, item.quantity, item.amount]
      );

      // Reduce product stock
      await client.query(
        'UPDATE products SET p_quantity = p_quantity - $1 WHERE p_id = $2',
        [item.quantity, item.p_id]
      );
    }

    
    await client.query('DELETE FROM add_to_cart WHERE user_name=$1', [user_name]);

    await client.query('COMMIT');
    res.status(201).json({ message: 'Order placed successfully!', pay_id });
  } catch (err) {
    await client.query('ROLLBACK');
    next(err);
  } finally {
    client.release();
  }
}

// GET 
async function getAllOrders(req, res, next) {
  try {
    const result = await pool.query(
      `SELECT o.*, p.p_name, u.name as customer_name, pay.pay_mode
       FROM orders o
       JOIN products p ON o.p_id = p.p_id
       JOIN users u ON o.user_name = u.user_name
       LEFT JOIN payment pay ON o.pay_id = pay.pay_id
       ORDER BY o.order_date DESC`
    );
    res.json(result.rows);
  } catch (err) {
    next(err);
  }
}

module.exports = { getUserOrders, placeOrder, getAllOrders };
