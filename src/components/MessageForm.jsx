import React from "react";
import { useState } from "react";
import { Row, Col, Form, InputGroup, Button } from "react-bootstrap";
import useStates from "../utilities/useStates.js";
import "../../public/css/conversationPage.css";

function MessageForm(props) {
  const { state } = props;
  const [content, setContent] = useState("");
  let l = useStates("appState");

  async function submitMessage(event) {
    event.preventDefault();
    if (l.loggedIn.role && l.loggedIn.role === "admin") {
      adminMessage();
      return;
    } else {
      let message = {
        content: content,
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
  }

  async function adminMessage() {
    let usersConversationsId;
    let result = await (
      await fetch(
        `/api/users-conversations-admin/${state.conversation.conversationId}`
      )
    ).json;
    let data;
    /* if (!result.error) {
      console.log(result);
      usersConversationsId = result.id;
      console.log("usersConversationsIdresult", usersConversationsId);
    } else { */
    console.log("No entries found");
    data = await (
      await fetch(
        `/api/conversations-join/${state.conversation.conversationId}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            creatorId: state.conversation.creatorId
          })
        }
      )
    ).json;
    console.log("data", data);
    usersConversationsId = data.insertId;
    console.log("usersConversationsIddata", usersConversationsId);
    let message = {
      content: content,
      usersConversationsId: usersConversationsId,
      conversationId: state.conversation.conversationId
    };
    await (
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
