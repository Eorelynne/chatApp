CREATE TABLE usersConversations (
  id int(10) NOT NULL AUTO_INCREMENT,
  userId int(10) DEFAULT NULL,
  conversationId int(10) DEFAULT NULL,
  PRIMARY KEY (id),
  KEY conversationId (conversationId),
  KEY userId (userId),
  CONSTRAINT conversationId FOREIGN KEY (conversationId) REFERENCES conversations (id),
  CONSTRAINT userId FOREIGN KEY (userId) REFERENCES users (id)
)