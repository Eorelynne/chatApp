import React from "react";
import { Form, Button, Col } from "react-bootstrap";
import useStates from "../assets/helpers/useStates.js";
import "../../public/css/myPage.css";

function CreateConversation(props) {
  let { conversationName, setConversationName, loggedIn, setLoggedIn } = props;
  //let l = useStates("loggedIn");

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
    console.log("userId:", loggedIn.id);
    let conversationId = result.insertId;
    await (
      await fetch(`/api/conversations-join/${conversationId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ creatorId: loggedIn.id })
      })
    ).json();

    resetForm();
  }

  return (
    <>
      <Col className='headlineContainer'>
        <h4>Start a conversation</h4>
      </Col>
      <Form onSubmit={submitForm} className='pt-1 pb-2'>
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
