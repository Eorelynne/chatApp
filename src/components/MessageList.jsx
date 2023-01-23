import React from "react";
import Message from "../components/Message";

function MessageList(props) {
  const { messageList, setMessageList, loggedIn, setLoggedIn, state } = props;

  return (
    <div>
      {messageList.length !== 0 &&
        messageList.map((message, index) => (
          <Message
            key={index}
            message={message}
            {...{ loggedIn, setLoggedIn }}
          />
        ))}
    </div>
  );
}

export default MessageList;
