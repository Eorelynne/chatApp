import React from "react";
import Message from "../components/Message";
import { Col } from "react-bootstrap";
import useStates from "../utilities/useStates.js";

function MessageList(props) {
  const { messageList, setMessageList, state } = props;
  let l = useStates("loggedIn");

  return (
    <div>
      <Col>
        {messageList.length !== 0 &&
          messageList.map((message, index) => (
            <Message key={index} message={message} />
          ))}
      </Col>
      {messageList.length === 0 && (
        <Col>
          <p>No messages yet</p>
        </Col>
      )}
    </div>
  );
}

export default MessageList;
