import React from "react";
import { Container, Col } from "react-bootstrap";
import InvitedConversation from "./InvitedConversation";
import "../../public/css/myPage.css";

function InvitedToList(props) {
  const {
    invitationList,
    setInvitationList,
    invitationAnswer,
    setInvitationAnswer
  } = props;
  return (
    <Container>
      <h3>Invitations</h3>
      {invitationList.length !== 0 &&
        invitationList.map((invitation, index) => (
          <InvitedConversation
            key={index}
            invitation={invitation}
            invitationAnswer={invitationAnswer}
            setInvitationAnswer={setInvitationAnswer}
          />
        ))}
      {invitationList.length === 0 && (
        <Col>
          <p>No pending invitations</p>
        </Col>
      )}
    </Container>
  );
}

export default InvitedToList;
