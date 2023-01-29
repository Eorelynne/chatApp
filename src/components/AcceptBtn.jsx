import React from "react";
import { Button } from "react-bootstrap";
import "../../public/css/myPage.css";

function AcceptBtn(props) {
  const { invitation, invitationAnswer, setInvitationAnswer } = props;

  async function joinConversation() {
    let conversationData = { creatorId: invitation.creatorId };
    let conversationId = invitation.conversationId;
    console.log(invitation.creatorId, conversationId);
    await (
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
    await (
      await fetch(`/api/conversations-invite/${invitation.invitationId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ isInvitePending: false })
      })
    ).json;
  }

  return (
    <>
      <Button onClick={joinConversation} size='sm' className='accept-btn'>
        Join
      </Button>
    </>
  );
}

export default AcceptBtn;
