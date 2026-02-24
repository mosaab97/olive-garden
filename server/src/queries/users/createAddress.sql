INSERT INTO addresses (user_id, label, street, city, state, zip, is_default)
VALUES ($1, $2, $3, $4, $5, $6, $7)
RETURNING *;
