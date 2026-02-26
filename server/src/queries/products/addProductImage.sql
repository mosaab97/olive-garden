INSERT INTO product_images (product_id, url, alt_text, is_primary, sort_order, public_id)
VALUES ($1, $2, $3, $4, $5, $6)
RETURNING *;
