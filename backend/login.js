import { createRequire } from "module";
import { passwordEncryptor } from "./passwordUtils.js";
import { sqlQuery } from "./restApi.js";
import { acl } from "./acl.js";
import { dbParams } from "./index.js";
const { url } = import.meta;
const require = createRequire(url);
const session = require("express-session");
const mysql2 = require("mysql2/promise");
const mysqlStore = require("express-mysql-session")(session);

export function login(db, app) {
  const options = {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.MYSQL_DB
  };

  const connection = mysql2.createPool(options);
  const sessionStore = new mysqlStore({}, connection);

  app.use(
    session({
      //key: "session_cookie_name",
      secret: "justForDevelopementUseOnly1234",
      store: sessionStore,
      resave: false,
      cookie: { secure: "auto" },
      saveUninitialized: false
    })
  );

  app.post("/api/login", async (req, res) => {
    if (!acl("login", req)) {
      res.status(405).json({ error: "Not allowed" });
      return;
    }
    if (!req.body.email || !req.body.password) {
      res.status(404).json({ error: "Bad request" });
      return;
    }
    let password = passwordEncryptor(req.body.password);
    let sql = `SELECT * FROM users
    WHERE email = ? AND
    password = ? `;
    let parameters = [req.body.email, password];
    let result = await sqlQuery("login", req, res, sql, parameters);
    //delete result.password;
    if (!result._error) {
      req.session.user = result;
      //Servern kommer ihåg att man är inloggad. Vid varje request skickas cookien med
      //Express-session ser vilken cookie som är kopplad till sessionen. Är man inloggad kan man läsa av att det finns en user
      //kopplad till sessionen.
    }
    return;
  });

  app.get("/api/login", (req, res) => {
    if (!acl("login", req)) {
      res.status(405).json({ _error: "Not allowed" });
    }
    res.json(req.session.user || { _error: "Not logged in" });
  });

  app.delete("/api/login", (req, res) => {
    if (!acl("login", req)) {
      res.status(405).json({ _error: "Not allowed" });
    }
    delete req.session.user;
    res.json({ success: "Logged out" });
  });
}
