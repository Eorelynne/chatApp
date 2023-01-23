import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "react-bootstrap";
import "../../public/css/conversationPage.css";

function ConversationListItem(props) {
  const { conversation, loggedIn, setLoggedIn } = props;
  const navigate = useNavigate();

  return (
    <>
      <li>
        <Button
          className='conversationItem'
          onClick={() => {
            navigate("/conversation-pit", { state: { ...conversation } });
          }}
        >
          {conversation.name}
        </Button>
      </li>
    </>
  );
}

export default ConversationListItem;
