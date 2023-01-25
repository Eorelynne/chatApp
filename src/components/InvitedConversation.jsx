import React from "react";
import { useEffect, useState } from "react";
import { Container, Row, Col } from "react-bootstrap";
import AcceptBtn from "./AcceptBtn";
import DeclineBtn from "./DeclineBtn";

function InvitedConversation(props) {
  const { invitation, index, invitationList, setInvitationList } = props;
  const [invitationAnswer, setInvitationAnswer] = useState(false);

  useEffect(() => {
    console.log(invitationList);
    console.log("invitationAnswer changed");
    if (invitationAnswer) {
      let filteredInvitationList = invitationList.filter(
        x => +x.invitationId !== +invitation.invitationId
      );
      setInvitationList(...filteredInvitationList);
      console.log(invitationList);
    }
  }, [invitationAnswer]);

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
