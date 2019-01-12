CREATE OR REPLACE FUNCTION differ_by_one(text, text) RETURNS boolean AS $$
  BEGIN RETURN (SELECT sum(chars_equal) = (length($1) - 1) FROM (SELECT a, b, (CASE WHEN a = b THEN 1 ELSE 0 END) AS chars_equal FROM unnest(regexp_split_to_array($1, ''), regexp_split_to_array($2, '')) AS unnested(a, b)) AS x); END;
  $$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION shared_chars(text, text) RETURNS text AS $$
  BEGIN RETURN (SELECT string_agg(a, '') FROM unnest(regexp_split_to_array($1, ''), regexp_split_to_array($2, '')) AS unnested(a, b) WHERE a = b); END;
  $$ LANGUAGE plpgsql;

SELECT shared_chars(a.val, b.val) FROM day_two AS a INNER JOIN day_two AS b ON differ_by_one(a.val, b.val) LIMIT 1;
