import React from "react";
import { useState } from "react";
import { Form, Button, Container, Modal } from "react-bootstrap";
import { checkPassword, checkEmail } from "../assets/helpers/inputCheck.js";
import styles from "../../public/css/form.css";

function loginForm(props) {
  const { loginData, setLoginData, showModal, setShowModal } = props;
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const handleClose = () => setShowModal(false);

  function resetForm() {
    setEmail("");
    setPassword("");
  }

  async function submitForm(event) {
    event.preventDefault();
    if (email.length === 0 || password.length === 0) {
      setErrorMessage("Enter both email and password");
      setShowModal(true);
    }
    let isPasswordApproved = checkPassword(password);
    let isEmailApproved = checkEmail(email);
    if (!isEmailApproved || !isPasswordApproved) {
      setErrorMessage("Wrong email or password");
      setShowModal(true);
    }
    console.log(email);
    console.log(isEmailApproved);
    console.log(password);
    console.log(isPasswordApproved);
    const user = await (await fetch(`/api/users?email={email}`)).json();
    console.log(user);
    resetForm();
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
