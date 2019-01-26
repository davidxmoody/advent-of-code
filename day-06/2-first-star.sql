CREATE MATERIALIZED VIEW grid_squares AS

WITH
  constants (min_x, max_x, min_y, max_y) AS
  (SELECT min(x), max(x), min(y), max(y) FROM day_six)

SELECT
  gx,
  gy,
  (gx = min_x OR gx = max_x OR gy = min_y OR gy = max_y) AS is_edge

FROM
  constants,
  generate_series(min_x, max_x) AS gx
  FULL OUTER JOIN generate_series(min_y, max_y) AS gy
  ON true;

CREATE OR REPLACE FUNCTION manhattan_distance(ax integer, ay integer, bx integer, by integer)
RETURNS integer AS $$
  SELECT abs(ax - bx) + abs(ay - by);
$$ IMMUTABLE LANGUAGE sql;

CREATE MATERIALIZED VIEW lowest_distances AS (
  WITH all_combinations AS (SELECT manhattan_distance(x, y, gx, gy) AS dist, x, y, gx, gy, (CASE is_edge WHEN true THEN 1 ELSE 0 END) AS edge FROM grid_squares FULL OUTER JOIN day_six ON true)

  SELECT (array_agg(dist ORDER BY dist))[1] AS dist, (array_agg(x ORDER BY dist))[1] AS x, (array_agg(y ORDER BY dist))[1] AS y, gx, gy, edge FROM all_combinations GROUP BY (gx, gy, edge) HAVING (array_agg(dist ORDER BY dist))[1] != (array_agg(dist ORDER BY dist))[2]
);

SELECT count(*) FROM lowest_distances GROUP BY x, y HAVING sum(edge) = 0 ORDER BY count(*) DESC LIMIT 1;
