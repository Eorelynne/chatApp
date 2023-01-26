import React from "react";
import { Container, Row, Col } from "react-bootstrap";

function NewMessage(props) {
  const { message, newMessage } = props;

  return (
    <Container>
      {!!newMessage.time && (
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
