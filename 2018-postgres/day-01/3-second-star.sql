CREATE TABLE day_one_repeating (id SERIAL, val INTEGER);

DO
$$
declare
  i record;
begin
  for i in 1..300 loop
    INSERT INTO day_one_repeating (val) SELECT val FROM day_one ORDER BY id;
  end loop;
end;
$$
;

CREATE VIEW day_one_running_totals AS SELECT id, val, sum(val) OVER (ORDER BY id) AS running_total FROM day_one_repeating;

WITH with_rank AS (SELECT *, rank() OVER (PARTITION BY running_total ORDER BY id) FROM day_one_running_totals)
SELECT running_total FROM with_rank WHERE rank > 1 ORDER BY id LIMIT 1;
