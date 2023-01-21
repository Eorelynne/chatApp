import React from "react";
import Message from "../components/Message";

function MessageList(props) {
  const { messageList, setMessageList } = props;

  return (
    <div>
      <Message />
    </div>
  );
}

export default MessageList;
