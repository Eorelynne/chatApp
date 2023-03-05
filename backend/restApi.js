import { passwordEncryptor, emailValidator } from "./loginUtils.js";
import { checkPassword } from "../src/utilities/inputCheck.js";
import { acl } from "./acl.js";

let promisePool;

export async function restApi(connection, app) {
  promisePool = connection;

  //USERS
  app.get("/api/users", async (req, res) => {
    const sql =
      "SELECT id, firstName, lastName, userName, email, role FROM users";
    let result = await sqlQuery("users", req, res, sql, false);
    res.json(result);
  });

  app.get("/api/users/:id", async (req, res) => {
    if (!req.params.id) {
      res.status(400).json({ error: "Bad request, id missing" });
      return;
    }
    const sql =
      "SELECT id, firstName, lastName, userName, email, role FROM users WHERE id = ?";
    const parameters = [req.params.id];
    let result = await sqlQuery("users", req, res, sql, true, parameters);
    res.json(result);
  });

  app.post("/api/users", async (req, res) => {
    if (
      !req.body.firstName ||
      !req.body.lastName ||
      !req.body.userName ||
      !req.body.email ||
      !req.body.password
    ) {
      res.status(400).json({ error: "Bad request, input missing" });
      return;
    }
    delete req.body?.role;
    let passwordIsValid = checkPassword(req.body.password);
    if (!passwordIsValid) {
      res.status(400).json({ error: "Wrong password format" });
      return;
    }
    let emailIsValid = emailValidator(req.body.email);
    if (!emailIsValid) {
      res.status(400).json({ error: "Wrong email format" });
      return;
    }

    let password = passwordEncryptor(req.body.password);
    const sql =
      "INSERT INTO users (firstName, lastName, userName, email, password, role) VALUES (?,?,?,?,?,?)";
    const parameters = [
      req.body.firstName,
      req.body.lastName,
      req.body.userName,
      req.body.email,
      password,
      "user"
    ];
    let result = await sqlQuery("users", req, res, sql, true, parameters);
    res.json(result);
  });

  app.put("/api/users/:id", async (req, res) => {
    if (!req.params.id) {
      res.status(400).json({ error: "Bad request, id missing" });
      return;
    }
    const sql = `UPDATE users
          SET ${Object.keys(req.body).map(x => x + " = ?")}
          WHERE id = ?
        `;
    const parameters = Object.values(req.body).map(x => x);
    parameters.push(req.params.id);
    let result = await sqlQuery("users", req, res, sql, true, parameters);
    res.json(result);
  });

  app.delete("/api/users/:id", async (req, res) => {
    if (!req.params.id) {
      res.status(400).json({ error: "Bad request, id missing" });
      return;
    }
    const sql = "DELETE FROM users WHERE id = ?";
    const parameters = [req.params.id];
    let result = await sqlQuery("users", req, res, sql, true, parameters);
    res.json(result);
  });

  app.get("/api/user-get-users", async (req, res) => {
    if (!req.session.user?.role) {
      res.json({ error: "Not allowed" });
      return;
    }
    const sql = "SELECT id,  userName, role FROM users WHERE role=?";
    const parameters = ["user"];
    let result = await sqlQuery(
      "user-get-users",
      req,
      res,
      sql,
      false,
      parameters
    );
    res.json(result);
  });

  //CONVERSATIONS
  app.get("/api/conversations", async (req, res) => {
    const sql =
      "SELECT conversations.id AS conversationId, name, creatorId FROM conversations";
    let result = await sqlQuery("conversations", req, res, sql, false);
    res.json(result);
  });

  app.get("/api/conversations/:id", async (req, res) => {
    if (!req.params.id) {
      res.status(400).json({ error: "Bad request, conversationId missing" });
      return;
    }
    const sql = "SELECT * FROM conversations WHERE id=?";
    const parameters = [req.params.id];
    let result = await sqlQuery(
      "conversations",
      req,
      res,
      sql,
      true,
      parameters
    );
    res.json(result);
  });

  //Start conversation
  app.post("/api/conversations", async (req, res) => {
    if (!req.body.name || req.body.name === "") {
      res.status(400).json({ error: "Bad request, conversation name missing" });
      return;
    }
    if (!req.session.user) {
      res.status(403).json({ error: "Not logged in" });
      return;
    }
    const sql = "INSERT INTO conversations (name, creatorId) VALUES(?,?)";
    const parameters = [req.body.name, req.session.user.id];
    let result = await sqlQuery(
      "conversations",
      req,
      res,
      sql,
      true,
      parameters
    );
    res.json(result);
  });

  //Create a conversation and creator joins at creation
  app.post("/api/conversations-create", async (req, res) => {
    if (!req.body.name || req.body.name === "") {
      res.status(400).json({ error: "Bad request, conversation name missing" });
      return;
    }
    if (!req.session.user) {
      res.status(403).json({ error: "Not logged in" });
      return;
    }
    let sql = "INSERT INTO conversations (name, creatorId) VALUES(?,?)";
    let parameters = [req.body.name, req.session.user.id];
    let result = await sqlQuery(
      "conversations-create",
      req,
      res,
      sql,
      true,
      parameters
    );
    let conversationId = result.insertId;
    let conversationRole = "creator";
    sql =
      "INSERT INTO usersconversations (userId, conversationId, conversationRole, isBanned, banReason) VALUES (?,?,?,?,?)";
    parameters = [
      req.session.user.id,
      conversationId,
      conversationRole,
      false,
      ""
    ];

    result = await sqlQuery(
      "conversations-create",
      req,
      res,
      sql,
      true,
      parameters
    );
    res.json(result);
  });

  app.put("/api/conversations/:id", async (req, res) => {
    if (!req.params.id) {
      res.status(400).json({ error: "Bad request, conversationId missing" });
      return;
    }
    const sql = `UPDATE conversations
          SET ${Object.keys(req.body).map(x => x + " = ?")}
          WHERE id = ?
        `;
    const parameters = Object.values(req.body).map(x => x);
    parameters.push(req.params.id);

    let result = await sqlQuery(
      "conversations",
      req,
      res,
      sql,
      true,
      parameters
    );
    res.json(result);
  });

  app.delete("/api/conversations/:id", async (req, res) => {
    if (!req.params.id) {
      res.status(400).json({ error: "Bad request, conversationId missing" });
      return;
    }
    const sql = "DELETE FROM conversations WHERE id = ?";
    const parameters = [req.params.id];
    let result = await sqlQuery(
      "conversations",
      req,
      res,
      sql,
      true,
      parameters
    );
    res.json(result);
  });

  //INVITATIONS
  app.get("/api/invitations", async (req, res) => {
    const sql = `SELECT * FROM invitations`;
    let result = await sqlQuery("invitations", req, res, sql, false);
    res.json(result);
  });

  app.get("/api/invitations/:id", async (req, res) => {
    if (!req.params.id) {
      res.status(400).json({ error: "Bad request, invitation id missing" });
      return;
    }
    const sql = `SELECT * FROM invitations WHERE id=?`;
    const parameters = [req.params.id];
    let result = await sqlQuery("invitations", req, res, sql, true, parameters);
    res.json(result);
  });

  app.post("/api/invitations", async (req, res) => {
    if (!req.session.user) {
      res.status(403).json({ error: "not allowed" });
      return;
    }
    if (!req.body.conversationId || !req.body.userId) {
      res.status(400).json({ error: "Bad request, input missing" });
      return;
    }
    if (+req.session.user.id !== +req.body.creatorId) {
      res.status(403).json({ error: "not allowed" });
      return;
    }
    let sql =
      "SELECT * FROM invitations WHERE userId = ? AND conversationId =? AND isInvitePending=?";
    let parameters = [req.body.userId, req.body.conversationId, true];
    let result = await sqlQuery("invitations", req, res, sql, true, parameters);
    if (!result.error) {
      res.json({ error: "User has a pending invite to conversation" });
      return;
    }
    sql =
      "SELECT * FROM usersconversations WHERE userId =? AND conversationId =?";
    parameters = [req.body.userId, req.body.conversationId];
    result = await sqlQuery("invitations", req, res, sql, true, parameters);
    if (result.error === "No entries found") {
      sql = `INSERT INTO invitations (conversationId, userId, isInvitePending) VALUES (?,?,?)`;
      parameters = [req.body.conversationId, req.body.userId, true];
      result = await sqlQuery("invitations", req, res, sql, true, parameters);
      res.json(result);
      return;
    } else if (!result.error) {
      res.json({ error: "User is already in conversation" });
      return;
    } else {
      res.status(500).json({ error: "Something went wrong" });
    }
  });

  //Update invitation
  app.put("api/invitations/:id", async (req, res) => {
    if (!req.params.id) {
      res.status(400).json({ error: "Bad request, conversationId missing" });
      return;
    }
    const sql = `UPDATE invitations
          SET ${Object.keys(req.body).map(x => x + " = ?")}
          WHERE id = ?
        `;
    const parameters = Object.values(req.body).map(x => x);
    parameters.push(req.params.id);

    let result = await sqlQuery("invitations", req, res, sql, true, parameters);
    res.json(result);
  });

  app.delete("/api/invitations/:id", async (req, res) => {
    if (!req.params.id) {
      res.status(400).json({ error: "Bad request, conversationId missing" });
      return;
    }
    const sql = `DELETE FROM invitations WHERE id =?`;
    const parameters = [req.params.id];
    let result = await sqlQuery("invitations", req, res, sql, true, parameters);
    res.json(result);
  });

  app.post("/api/conversations-join/:id", async (req, res) => {
    if (!req.session.user) {
      res.status(403).json({ error: "Not logged in" });
      return;
    }
    if (!req.params.id || !req.body.creatorId) {
      res.status(400).json({ error: "Bad request, input missing" });
      return;
    }
    let userId = req.session.user.id;
    let conversationId = req.params.id;

    let conversationCreator = req.body.creatorId;
    let conversationRole = "member";
    if (userId === conversationCreator) {
      conversationRole = "creator";
    }
    const sql =
      "INSERT INTO usersconversations (userId, conversationId, conversationRole, isBanned, banReason) VALUES (?,?,?,?,?)";
    const parameters = [userId, conversationId, conversationRole, false, ""];

    let result = await sqlQuery(
      "conversations-join",
      req,
      res,
      sql,
      true,
      parameters
    );
    res.json(result);
  });

  //Invitations by user
  app.get("/api/invitations-user", async (req, res) => {
    if (!req.session.user?.id) {
      res.status(403).json({ error: "Not logged in" });
      return;
    }
    const sql =
      "SELECT * FROM invitations_conversations_with_creator WHERE userId=? AND isInvitePending = ?";
    const parameters = [req.session.user.id, true];
    let result = await sqlQuery(
      "invitations-user",
      req,
      res,
      sql,
      false,
      parameters
    );
    res.json(result);
  });

  //Update invitation
  app.put("/api/conversations-invite/:id", async (req, res) => {
    if (
      !req.params.id ||
      req.body.isInvitePending === undefined ||
      !req.session.user.id
    ) {
      res.status(400).json({ error: "Bad request, input missing" });
      return;
    }

    const sql =
      " UPDATE invitations SET isInvitePending = ? WHERE id = ? AND userId = ?";
    const parameters = [
      req.body.isInvitePending,
      req.params.id,
      req.session.user.id
    ];
    let result = await sqlQuery(
      "conversations-invite",
      req,
      res,
      sql,
      true,
      parameters
    );
    if (result.affectedRows == 0) {
      res.json({ error: "You have no such invitation." });
      return;
    }
    res.json(result);
  });

  app.get("/api/conversations-by-user/", async (req, res) => {
    if (!req.session.user) {
      res.status(403).json({ error: "Not logged in" });
      return;
    }
    const sql =
      "SELECT * FROM conversation_message_user_time_and_last_message_time WHERE userId = ? AND isBanned =?";
    const parameters = [req.session.user.id, false];
    let result = await sqlQuery(
      "conversations-by-user",
      req,
      res,
      sql,
      false,
      parameters
    );
    res.json(result);
  });

  app.get("/api/conversations-banned/", async (req, res) => {
    if (!req.session.user) {
      res.status(403).json({ error: "Not logged in" });
      return;
    }
    const sql =
      "SELECT conversationId, usersConversationsId, name FROM conversations_with_usersconversations WHERE userId = ? AND isBanned =?";
    const parameters = [req.session.user.id, true];
    let result = await sqlQuery(
      "conversations-banned",
      req,
      res,
      sql,
      false,
      parameters
    );
    res.json(result);
  });

  app.get(`/api/conversation-by-creator/:id`, async (req, res) => {
    if (!req.params.id) {
      res.status(400).json({ error: "Bad request, input missing" });
      return;
    }
    if (+req.params.id !== +req.session.user.id) {
      res.status(403).json({ error: "Not allowed" });
      return;
    }
    const sql = "SELECT * FROM conversations WHERE creatorId =?";
    const parameters = [req.params.id];
    let result = await sqlQuery(
      "conversation-by-creator",
      req,
      res,
      sql,
      false,
      parameters
    );
    res.json(result);
  });

  app.get("/api/users-in-conversation/:id", async (req, res) => {
    if (!req.params.id) {
      res.status(400).json({ error: "Bad request, conversationId missing" });
      return;
    }
    let sql =
      "SELECT * FROM usersconversations WHERE userId = ? AND conversationId = ?";
    let parameters = [req.session.user.id, req.params.id];
    let result = await sqlQuery(
      "users-in-conversation",
      req,
      res,
      sql,
      true,
      parameters
    );
    if (result.error && req.session.user.role !== "admin") {
      res.json({ error: "Not in conversation" });
      return;
    }

    sql =
      "SELECT * FROM conversations_with_usersconversations_with_user WHERE conversationId =? AND isBanned = ?";
    parameters = [req.params.id, false];
    result = await sqlQuery(
      "users-in-conversation",
      req,
      res,
      sql,
      false,
      parameters
    );
    res.json(result);
  });

  //MESSAGES
  app.get("/api/messages", async (req, res) => {
    const sql = "SELECT * FROM messages";
    let result = await sqlQuery("messages", req, res, sql, false);
    res.json(result);
  });

  app.get("/api/messages/:id", async (req, res) => {
    if (!req.params.id) {
      res.status(400).json({ error: "Bad request, message id missing" });
      return;
    }
    const sql = "SELECT * FROM messages WHERE id= ?";
    const parameters = [req.params.id];
    let result = await sqlQuery("messages", req, res, sql, true, parameters);
    res.json(result);
  });

  app.put("/api/messages/:id", async (req, res) => {
    if (!req.params.id) {
      res.status(400).json({ error: "Bad request, conversationId missing" });
      return;
    }
    const sql = `UPDATE messages
          SET ${Object.keys(req.body).map(x => x + " = ?")}
          WHERE id = ? `;
    const parameters = Object.values(req.body).map(x => x);
    parameters.push(req.params.id);

    let result = await sqlQuery("messages", req, res, sql, true, parameters);
    res.json(result);
  });

  app.delete("/api/messages/:id", async (req, res) => {
    if (!req.params.id) {
      res.status(400).json({ error: "Bad request, conversationId missing" });
      return;
    }
    const sql = `DELETE FROM messages WHERE id=?`;
    const parameters = [req.params.id];
    let result = await sqlQuery("messages", req, res, sql, true, parameters);
    res.json(result);
  });

  //Messages by conversation
  app.get("/api/conversation-messages/:id", async (req, res) => {
    if (!req.params.id) {
      res.status(400).json({ error: "Bad request, conversationId missing" });
      return;
    }
    let sql =
      "SELECT * FROM usersconversations WHERE userId = ? AND conversationID = ? AND isBanned=?";
    let parameters = [req.session.user.id, req.params.id, false];
    let result = await sqlQuery(
      "conversation-messages",
      req,
      res,
      sql,
      true,
      parameters
    );
    if (result.error && req.session.user.role !== "admin") {
      res.json({ error: "Not in conversation" });
      return;
    }

    sql = `SELECT * FROM usersconversations_conversations_with_messages_and_users WHERE conversationId = ?`;
    parameters = [req.params.id];
    result = await sqlQuery(
      "conversation-messages",
      req,
      res,
      sql,
      false,
      parameters
    );
    res.json(result);
  });

  app.put("/api/ban-from-chat/:id", async (req, res) => {
    if (!req.session.user) {
      res.status(403).json({ error: "Not logged in" });
      return;
    }

    if (
      !req.params.id ||
      !req.body.banReason ||
      !req.body.creatorId ||
      !req.body.bannedUserRole ||
      !req.body.conversationId ||
      !req.body.userId
    ) {
      res.status(400).json({ error: "Bad request, input missing" });
      return;
    }
    if (
      +req.body.creatorId !== +req.session.user.id &&
      req.session.user.role !== "admin"
    ) {
      res.status(403).json({ error: "Not allowed" });
      return;
    }
    if (req.body.bannedUserRole === "admin") {
      res.status(403).json({ error: "Not allowed to ban admin" });
      return;
    }
    if (+req.body.userId === +req.session.user.id) {
      res.status(403).json({ error: "You can't ban yourself" });
      return;
    }
    let sql = "SELECT * FROM conversations WHERE id = ?";
    let parameters = [req.body.conversationId];
    let result = await sqlQuery(
      "ban-from-chat",
      req,
      res,
      sql,
      true,
      parameters
    );
    if (+result.creatorId !== +req.body.creatorId) {
      res.status(403).json({ error: "Not allowed" });
      return;
    }
    sql =
      "UPDATE usersconversations SET isBanned = ?, banReason =? WHERE id =?";
    parameters = [true, req.body.banReason, req.params.id];
    result = await sqlQuery("ban-from-chat", req, res, sql, true, parameters);
    res.json(result);
  });
}

async function sqlQuery(path, req, res, sql, justOne, parameters) {
  if (!acl(path, req)) {
    res.status(403).json({ error: "Not allowed" });
    return;
  }
  try {
    const r = await promisePool.execute(sql, parameters);
    let [result] = r;

    if (result instanceof Array) {
      if (result.length === 0) {
        return { error: "No entries found" };
      }
      if (justOne) {
        result = result[0];
      }
    }

    if (result && path === "login") {
      delete result.password;
      req.session.user = result;
    }
    return result;
  } catch (error) {
    if (error.code == "ER_DUP_ENTRY" || error.errno == 1062) {
      return { error: "Record already exist in database" };
    }
    return { error: error + " " };
  }
}

export { sqlQuery };
