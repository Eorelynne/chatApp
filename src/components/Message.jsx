import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import useStates from "../utilities/useStates";
import "../../public/css/conversationPage.css";

function Message(props) {
  const { message, newMessage } = props;
  let l = useStates("loggedIn");

  return (
    <>
      {/*  {!!l.id && !!message.senderUserId && ( */}
      <Container
        className={
          l.id === message.senderUserId
            ? "sent-message message"
            : "recieved-message message"
        }
      >
        {!!message && (
          <Row>
            <Col>
              <p>{new Date(message.time).toLocaleString()}</p>
            </Col>
            <Row>
              <Col>
                <h5>{message.content}</h5>
              </Col>
            </Row>
            <Row>
              <Col>
                <h5>{message.userName}</h5>
              </Col>
            </Row>
          </Row>
        )}
      </Container>
      {/* )} */}
    </>
  );
}

export default Message;
