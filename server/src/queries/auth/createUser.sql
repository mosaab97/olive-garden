INSERT INTO users (email, password_hash, first_name, last_name, phone)
VALUES ($1, $2, $3, $4, $5)
RETURNING id, email, first_name, last_name, phone, role, created_at;
