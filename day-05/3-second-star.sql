CREATE OR REPLACE FUNCTION get_lower_unique_chars(text) RETURNS TABLE (c text) AS $$
  SELECT DISTINCT lower(a) FROM regexp_split_to_table($1, '') AS a ORDER BY 1;
$$ LANGUAGE sql;

CREATE OR REPLACE FUNCTION without_char(text, text) RETURNS text AS $$
  SELECT replace(replace($1, $2, ''), upper($2), '');
$$ LANGUAGE sql;

SELECT get_collapsed_length(without_char((SELECT val FROM day_five), c)) FROM get_lower_unique_chars((SELECT val FROM day_five)) ORDER BY 1 ASC LIMIT 1;
