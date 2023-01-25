import React from "react";
import { Container, Row, Col } from "react-bootstrap";

function NewMessage(props) {
  const { message, newMessage } = props;
  console.log("New message");
  console.log(newMessage);
  return (
    <Container>
      {!!newMessage && (
        <Row>
          <Col>
            <p>{new Date(newMessage.time).toLocaleString()}</p>
          </Col>
          <p>{newMessage.content}</p>
        </Row>
      )}
    </Container>
  );
}

export default NewMessage;
