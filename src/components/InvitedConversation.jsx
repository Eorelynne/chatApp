import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import AcceptBtn from "./AcceptBtn";
import DeclineBtn from "./DeclineBtn";

function InvitedConversation(props) {
  const { invitation, index, invitationAnswer, setInvitationAnswer } = props;

  /*let conversation = {
    id: 1,
    name: "Angies birthday",
    creator: "Lolo1"
  };
*/
  return (
    <Container fluid>
      <Row>
        <Col xs={3}>
          <p>{invitation.conversationName}</p>
        </Col>
        <Col xs={3}>{invitation.creatorUserName}</Col>
        <Col xs={3}>
          <AcceptBtn
            invitation={invitation}
            invitationAnswer={invitationAnswer}
            setInvitationAnswer={setInvitationAnswer}
          />
        </Col>
        <Col xs={3}>
          <DeclineBtn
            invitation={invitation}
            invitationAnswer={invitationAnswer}
            setInvitationAnswer={setInvitationAnswer}
          />
        </Col>
      </Row>
    </Container>
  );
}

export default InvitedConversation;
