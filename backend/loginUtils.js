import { createRequire } from "module";
const { url } = import.meta;
const require = createRequire(url);
require("dotenv").config();
const validator = require("email-validator");

const crypto = require("crypto");

const salt = process.env.PASSWORDSALT;

export function passwordVerifyer(password) {
  //At least 8 characters, at least one capital letter and one non-letter character.
  let regexp = "^(?=.*[A-Z])(?=.*[-+_!@#$%^&*.,?0-9])";
  let isPasswordApproved = false;
  if (password.length < 8 || !password?.match(regexp)) {
    return isPasswordApproved;
  }
  isPasswordApproved = true;
  return isPasswordApproved;
}

export function passwordEncryptor(password) {
  if (typeof password !== "string") {
    return null;
  }
  return crypto.createHmac("sha256", salt).update(password).digest("hex");
}

export function emailValidator(email) {
  return validator.validate(email);
}
