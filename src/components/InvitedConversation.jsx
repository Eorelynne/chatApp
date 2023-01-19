import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import AcceptBtn from "./AcceptBtn";
import DeclineBtn from "./DeclineBtn";

function InvitedConversation() {
  let conversation = {
    id: 1,
    name: "Angies birthday",
    creator: "Lolo1"
  };
  return (
    <Container fluid>
      <Row>
        <Col xs={3}>
          <p>{conversation.name}</p>
        </Col>
        <Col xs={3}>{conversation.creator}</Col>
        <Col xs={3}>
          <AcceptBtn conversation={conversation} />
        </Col>
        <Col xs={3}>
          <DeclineBtn conversation={conversation} />
        </Col>
      </Row>
    </Container>
  );
}

export default InvitedConversation;
