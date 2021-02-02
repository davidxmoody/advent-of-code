CREATE TABLE alphabet AS SELECT rank() OVER (ORDER BY c) AS pos, c FROM regexp_split_to_table('ABCDEFGHIJKLMNOPQRSTUVWXYZ', '') AS c;

CREATE FUNCTION work_duration(letter text) RETURNS bigint IMMUTABLE LANGUAGE sql as $$
  SELECT pos + 60 FROM alphabet WHERE alphabet.c = letter;
$$;

-- WIP:

CREATE TYPE work_item AS (
  item text,
  remaining_time int
);

CREATE OR REPLACE FUNCTION d7_duration_multi(num_workers int) RETURNS int LANGUAGE plpgsql AS $$
BEGIN
  CREATE TEMP TABLE tmp (second int PRIMARY KEY, workers text[], chosen text[]);
  LOOP
  EXIT WHEN array_length((SELECT chosen FROM tmp ORDER BY second DESC LIMIT 1), 1) >= 26;
  INSERT INTO tmp VALUES (
    (SELECT COALESCE(max(second), 0) FROM tmp),
    ARRAY[],
    (SELECT chosen FROM tmp ORDER BY second DESC LIMIT 1)
  );
  
  
  LOOP
  
  chosen := chosen || (
    SELECT c FROM alphabet WHERE NOT c = ANY(chosen) AND NOT c = ANY(SELECT post FROM d7 WHERE NOT pre = ANY(chosen)) ORDER BY c LIMIT 1
  );
  END LOOP;
  
  DROP TABLE tmp
  
  RETURN array_to_string(chosen, '');
END;
$$;

SELECT d7_duration_multi(2);

select unnest(array_agg(ab)) from (select 'idle' from generate_series(1, 2)) as ab;

