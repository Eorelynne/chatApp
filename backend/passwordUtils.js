import { createRequire } from "module";
const { url } = import.meta;
const require = createRequire(url);
require("dotenv").config();

const crypto = require("crypto");

const salt = process.env.PASSWORDSALT;

export function passwordVerifyer(password) {
  //minst 8 tecken, minst en stor bokstav och en som inte är bokstav.
  let regexp = "^(?=.*[A-Z])(?=.*[-+_!@#$%^&*.,?0-9])";
  let isPasswordApproved = false;
  if (password.length < 8 || !password?.match(regexp)) {
    return isPasswordApproved;
  }
  console.log("Running verifyer");
  isPasswordApproved = true;
  return isPasswordApproved;
}

export function passwordEncryptor(password) {
  if (typeof password !== "string") {
    return null;
  }
  //nödvändig om verifyer körs först?
  return crypto.createHmac("sha256", salt).update(password).digest("hex");
}
