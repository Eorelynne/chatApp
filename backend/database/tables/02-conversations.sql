CREATE TABLE conversations (
  id int NOT NULL AUTO_INCREMENT,
  name varchar(100) DEFAULT NULL,
  creatorId int NOT NULL,
  PRIMARY KEY (id),
  KEY creatorId (creatorId),
  CONSTRAINT conversationsCreator FOREIGN KEY (creatorId) REFERENCES users (id)
) 