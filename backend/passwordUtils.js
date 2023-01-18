import { createRequire } from "module";
const { url } = import.meta;
const require = createRequire(url);
require("dotenv").config();

const crypto = require("crypto");

const salt = process.env.PASSWORDSALT;

export function passwordVerifyer(password) {}

export function passwordEncryptor(password) {
  if (typeof password !== "string") {
    return null;
  }
  //nödvändig om verifyer körs först?
  return crypto.createHmac("sha256", salt).update(password).digest("hex");
}
