import { createRequire } from "module";
// Only necessary if you need  __filename or __dirname
import { fileURLToPath } from "url";
//import { login } from "./login.js";
//import { restApi } from "./restApi.js";
import { dbQuery } from "./databaseQueryer.js";

// Note: import.meta.url is different for every file
const { url } = import.meta;
// Make the require function available
const require = createRequire(url);
// Set __filename and __dirname constants
const __filename = fileURLToPath(url);
const __dirname = fileURLToPath(new URL(".", url));

const express = require("express");
const mysql = require("mysql2");
require("dotenv").config();

const app = express();
const port = process.env.PORT || 4000;

app.use(express.json());

//Middleware for json-errorhandling.
app.use((error, req, res, next) => {
  if (error) {
    res.status(500);
    res.json({
      error: "Something went wrong with your JSON",
      details: error // needed?
    });
  } else {
    next();
  }
});

dbQuery(app);

let connections = [];
app.get("/api/sse", (req, res) => {
  connections.push(res);

  req.on("close", () => {
    connections = connections.filter(openRes => openRes != res);

    broadcast("disconnect", {
      message: "client disconnected"
    });
  });

  res.set({
    "Content-Type": "text/event-stream",
    "Cache-Control": "no-cache"
  });

  broadcast("connect", {
    message: "clients connected: " + connections.length
  });

  function broadcast(event, data) {
    for (let res of connections) {
      res.write("event:" + event + "\ndata:" + JSON.stringify(data) + "\n\n");
    }
  }
});
/*

//login(connection, app);*/

//restApi(app);

//app.use(express.static(__dirname + '/static')); kolla upp sökvägen.

app.listen(port, () => {
  console.log("Server listening on port " + port);
});
