import React from "react";
import { Col, Dropdown, ButtonGroup, Button } from "react-bootstrap";
import useStates from "../assets/helpers/useStates.js";

import "../../public/css/myPage.css";

function User(props) {
  const {
    index,
    userItem,
    loggedIn,
    setLoggedIn,
    loggedInConversationList,
    setLoggedInConversationList
  } = props;
  //let l = useStates("loggedIn");

  async function inviteUser(conversation) {
    console.log(conversation);
    console.log(userItem);
    console.log(loggedIn);
    if (conversation.id && userItem.id && loggedIn) {
      let result = await (
        await fetch("/api/conversations-invite", {
          method: "POST",
          headers: {
            "Content-Type": "Application/json"
          },
          body: JSON.stringify({
            conversationId: conversation.id,
            userId: userItem.id,
            creatorId: loggedIn.id
          })
        })
      ).json();
    }
    console.log("Result in User");
    console.log(result);
  }

  return (
    <li>
      {userItem.userName}
      {/* 
      <Dropdown as={ButtonGroup}>
        <Button className='userNameDropdown-btn'>{userItem.userName}</Button>
        <Dropdown.Toggle className='userNameDropdown-toggle'></Dropdown.Toggle>
        <Dropdown.Menu>
          {loggedInConversationList.length !== 0 && (
            <Dropdown.Item>
              <Dropdown as={ButtonGroup} drop='end'>
                <Button className='userNameDropdown-btn'>Invite</Button>
                <Dropdown.Toggle className='userNameDropdown-toggle'></Dropdown.Toggle>
                <Dropdown.Menu>
                  {loggedInConversationList.map((conversation, index) => (
                    <Dropdown.Item
                      key={index}
                      onClick={inviteUser(conversation)}
                    >
                      {conversation.name}
                    </Dropdown.Item>
                  ))}
                </Dropdown.Menu>
              </Dropdown>
            </Dropdown.Item>
          )}
        </Dropdown.Menu>
      </Dropdown> */}
    </li>
  );
}

export default User;
