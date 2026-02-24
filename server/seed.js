/**
 * seed.js — run from the server/ folder
 * Usage: node seed.js
 *
 * Creates:
 *  - 1 admin user
 *  - 2 customer users
 *  - 4 categories
 *  - 6 products with variants
 */

require('dotenv').config();
const { Pool } = require('pg');
const bcrypt   = require('bcryptjs');

const pool = new Pool({
  host:     process.env.DB_HOST,
  port:     process.env.DB_PORT,
  database: process.env.DB_NAME,
  user:     process.env.DB_USER,
  password: process.env.DB_PASSWORD,
});

// ─── Seed data ────────────────────────────────────────────────────────────────

const users = [
  {
    email:      'admin@oliveandco.com',
    password:   'Admin@123',
    first_name: 'Store',
    last_name:  'Admin',
    phone:      '3125550001',
    role:       'admin',
  },
  {
    email:      'jane@example.com',
    password:   'Customer@123',
    first_name: 'Jane',
    last_name:  'Doe',
    phone:      '3125550002',
    role:       'customer',
  },
  {
    email:      'mike@example.com',
    password:   'Customer@123',
    first_name: 'Mike',
    last_name:  'Smith',
    phone:      '3125550003',
    role:       'customer',
  },
];

const categories = [
  { name: 'By Filling',  slug: 'by-filling',  description: 'Olives stuffed with your choice of filling' },
  { name: 'Gift Sets',   slug: 'gift-sets',   description: 'Curated gift boxes perfect for entertaining' },
  { name: 'Sampler',     slug: 'sampler',     description: 'Try a little of everything' },
  { name: 'Bulk Orders', slug: 'bulk-orders', description: 'Large quantity jars for events and catering' },
];

// Products and their variants
const products = [
  {
    name:        'Carrot Stuffed Olives',
    slug:        'carrot-stuffed-olives',
    description: 'Crisp, briny olives stuffed with fresh carrot. A classic combination with a satisfying crunch.',
    ingredients: 'Green olives, fresh carrots, olive oil, sea salt, citric acid',
    category:    'by-filling',
    variants: [
      { sku: 'CAR-8OZ',  filling: 'carrot', size_oz: 8,  label: '8oz — Carrot',  price: 9.99,  stock_qty: 50, weight_lbs: 0.6 },
      { sku: 'CAR-16OZ', filling: 'carrot', size_oz: 16, label: '16oz — Carrot', price: 16.99, stock_qty: 35, weight_lbs: 1.1 },
      { sku: 'CAR-32OZ', filling: 'carrot', size_oz: 32, label: '32oz — Carrot', price: 29.99, stock_qty: 20, weight_lbs: 2.1 },
    ],
  },
  {
    name:        'Labaneh Stuffed Olives',
    slug:        'labaneh-stuffed-olives',
    description: 'Plump olives filled with creamy, tangy labaneh (strained yogurt). A Lebanese classic.',
    ingredients: 'Green olives, labaneh (strained yogurt), olive oil, sea salt, dried mint',
    category:    'by-filling',
    variants: [
      { sku: 'LAB-8OZ',  filling: 'labaneh', size_oz: 8,  label: '8oz — Labaneh',  price: 11.99, stock_qty: 40, weight_lbs: 0.6 },
      { sku: 'LAB-16OZ', filling: 'labaneh', size_oz: 16, label: '16oz — Labaneh', price: 19.99, stock_qty: 30, weight_lbs: 1.1 },
    ],
  },
  {
    name:        'Cheese Stuffed Olives',
    slug:        'cheese-stuffed-olives',
    description: 'Rich green olives stuffed with creamy feta or blue cheese. Perfect on a charcuterie board.',
    ingredients: 'Green olives, feta cheese, olive oil, sea salt, black pepper',
    category:    'by-filling',
    variants: [
      { sku: 'CHE-FETA-8OZ',  filling: 'feta cheese',  size_oz: 8,  label: '8oz — Feta',       price: 11.99, stock_qty: 45, weight_lbs: 0.6 },
      { sku: 'CHE-BLUE-8OZ',  filling: 'blue cheese',  size_oz: 8,  label: '8oz — Blue Cheese', price: 12.99, stock_qty: 30, weight_lbs: 0.6 },
      { sku: 'CHE-FETA-16OZ', filling: 'feta cheese',  size_oz: 16, label: '16oz — Feta',       price: 19.99, stock_qty: 25, weight_lbs: 1.1 },
    ],
  },
  {
    name:        'Jalapeño Stuffed Olives',
    slug:        'jalapeno-stuffed-olives',
    description: 'For heat lovers — green olives packed with spicy jalapeño. Bold, bright, and addictive.',
    ingredients: 'Green olives, jalapeño peppers, olive oil, sea salt, garlic',
    category:    'by-filling',
    variants: [
      { sku: 'JAL-8OZ',  filling: 'jalapeño', size_oz: 8,  label: '8oz — Jalapeño',  price: 10.99, stock_qty: 35, weight_lbs: 0.6 },
      { sku: 'JAL-16OZ', filling: 'jalapeño', size_oz: 16, label: '16oz — Jalapeño', price: 17.99, stock_qty: 20, weight_lbs: 1.1 },
    ],
  },
  {
    name:        'The Classic Sampler',
    slug:        'classic-sampler',
    description: 'Can\'t pick just one? Get 4 small jars — carrot, labaneh, feta, and jalapeño. The perfect introduction.',
    ingredients: 'Assorted stuffed olives — see individual products for full ingredient list',
    category:    'sampler',
    variants: [
      { sku: 'SAMP-4PK', filling: 'assorted', size_oz: 4, label: '4-Pack Sampler (4 × 4oz)', price: 34.99, stock_qty: 25, weight_lbs: 1.5 },
    ],
  },
  {
    name:        'The Gift Box',
    slug:        'gift-box',
    description: 'A beautifully packaged gift box with 2 full-size jars of your choice, perfect for birthdays, holidays, and housewarmings.',
    ingredients: 'Assorted stuffed olives — customer selects fillings at checkout',
    category:    'gift-sets',
    variants: [
      { sku: 'GIFT-2PK', filling: 'assorted', size_oz: 16, label: 'Gift Box — 2 × 16oz',  price: 44.99, stock_qty: 15, weight_lbs: 2.5 },
      { sku: 'GIFT-4PK', filling: 'assorted', size_oz: 16, label: 'Gift Box — 4 × 16oz',  price: 79.99, stock_qty: 10, weight_lbs: 4.5 },
    ],
  },
];

