SELECT id FROM day_three_extracted WHERE (
  SELECT a.square FROM get_squares(x, y, w, h) AS a INNER JOIN day_three_all_conflicting_squares AS b ON a.square = b.square LIMIT 1
) IS NULL;
