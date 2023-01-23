import React from "react";
import { Button } from "react-bootstrap";
import "../../public/css/myPage.css";

function DeclineBtn(props) {
  const {
    invitation,
    invitationAnswer,
    setInvitationAnswer,
    loggedIn,
    setLoggedIn
  } = props;

  async function declineConversation() {
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
  }

  return (
    <>
      <Button onClick={declineConversation} className='decline-btn'>
        Decline
      </Button>
    </>
  );
}

export default DeclineBtn;
