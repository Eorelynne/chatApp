import React from "react";
import { Form, Button } from "react-bootstrap";
import useStates from "../assets/helpers/useStates.js";

function CreateConversation(props) {
  let { conversationName, setConversationName } = props;
  let l = useStates("loggedIn");

  function resetForm() {
    setConversationName("");
  }

  async function submitForm(event) {
    event.preventDefault();
    let result = await (
      await fetch(`/api/conversations-create/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ name: conversationName })
      })
    ).json();
    console.log(result);
    console.log("userId:", l.id);
    let conversationId = result.insertId;
    await (
      await fetch(`/api/conversations-join/${conversationId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ creatorId: l.id })
      })
    ).json();

    resetForm();
  }

  return (
    <>
      <Form onSubmit={submitForm} className='pt-1 pb-2'>
        <h4>Start a conversation</h4>
        <Form.Group className='mb-1' controlId='formBasicConversationName'>
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
          <Button className='btn mt-1' type='submit'>
            Create
          </Button>
        </Form.Group>
      </Form>
    </>
  );
}

export default CreateConversation;
