import React from "react";
import { Form, Button } from "react-bootstrap";

function CreateConversation(props) {
  let { conversationName, setConversationName } = props;

  async function submitForm(event) {
    event.preventDefault();
    let result = await (
      await fetch("/api/conversations-create/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ name: conversationName })
      })
    ).json();
    console.log(result);

    let conversationId = result.insertId;
    await (
      await fetch("/api/conversations-join", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: {
          creatorId: 1
        }
      })
    ).json();
  }

  return (
    <>
      <p>Start a conversation</p>
      <Form onSubmit={submitForm} className='pt-3 pb-5'>
        <Form.Group className='mb-3' controlId='formBasicConversationName'>
          <Form.Label>Name your conversation</Form.Label>
          <Form.Control
            type='text'
            value={conversationName}
            onChange={event => {
              setConversationName(event.target.value);
            }}
            placeholder=''
          />
        </Form.Group>
        <Form.Group>
          <Button className='btn mt-3 mb-5' type='submit'>
            Create
          </Button>
        </Form.Group>
      </Form>
    </>
  );
}

export default CreateConversation;
