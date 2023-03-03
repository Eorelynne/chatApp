import React from "react";
import { useState } from "react";
import useStates from "../utilities/useStates.js";
import { useNavigate } from "react-router-dom";
import { Form, Button, Container, Modal } from "react-bootstrap";
import "../../public/css/form.css";

function loginForm(props) {
  const { showModal, setShowModal } = props;
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const handleClose = () => setShowModal(false);
  const navigate = useNavigate();
  let l = useStates("appState");

  function resetForm() {
    setEmail("");
    setPassword("");
  }

  async function submitForm(event) {
    event.preventDefault();
    login();
  }

  async function login() {
    if (email.length === 0 || password.length === 0) {
      setErrorMessage("Enter both email and password");
      setShowModal(true);
    }

    let loginData = {
      email: email,
      password: password
    };
    const data = await (
      await fetch(`/api/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(loginData)
      })
    ).json();
    let result = await (await fetch("/api/login")).json();
    if (result.id && result.id !== 0 && result.error !== "Not logged in") {
      (l.loggedIn.id = result.id),
        (l.loggedIn.firstName = result.firstName),
        (l.loggedIn.lastName = result.lastName),
        (l.loggedIn.userName = result.userName),
        (l.loggedIn.email = result.email),
        (l.loggedIn.role = result.role);
      resetForm();
      if (l.loggedIn.role === "user") {
        navigate("/my-page");
      } else if (l.loggedIn.role === "admin") {
        navigate("/admin");
      }
    } else {
      setErrorMessage("Email or password is wrong");
      setShowModal(true);
    }
  }

  return (
    <div>
      <Form onSubmit={submitForm} className='pt-3 pb-5'>
        <Form.Group className='mb-3' controlId='formBasicEmail'>
          <Form.Label>Email address</Form.Label>
          <Form.Control
            size='sm'
            type='email'
            name='email'
            value={email}
            onChange={event => {
              setEmail(event.target.value);
            }}
            placeholder='Enter email'
          />
        </Form.Group>

        <Form.Group className='mb-3' controlId='formBasicPassword'>
          <Form.Label>Password</Form.Label>
          <Form.Control
            type='password'
            name='password'
            value={password}
            onChange={event => {
              setPassword(event.target.value);
            }}
            placeholder='Password'
          />
        </Form.Group>
        <Container className='justify-content-end'>
          <Button className='btn mt-3 mb-5' type='submit'>
            Send
          </Button>
        </Container>
        <Modal show={showModal} onHide={handleClose}>
          <Modal.Header closeButton></Modal.Header>
          <Modal.Body>
            <p className='custom-label'>{errorMessage}</p>
          </Modal.Body>
          <Modal.Footer>
            <Button className='custom-button' onClick={handleClose}>
              Close
            </Button>
          </Modal.Footer>
        </Modal>
      </Form>
    </div>
  );
}

export default loginForm;
