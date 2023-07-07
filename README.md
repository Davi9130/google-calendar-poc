# google-calendar-poc

1 - setup a docker with mysql:latest
2 - create the db and the tables
3 - register and active the accound by changing the email_verified or add the mailtrap credentials
4 - login and create a calendar and events, binding with the user


sql query:

CREATE DATABASE IF NOT EXISTS `on_timer`;

USE `on_timer`;

CREATE TABLE users (
     id INT PRIMARY KEY AUTO_INCREMENT,
     name VARCHAR(255) NOT NULL,
     email VARCHAR(255) NOT NULL,
     password VARCHAR(255) NOT NULL,
     email_verified BOOLEAN NOT NULL DEFAULT FALSE,
     two_factor_auth BOOLEAN NOT NULL DEFAULT FALSE,
     created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
     calendar_uuid VARCHAR(255) NULL
);
