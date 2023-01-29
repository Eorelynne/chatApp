import React from "react";
import { useEffect } from "react";
import Message from "../components/Message";
import { Col } from "react-bootstrap";
import useStates from "../utilities/useStates.js";
import "../../public/css/conversationPage.css";

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

  function scrollToNewMessage() {
    let element = document.querySelector("#new-message:nth-last-child(1)");
    if (element !== null) {
      element.scrollIntoView("false", {
        behavior: "smooth"
      });
    }
  }

  useEffect(() => {
    /* if (messageList && messageList.length !== 0) { */
    setTimeout(() => {
      scrollToNewMessage();
    }, 500);
    /*  } */
  });

  return (
    <>
      <Col className='scroll-container message-list'>
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
    </>
  );
}

export default MessageList;
