SET FOREIGN_KEY_CHECKS = 0;

CREATE TABLE IF NOT EXISTS `user` (
  `userid` int unsigned NOT NULL AUTO_INCREMENT,
  `firstname` varchar(100) NOT NULL,
  `lastname` varchar(100) NOT NULL,
  `email` varchar(100) NOT NULL,
  `password` varchar(100) NOT NULL,
  `phone` varchar(20) NOT NULL,
  `phone_consent` datetime DEFAULT NULL,
  `data_consent` datetime DEFAULT NULL,
  `request_delete` datetime DEFAULT NULL,
  `request_pass` varchar(36) DEFAULT NULL,
  `role` enum('visitor','staff','member') NOT NULL,
  PRIMARY KEY (`userid`)
);
CREATE TABLE IF NOT EXISTS `session` (
  id VARCHAR(255) PRIMARY KEY NOT NULL,
  userid int unsigned NOT NULL,
  created DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL,
  modified DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL,
  data JSON,
  CONSTRAINT `session_user` FOREIGN KEY (`userid`) REFERENCES `user` (`userid`)
);

CREATE TABLE IF NOT EXISTS `price` (
  `priceid` int unsigned NOT NULL AUTO_INCREMENT,
  `price` decimal(10,2) NOT NULL,
  `type` enum('child','adult','senior','salon_small','salon_large') NOT NULL,
  PRIMARY KEY (`priceid`)
);

CREATE TABLE IF NOT EXISTS `film` (
  `filmid` int unsigned NOT NULL AUTO_INCREMENT,
  `title` varchar(100) NOT NULL,
  `duration` int NOT NULL,
  `language` varchar(100) NOT NULL,
  `subtitle_language` varchar(100) NOT NULL,
  `trailer` varchar(255) DEFAULT NULL,
  `description` text NOT NULL,
  `cover_image` varchar(255) NOT NULL,
  `details` json DEFAULT NULL,
  `genre` enum('action','blackandwhite','classic','comedy','family','holiday','horror','romance') NOT NULL,
  `viewer_rating` enum('btl','7+','11+','15+','bfj') NOT NULL,
  `priceid` int unsigned DEFAULT NULL,
  PRIMARY KEY (`filmid`),
  KEY `film_price_idx` (`priceid`),
  KEY `title` (`title`),
  KEY `viewer` (`viewer_rating`),
  KEY `language` (`language`),
  KEY `subtitle_language` (`subtitle_language`),
  KEY `genre` (`genre`),
  CONSTRAINT `film_price` FOREIGN KEY (`priceid`) REFERENCES `price` (`priceid`)
);

CREATE TABLE IF NOT EXISTS `salon` (
  `salonid` int unsigned NOT NULL AUTO_INCREMENT,
  `room_number` varchar(45) NOT NULL,
  `description` text NOT NULL,
  `row_capacity` varchar(255) NOT NULL,
  `amenities` varchar(225) DEFAULT NULL,
  `priceid` int unsigned DEFAULT NULL,
  PRIMARY KEY (`salonid`),
  KEY `salon_price_idx` (`priceid`),
  CONSTRAINT `salon_price` FOREIGN KEY (`priceid`) REFERENCES `price` (`priceid`)
);

CREATE TABLE IF NOT EXISTS `screening` (
  `screeningid` int unsigned NOT NULL AUTO_INCREMENT,
  `start` datetime NOT NULL,
  `filmid` int unsigned NOT NULL,
  `salonid` int unsigned NOT NULL,
  PRIMARY KEY (`screeningid`),
  KEY `screen_filmn_idx` (`filmid`),
  KEY `screen_salon_idx` (`salonid`),
  CONSTRAINT `screen_film` FOREIGN KEY (`filmid`) REFERENCES `film` (`filmid`),
  CONSTRAINT `screen_salon` FOREIGN KEY (`salonid`) REFERENCES `salon` (`salonid`)
);

CREATE TABLE IF NOT EXISTS `booking` (
  `bookingid` int unsigned NOT NULL AUTO_INCREMENT,
  `total_cost` decimal(10,2) NOT NULL,
  `date` timestamp NOT NULL,
  `guid` varchar(36) NOT NULL,
  `status` enum('reserved','booked','canceled') NOT NULL,
  `screeningid` int unsigned NOT NULL,
  `userid` int unsigned DEFAULT NULL,
  PRIMARY KEY (`bookingid`),
  KEY `book_screen_idx` (`screeningid`),
  KEY `book_user_idx` (`userid`),
  CONSTRAINT `book_screen` FOREIGN KEY (`screeningid`) REFERENCES `screening` (`screeningid`),
  CONSTRAINT `book_user` FOREIGN KEY (`userid`) REFERENCES `user` (`userid`)
);

CREATE TABLE IF NOT EXISTS `reservation` (
  `reservationid` int unsigned NOT NULL AUTO_INCREMENT,
  `seat_number` smallint unsigned NOT NULL,
  `row_number` tinyint unsigned NOT NULL,
  `bookingid` int unsigned NOT NULL,
  PRIMARY KEY (`reservationid`),
  KEY `reservation_booking_idx` (`bookingid`),
  CONSTRAINT `reservation_booking` FOREIGN KEY (`bookingid`) REFERENCES `booking` (`bookingid`)
);

SET FOREIGN_KEY_CHECKS = 1;