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
