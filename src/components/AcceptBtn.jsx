import React from "react";
import { Button } from "react-bootstrap";
import "../../public/css/myPage.css";

function AcceptBtn({ conversation }) {
  async function joinConversation() {
    let conversationData = { creatorId: conversation.creatorId };
    let conversationId = conversation.id;
    console.log(conversation.creatorId, conversationId);
    let result = await (
      await fetch(`/api/conversation-user/${conversationId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(conversationData)
      })
    ).json;
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
