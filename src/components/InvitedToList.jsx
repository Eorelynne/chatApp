import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import InvitedConversation from "./InvitedConversation";
import "../../public/css/myPage.css";

function InvitedToList(props) {
  const {
    invitationList,
    setInvitationList,
    invitationAnswer,
    setInvitationAnswer,
    loggedIn,
    setLoggedIn
  } = props;
  return (
    <Container>
      <Row>
        <h3>Invitations</h3>
      </Row>
      {invitationList.length !== 0 && (
        <Container>
          <Row>
            <Col xs={3}>Conversation Pit</Col>
            <Col xs={3}>Invited by</Col>
          </Row>
          {invitationList.map((invitation, index) => (
            <InvitedConversation
              key={index}
              invitation={invitation}
              invitationAnswer={invitationAnswer}
              setInvitationAnswer={setInvitationAnswer}
              {...{ loggedIn, setLoggedIn }}
            />
          ))}
        </Container>
      )}
      {invitationList.length === 0 && (
        <Col>
          <p>No pending invitations</p>
        </Col>
      )}
    </Container>
  );
}

export default InvitedToList;