// ─── Helpers ─────────────────────────────────────────────────────────────────

const q = (sql, params) => pool.query(sql, params);

// ─── Seed functions ───────────────────────────────────────────────────────────

async function seedUsers() {
  console.log('\n👤  Seeding users...');
  const ids = {};

  for (const u of users) {
    const hash = await bcrypt.hash(u.password, 12);
    const { rows } = await q(
      `INSERT INTO users (email, password_hash, first_name, last_name, phone, role)
       VALUES ($1, $2, $3, $4, $5, $6)
       ON CONFLICT (email) DO UPDATE SET role = EXCLUDED.role
       RETURNING id, email, role`,
      [u.email, hash, u.first_name, u.last_name, u.phone, u.role]
    );
    ids[u.email] = rows[0].id;
    console.log(`  ✓ ${rows[0].role.padEnd(8)} ${rows[0].email}  (id: ${rows[0].id})`);
  }

  return ids;
}

async function seedCategories() {
  console.log('\n📁  Seeding categories...');
  const ids = {};

  for (const c of categories) {
    const { rows } = await q(
      `INSERT INTO categories (name, slug, description)
       VALUES ($1, $2, $3)
       ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name
       RETURNING id, slug`,
      [c.name, c.slug, c.description]
    );
    ids[c.slug] = rows[0].id;
    console.log(`  ✓ ${c.name}  (id: ${rows[0].id})`);
  }

  return ids;
}

async function seedProducts(categoryIds) {
  console.log('\n🫒  Seeding products & variants...');

  for (const p of products) {
    // Insert product
    const { rows: pRows } = await q(
      `INSERT INTO products (category_id, name, slug, description, ingredients)
       VALUES ($1, $2, $3, $4, $5)
       ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name
       RETURNING id, name`,
      [categoryIds[p.category], p.name, p.slug, p.description, p.ingredients]
    );
    const productId = pRows[0].id;
    console.log(`  ✓ ${pRows[0].name}  (id: ${productId})`);

    // Insert variants
    for (const v of p.variants) {
      await q(
        `INSERT INTO product_variants (product_id, sku, filling, size_oz, label, price, stock_qty, weight_lbs)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
         ON CONFLICT (sku) DO UPDATE SET price = EXCLUDED.price, stock_qty = EXCLUDED.stock_qty`,
        [productId, v.sku, v.filling, v.size_oz, v.label, v.price, v.stock_qty, v.weight_lbs]
      );
      console.log(`      → ${v.label.padEnd(30)} $${v.price}  stock: ${v.stock_qty}`);
    }
  }
}

