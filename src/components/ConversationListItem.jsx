import React from "react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "react-bootstrap";
import "../../public/css/conversationPage.css";

function ConversationListItem(props) {
  const { conversation } = props;
  const navigate = useNavigate();

  function navigateToConversationPit() {
    navigate("/conversation-pit", {
      state: { ...{ conversation } }
    });
  }

  return (
    <>
      <li>
        <Button
          className='conversationItem custom-text'
          onClick={navigateToConversationPit}
        >
          {conversation.name}
        </Button>
        {!!conversation.isBanned && <p>{conversation.banReason}</p>}
      </li>
    </>
  );
}

export default ConversationListItem;
