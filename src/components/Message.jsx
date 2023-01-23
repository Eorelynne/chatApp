import React from "react";
import { Container, Row, Col } from "react-bootstrap";

function Message(props) {
  const { message, loggedIn, setLoggedIn, newMessage } = props;
  return (
    <Container>
      {!!message && (
        <Row>
          <Col>
            <p>{Date(message.time).toLocaleString()}</p>
          </Col>
          <p>{message.content}</p>
        </Row>
      )}
      {!!newMessage && (
        <Row>
          <Col>
            <p>{Date(newMessage.time).toLocaleSstring()}</p>
          </Col>
          <p>{newMessage.content}</p>
        </Row>
      )}
    </Container>
  );
}

export default Message;
