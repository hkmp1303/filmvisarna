Set FOREIGN_KEY_CHECKS = 0;

INSERT IGNORE INTO user (userid, firstname, lastname, email, password, phone, phone_consent, data_consent, request_delete, request_pass, role) VALUES
(1,'Mary','Poppins','aspoonfull@sugar.com','m3dicin3','+4670433223344','2026-01-12 09:14:00','2026-01-12 09:15:10',NULL,NULL,'member'),
(2,'Natasha','Romanoff','nromanoff@shield.gov','blackwid0w','+467045558899','2026-04-02 11:20:00','2026-04-02 11:20:00','2026-01-08 16:42:00',NULL,'member'),
(3,'Alicia','Vikander','avikander@film.se','exmachina','+46703334455','2026-01-28 14:03:00','2026-01-28 14:03:00',NULL,NULL,'member'),
(4,'Noomi','Rapace','nrapace@millennium.se','lisbeth','46701112233','2026-02-05 11:30:00','2026-02-05 11:30:00',NULL,NULL,'staff'),
(5,'Stellan','Skarsgard','sskarsgard@cinema.se','chern0byl','+46702223344','2026-02-18 08:55:00','2026-02-18 08:55:00',NULL,NULL,'staff'),
(6,'Max','vonSydow','mvonsydow@bergman.se','seventhseal','+46704445566','2026-03-01 10:00:00','2026-03-01 10:00:00',NULL,NULL,'staff');

INSERT IGNORE INTO price (priceid, price, type) VALUES
(1, 80.00, 'child'),
(2, 140.00, 'adult'),
(3, 120.00, 'senior');

INSERT IGNORE INTO film (filmid, title, duration, language, subtitle_language, trailer, description, cover_image, details, genre, viewer_rating, priceid) VALUES
(1,'Northern Strike',124,'Swedish','Swedish','','En elitstyrka kämpar mot klockan för att stoppa en samordnad attack i Skandinavien.','.png','{"actor":"", "director": "", "release_year":"2025","production_company":"", "production_counrty":""}','action','bfj','2'),
(2,'Skuggor i Silver',92,'Swedish','English','shadows_silver_trailer.mp4','Ett hemsökande mysterium tar form i starka kontraster och tysta gator.','shadows_silver_cover.jpg',NULL,'blackandwhite', '11+', '2'),
(3,'Den Sjunde Överfarten',96,'Swedish','English','seventh_crossing_trailer.mp4','En riddare konfronterar tro, död och öde under en förödande pest.','seventh_crossing_cover.jpg',NULL,'classic','bfj','2'),
(4,'Laughing Stock',101,'English','Swedish','laughing_stock_trailer.mp4','En kämpande komiker råkar snubbla in i berömmelse genom en rad katastrofer.','laughing_stock_cover.jpg',NULL,'comedy', '7+', '2'),
(5,'Skogens Vänner',88,'Swedish','English','forest_friends_trailer.mp4','Syskon samarbetar med skogens djur för att rädda sitt hem.','forest_friends_cover.jpg',NULL,'family','btl','2'),
(6,'Jul i Snöstorm',104,'English','Swedish','snowbound_christmas_trailer.mp4','Fastfrusna resenärer finner kärlek och gemenskap på julafton.','snowbound_christmas_cover.jpg',NULL,'holiday','7+','2'),
(7,'De Ihåliga Tallarna',113,'English','English','hollow_pines_trailer.mp4','Något uråldrigt vaknar när en grupp vänner går in i förbjuden skog.','hollow_pines_cover.jpg',NULL,'horror','15+','2'),
(8,'Midnattsbrev',109,'French','English','midnight_letters_trailer.mp4','Två främlingar skapar ett band genom anonyma brev i ett kafé.','midnight_letters_cover.jpg',NULL,'romance','11+','2');
  
INSERT IGNORE INTO salon (salonid, room_number, description, row_capacity, amenities, priceid) VALUES
(1,1,'Småsalong','8,8,8,8,8,8,8,8',null,null),
(2,2,'Störsalong','12,12,12,12,12,12,12,12',null,null);

INSERT IGNORE INTO screening (screeningid, start, filmid, salonid) VALUES
(1,'2026-02-05 12:30:00',1,1),
(2,'2026-02-05 12:30:00',2,2),
(3,'2026-02-05 14:30:00',3,1),
(4,'2026-02-05 14:30:00',4,2),
(5,'2026-02-05 17:30:00',5,1),
(6,'2026-02-05 17:30:00',6,2),
(7,'2026-02-05 20:00:00',7,2),
(8,'2026-02-05 20:00:00',8,1);

INSERT IGNORE INTO booking (bookingid, total_cost, date, guid, screeningid, userid) VALUES
(1,160,'2026-02-01 18:45:00','a1f3c9d2-4b21-4c9a-9d01-001aa1111111',1,1),
(2,120,'2026-02-01 19:00:00','b2e4d8a1-7c34-4f10-8a22-002bb2222222',2,2),
(3,280,'2026-02-02 17:30:00','c3d5e7b4-9a45-4a21-9b33-003cc3333333',3,NULL),
(4,200,'2026-02-02 18:15:00','d4a6f9c8-1b56-4b32-8c44-004dd4444444',4,3),
(5,240,'2026-02-03 19:00:00','e5b7a1d9-2c67-4c43-9d55-005ee5555555',5,NULL),
(6,140,'2026-02-03 16:45:00','f6c8b2e1-3d78-4d54-8e66-006ff6666666',6,4),
(7,160,'2026-02-04 18:30:00','a7d9c3f2-4e89-4e65-9f77-007aa7777777',7,5),
(8,120,'2026-02-04 17:00:00','b8e1d4a3-5f90-4f76-8a88-008bb8888888',8,NULL),
(9,280,'2026-02-05 19:00:00','c9f2e5b4-6091-4a87-9b99-009cc9999999',8,6),
(10,200,'2026-02-05 15:30:00','d0a3f6c5-7192-4b98-8c00-010dd0000000',5,NULL),
(11,240,'2026-02-05 18:00:00','e1b4a7d6-8293-4c09-9d11-011ee1111111',7,NULL),
(12,140,'2026-02-05 16:15:00','f2c5b8e7-9394-4d10-8e22-012ff2222222',8,NULL);

Set FOREIGN_KEY_CHECKS = 1;