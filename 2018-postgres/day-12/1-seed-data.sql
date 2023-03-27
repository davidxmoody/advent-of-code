CREATE TABLE d12_rules_raw (input text not null);

INSERT INTO d12_rules_raw VALUES
('...## => #'),
('#.#.# => #'),
('.###. => #'),
('#.#.. => .'),
('.#..# => #'),
('#..#. => #'),
('..##. => .'),
('....# => .'),
('#.... => .'),
('###.. => #'),
('.#### => #'),
('###.# => .'),
('#..## => #'),
('..... => .'),
('##.## => #'),
('####. => .'),
('##.#. => .'),
('#...# => .'),
('##### => .'),
('..#.. => .'),
('.#.#. => .'),
('#.### => .'),
('.##.# => .'),
('..#.# => .'),
('.#.## => #'),
('...#. => .'),
('##... => #'),
('##..# => #'),
('.##.. => .'),
('.#... => #'),
('#.##. => #'),
('..### => .');

CREATE MATERIALIZED VIEW d12_rules AS SELECT
  substring(input FROM 1 FOR 5) AS before,
  substring(input FROM 10 FOR 1) AS after
FROM d12_rules_raw;

CREATE TABLE d12_states (generation int, state text[]);

INSERT INTO d12_states VALUES
(0, regexp_split_to_array('##.#.#.##..#....######..#..#...#.#..#.#.#..###.#.#.#..#..###.##.#..#.##.##.#.####..##...##..#..##.#.', ''));
