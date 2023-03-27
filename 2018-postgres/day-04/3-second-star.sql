SELECT a * b FROM (SELECT g_id::integer AS a, generate_series(sleep_at, wake_at - 1) AS b FROM day_four_sleeps GROUP BY a, b ORDER BY count(*) DESC LIMIT 1) AS x;
