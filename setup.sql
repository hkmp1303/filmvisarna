CREATE SCHEMA IF NOT EXISTS filmvisarna CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
CREATE USER IF NOT EXISTS 'filmvisarna'@'localhost' IDENTIFIED BY "filmvisarna";
GRANT ALL PRIVILEGES ON `filmvisarna`.* TO 'filmvisarna'@'localhost'; 
USE filmvisarna;