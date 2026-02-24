INSERT INTO categories (name, slug, description)
VALUES ($1, $2, $3)
RETURNING *;
