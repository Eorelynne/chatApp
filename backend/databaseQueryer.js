import { createRequire } from "module";
// Only necessary if you need  __filename or __dirname
import { fileURLToPath } from "url";
//import { login } from "./login.js";
//import { restApi } from "./restApi.js";

export async function dbQuery(app) {
  // Note: import.meta.url is different for every file
  const { url } = import.meta;
  // Make the require function available
  const require = createRequire(url);
  // Set __filename and __dirname constants
  const __filename = fileURLToPath(url);
  const __dirname = fileURLToPath(new URL(".", url));

  const mysql = require("mysql2");

  const dbParams = {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.MYSQL_DB
  };

  const connection = mysql.createConnection(dbParams);

  async function sqlQuery(req, res, sql, parameters) {
    let resultId;
    connection.connect(function (err) {
      if (err) {
        console.log("Not connected" + err.stack); // not connected!
        return;
      }
      console.log("connected as id " + connection.threadId);
    });

    connection.execute(sql, parameters, function (error, results, fields) {
      if (error) {
        console.log("Error: " + error + "");
      }
      res.json(results);
      resultId = results.insertId;
    });
    return resultId;
  }

  app.get("/api/", (req, res) => {
    res.send("Hello from backend");
  });

  app.get("/api/users", async (req, res) => {
    console.log("Running Users");
    let sql = "SELECT * FROM users";
    const data = await sqlQuery(req, res, sql);
  });

  app.get("/api/users/:id", async (req, res) => {
    const sql = "SELECT * FROM users WHERE `id` = ?";
    const parameters = [req.params.id];
    await sqlQuery(req, res, sql, parameters);
  });

  app.post("/api/users", (req, res) => {
    const sql =
      "INSERT INTO users (first_name, last_name, user_name, email, password, role) VALUES (?,?,?,?,?,?)";
    const parameters = [
      req.body.first_name,
      req.body.last_name,
      req.body.user_name,
      req.body.email,
      req.body.password,
      "USER"
    ];
    const data = sqlQuery(req, res, sql, parameters);
  });

  //Skapa en konversation
  app.post("/api/conversations", async (req, res) => {
    const sql = "INSERT INTO conversations (name, creator) VALUES (?,?)";
    const parameters = [req.body.name, req.body.user];
    //ändra till req.session.user.id
    const resultId = await sqlQuery(req, res, sql, parameters);
    console.log(resultId);
  });

  app.get("/api/messages", (req, res) => {
    const sql = "SELECT * FROM messages";
    sqlQuery(req, res, sql);
  });

  app.get("/api/messages/conversations/:id", (req, res) => {
    const sql =
      "SELECT * FROM messages WHERE users_conversations_id IN (SELECT id FROM users_conversations_id WHERE conversation_id = ?";
    const parameters = [req.params.id];
    sqlQuery(req, res, sql, parameters);
  });

  app.post("/api/messages/ ", (req, res) => {
    const sql =
      "INSERT INTO messages (content, time, users_conversations_id) VALUES(?,?,?)";
    const parameters = [req.body.content, Date.now()];
  });
}
