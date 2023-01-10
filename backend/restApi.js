import { dbQuery } from "./databaseQueryer.js";

export async function restApi(app) {
  const sqlQuery = dbQuery.sqlQuery;
  console.log(typeof sqlQuery);
  app.get("/api/", (req, res) => {
    res.json({ name: "Holly" });
  });
  app.get("/api/users", async (req, res) => {
    console.log("Running Users");
    let sql = "SELECT * FROM users";
    const data = await sqlQuery(req, res, sql);
  });

  app.get("/api/users/:id", (req, res) => {
    connection.execute(
      "SELECT * FROM users WHERE `id` = ?",
      [req.params.id],
      function (err, results, fields) {
        console.log(results); // results contains rows returned by server
        console.log(fields); // fields contains extra meta data about results, if available
        res.json(results);
        // If you execute same statement again, it will be picked from a LRU cache
        // which will save query preparation time and give better performance
      }
    );
  });

  app.post("/api/users", (req, res) => {
    const sql =
      "INSERT INTO users (first_name, last_name, user_name, email, password, role) VALUES (?,?,?,?,?,?)";
    const parameters = [
      req.body.first_name,
      req.body.last_name,
      req.body.user_name,
      req.body.email,
      req.body.password,
      "USER"
    ];
    const data = sqlQuery(req, res, sql, parameters);
  });

  /* async function runQuery(
    tableName,
    req,
    res,
    parameters,
    sql,
    isJustOne = false
  ) {
    /* if (!acl(tableName, req)) {
      res.status(405);
      res.json({ _error: "Not allowed!" });
    }*/
  /*
    let result;
    try {
      result = await connection.execute(
        sql,
        parameters,
        function (err, results, fields) {
          console.log(results);
          console.log(results.json());
          console.log(fields);
          console.log(err);
        }
      );
    } catch (error) {
      result = { _error: error + "" };
    }
    if (isJustOne) {
      result = result[0];
    }
    result = result || null;
    res.status(result ? (result._error ? 500 : 200) : 404);
    setTimeout(() => res.json(result), 1);
  }*/
}
