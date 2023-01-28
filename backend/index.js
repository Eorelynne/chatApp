import { createRequire } from "module";
// Only necessary if you need  __filename or __dirname
import { fileURLToPath } from "url";
import { login } from "./login.js";
import { restApi, sqlQuery } from "./restApi.js";

// Note: import.meta.url is different for every file
const { url } = import.meta;
// Make the require function available
const require = createRequire(url);
// Set __filename and __dirname constants
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

//Middleware for json-errorhandling.
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
/* :conversationId */
let connections = [];
app.get("/api/sse/:conversationId", (req, res) => {
  connections.push({ req, res });

  req.on("close", () => {
    connections = connections.filter(x => x.res != res);
    console.log("Disconnected!!!!");
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
      "SELECT userId FROM users_conversations WHERE conversationId = ?";
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
      if (+userList[i].userId === +connection.req.session.user.id) {
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

    // syntax for a SSE message: 'event: message \ndata: "the-message" \n\n'
    connection.res.write(
      "event:" + event + "\ndata:" + JSON.stringify(data) + "\n\n"
    );
  }
}
/* 
setInterval(() => {
  broadcast("keep-alive", "");
}, 25000); */

app.post("/api/messages", async (req, res) => {
  let content = req.body.content;
  let time = Date.now();
  let usersConversationsId = req.body.usersConversationsId;
  let conversationId = req.body.conversationId;
  let senderUserId = req.session.user.id;
  let userName = req.session.user.userName;
  let senderUserRole = req.session.user.role;

  let message = {
    content,
    time,
    usersConversationsId,
    conversationId,
    senderUserId,
    userName,
    senderUserRole
  };
  console.log("message", message);
  await broadcast("new-message", message);
  const sql =
    "INSERT INTO messages (content, time, usersConversationsId) VALUES (?,?,?)";
  const parameters = [content, time, usersConversationsId];
  let result = await sqlQuery("messages", req, res, sql, true, parameters);
});

restApi(db, app);

//app.use(express.static(__dirname + '/dist')); kolla upp sökvägen.

app.listen(port, () => {
  console.log("Server listening on port " + port);
});

app.all("*", (req, res) => {
  res.status(404).json({ error: "Endpoint not found" });
  /*res.set("Content-Type", "text/html");
  res.sendFile(path.join(__dirname, "../src/views", "NotFound.jsx"));*/
});
