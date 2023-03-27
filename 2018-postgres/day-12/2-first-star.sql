CREATE OR REPLACE FUNCTION next_state(state text[]) RETURNS text[] LANGUAGE sql AS $$
  SELECT ARRAY['.', '.'] || state || ARRAY['.', '.'];
$$;
