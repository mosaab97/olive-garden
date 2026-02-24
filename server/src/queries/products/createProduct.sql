INSERT INTO products (category_id, name, slug, description, ingredients)
VALUES ($1, $2, $3, $4, $5)
RETURNING *;
