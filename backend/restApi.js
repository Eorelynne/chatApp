import { passwordEncryptor } from "./passwordUtils.js";
import { checkPassword } from "../src/assets/helpers/inputCheck.js";
import { acl } from "./acl.js";

let promisePool;

export async function restApi(connection, app) {
  promisePool = connection;

  //USERS
  app.get("/api/users", async (req, res) => {
    const sql = "SELECT * FROM users";
    const data = await sqlQuery("users", req, res, sql, false);
  });

  app.get("/api/users/:id", async (req, res) => {
    const sql = "SELECT * FROM users WHERE `id` = ?";
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
      "USER"
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

  //Messages
  app.get("/api/messages", async (req, res) => {
    const sql = "SELECT * FROM messages";
    let result = await sqlQuery("messages", req, res, sql);
  });

  app.get("/api/messages/:id", async (req, res) => {
    const sql = "SELECT * FROM messages WHERE id=?";
    const parameters = [req.params.id];
    let result = await sqlQuery("messages", req, res, sql, parameters);
  });

  app.post("/api/messages", async (req, res) => {
    const [content, users_conversations_id] = req.body;
    const time = Date.now();
    const sql =
      "INSERT INTO messages (content, time, users_conversations_id) VALUES (?,?,?)";
    const parameters = [content, time, users_conversations_id];
    let result = await sqlQuery("messages", req, res, sql, parameters);
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
        res.status(404).json({ error: "Not found" });
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
