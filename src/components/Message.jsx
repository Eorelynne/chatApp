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
  const { message, newMessage, messageDeleted, setMessageDeleted } = props;
  let l = useStates("appState");

  /*  {!!l.id && !!message.senderUserId && ( */
  return (
    <Container className='new-message'>
      {!!message && (
        <Col
          /*  xs={8}
            sm={4} */
          className={
            l.loggedIn.id === message.senderUserId
              ? "sent-message message pt-1 mt-3 col-5  col-sm-5 col-lg-5 ms-auto message-scroll-container"
              : "recieved-message message pt-1 mt-3 col-5 col-sm-5  col-lg-5 me-auto message-scroll-container"
          }
        >
          <Row className='pe-0 ps-0'>
            <Col xs={{ span: 1, offset: 6 }}>
              {l.loggedIn.role && l.loggedIn.role === "admin" && (
                <ToggleDropdown
                  message={message}
                  l={l}
                  messageDeleted={messageDeleted}
                  setMessageDeleted={setMessageDeleted}
                />
              )}
            </Col>
          </Row>
          <Row>
            <Col className='col-12'>
              <p className='custom-small-text mb-0'>
                {new Date(message.time).toLocaleString("sv-SE", {
                  dateStyle: "short"
                })}
              </p>
            </Col>
            <Col className='col-12'>
              <p className='custom-small-text mt-0 mb-1'>
                {new Date(message.time).toLocaleString("sv-SE", {
                  timeStyle: "short"
                })}
              </p>
            </Col>
          </Row>
          <Row className='pe-1 ps-1 pt-0'>
            <Col>
              <p className='custom-text'>{message.content}</p>
            </Col>
          </Row>
          <Row className='pe-0 ps-0'>
            <Col>
              {message.senderUserRole === "admin" && (
                <div
                  className=' pb-0 mb-0 custom-small-text'
                  style={{ color: "rgb(228, 117, 33)" }}
                >
                  <p className='mb-0'>Admin</p>
                  <p>{message.userName}</p>
                </div>
              )}
              {message.senderUserRole !== "admin" && (
                <p className='mt-0 pt-0 custom-small-text'>
                  {message.userName}
                </p>
              )}
            </Col>
          </Row>
        </Col>
      )}
    </Container>
  );
}

export default Message;

function ToggleDropdown(props) {
  const { message, l, messageDeleted, setMessageDeleted } = props;

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
      setMessageDeleted(true);
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
