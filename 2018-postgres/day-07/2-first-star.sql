CREATE OR REPLACE FUNCTION d7_order() RETURNS text LANGUAGE plpgsql as $$
DECLARE
  chosen text[] := ARRAY[]::text[];
BEGIN
  LOOP
  EXIT WHEN array_length(chosen, 1) >= 26;
  chosen := chosen || (
    SELECT c FROM regexp_split_to_table('ABCDEFGHIJKLMNOPQRSTUVWXYZ', '') AS c WHERE NOT c = ANY(chosen) AND NOT c = ANY(SELECT post FROM d7 WHERE NOT pre = ANY(chosen)) ORDER BY c LIMIT 1
  );
  END LOOP;

  RETURN array_to_string(chosen, '');
END;
$$;

SELECT d7_order();
