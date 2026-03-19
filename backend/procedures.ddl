DELIMITER //
CREATE PROCEDURE IF NOT EXISTS `calc_row_number`(salon_id INT UNSIGNED, seat_number SMALLINT UNSIGNED)
BEGIN
  DECLARE currentRow TINYINT UNSIGNED DEFAULT 1;
  DECLARE currentRowCapacity TINYINT UNSIGNED;
  DECLARE currentSeat SMALLINT UNSIGNED DEFAULT 1;
  DECLARE rowCapacity VARCHAR(255);
  SELECT row_capacity INTO rowCapacity FROM salon WHERE salonid = salon_id;
  i: LOOP
    SET currentRowCapacity = SUBSTRING_INDEX(SUBSTRING_INDEX(rowCapacity, ',', currentRow), ',', -1);
    SET currentSeat = currentSeat + currentRowCapacity;
    IF currentSeat >= seat_number THEN
      LEAVE i;
    END IF;
    SET currentRow = currentRow + 1;
  END LOOP i;
  UPDATE reservation SET `row_number` = currentRow WHERE reservationid=reservation_id;
  SELECT currentRow;
END//
DELIMITER ;