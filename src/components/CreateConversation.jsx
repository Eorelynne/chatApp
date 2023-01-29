import React from "react";
import { Form, Button, Col, Row } from "react-bootstrap";
import useStates from "../utilities/useStates.js";
import "../../public/css/myPage.css";

function CreateConversation(props) {
  let { conversationName, setConversationName } = props;
  let l = useStates("loggedIn");

  function resetForm() {
    setConversationName("");
  }

  async function submitForm(event) {
    event.preventDefault();
    let result = await (
      await fetch(`/api/conversations/`, {
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
      <Row className='headlineContainer  ms-2 me-2'>
        <h5>Start a conversation</h5>
      </Row>
      <Row>
        <Col className='col-lg-10 col-sm-10'>
          <Form onSubmit={submitForm} className='pt-1 pb-2  ms-2 me-2'>
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
              <Button className='btn mt-1 create-btn' type='submit'>
                Create
              </Button>
            </Form.Group>
          </Form>
        </Col>
      </Row>
    </>
  );
}

export default CreateConversation;
