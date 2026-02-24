INSERT INTO product_variants (product_id, sku, filling, size_oz, label, price, stock_qty, weight_lbs)
VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
RETURNING *;
