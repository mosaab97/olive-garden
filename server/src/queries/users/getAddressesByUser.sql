SELECT id, label, street, city, state, zip, is_default, created_at
FROM addresses
WHERE user_id = $1
ORDER BY is_default DESC, created_at DESC;
