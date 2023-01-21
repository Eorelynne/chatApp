import { createRequire } from "module";
import { fileURLToPath } from "url";
const { url } = import.meta;
const __filename = fileURLToPath(url);
const __dirname = fileURLToPath(new URL(".", url));
const require = createRequire(url);
//const mysql = require("mysql2");
const fs = require("fs");
const path = require("path");

export async function seeder(db) {
  /*const db = await mysql.createConnection({
    host: localhost,
    port: 3306,
    user: root,
    password: password,
    database: prov
  });
*/
  seed();

  async function seed() {
    console.log("Running seed");
    // console.log('\n\nSEEDING DB\n' + '-'.repeat(60) + '\n');
    // db.verbose = true;
    await db.query("SET foreign_key_checks = 0;");
    await createTablesAndViews();
    //await insertData();
    await db.query("SET foreign_key_checks = 1;");
    console.log("\nAll done!\n");
    process.exit();
  }

  async function createTablesAndViews() {
    console.log("Running createTablesAndViews");
    const tableAndViewDefs = [
      ...readSqlFiles("./", "tables")
      //...this.readSqlFiles('./', 'views')
    ];

    for (let sql of tableAndViewDefs) {
      // createa and run drop query
      let dropSql = "";
      if (sql.includes("CREATE TABLE")) {
        console.log("sql Includes CREATE TABLE");
        dropSql =
          "DROP TABLE IF EXISTS " + sql.split("CREATE TABLE ")[1].split("(")[0];
      }
      if (sql.includes("CREATE VIEW ")) {
        dropSql =
          "DROP VIEW IF EXISTS " + sql.split("CREATE VIEW ")[1].split(" AS")[0];
      }
      dropSql && (await db.query(dropSql));
      // run create query
      let defaults =
        " ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 " +
        "COLLATE=utf8mb4_swedish_ci;";
      sql = sql.includes("CREATE TABLE") ? sql.replace(";", defaults) : sql;
      console.log("sql: ", sql);
      await db.query(sql);
    }
  }

  /*async function insertData() {
    let data = readJsonFiles('./', 'data');
    for (let [tableName, rows] of data) {
      let keys = Object.keys(rows[0]);
      let qMarks = (
        '(' + '?,'.repeat(keys.length).slice(0, -1) + '),'
      ).repeat(rows.length).slice(0, -1);
      let sql = `
        INSERT INTO ${tableName}(${keys}) 
        VALUES ${qMarks}`;
      let params = rows.map(x => Object.values(x)).flat();
      await db.query(sql, params);
    }
  }*/

  function readSqlFiles(...pathParts) {
    console.log("Running readSqlFiles");
    pathParts.unshift(__dirname);
    return fs
      .readdirSync(path.join(...pathParts))
      .filter(x => x.slice(-4) === ".sql")
      .map(x => path.join(...pathParts, x))
      .map(x => fs.readFileSync(x, "utf-8"));
  }

  /*static readJsonFiles(...pathParts) {
    pathParts.unshift(__dirname);
    return fs.readdirSync(path.join(...pathParts))
      .filter(x => x.slice(-5) === '.json')
      .map(x => path.join(...pathParts, x))
      .map(x => [x, fs.readFileSync(x, 'utf-8')])
      .map(x => [
        x[0].slice(x[0].lastIndexOf('-') + 1, -5),
        JSON.parse(x[1], null, '  ')]);
  }*/

  /*static log(sql, params) {
    if (!this.verbose) { return; }
    params ? console.log(sql, params) : console.log(sql);
    console.log('\n' + '-'.repeat(60) + '\n');
    return true;
  }
*/
}
