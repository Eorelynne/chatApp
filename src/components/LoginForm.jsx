import React from "react";
import { useState } from "react";
import { Form, Button, Container } from "react-bootstrap";
import styles from "../../public/css/form.css";

function loginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  function submitForm(event) {
    event.prevent.default;
  }
  function handleChange(event) {
    setEmail(event.target.email);
    setPassword(event.target.password);
  }

  console.log(email);
  console.log(password);

  return (
    <div>
      <Form onSubmit={submitForm} className='pt-3 pb-5'>
        <Form.Group className='mb-3' controlId='formBasicEmail'>
          <Form.Label>Email address</Form.Label>
          <Form.Control
            type='email'
            value={email}
            onChange={handleChange}
            placeholder='Enter email'
          />
        </Form.Group>

        <Form.Group className='mb-3' controlId='formBasicPassword'>
          <Form.Label>Password</Form.Label>
          <Form.Control
            type='password'
            onChange={handleChange}
            placeholder='Password'
          />
        </Form.Group>
        <Container className='justify-content-end'>
          <Button className='btn mt-3 mb-5' type='submit'>
            Send
          </Button>
        </Container>
      </Form>
    </div>
  );
}

export default loginForm;
