import React from "react";
import { Container } from "react-bootstrap";
import InvitedConversation from "./InvitedConversation";
import "../../public/css/myPage.css";

function InvitedToList() {
  return (
    <Container>
      <h3>Invitations</h3>
      <InvitedConversation />
    </Container>
  );
}

export default InvitedToList;
