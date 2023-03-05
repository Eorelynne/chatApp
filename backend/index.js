import { createRequire } from "module";

import { fileURLToPath } from "url";
import { login } from "./login.js";
import { restApi, sqlQuery } from "./restApi.js";

const { url } = import.meta;
const require = createRequire(url);

const __filename = fileURLToPath(url);
const __dirname = fileURLToPath(new URL(".", url));

const express = require("express");
require("dotenv").config();

const app = express();
const port = process.env.PORT || 4000;
const mysql = require("mysql2");

export const dbParams = {
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.MYSQL_DB
};

async function connect() {
  const pool = mysql.createPool({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.MYSQL_DB,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
  });

  const promisePool = pool.promise();

  return promisePool;
}
const db = await connect();

app.use(express.json({ limit: "10KB" }));

app.use((error, req, res, next) => {
  if (error) {
    res.status(400);
    res.json({
      error: "Bad request. Error in JSON"
    });
  } else {
    next();
  }
});

login(db, app);

let connections = [];
app.get("/api/sse/:conversationId", (req, res) => {
  connections.push({ req, res });

  req.on("close", () => {
    connections = connections.filter(x => x.res != res);
    broadcast("disconnect", {
      conversationId: req.params.conversationId,
      message: req.session.user.userName + " disconnected"
    });
  });

  res.set({
    "Content-Type": "text/event-stream",
    Connection: "keep-alive",
    "Cache-Control": "no-cache"
  });

  broadcast("connect", {
    user: {
      userName: req.session.user.userName,
      userId: req.session.user.id,
      userRole: req.session.user.role
    },
    conversationId: req.params.conversationId,
    message: req.session.user.userName + " connected "
  });
});

export async function broadcast(event, data) {
  for (let connection of connections) {
    const sql =
      "SELECT userId FROM usersconversations WHERE conversationId = ?";
    const parameters = [data.conversationId];
    let userList;
    try {
      let r = await db.execute(sql, parameters);
      [userList] = r;
    } catch (error) {
      console.log(error);
    }
    let inList = false;
    for (let i = 0; i < userList.length; i++) {
      if (
        +userList[i].userId === +connection.req.session.user.id ||
        connection.req.session.user.role === "admin"
      ) {
        inList = true;
        break;
      }
    }
    if (!inList) {
      continue;
    }

    if (+connection.req.params.conversationId !== +data.conversationId) {
      continue;
    }

    connection.res.write(
      "event:" + event + "\ndata:" + JSON.stringify(data) + "\n\n"
    );
  }
}

app.post("/api/messages", async (req, res) => {
  if (!req.body.content || !req.body.conversationId) {
    res.status(404).json({ error: "Input missing" });
    return;
  }
  if (!req.session.user) {
    res.status(403).json({ error: "Not logged in" });
    return;
  }
  let sql =
    "SELECT * FROM usersconversations WHERE userId = ? AND conversationID = ?";
  let parameters = [req.session.user.id, req.body.conversationId];
  let result = await sqlQuery("messages", req, res, sql, true, parameters);
  if (result.error && req.session.user.role !== "admin") {
    res.json({ error: "Not in conversation" });
    return;
  }

  let content = req.body.content;
  let time = Date.now();
  let conversationId = req.body.conversationId;
  let senderUserId = req.session.user.id;
  let userName = req.session.user.userName;
  let senderUserRole = req.session.user.role;

  let message = {
    content,
    time,
    conversationId,
    senderUserId,
    userName,
    senderUserRole
  };
  await broadcast("new-message", message);
  sql =
    "INSERT INTO messages (content, time, userId, conversationId) VALUES (?,?,?,?)";
  parameters = [content, time, senderUserId, conversationId];
  result = await sqlQuery("messages", req, res, sql, true, parameters);
  res.json(result);
});

restApi(db, app);

app.use(express.static(__dirname + "/dist"));

app.listen(port, () => {
  console.log("Server listening on port " + port);
});

app.all("*", (req, res) => {
  res.status(404).json({ error: "Endpoint not found" });
  res.set("Content-Type", "text/html");
  res.sendFile(path.join(__dirname, "../src/views", "NotFound.jsx"));
});
