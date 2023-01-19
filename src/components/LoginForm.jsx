import React from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Form, Button, Container, Modal } from "react-bootstrap";
import "../../public/css/form.css";

function loginForm(props) {
  const { showModal, setShowModal, user, setUser } = props;
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const handleClose = () => setShowModal(false);
  const navigate = useNavigate();

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
    console.log(data);
    let sessionUser = await (await fetch("/api/login")).json();
    console.log(sessionUser);
    setUser(sessionUser);

    console.log("USER!!!");
    console.log(user);

    resetForm();

    if (Object.keys(user).length !== 0) {
      console.log("user!!!!");
      console.log(user);
      navigate("/my-page");
    } else {
      console.log("Not logged in");
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
