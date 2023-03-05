//Borrowed from Thomas Frank

import { createRequire } from "module";
const { url } = import.meta;
const require = createRequire(url);
const aclRules = require("./acl-rules.json");

export function acl(path, req) {
  let role = req.session.user ? req.session.user.role : "anonymus";
  let method = req.method.toLowerCase();
  let allowed = aclRules?.[role]?.[path]?.[method];
  return !!allowed;
}
