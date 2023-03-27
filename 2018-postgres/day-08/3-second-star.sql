-- WIP:

CREATE OR REPLACE FUNCTION sum_metadata(start_pos int, end_pos int) RETURNS int IMMUTABLE LANGUAGE sql AS $$
  SELECT
$$;

DROP TABLE d8_nodes;
CREATE TABLE d8_nodes (start_pos int not null, num_children int not null, num_metadata int not null, meta int[] not null);

ALTER TABLE d8_nodes ADD COLUMN value int;

CREATE OR REPLACE FUNCTION build_table_with_values() RETURNS VOID LANGUAGE plpgsql AS $$
BEGIN
  DELETE FROM d8_nodes WHERE true;
  PERFORM extend_table_with_values(1);
END;
$$;

CREATE OR REPLACE FUNCTION extend_table_with_values(start_pos int) RETURNS int LANGUAGE plpgsql AS $$
DECLARE
  value int := 0;
  i int := 0;
  num_children int := (SELECT val FROM d8 WHERE pos = start_pos);
  num_metadata int := (SELECT val FROM d8 WHERE pos = (start_pos + 1));
  len_of_covered_children int := 0;
BEGIN
  -- RAISE NOTICE 'extend_table start_pos=% num_children=% num_metadata=%', start_pos, num_children, num_metadata;

  WHILE i < num_children LOOP
    -- RAISE NOTICE 'LOOP         start_pos=% num_children=% num_metadata=% len_of_covered_children=%, i=%', start_pos, num_children, num_metadata, len_of_covered_children, i;
    
    len_of_covered_children := len_of_covered_children + extend_table(start_pos + len_of_covered_children + 2);
    i := i + 1;
  END LOOP;
  
  
  
  -- RAISE NOTICE 'INSERT start_pos=%', start_pos;
  INSERT INTO d8_nodes VALUES (
    start_pos, num_children,
    num_metadata,
    (SELECT array_agg(val ORDER BY pos) FROM d8 WHERE pos >= (start_pos + len_of_covered_children + 2) AND pos < (start_pos + len_of_covered_children + 2 + num_metadata)),
    (CASE num_children = 0 THEN
      (SELECT array_agg(val ORDER BY pos) FROM d8 WHERE pos >= (start_pos + len_of_covered_children + 2) AND pos < (start_pos + len_of_covered_children + 2 + num_metadata)
    ELSE
      
    END)
  );
  
  -- RAISE NOTICE 'RETURNING start_pos=% length=%', start_pos, (len_of_covered_children + num_metadata + 2);
  RETURN (len_of_covered_children + num_metadata + 2);
END;
$$;

SELECT build_table();

SELECT * FROM d8;
SELECT * FROM d8_nodes;

SELECT sum(x) FROM (SELECT unnest(meta) AS x FROM d8_nodes) AS y;

-- NOT 69643 (too high)
-- NOT 63144 (too high)

SELECT array_agg(x) FROM generate_series(0, 0) AS x;
