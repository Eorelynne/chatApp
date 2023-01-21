CREATE TABLE messages (
  id int(10) NOT NULL AUTO_INCREMENT,
  content varchar(100) DEFAULT NULL,
  time datetime DEFAULT NULL,
  usersConversationsId int(10) DEFAULT NULL,
  PRIMARY KEY (id),
  KEY conversation (usersConversationsId),
  CONSTRAINT conversation FOREIGN KEY (usersConversationsId) REFERENCES usersConversations (id)
)