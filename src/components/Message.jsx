import React from "react";
import { useEffect } from "react";
import {
  Container,
  Row,
  Col,
  Dropdown,
  Button,
  DropdownButton
} from "react-bootstrap";
import useStates from "../utilities/useStates.js";
import "../../public/css/conversationPage.css";

function Message(props) {
  const { message, newMessage } = props;
  let l = useStates("appState");

  /*  {!!l.id && !!message.senderUserId && ( */
  return (
    <Container id='new-message'>
      {!!message && (
        <Col
          /*  xs={8}
            sm={4} */
          className={
            l.loggedIn.id === message.senderUserId
              ? "sent-message message pt-1 mt-2 col-md-6 col-sm-6 col-6 ms-auto scroll-container message-container"
              : "recieved-message message pt-1 mt-2 col-md-6 col-sm-6 col-6 me-auto scroll-container message-container"
          }
        >
          <Row className='pe-0 ps-0 align-items-end'>
            <Col xs={{ span: 1, offset: 6 }}>
              {l.loggedIn.role && l.loggedIn.role === "admin" && (
                <ToggleDropdown message={message} l={l} />
              )}
            </Col>
          </Row>
          <Row>
            <Col>
              <p>{new Date(message.time).toLocaleString()}</p>
            </Col>
          </Row>
          <Row className='pe-0 ps-0'>
            <Col>
              <p>{message.content}</p>
            </Col>
          </Row>
          <Row className='pe-0 ps-0'>
            <Col>
              {message.senderUserRole === "admin" && (
                <p className='mb-0' style={{ color: "red" }}>
                  Admin
                </p>
              )}
              <p className='mt-0'>{message.userName}</p>
            </Col>
          </Row>
        </Col>
      )}
    </Container>
  );
}

export default Message;

function ToggleDropdown(props) {
  const { message, l } = props;

  async function deleteMessage() {
    if (l.loggedIn.role === "admin") {
      await (
        await fetch(`/api/messages/${message.messageId}`, {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json"
          }
        })
      ).json();
    }
  }

  return (
    <Dropdown>
      <Dropdown.Toggle
        variant='success'
        id='dropdown-basic-message'
        className={
          l.loggedIn.id === message.senderUserId
            ? "sent-message-btn "
            : "recieved-message-btn"
        }
      >
        <h3>...</h3>
      </Dropdown.Toggle>
      <Dropdown.Menu>
        <Dropdown.Item
          onClick={() => {
            deleteMessage();
          }}
        >
          Delete
        </Dropdown.Item>
      </Dropdown.Menu>
    </Dropdown>
  );
}
