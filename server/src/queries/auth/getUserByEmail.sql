SELECT id, email, password_hash, first_name, last_name, phone, role, created_at
FROM users
WHERE email = $1;
