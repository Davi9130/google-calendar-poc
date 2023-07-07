# google-calendar-poc

1 - Setup a docker with mysql:latest<br/>
2 - Create the db and the tables<br/>
3 - Register and active the accound by changing the email_verified or add the mailtrap credentials<br/>
4 - Login and create a calendar and events, binding with the user<br/>



```sh
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
```
