-- Puzzle input: 7347

CREATE OR REPLACE FUNCTION d11_power_level(x int, y int, serial_number int) RETURNS int LANGUAGE sql AS $$
  SELECT ((((((x + 10) * y) + serial_number) * (x + 10)) / 100) % 10) - 5;
$$;

CREATE VIEW d11_grid AS
  SELECT *
  FROM generate_series(1, 300) AS x
  FULL OUTER JOIN generate_series(1, 300) AS y
  ON TRUE;

SELECT
  d11_power_level(x+0, y+0, 7347) +
  d11_power_level(x+0, y+1, 7347) +
  d11_power_level(x+0, y+2, 7347) +
  d11_power_level(x+1, y+0, 7347) +
  d11_power_level(x+1, y+1, 7347) +
  d11_power_level(x+1, y+2, 7347) +
  d11_power_level(x+2, y+0, 7347) +
  d11_power_level(x+2, y+1, 7347) +
  d11_power_level(x+2, y+2, 7347) AS total_power,
  x, y
FROM d11_grid
ORDER BY 1 DESC LIMIT 1;
