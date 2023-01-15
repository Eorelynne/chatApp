import { createRequire } from "module";
// Only necessary if you need  __filename or __dirname
import { fileURLToPath } from "url";

// Note: import.meta.url is different for every file
const { url } = import.meta;
// Make the require function available
const require = createRequire(url);
// Set __filename and __dirname constants
const __filename = fileURLToPath(url);
const __dirname = fileURLToPath(new URL(".", url));

const express = require("express");
const app = express();
const port = 4000;
app.use(express.json());

app.listen(port, () => {
  console.log("Server listening on port " + port);
});

app.get("/api/", (req, res) => {
  res.json({ name: "Holly" });
});

app.post("/api/users", (req, res) => {
  console.log(req.body);
  res.json({ name: req.body.firstName });
});
