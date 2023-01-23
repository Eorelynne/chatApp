import { passwordEncryptor } from "./passwordUtils.js";
import { checkPassword } from "../src/assets/helpers/inputCheck.js";
import { acl } from "./acl.js";
import { broadcast } from "./index.js";

let promisePool;

export async function restApi(connection, app) {
  promisePool = connection;

  //USERS
  app.get("/api/users", async (req, res) => {
    const sql = "SELECT * FROM users";
    await sqlQuery("users", req, res, sql, false);
  });

  app.get("/api/users/:id", async (req, res) => {
    const sql = "SELECT * FROM users WHERE id = ?";
    const parameters = [req.params.id];
    await sqlQuery("users", req, res, sql, true, parameters);
  });

  app.post("/api/users", async (req, res) => {
    let passwordIsValid = checkPassword(req.body.password);
    if (!passwordIsValid) {
      res.json({ error: "Wrong passwordformat" });
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
    const result = await sqlQuery("users", req, res, sql, true, parameters);
  });

  app.delete("/api/users/:id", async (req, res) => {
    const sql = "DELETE FROM users WHERE id = ?";
    const parameters = [req.params.id];
    let result = await sqlQuery("users", req, res, sql, true, parameters);
  });

  app.get("/api/users-by-username/:username", async (req, res) => {
    const sql = "SELECT * FROM users WHERE username = ?";
    const parameters = [req.params.username];
    let user = await sqlQuery(
      "users-by-username",
      req,
      res,
      sql,
      true,
      parameters
    );
  });

  //Conversations
  //Start conversation
  app.post("/api/conversations-create/", async (req, res) => {
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
    /* console.log(result);
    let conversationId = result.insertId;
    console.log(req.session.user.id, conversationId);
    sql =
      "INSERT INTO users_conversations (userId, conversationId, conversationRole, isBanned, banReason) VALUES (?,?,?,?,?)";
    parameters = [req.session.user.id, conversationId, "creator", false, ""];
    result = await sqlQuery(
      "conversations-create",
      req,
      res,
      sql,
      true,
      parameters
    );
    console.log("RESULT!!!");
    console.log(result);*/
  });

  //Get all pending invites
  app.get("/api/invitations", async (req, res) => {
    const sql =
      "SELECT * FROM invitations WHERE userId = ? AND isInvitePending = ?";
    const parameters = [req.session.user.id, true];
    await sqlQuery("invitations", req, res, sql, false, parameters);
  });

  //Join conversation (in req.body creatorId)
  app.post("/api/conversations-join/:id", async (req, res) => {
    let userId = req.session.user.id;
    let conversationId = req.params.id;
    if (!req.body.creatorId) {
      res.status(400).json({ error: "Bad request" });
      return;
    }
    let conversationCreator = req.body.creatorId;
    let conversationRole = "member";
    if (userId === conversationCreator) {
      conversationRole = "creator";
    }
    const sql =
      "INSERT INTO users_conversations (userId, conversationId, conversationRole, isBanned, banReason) VALUES (?,?,?,?,?)";
    const parameters = [userId, conversationId, conversationRole, false, ""];
    await sqlQuery("join-conversation", req, res, sql, true, parameters);
  });

  //Get all conversations
  app.get("/api/conversations", async (req, res) => {
    const sql = "SELECT * FROM conversations";
    await sqlQuery("conversations", req, res, sql, false);
  });
  //Invite to conversation (userId, conversationId and creatorId in body)
  app.post("/api/conversations-invite", async (req, res) => {
    if (!req.session.user) {
      res.status(403).json({ error: "not allowed" });
    }
    console.log(req.session.user);
    if (req.session.user.id !== req.body.creatorId) {
      res.status(403).json({ error: "not allowed" });
      return;
    }
    const sql =
      "INSERT INTO invitations (conversationId, userId, isInvitePending) VALUES(?,?,?)";
    const parameters = [req.body.conversationId, req.body.userId, true];
    await sqlQuery("conversations-invite", req, res, sql, true, parameters);
  });

  //Invitation by user
  app.get("/api/invitations-user", async (req, res) => {
    const sql =
      "SELECT * FROM invitations_conversations_with_creator WHERE userId=? AND isInvitePending = ?";
    const parameters = [req.session.user.id, true];
    await sqlQuery("test", req, res, sql, false, parameters);
  });
  //Update invitation
  app.put("/api/conversations-invite/:id", async (req, res) => {
    const sql = " UPDATE invitations SET isInvitePending = ? WHERE id = ?";
    const parameters = [false, req.params.id];
    await sqlQuery("conversations-invite", req, res, sql, false, parameters);
  });
  //Get conversations by user
  app.get("/api/conversations-by-user/:id", async (req, res) => {
    const sql =
      "SELECT * FROM conversations_with_users_conversations WHERE userId = ?";
    const parameters = [req.params.id];
    await sqlQuery("conversations-by-user", req, res, sql, false, parameters);
  });

  //Get conversation by creator
  app.get(`/api/conversation-by-creator/:id`, async (req, res) => {
    const sql = "SELECT * FROM conversations WHERE creatorId =?";
    const parameters = [req.params.id];
    await sqlQuery("conversation-by-creator", req, res, sql, false, parameters);
  });

  //Get one conversation by id
  app.get("/api/conversations/:id", async (req, res) => {
    const sql = "SELECT * FROM conversations WHERE id = ?";
    const parameters = [req.params.id];
    let result = await sqlQuery(
      "conversations",
      req,
      res,
      sql,
      true,
      parameters
    );
  });

  //Delete conversation by id
  app.delete("/api/conversations/:id", async (req, res) => {
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
  });

  //Messages
  app.get("/api/messages", async (req, res) => {
    const sql = "SELECT * FROM messages";
    let result = await sqlQuery("messages", req, res, sql, false);
  });

  app.get("/api/messages/:id", async (req, res) => {
    if (req.params.id === undefined || !req.params.id) {
      res.status(400).json({ error: "Bad request, messageId is missing" });
    }
    const sql = "SELECT * FROM messages WHERE id= ?";
    const parameters = [req.params.id];
    let result = await sqlQuery("messages", req, res, sql, true, parameters);
  });

  //
  app.get("/api/conversation-messages/:id", async (res, req) => {
    let conversationId = +req.params.id;
    if (req.params.id === undefined || !req.params.id) {
      res.status(400).json({ error: "Bad request, conversationId missing" });
    }
    const sql =
      "SELECT * FROM users_conversations_messages WHERE conversationId = ?";
    const parameters = [req.params.id];
    await sqlQuery("conversation-messages", req, res, sql, false, parameters);
  });

  app.post("/api/messages", async (req, res) => {
    let message = {
      content: req.body.content,
      time: Date.now(),
      usersConversationsId: req.body.usersConversationsId,
      conversationId: req.body.conversationId
    };
    broadcast("new-message", message);
    const sql =
      "INSERT INTO messages (content, time, usersConversationsId) VALUES (?,?,?)";
    const parameters = [
      req.body.content,
      message.time,
      req.body.usersConversationsId
    ];
    let result = await sqlQuery("messages", req, res, sql, true, parameters);
  });
}

async function sqlQuery(path, req, res, sql, justOne, parameters) {
  if (!acl(path, req)) {
    res.status(405).json({ error: "Not allowed" });
    return;
  }
  try {
    const r = await promisePool.execute(sql, parameters);
    let [result] = r;

    if (result instanceof Array) {
      if (result.length === 0) {
        console.log("In if instanceof");
        res.json({ message: "No entries found" });
        return;
      }
      if (justOne) {
        result = result[0];
      }
    }

    if (result && path === "login") {
      delete result.password;
      req.session.user = result;
    }
    res.json(result);
    return result;
  } catch (error) {
    console.log("Error in tryCatch");
    res.status(500);
    res.json({ error: error + "" });
    return { error: error + "" };
  }
}

export { sqlQuery };
