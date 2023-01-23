import React from "react";
import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { Container, Row, Col, Form, InputGroup, Button } from "react-bootstrap";
import MessageList from "../components/MessageList";
import MessageForm from "../components/MessageForm";
import Header from "../components/Header";
import Message from "../components/Message";
import "../../public/css/conversationPage.css";

function ConversationPit(props) {
  const { loggedIn, setLoggedIn } = props;
  const location = useLocation();
  console.log(location);
  const { state } = location;
  const [messageList, setMessageList] = useState([]);
  const [newMessage, setNewMessage] = useState("");

  /* 
  useEffect(() => {
    console.log("stateid", state.id);
    if (state.id) {
      (async () => {
        let data = await (
          await fetch(`/api/conversation-messages/${state.id}`)
        ).json();
        setMessageList({ messageList, ...data });
      })();
    } else {
      console.log("No state.id");
    }
    console.log("messageList.length", messageList.length);
  }, []);

 */ function startSSE() {
    let sse = new EventSource("/api/sse");

    sse.addEventListener("connect", message => {
      let data = JSON.parse(message.data);
      console.log("[connect]", data);
    });
    sse.addEventListener("disconnect", message => {
      let data = JSON.parse(message.data);
      console.log("[disconnect]", data);
    });

    sse.addEventListener("new-message", message => {
      let data = JSON.parse(message.data);
      console.log("[new-message]", data);
      setNewMessage(data);
    });
  }

  useEffect(() => {
    startSSE();
  }, []);

  return (
    <>
      <Header {...{ loggedIn, setLoggedIn }} />
      <Container className='messageFormContainer mt-4'>
        <Row>
          <Col xs={{ span: 6, offset: 3 }}>{state.name}</Col>
        </Row>
        <Col>
          <MessageList
            messageList={messageList}
            setMessageList={setMessageList}
            {...{ loggedIn, setLoggedIn }}
            state={state}
          />
        </Col>
        <Col>
          <Message newMessage={newMessage} />
        </Col>
        <MessageForm {...{ loggedIn, setLoggedIn }} state={state} />
      </Container>
    </>
  );
}

export default ConversationPit;
