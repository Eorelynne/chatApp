import { createRequire } from "module";
// Only necessary if you need  __filename or __dirname
import { fileURLToPath } from "url";
const { url } = import.meta;
// Make the require function available
const require = createRequire(url);
// Set __filename and __dirname constants
const __filename = fileURLToPath(url);
const __dirname = fileURLToPath(new URL(".", url));

const session = require("express-session");
const mysqlStore = require("express-mysql-session")(session);

export function login(connection, app) {
  const con = connection;

  const options = {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    database: process.env.MYSQL_DB,
    password: process.env.DB_PASS
  };
  const sessionStore = new mysqlStore({}, con);
  console.log(sessionStore);
  /*app.use(
    session({
      secret: process.env.SALT,
      resave: false,
      saveUninitialized: true,
      cookie: { secure: "auto" },
      store: sessionStore
    })
  );*/

  app.use(
    session({
      key: "session_cookie_name",
      secret: "session_cookie_secret",
      store: sessionStore,
      resave: false,
      saveUninitialized: false
    })
  );
}
