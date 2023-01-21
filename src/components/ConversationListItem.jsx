import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "react-bootstrap";
function ConversationListItem(props) {
  const { conversation } = props;
  const navigate = useNavigate();

  console.log("conversation name in list", conversation.name);
  return (
    <>
      <li>
        <Button
          onClick={() => {
            navigate("/conversation-pit", { ...{ conversation } });
          }}
        >
          {conversation.name}
        </Button>
      </li>
    </>
  );
}

export default ConversationListItem;
