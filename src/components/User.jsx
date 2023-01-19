import React from "react";

import "../../public/css/myPage.css";

function User({ index, user }) {
  return <div>{user.userName}</div>;
}

export default User;
