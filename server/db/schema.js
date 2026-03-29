// server/db/schema.js
// Run with: node db/schema.js
// Creates all tables based on the ER Diagram

const pool = require('./pool');

async function createTables() {
  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    // ─── USERS ───────────────────────────────────────────────────────────────
    await client.query(`
      CREATE TABLE IF NOT EXISTS users (
        user_id   SERIAL PRIMARY KEY,
        name      VARCHAR(100) NOT NULL,
        city      VARCHAR(100),
        mobile    VARCHAR(15),
        user_name VARCHAR(50)  UNIQUE NOT NULL,
        pass      VARCHAR(255) NOT NULL,   -- stored as bcrypt hash
        address   TEXT,
        gender    VARCHAR(10),
        email_id  VARCHAR(150) UNIQUE NOT NULL
      );
    `);

    // ─── PRODUCTS ─────────────────────────────────────────────────────────────
    await client.query(`
      CREATE TABLE IF NOT EXISTS products (
        p_id       SERIAL PRIMARY KEY,
        p_name     VARCHAR(150) NOT NULL,
        p_desc     TEXT,
        category   VARCHAR(100),
        price      NUMERIC(10,2) NOT NULL,
        p_quantity  INTEGER DEFAULT 0,
        p_image    VARCHAR(300)
      );
    `);

    // ─── ADMIN ────────────────────────────────────────────────────────────────
    await client.query(`
      CREATE TABLE IF NOT EXISTS admin (
        admin_id   SERIAL PRIMARY KEY,
        admin_name VARCHAR(100) NOT NULL,
        admin_pass VARCHAR(255) NOT NULL
      );
    `);

    // ─── ADD_TO_CART ──────────────────────────────────────────────────────────
    await client.query(`
      CREATE TABLE IF NOT EXISTS add_to_cart (
        cart_id    SERIAL PRIMARY KEY,
        quantity   INTEGER NOT NULL DEFAULT 1,
        amount     NUMERIC(10,2),
        user_name  VARCHAR(50) REFERENCES users(user_name) ON DELETE CASCADE,
        p_id       INTEGER REFERENCES products(p_id) ON DELETE CASCADE
      );
    `);

    // ─── PAYMENT ──────────────────────────────────────────────────────────────
    await client.query(`
      CREATE TABLE IF NOT EXISTS payment (
        pay_id     SERIAL PRIMARY KEY,
        pay_mode   VARCHAR(50),
        amount     NUMERIC(10,2),
        card_no    VARCHAR(20),
        h_name     VARCHAR(100),         -- cardholder name
        exp_month  INTEGER,
        exp_year   INTEGER,
        p_id       INTEGER REFERENCES products(p_id),
        user_name  VARCHAR(50) REFERENCES users(user_name)
      );
    `);

    // ─── ORDERS ───────────────────────────────────────────────────────────────
    await client.query(`
      CREATE TABLE IF NOT EXISTS orders (
        order_id    SERIAL PRIMARY KEY,
        order_date  TIMESTAMP DEFAULT NOW(),
        user_name   VARCHAR(50) REFERENCES users(user_name) ON DELETE SET NULL,
        p_id        INTEGER REFERENCES products(p_id),
        pay_id      INTEGER REFERENCES payment(pay_id),
        shipp_addr  TEXT,
        quantity    INTEGER DEFAULT 1,
        amount      NUMERIC(10,2)
      );
    `);

    // ─── FEEDBACK ─────────────────────────────────────────────────────────────
    await client.query(`
      CREATE TABLE IF NOT EXISTS feedback (
        f_id      SERIAL PRIMARY KEY,
        comment   TEXT,
        amount    NUMERIC(10,2),
        quantity  INTEGER,
        email_id  VARCHAR(150) REFERENCES users(email_id) ON DELETE SET NULL
      );
    `);

    await client.query('COMMIT');
    console.log('✅ All tables created successfully!');
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('Schema error:', err.message);
  } finally {
    client.release();
    process.exit();
  }
}

createTables();
