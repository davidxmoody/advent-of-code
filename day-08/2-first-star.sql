CREATE TABLE d8_nodes (
    start_pos int NOT NULL,
    num_children int NOT NULL,
    num_metadata int NOT NULL,
    meta int[] NOT NULL
);

CREATE OR REPLACE FUNCTION extend_table (start_pos int)
    RETURNS int
    LANGUAGE plpgsql
    AS $$
DECLARE
    i int := 0;
    num_children int := (
        SELECT
            val
        FROM
            d8
        WHERE
            pos = start_pos);
    num_metadata int := (
        SELECT
            val
        FROM
            d8
        WHERE
            pos = (start_pos + 1));
    len_of_covered_children int := 0;
BEGIN
    -- RAISE NOTICE 'extend_table start_pos=% num_children=% num_metadata=%', start_pos, num_children, num_metadata;
    WHILE i < num_children LOOP
        -- RAISE NOTICE 'LOOP         start_pos=% num_children=% num_metadata=% len_of_covered_children=%, i=%', start_pos, num_children, num_metadata, len_of_covered_children, i;
        len_of_covered_children := len_of_covered_children + extend_table (start_pos + len_of_covered_children + 2);
        i := i + 1;
    END LOOP;
    -- RAISE NOTICE 'INSERT start_pos=%', start_pos;
    INSERT INTO d8_nodes
        VALUES (start_pos, num_children, num_metadata, (
                SELECT
                    array_agg(val ORDER BY pos)
                FROM
                    d8
                WHERE
                    pos >= (start_pos + len_of_covered_children + 2)
                    AND pos < (start_pos + len_of_covered_children + 2 + num_metadata)));
    -- RAISE NOTICE 'RETURNING start_pos=% length=%', start_pos, (len_of_covered_children + num_metadata + 2);
    RETURN (len_of_covered_children + num_metadata + 2);
END;
$$;

CREATE OR REPLACE FUNCTION build_table ()
    RETURNS VOID
    LANGUAGE plpgsql
    AS $$
BEGIN
    DELETE FROM d8_nodes
    WHERE TRUE;
    PERFORM
        extend_table (1);
END;
$$;

SELECT
    build_table ();

SELECT
    sum(x)
FROM (
    SELECT
        unnest(meta) AS x
    FROM
        d8_nodes) AS y;

