import { createRequire } from "module";
import { passwordEncryptor } from "./loginUtils.js";
import { sqlQuery } from "./restApi.js";
import { acl } from "./acl.js";
const { url } = import.meta;
const require = createRequire(url);
const session = require("express-session");
const mysqlStore = require("express-mysql-session")(session);

export function login(db, app) {
  let pool = db;

  const sessionStore = new mysqlStore({}, pool);

  app.use(
    session({
      secret: process.env.SESSION_SECRET,
      store: sessionStore,
      resave: false,
      cookie: { secure: "auto" },
      saveUninitialized: true
    })
  );

  app.post("/api/login", async (req, res) => {
    if (!acl("login", req)) {
      res.status(405).json({ error: "Not allowed" });
      return;
    }
    if (req.session.user) {
      res.status(400).json({ error: "Already logged in" });
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
    await sqlQuery("login", req, res, sql, true, parameters);

    // Note: The session.user property is set in the sqlQuery function

    return;
  });

  app.get("/api/login", (req, res) => {
    if (!acl("login", req)) {
      res.status(405).json({ error: "Not allowed" });
      return;
    }
    if (req.session.user) {
      res.json(req.session.user);
      return;
    } else {
      res.json({ error: "Not logged in" });
      return;
    }
  });

  app.delete("/api/login", (req, res) => {
    if (!acl("login", req)) {
      res.status(403).json({ error: "Not allowed" });
      return;
    }
    if (!req.session.user) {
      res.status(400).json({ error: "Already logged out" });
      return;
    }
    delete req.session.user;

    res.json({ success: "Logged out" });
  });
}
