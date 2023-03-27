WITH with_counts AS
(SELECT
  (SELECT count(DISTINCT r_count) FROM (SELECT count(*) AS r_count, regexp_split_to_table(val, '') AS r GROUP BY r) AS x WHERE r_count = 2) AS has_two,
  (SELECT count(DISTINCT r_count) FROM (SELECT count(*) AS r_count, regexp_split_to_table(val, '') AS r GROUP BY r) AS x WHERE r_count = 3) AS has_three
FROM day_two)

SELECT sum(has_two) * sum(has_three) FROM with_counts;
