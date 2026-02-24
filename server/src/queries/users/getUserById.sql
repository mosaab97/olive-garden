SELECT id, email, first_name, last_name, phone, role, created_at
FROM users
WHERE id = $1;
