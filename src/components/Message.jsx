import React from "react";
import { useEffect } from "react";
import { Container, Row, Col, Dropdown, Button } from "react-bootstrap";
import useStates from "../utilities/useStates.js";
import "../../public/css/conversationPage.css";

function Message(props) {
  const { message, newMessage } = props;
  let l = useStates("loggedIn");

  /*  {!!l.id && !!message.senderUserId && ( */
  return (
    <Container id='new-message'>
      {!!message && (
        <Col
          /*  xs={8}
            sm={4} */
          className={
            l.id === message.senderUserId
              ? "sent-message message pt-1 mt-2 col-md-6 col-sm-6 col-6 ms-auto scroll-container message-container"
              : "recieved-message message pt-1 mt-2 col-md-6 col-sm-6 col-6 me-auto scroll-container message-container"
          }
        >
          <Row className='pe-0 ps-0'>
            <Col>
              {l.role && l.role === "admin" && (
                <ToggleDropdown message={message} l={l} />
              )}
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
                <p className='mb-0'>Admin</p>
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
    if (l.role === "admin") {
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
      <Dropdown.Toggle variant='success' id='dropdown-basic'>
        Dropdown Button
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
