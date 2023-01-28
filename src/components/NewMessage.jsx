/* import React from "react";
import { Container, Row, Col } from "react-bootstrap";

function NewMessage(props) {
  const { newMessage } = props;

  return !newMessage ? null : (
    <Container>
      {!!newMessage.time && (
        <Row>
          <p>{new Date(newMessage.time).toLocaleString()}</p>

          <p>{newMessage.content}</p>
        </Row>
      )}
    </Container>
  );
}

export default NewMessage;
 */
