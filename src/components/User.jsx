import React from "react";
import { Col, Dropdown, ButtonGroup, Button } from "react-bootstrap";
import useStates from "../assets/helpers/useStates.js";

import "../../public/css/myPage.css";

function User({ index, userItem }) {
  let loggedIn = useStates("loggedIn");

  /*
  async function inviteUser() {
    await (await fetch('/api/conversations-invite'), {
      method: "POST",
      headers: {
        "Content-Type":"Application/json"
      }
      body: {
        conversationId: ,
        userId: userItem.id,
        creatorId: user.id 

      }
  }
}*/

  return (
    <li>
      <Dropdown as={ButtonGroup}>
        <Button className='userNameDropdown-btn'>{userItem.userName}</Button>
        <Dropdown.Toggle className='userNameDropdown-toggle'></Dropdown.Toggle>
        <Dropdown.Menu>
          <Dropdown.Item
            onClick={() => {
              console.log("Inviting");
            }}
          >
            Invite
          </Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown>
    </li>
  );
}

export default User;
