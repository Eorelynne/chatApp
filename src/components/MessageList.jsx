import React from "react";
import Message from "../components/Message";
import { Col } from "react-bootstrap";
import useStates from "../utilities/useStates.js";

function MessageList(props) {
  const { messageList, setMessageList, state } = props;
  let l = useStates("loggedIn");

  function sortOnTime(a, b) {
    const timeA = a.time;
    const timeB = b.time;
    if (timeA > timeB) {
      return 1;
    } else if (timeA < timeB) {
      return -1;
    }
    return 0;
  }

  return (
    <div>
      <Col>
        {messageList.length !== 0 &&
          messageList
            .sort(sortOnTime)
            .map((message, index) => <Message key={index} message={message} />)}
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
