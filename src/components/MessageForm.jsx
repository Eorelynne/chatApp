import React from "react";
import { useState } from "react";
import { Row, Col, Form, InputGroup, Button } from "react-bootstrap";
import useStates from "../utilities/useStates";
import "../../public/css/conversationPage.css";

function MessageForm(props) {
  const { state } = props;
  const [content, setContent] = useState("");

  async function submitMessage(event) {
    event.preventDefault();
    let message = {
      content: content,
      usersConversationsId: state.conversation.usersConversationsId,
      conversationId: state.conversation.conversationId
    };
    let result = await (
      await fetch("/api/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(message)
      })
    ).json();
    setContent("");
  }

  return (
    <>
      <Row className='messageInputRow'>
        <Col>
          <Form onSubmit={submitMessage}>
            <InputGroup className='mb-3'>
              <Form.Control
                type='text'
                value={content}
                onChange={event => {
                  setContent(event.target.value);
                }}
                placeholder=''
                aria-label='message'
                aria-describedby='button-message'
              />
              <Button
                type='submit'
                variant='outline-secondary'
                id='button-message'
              >
                Send
              </Button>
            </InputGroup>
          </Form>
        </Col>
      </Row>
    </>
  );
}

export default MessageForm;
