-- WIP:

CREATE OR REPLACE FUNCTION d9_high_score(num_players int, last_marble int) RETURNS int LANGUAGE plpgsql AS
$$
DECLARE
  current_marble INT := 1;
  current_player INT := 1;
  
BEGIN
  CREATE TEMP TABLE players (pos INT NOT NULL, score INT default 0);
  INSERT INTO players (SELECT generate_series(1, num_players));
  
  CREATE TEMP TABLE board (pos INT NOT NULL, marble INT NOT NULL);
  INSERT INTO board VALUES (0, 0);
  
  LOOP
    EXIT WHEN current_marble > last_marble;
  
    INSERT INTO board VALUES (current_marble * 1000, 
  
    current_marble := current_marble + 1;
  END LOOP; 
  
  DROP TABLE players;
  DROP TABLE board;
  
  RETURN (SELECT 1);
END;
$$;

SELECT d9_high_score(10, 1618);

SELECT generate_series(1, 4);
