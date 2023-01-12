import { createRequire } from "module";
const { url } = import.meta;
const require = createRequire(url);
const aclRules = require("./acl-rules.json");

export function acl(tableName, req) {
  return true;
  console.log(req.session);
  let role = req.session.user ? req.session.user.role : "anonymus";
  let method = req.method.toLowerCase();
  // method = method === "patch" ? "put" : method;
  let allowed = aclRules?.[role]?.[tableName]?.[method];
  return !!allowed;
}