async function seedOrders(userIds) {
  console.log('\n📦  Seeding sample orders...');

  // Grab a couple of variant IDs to use in mock orders
  const { rows: variants } = await q(
    `SELECT id, product_id, label, price FROM product_variants WHERE sku IN ('CAR-8OZ','LAB-16OZ','CHE-FETA-8OZ') ORDER BY sku`
  );

  if (variants.length < 2) {
    console.log('  ⚠  Skipping orders — variants not found, run products seed first');
    return;
  }

  const janeId = userIds['jane@example.com'];
  const mikeId = userIds['mike@example.com'];

  // Get product names for snapshot
  const { rows: vDetails } = await q(
    `SELECT pv.id, pv.label, pv.price, p.name as product_name
     FROM product_variants pv JOIN products p ON p.id = pv.product_id
     WHERE pv.sku IN ('CAR-8OZ','LAB-16OZ','CHE-FETA-8OZ')`
  );
  const byId = Object.fromEntries(vDetails.map((v) => [v.id, v]));

  const sampleOrders = [
    {
      userId: janeId,
      shipping: { name: 'Jane Doe', street: '123 Elm St', city: 'Chicago', state: 'IL', zip: '60601' },
      status: 'delivered',
      items: [
        { variant: vDetails[0], qty: 2 },
        { variant: vDetails[1], qty: 1 },
      ],
    },
    {
      userId: janeId,
      shipping: { name: 'Jane Doe', street: '123 Elm St', city: 'Chicago', state: 'IL', zip: '60601' },
      status: 'shipped',
      items: [
        { variant: vDetails[2], qty: 1 },
      ],
    },
    {
      userId: mikeId,
      shipping: { name: 'Mike Smith', street: '456 Oak Ave', city: 'Evanston', state: 'IL', zip: '60201' },
      status: 'pending',
      items: [
        { variant: vDetails[0], qty: 3 },
      ],
    },
  ];

  for (const o of sampleOrders) {
    const subtotal     = o.items.reduce((s, i) => s + i.variant.price * i.qty, 0);
    const shipping_cost = 7.99;
    const tax          = parseFloat((subtotal * 0.1).toFixed(2));
    const total        = parseFloat((subtotal + shipping_cost + tax).toFixed(2));

    const { rows: oRows } = await q(
      `INSERT INTO orders
         (user_id, shipping_name, shipping_street, shipping_city, shipping_state, shipping_zip,
          subtotal, shipping_cost, tax, total, status)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11)
       RETURNING id`,
      [
        o.userId,
        o.shipping.name, o.shipping.street, o.shipping.city, o.shipping.state, o.shipping.zip,
        subtotal, shipping_cost, tax, total, o.status,
      ]
    );
    const orderId = oRows[0].id;

    for (const item of o.items) {
      const line_total = parseFloat((item.variant.price * item.qty).toFixed(2));
      await q(
        `INSERT INTO order_items (order_id, variant_id, product_name, variant_label, unit_price, quantity, line_total)
         VALUES ($1,$2,$3,$4,$5,$6,$7)`,
        [orderId, item.variant.id, item.variant.product_name, item.variant.label, item.variant.price, item.qty, line_total]
      );
    }

    console.log(`  ✓ Order #${orderId}  status: ${o.status.padEnd(10)} total: $${total}`);
  }
}

// ─── Main ─────────────────────────────────────────────────────────────────────

async function main() {
  console.log('🌱  Starting seed...');
  console.log(`    DB: ${process.env.DB_NAME} @ ${process.env.DB_HOST}:${process.env.DB_PORT}\n`);

  try {
    const userIds     = await seedUsers();
    const categoryIds = await seedCategories();
    await seedProducts(categoryIds);
    await seedOrders(userIds);

    console.log('\n✅  Seed complete!\n');
    console.log('─────────────────────────────────────────');
    console.log('  Admin login');
    console.log('  Email:    admin@oliveandco.com');
    console.log('  Password: Admin@123');
    console.log('─────────────────────────────────────────\n');
  } catch (err) {
    console.error('\n❌  Seed failed:', err.message);
    console.error(err);
  } finally {
    await pool.end();
  }
}

main();
