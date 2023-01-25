import React from "react";
import { useState } from "react";
import { Col, Dropdown, ButtonGroup, Button, Modal } from "react-bootstrap";
import useStates from "../utilities/useStates.js";

import "../../public/css/myPage.css";

function User(props) {
  const {
    index,
    userItem,
    loggedInConversationList,
    setLoggedInConversationList
  } = props;
  let l = useStates("loggedIn");
  const [showModal, setShowModal] = useState(false);
  const handleClose = () => setShowModal(false);

  async function inviteUser(conversation) {
    console.log(conversation);
    console.log(userItem);
    console.log(l);
    let result;
    if (conversation.id && userItem.id && l) {
      result = await (
        await fetch("/api/conversations-invite", {
          method: "POST",
          headers: {
            "Content-Type": "Application/json"
          },
          body: JSON.stringify({
            conversationId: conversation.id,
            userId: userItem.id,
            creatorId: l.id
          })
        })
      ).json();
    }
    console.log("Result in User");
    console.log(result);
    setShowModal(false);
  }

  function showConversationList() {
    for (let loggedInConversation of loggedInConversationList) {
      console.log(loggedInConversation);
    }
    console.log("running conversationList");

    setShowModal(true);
  }

  return (
    <>
      <li>
        <Dropdown as={ButtonGroup}>
          <Button className='userNameDropdown-btn'>{userItem.userName}</Button>
          <Dropdown.Toggle className='userNameDropdown-toggle'></Dropdown.Toggle>
          <Dropdown.Menu>
            <Dropdown.Item onClick={showConversationList}>Invite</Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
      </li>
      <Modal show={showModal} onHide={handleClose}>
        <Modal.Header style={{ background: "#062E53" }}></Modal.Header>
        <Modal.Body>
          <ul>
            {loggedInConversationList.map((conversation, index) => (
              <li
                key={index}
                /*  onClick={() => {
                  inviteUser(conversation);
                }} */
              >
                {conversation.name}
              </li>
            ))}
          </ul>
        </Modal.Body>
        <Modal.Footer>
          <Button className='custom-button' onClick={handleClose}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default User;
/* 
{loggedInConversationList.length !== 0 && (
           
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
            
          )}*/
