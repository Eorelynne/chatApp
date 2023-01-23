import React from "react";
import { Button } from "react-bootstrap";
import "../../public/css/myPage.css";

function AcceptBtn(props) {
  const {
    invitation,
    invitationAnswer,
    setInvitationAnswer,
    loggedIn,
    setLoggedIn
  } = props;

  async function joinConversation() {
    let conversationData = { creatorId: invitation.creatorId };
    let conversationId = invitation.conversationId;
    console.log(invitation.creatorId, conversationId);
    let result = await (
      await fetch(`/api/conversations-join/${conversationId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(conversationData)
      })
    ).json;

    updateInvitation();
    setInvitationAnswer(true);
  }

  async function updateInvitation() {
    let result = await (
      await fetch(`/api/conversations-invite/${invitation.invitationId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ isInvitePending: false })
      })
    ).json;
    console.log(result);
  }

  return (
    <>
      <Button onClick={joinConversation} className='accept-btn'>
        Join
      </Button>
    </>
  );
}

export default AcceptBtn;
