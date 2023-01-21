import React from "react";

function ConversationListItem(props) {
  const { conversation } = props;

  return (
    <>
      <li>{conversation.name}</li>
    </>
  );
}

export default ConversationListItem;
