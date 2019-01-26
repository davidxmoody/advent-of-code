WITH
  all_combinations AS (SELECT manhattan_distance(x, y, gx, gy) AS dist, x, y, gx, gy FROM grid_squares FULL OUTER JOIN day_six ON true),

  within_area AS (SELECT gy, gy FROM all_combinations GROUP BY gx, gy HAVING sum(dist) < 10000)

SELECT count(*) FROM within_area;
