import { createRequire } from "module";
// Only necessary if you need  __filename or __dirname
import { fileURLToPath } from "url";
import { login } from "./login.js";
import { restApi } from "./restApi.js";

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
      //details: error // needed?
    });
  } else {
    next();
  }
});

login(db, app);

let connections = [];
app.get("/api/sse", (req, res) => {
  connections.push(res);

  req.on("close", () => {
    connections = connections.filter(openRes => openRes != res);

    broadcast("disconnect", {
      message: req.session.user.userName + " disconnected"
    });
  });

  res.set({
    "Content-Type": "text/event-stream",
    "Cache-Control": "no-cache"
  });

  broadcast("connect", { message: req.session.user.userName + "connected" });
});

function broadcast(event, data) {
  // loop through all open connections and send
  // some data without closing the connection (res.write)
  for (let res of connections) {
    // syntax for a SSE message: 'event: message \ndata: "the-message" \n\n'
    res.write("event:" + event + "\ndata:" + JSON.stringify(data) + "\n\n");
  }
}

restApi(db, app);

//app.use(express.static(__dirname + '/dist')); kolla upp sökvägen.

app.listen(port, () => {
  console.log("Server listening on port " + port);
});
