import { passwordEncryptor, emailValidator } from "./loginUtils.js";
import { checkPassword } from "../src/utilities/inputCheck.js";
import { acl } from "./acl.js";
import { broadcast } from "./index.js";

let promisePool;

export async function restApi(connection, app) {
  promisePool = connection;

  //USERS
  app.get("/api/users", async (req, res) => {
    const sql =
      "SELECT id, firstName, lastName, userName, email, role FROM users";
    await sqlQuery("users", req, res, sql, false);
  });

  app.get("/api/users/:id", async (req, res) => {
    if (!req.params.id) {
      res.status(400).json({ error: "Bad request, id missing" });
      return;
    }
    const sql =
      "SELECT id, firstName, lastName, userName, email, role FROM users WHERE id = ?";
    const parameters = [req.params.id];
    await sqlQuery("users", req, res, sql, true, parameters);
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
    const result = await sqlQuery("users", req, res, sql, true, parameters);
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
    console.log(sql);
    console.log(parameters);
    await sqlQuery("conversations", req, res, sql, true, parameters);
  });

  app.delete("/api/users/:id", async (req, res) => {
    if (!req.params.id) {
      res.status(400).json({ error: "Bad request, id missing" });
      return;
    }
    const sql = "DELETE FROM users WHERE id = ?";
    const parameters = [req.params.id];
    let result = await sqlQuery("users", req, res, sql, true, parameters);
  });

  app.get("/api/users-by-username/:username", async (req, res) => {
    if (!req.params.username) {
      res.status(400).json({ error: "Bad request, userName missing" });
      return;
    }
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

  app.get("/api/user-get-users", async (req, res) => {
    const sql = "SELECT id,  userName, role FROM users";
    await sqlQuery("user-get-users", req, res, sql, false);
  });

  //Conversations
  //Get all conversations
  app.get("/api/conversations", async (req, res) => {
    const sql = "SELECT * FROM conversations";
    await sqlQuery("conversations", req, res, sql, false);
  });

  //Get one conversation by id
  app.get("/api/conversations/:id", async (req, res) => {
    if (!req.params.id) {
      res.status(400).json({ error: "Bad request, conversationId missing" });
      return;
    }
    const sql = "SELECT * FROM conversations WHERE id=?";
    const parameters = [req.params.id];
    await sqlQuery("conversations", req, res, sql, true, parameters);
  });

  //Start conversation
  app.post("/api/conversations", async (req, res) => {
    if (!req.body.name) {
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
  });

  //update a conversation
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
    console.log(sql);
    consnole.log(parameters);
    await sqlQuery("conversations", req, res, sql, true, parameters);
  });

  //Delete conversation by id
  app.delete("/api/conversations/:id", async (req, res) => {
    if (!req.params.id) {
      res.status(400).json({ error: "Bad request, conversationId missing" });
      return;
    }
    const sql = "DELETE FROM conversations WHERE id = ?";
    const parameters = [req.params.id];
    await sqlQuery("conversations", req, res, sql, true, parameters);
  });

  //Invitations
  //Get all invitations
  app.get("/api/invitations", async (req, res) => {
    const sql = `SELECT * FROM invitations`;
    await sqlQuery("invitations", req, res, sql, false);
  });

  //Get one invitation by id
  app.get("/api/invitations/:id", async (req, res) => {
    if (!req.params.id) {
      res.status(400).json({ error: "Bad request, invitation id missing" });
      return;
    }
    const sql = `SELECT * FROM invitations WHERE id=?`;
    const parameters = [req.params.id];
    await sqlQuery("invitations", req, res, sql, true, parameters);
  });

  //Post invite
  app.post("/api/invitations", async (req, res) => {
    if (!req.body.conversationId || !req.body.userId) {
      res.status(400).json({ error: "Bad request, input missing" });
      return;
    }
    const sql = `INSERT INTO invitations (conversationId, userId, isInvitePending) VALUES (?,?,?)`;
    const parameters = [req.body.conversationId, req.body.userId, true];
    await sqlQuery("invitations", req, res, sql, true, parameters);
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
    console.log(sql);
    consnole.log(parameters);
    await sqlQuery("invitations", req, res, sql, true, parameters);
  });

  //Delete invitation
  app.delete("/api/invitations/:id", async (req, res) => {
    if (!req.params.id) {
      res.status(400).json({ error: "Bad request, conversationId missing" });
      return;
    }
    const sql = `DELETE FROM invitations WHERE id =?`;
    const parameters = [req.params.id];
    await sqlQuery("invitations", req, res, sql, true, parameters);
  });

  //Get all pending invites
  app.get("/api/invitations-pending", async (req, res) => {
    if (!req.session.user) {
      res.status(403).json({ error: "Not logged in" });
      return;
    }
    const sql =
      "SELECT * FROM invitations WHERE userId = ? AND isInvitePending = ?";
    const parameters = [req.session.user.id, true];
    await sqlQuery("invitations", req, res, sql, false, parameters);
  });

  //Join conversation (in req.body creatorId)
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
      "INSERT INTO users_conversations (userId, conversationId, conversationRole, isBanned, banReason) VALUES (?,?,?,?,?)";
    const parameters = [userId, conversationId, conversationRole, false, ""];
    console.log(sql);
    console.log(parameters);
    await sqlQuery("conversations-join", req, res, sql, true, parameters);
  });

  //Invite to conversation (userId, conversationId and creatorId in body)
  app.post("/api/conversations-invite", async (req, res) => {
    if (!req.session.user) {
      res.status(403).json({ error: "not allowed" });
      return;
    }
    if (+req.session.user.id !== +req.body.creatorId) {
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
    if (!req.session.user) {
      res.status(403).json({ error: "Not logged in" });
      return;
    }
    const sql =
      "SELECT * FROM invitations_conversations_with_creator WHERE userId=? AND isInvitePending = ?";
    const parameters = [req.session.user.id, true];
    await sqlQuery("invitations-user", req, res, sql, false, parameters);
  });
  //Update invitation to pending false
  app.put("/api/conversations-invite/:id", async (req, res) => {
    console.log(req.params.id);
    console.log(req.body.isInvitePending);

    if (!req.params.id || req.body.isInvitePending === undefined) {
      res.status(400).json({ error: "Bad request, input missing" });
      return;
    }
    const sql = " UPDATE invitations SET isInvitePending = ? WHERE id = ?";
    const parameters = [req.body.isInvitePending, req.params.id];
    await sqlQuery("conversations-invite", req, res, sql, true, parameters);
  });
  //Get conversations by user
  app.get("/api/conversations-by-user/", async (req, res) => {
    if (!req.session.user) {
      res.status(403).json({ error: "Not logged in" });
      return;
    }
    const sql =
      "SELECT * FROM latest_message_time_and_users_latest_message_time WHERE userId = ?";
    const parameters = [req.session.user.id];
    await sqlQuery("conversations-by-user", req, res, sql, false, parameters);
  });

  app.get("/api/conversations-admin/", async (req, res) => {
    const sql =
      "SELECT usersConversationsId, conversationId, name, creatorId, latestMessageTime FROM latest_message_time_and_users_latest_message_time GROUP BY conversationId";
    await sqlQuery("conversations-admin", req, res, sql, false);
  });

  //Get conversation by creator
  app.get(`/api/conversation-by-creator/:id`, async (req, res) => {
    if (!req.params.id) {
      res.status(400).json({ error: "Bad request, input missing" });
      return;
    }
    const sql = "SELECT * FROM conversations WHERE creatorId =?";
    const parameters = [req.params.id];
    await sqlQuery("conversation-by-creator", req, res, sql, false, parameters);
  });

  //Get users in one conversation
  app.get("/api/users-in-conversation/:id", async (req, res) => {
    if (!req.params.id) {
      res.status(400).json({ error: "Bad request, conversationId missing" });
      return;
    }
    const sql =
      "SELECT * FROM users_conversations_with_user_and_conversation WHERE conversationId =?";
    const parameters = [req.params.id];
    await sqlQuery("users-in-conversation", req, res, sql, false, parameters);
  });

  //Conversations with messages
  app.get(`/api/conversation-with-messages/:id`, async (req, res) => {
    if (!req.params.id) {
      res.status(400).json({ error: "Bad request, conversationId missing" });
      return;
    }
    const sql =
      "SELECT * FROM userConversation_with_messages WHERE conversationId =?";
    const parameters = [req.params.id];
    await sqlQuery(
      "conversation-with-messages",
      req,
      res,
      sql,
      false,
      parameters
    );
  });

  //Messages
  app.get("/api/messages", async (req, res) => {
    const sql = "SELECT * FROM messages";
    await sqlQuery("messages", req, res, sql, false);
  });

  app.get("/api/messages/:id", async (req, res) => {
    if (!req.params.id) {
      res.status(400).json({ error: "Bad request, message id missing" });
      return;
    }
    const sql = "SELECT * FROM messages WHERE id= ?";
    const parameters = [req.params.id];
    await sqlQuery("messages", req, res, sql, true, parameters);
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
    console.log(sql);
    consnole.log(parameters);
    await sqlQuery("messages", req, res, sql, true, parameters);
  });

  app.delete("/api/messages/:id", async (req, res) => {
    if (!req.params.id) {
      res.status(400).json({ error: "Bad request, conversationId missing" });
      return;
    }
    const sql = `DELETE FROM messages WHERE id=?`;
    const parameters = [req.params.id];
    await sqlQuery("messages", req, res, sql, true, parameters);
  });

  //
  app.get("/api/conversation-messages/:id", async (req, res) => {
    if (!req.params.id) {
      res.status(400).json({ error: "Bad request, conversationId missing" });
      return;
    }
    const sql = `SELECT * FROM users_conversations_messages_with_user_info WHERE conversationId = ?`;
    const parameters = [req.params.id];
    await sqlQuery("conversation-messages", req, res, sql, false, parameters);
  });

  //Ban from chat
  app.put("/api/ban-from-chat/:id", async (req, res) => {
    if (!req.session.user) {
      res.status(403).json({ error: "Not logged in" });
      return;
    }
    console.log(req.session.user.role);
    console.log(req.body.creatorId);
    console.log(req.session.user.id);
    if (
      !req.params.id ||
      !req.body.banReason ||
      !req.body.creatorId ||
      !req.body.bannedUserRole
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
    const sql =
      "UPDATE users_conversations SET isBanned = ?, banReason =? WHERE id =?";
    const parameters = [true, req.body.banReason, req.params.id];
    await sqlQuery("ban-from-chat", req, res, sql, true, parameters);
  });

  //Edit userinfo
  app.put("/api/edit-my-user-info/:id", async (req, res) => {
    if (!req.session.user) {
      res.status(403).json({ error: "Not logged in" });
      return;
    }
    if (!req.params.id) {
      res.status(400).json({ error: "Bad request, conversationId missing" });
      return;
    }
    delete req.body.role;
    if (+req.params.id === +req.session.user?.id) {
      const sql = `UPDATE users
          SET ${Object.keys(req.body).map(x => x + " = ?")}
          WHERE id = ?
        `;
      const parameters = Object.values(req.body).map(x => x);
      parameters.push(req.params.id);
      let result = await sqlQuery(
        "edit-my-user-info",
        req,
        res,
        sql,
        true,
        parameters
      );
    } else {
      res.status(403).json({ error: "Not allowed" });
      return;
    }
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
        res.json({ error: "No entries found" });
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
    res.status(500);
    res.json({ error: error + "" });
    return { error: error + "" };
  }
}

export { sqlQuery };
