import React from "react";
import { useEffect } from "react";
import { Container, Row, Col } from "react-bootstrap";
import AcceptBtn from "./AcceptBtn";
import DeclineBtn from "./DeclineBtn";

function InvitedConversation(props) {
  const {
    invitation,
    index,
    invitationAnswer,
    setInvitationAnswer,
    loggedIn,
    setLoggedIn
  } = props;
  useEffect(() => {
    console.log("invitationAnswer changed");
  }, [invitationAnswer]);

  return (
    <Container fluid>
      <Row>
        <Col xs={3}>
          <p>{invitation.conversationName}</p>
        </Col>
        <Col xs={3}>{invitation.creatorUserName}</Col>
        {invitationAnswer && (
          <Col xs={3}>
            <AcceptBtn
              invitation={invitation}
              invitationAnswer={invitationAnswer}
              setInvitationAnswer={setInvitationAnswer}
              {...{ loggedIn, setLoggedIn }}
            />
          </Col>
        )}
        {invitationAnswer && (
          <Col xs={3}>
            <DeclineBtn
              invitation={invitation}
              invitationAnswer={invitationAnswer}
              setInvitationAnswer={setInvitationAnswer}
              {...{ loggedIn, setLoggedIn }}
            />
          </Col>
        )}
      </Row>
    </Container>
  );
}

export default InvitedConversation;
