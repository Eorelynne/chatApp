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
    setLoggedInConversationList,
    isInvitationSent,
    setIsInvitationSent
  } = props;

  let l = useStates("appState");
  const [showModal, setShowModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const handleClose = () => {
    setShowModal(false);
    setShowSuccessModal(false);
  };

  async function inviteUser(conversation) {
    let result;
    if (conversation.id && userItem.id && l.loggedIn.id) {
      if (+conversation.creatorId === +l.loggedIn.id) {
        result = await (
          await fetch("/api/invitations", {
            method: "POST",
            headers: {
              "Content-Type": "Application/json"
            },
            body: JSON.stringify({
              conversationId: conversation.id,
              userId: userItem.id,
              creatorId: l.loggedIn.id
            })
          })
        ).json();
        if (!result.error) {
          setModalMessage(
            userItem.userName + " is invited to " + conversation.name
          );
          setShowModal(false);
          setShowSuccessModal(true);
          setIsInvitationSent(true);
        } else if (result.error === "User is already in conversation") {
          setModalMessage(
            userItem.userName + " is already in this conversation"
          );
          setShowSuccessModal(true);
        } else if (
          result.error === "User has a pending invite to conversation"
        ) {
          setModalMessage(
            userItem.userName +
              " already has a pending invite to this conversation"
          );
          setShowSuccessModal(true);
        } else {
          setModalMessage("Something went wrong");
          setShowSuccessModal(true);
        }
      } else {
        setModalMessage("You are not the creator of this conversation.");
        setShowSuccessModal(true);
      }
    } else {
      setModalMessage("Something went wrong");
      setShowSuccessModal(true);
    }
  }

  function showConversationList() {
    setShowModal(true);
  }

  return (
    <>
      <li>
        <Dropdown as={ButtonGroup}>
          <Dropdown.Toggle className='userNameDropdown-toggle'></Dropdown.Toggle>
          <Button
            className={
              userItem.role === "admin"
                ? "userNameDropdown-btn custom-text userlist-admin"
                : "userNameDropdown-btn custom-text userlist-user"
            }
          >
            {userItem.userName}
          </Button>
          <Dropdown.Menu>
            <Dropdown.Item onClick={showConversationList}>Invite</Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
      </li>
      <Modal show={showModal} onHide={handleClose} backdrop='static'>
        <Modal.Header style={{ background: "#062E53" }}></Modal.Header>
        <Modal.Body>
          <ul>
            {!!loggedInConversationList &&
              loggedInConversationList.length !== 0 &&
              loggedInConversationList.map((conversation, index) => (
                <li
                  className='user-list-item'
                  key={index}
                  onClick={() => {
                    inviteUser(conversation);
                  }}
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
      <Modal show={showSuccessModal} onHide={handleClose} backdrop='static'>
        <Modal.Header style={{ background: "#062E53" }}></Modal.Header>
        <Modal.Body>{modalMessage}</Modal.Body>
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
