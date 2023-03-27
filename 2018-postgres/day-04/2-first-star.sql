CREATE MATERIALIZED VIEW day_four_extracted AS SELECT
  id, val,
  substring(val FROM '^\[(\d\d\d\d-\d\d-\d\d) \d\d:\d\d] .*$')::text AS d,
  substring(val FROM '^\[\d\d\d\d-\d\d-\d\d (\d\d):\d\d] .*$')::integer AS h,
  substring(val FROM '^\[\d\d\d\d-\d\d-\d\d \d\d:(\d\d)] .*$')::integer AS m,
  substring(val FROM '^\[\d\d\d\d-\d\d-\d\d \d\d:\d\d] (.*)$')::text AS full_text,
  substring(val FROM '^\[\d\d\d\d-\d\d-\d\d \d\d:\d\d] Guard #(\d+) begins shift$')::text AS guard_id,
  substring(val FROM '^\[\d\d\d\d-\d\d-\d\d \d\d:\d\d] (falls asleep)$') IS NOT NULL AS falls_asleep,
  substring(val FROM '^\[\d\d\d\d-\d\d-\d\d \d\d:\d\d] (wakes up)$') IS NOT NULL AS wakes_up,
  rank() OVER (ORDER BY val) AS new_id
FROM day_four ORDER BY val;

CREATE MATERIALIZED VIEW day_four_full AS SELECT
  new_id,
  val,
  h,
  m,
  (SELECT guard_id FROM day_four_extracted AS x WHERE x.new_id <= y.new_id AND x.guard_id IS NOT NULL ORDER BY new_id DESC LIMIT 1) AS g_id,
  falls_asleep,
  wakes_up
FROM day_four_extracted AS y;

CREATE MATERIALIZED VIEW day_four_sleeps AS SELECT g_id, sleep_at, wake_at, (wake_at - sleep_at) AS duration FROM (SELECT (lag(m) OVER (ORDER BY new_id)) AS sleep_at, m AS wake_at, g_id, wakes_up FROM day_four_full) AS x WHERE wakes_up IS TRUE;

CREATE MATERIALIZED VIEW sleepiest_guard AS SELECT g_id FROM day_four_sleeps GROUP BY g_id ORDER BY sum(duration) DESC LIMIT 1;

CREATE MATERIALIZED VIEW sleepiest_minute AS SELECT min FROM (SELECT generate_series(sleep_at, wake_at - 1) AS min FROM day_four_sleeps WHERE g_id = (SELECT g_id FROM sleepiest_guard)) AS a GROUP BY min ORDER BY count(min) DESC LIMIT 1;

SELECT (SELECT g_id FROM sleepiest_guard)::integer * (SELECT * FROM sleepiest_minute);
