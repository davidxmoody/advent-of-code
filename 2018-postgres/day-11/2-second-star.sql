CREATE MATERIALIZED VIEW d11_grid_with_power AS
SELECT x, y, d11_power_level(x, y, 7347) AS power
FROM generate_series(1, 300) AS x
FULL OUTER JOIN generate_series(1, 300) AS y
ON TRUE;

CREATE OR REPLACE FUNCTION d11_sized_power(x_start int, y_start int, size int) RETURNS bigint LANGUAGE sql AS $$
  SELECT sum(power) FROM d11_grid_with_power WHERE x >= x_start AND x < (x_start + size) AND y >= y_start AND y < (y_start + size);
$$;

-- Hmm, too slow
