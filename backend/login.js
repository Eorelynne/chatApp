import { createRequire } from "module";
import { passwordEncryptor } from "./passwordUtils.js";
import { sqlQuery } from "./restApi.js";
import { acl } from "./acl.js";
const { url } = import.meta;
const require = createRequire(url);
const session = require("express-session");
const mysqlStore = require("express-mysql-session")(session);

export function login(db, app) {
  let pool = db;

  /* const options = {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.MYSQL_DB
  };
*/
  // const connection = mysql.createPool(options);
  const sessionStore = new mysqlStore({}, pool);

  app.use(
    session({
      // key: "session_cookie_name",
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

    //Servern kommer ihåg att man är inloggad. Vid varje request skickas cookien med
    //Express-session ser vilken cookie som är kopplad till sessionen. Är man inloggad kan man läsa av att det finns en user
    //kopplad till sessionen.
    //}
    return;
  });

  app.get("/api/login", (req, res) => {
    if (!acl("login", req)) {
      res.status(405).json({ error: "Not allowed" });
      return;
    }
    console.log(req.session);
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
      res.status(405).json({ error: "Not allowed" });
    }
    console.log(req.session);
    delete req.session.user;
    console.log(req.session);
    res.json({ success: "Logged out" });
  });
}
