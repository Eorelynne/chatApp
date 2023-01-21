import React from "react";
import { useState, useEffect, useLocation } from "react";
import { Row, Col, Form, InputGroup, Button } from "react-bootstrap";
import MessageList from "../components/MessageList";

function ConversationPit() {
  const { state } = useLocation();
  const { conversation } = state;
  const [messageList, setMessageList] = useState([]);

  console.log("conversation in conversation!!!");
  console.log(conversation);

  useEffect(() => {
    (async () => {
      let data = await (
        await fetch(`/api/conversation-messages/${conversation.id}`)
      ).json();
      setMessageList([messageList, ...data]);
    })();
  }, []);

  function startSSE() {
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
    });
  }

  useEffect(() => {
    startSSE();
  }, []);

  return (
    <>
      <Col>ConversationPit {conversation.name}</Col>
      <Col>
        <MessageList />
      </Col>
      <Row>
        <Col xs={{ span: 6, offset: 3 }}>
          <Form>
            <InputGroup className='mb-3'>
              <Form.Control
                placeholder=''
                aria-label="Recipient's username"
                aria-describedby='basic-addon2'
              />
              <Button variant='outline-secondary' id='button-addon2'>
                Send
              </Button>
            </InputGroup>
          </Form>
        </Col>
      </Row>
    </>
  );
}

export default ConversationPit;
