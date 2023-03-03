import React from "react";
import { Button } from "react-bootstrap";
import "../../public/css/myPage.css";

function DeclineBtn(props) {
  const { invitation, invitationAnswer, setInvitationAnswer } = props;

  async function declineConversation() {
    await updateInvitation();
    setInvitationAnswer(!invitationAnswer);
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
    ).json();
    return;
  }

  return (
    <>
      <Button onClick={declineConversation} className='decline-btn' size='sm'>
        Decline
      </Button>
    </>
  );
}

export default DeclineBtn;
