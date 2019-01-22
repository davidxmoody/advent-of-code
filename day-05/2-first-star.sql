CREATE OR REPLACE FUNCTION chars_match(text, text) RETURNS boolean AS $$
  SELECT $1 != $2 AND LOWER($1) = LOWER($2);
$$ LANGUAGE sql;

CREATE OR REPLACE FUNCTION collapse(text[]) RETURNS text[] AS $$
DECLARE
  x text;
  arr text[] := ARRAY[]::text[];
BEGIN
  FOREACH x IN ARRAY $1
  LOOP
  IF array_length(arr, 1) > 0 AND chars_match(arr[array_upper(arr, 1)], x) THEN
    arr := arr[1:array_upper(arr, 1) - 1];
  ELSE
    arr := arr || x;
  END IF;
  END LOOP;
  RETURN arr;
END;
$$ LANGUAGE plpgsql;

SELECT length(array_to_string(
    collapse(regexp_split_to_array((SELECT val FROM day_five), ''))
, ''));
