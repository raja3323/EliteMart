// server/db/seed.js
// Run with: node db/seed.js
// Populates the database with sample data for development

const pool = require('./pool');
const bcrypt = require('bcryptjs');
require('dotenv').config({ path: '../../.env' });

async function seed() {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    // Seed Admin
    const adminPass = await bcrypt.hash('admin123', 10);
    await client.query(`
      INSERT INTO admin (admin_name, admin_pass)
      VALUES ('SuperAdmin', $1)
      ON CONFLICT DO NOTHING;
    `, [adminPass]);

    // Seed Users
    const userPass = await bcrypt.hash('password123', 10);
    await client.query(`
      INSERT INTO users (name, city, mobile, user_name, pass, address, gender, email_id)
      VALUES
        ('Aarav Sharma', 'Delhi', '9876543210', 'aarav_s', $1, '12 MG Road, Delhi', 'Male', 'aarav@example.com'),
        ('Priya Singh', 'Mumbai', '9123456789', 'priya_s', $1, '45 Linking Road, Mumbai', 'Female', 'priya@example.com')
      ON CONFLICT DO NOTHING;
    `, [userPass]);

    // Seed Products
    await client.query(`
      INSERT INTO products (p_name, p_desc, category, price, p_quantity, p_image)
      VALUES
        ('Wireless Headphones', 'Premium noise-cancelling headphones with 30hr battery.', 'Electronics', 2999.00, 50, 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400'),
        ('Running Shoes', 'Lightweight and breathable for long-distance runs.', 'Footwear', 1499.00, 100, 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400'),
        ('Leather Wallet', 'Slim genuine leather wallet with RFID protection.', 'Accessories', 799.00, 200, 'https://images.unsplash.com/photo-1627123424574-724758594e93?w=400'),
        ('Yoga Mat', 'Non-slip, eco-friendly, 6mm thick.', 'Sports', 899.00, 75, 'https://images.unsplash.com/photo-1718862403436-616232ec6005?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'),
        ('Mechanical Keyboard', 'RGB backlit, tactile switches, compact TKL layout.', 'Electronics', 3499.00, 30, 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=400'),
        ('Sunglasses', 'UV400 polarised lenses, metal frame.', 'Accessories', 1299.00, 60, 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=400')
      ON CONFLICT DO NOTHING;
    `);

    await client.query('COMMIT');
    console.log('Database seeded successfully!');
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('Seed error:', err.message);
  } finally {
    client.release();
    process.exit();
  }
}

seed();
