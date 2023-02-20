import React from "react";
import { useState } from "react";
import { Form, Button, Col, Row, Modal } from "react-bootstrap";
import useStates from "../utilities/useStates.js";
import "../../public/css/myPage.css";

function CreateConversation(props) {
  const {
    conversationName,
    setConversationName,
    isNewConversation,
    setIsNewConversation
  } = props;
  let l = useStates("appState");
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const handleClose = () => setShowModal(false);

  function resetForm() {
    setConversationName("");
  }

  async function submitForm(event) {
    event.preventDefault();
    if (conversationName === "" || conversationName === null) {
      setModalMessage("Conversation must have a name");
      setShowModal(true);
      return;
    }

    let result = await (
      await fetch(`/api/conversations-create/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ name: conversationName })
      })
    ).json();
    /*  let conversationId = result.insertId;
    await (
      await fetch(`/api/conversations-join/${conversationId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ creatorId: l.loggedIn.id })
      })
    ).json(); */
    setModalMessage("Conversation created");
    setShowModal(true);
    setIsNewConversation(true);

    resetForm();
  }
  return (
    <>
      <Row className='headlineContainer pt-1 ms-2 me-2'>
        <h5 className='custom-headline'>Start a conversation</h5>
      </Row>
      <Row>
        <Col className='col-lg-10 col-sm-10'>
          <Form onSubmit={submitForm} className='pt-1 pb-2  ms-2 me-2'>
            <Form.Group className='mb-1' controlId='formBasicConversationName'>
              {/*  <Form.Label className='custom-label'>
                Name your conversation
              </Form.Label> */}
              <Form.Control
                type='text'
                size='sm'
                value={conversationName}
                onChange={event => {
                  setConversationName(event.target.value);
                }}
                placeholder='Conversation name'
              />
            </Form.Group>
            <Form.Group>
              <Button size='sm' className='btn mt-1 create-btn' type='submit'>
                Create
              </Button>
            </Form.Group>
          </Form>
        </Col>
      </Row>
      <Modal show={showModal} onHide={handleClose}>
        <Modal.Header></Modal.Header>
        <Modal.Body>
          <p className='custom-label'>{modalMessage}</p>
        </Modal.Body>
        <Modal.Footer>
          <Button className='custom-button' onClick={handleClose}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default CreateConversation;
