CREATE OR REPLACE FUNCTION get_squares(x INTEGER, y INTEGER, w INTEGER, h INTEGER) RETURNS TABLE (square TEXT) AS $$
  BEGIN
    RETURN QUERY SELECT (a || ',' || b) AS square
      FROM generate_series(x, x + w - 1) AS a
      FULL OUTER JOIN generate_series(y, y + h - 1) AS b
      ON true;
  END;
$$ LANGUAGE 'plpgsql';

CREATE MATERIALIZED VIEW day_three_all_conflicting_squares AS 
  (SELECT a AS square FROM (SELECT get_squares(x, y, w, h) AS a FROM day_three_extracted) AS b GROUP BY a HAVING count(*) > 1);

SELECT count(*) from day_three_all_conflicting_squares;
