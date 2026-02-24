SELECT *
FROM product_variants
WHERE product_id = $1 AND is_active = TRUE
ORDER BY size_oz ASC, filling ASC;
