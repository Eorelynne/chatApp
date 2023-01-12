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

const db = await mysql.createConnection(dbParams);

app.use(express.json({ limit: "10KB" }));

//Middleware for json-errorhandling.
app.use((error, req, res, next) => {
  if (error) {
    res.status(400);
    res.json({
      error: "Bad request",
      details: error // needed?
    });
  } else {
    next();
  }
});

restApi(db, app);

login(db, app);

//app.use(express.static(__dirname + '/dist')); kolla upp sökvägen.

app.listen(port, () => {
  console.log("Server listening on port " + port);
});
