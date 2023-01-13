import { passwordEncryptor } from "./passwordUtils.js";
import { acl } from "./acl.js";

let db;

export async function restApi(dbConnection, app) {
  db = dbConnection;

  app.get("/api/", (req, res) => {
    res.send("Hello from backend");
  });

  app.get("/api/users", async (req, res) => {
    const sql = "SELECT * FROM users";
    const data = await sqlQuery("users", req, res, sql);
  });

  app.get("/api/users/:id", async (req, res) => {
    const sql = "SELECT * FROM users WHERE `id` = ?";
    const parameters = [req.params.id];
    await sqlQuery("users", req, res, sql, parameters);
  });

  app.post("/api/users", async (req, res) => {
    let password = passwordEncryptor(req.body.password);
    const sql =
      "INSERT INTO users (first_name, last_name, user_name, email, password, role) VALUES (?,?,?,?,?,?)";
    const parameters = [
      req.body.first_name,
      req.body.last_name,
      req.body.user_name,
      req.body.email,
      password,
      "USER"
    ];
    const data = await sqlQuery("users", req, res, sql, parameters);
    console.log("data: ", data);
  });
}

async function sqlQuery(path, req, res, sql, parameters) {
  db.connect(function (error) {
    if (error) {
      res.status(500).json({ error: "Not connected" + error.stack });
      return;
    }
    console.log("connected as id " + db.threadId);
  });
  if (!acl(path, req)) {
    res.status(405).json({ error: "Not allowed" });
    return;
  }
  let result = await db.execute(
    sql,
    parameters,
    function (error, results, fields) {
      if (error) {
        res.status(500).json({ _error: error });
        return;
      }
      if (path === "login" && !!req.body.password) {
        console.log(result._rows[0][0].password);
        result = delete result._rows[0][0].password;
      }
      res.json({ result: results });
    }
  );
  return result;
}

export { sqlQuery };
