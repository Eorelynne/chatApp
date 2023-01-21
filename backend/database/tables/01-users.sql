CREATE TABLE users (
  id int(10) NOT NULL AUTO_INCREMENT,
  firstName varchar(100) DEFAULT NULL,
  lastName varchar(100) DEFAULT NULL,
  userName varchar(100) NOT NULL,
  email varchar(100) NOT NULL,
  password varchar(100) NOT NULL,
  role varchar(100) NOT NULL,
  PRIMARY KEY (id),
  UNIQUE KEY email (email),
  UNIQUE KEY email (email)
) 
