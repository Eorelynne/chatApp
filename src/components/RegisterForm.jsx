import React from "react";
import { useState } from "react";
import { Form, Button, Container } from "react-bootstrap";
import styles from "../../public/css/form.css";

function RegisterForm() {
  const [formValues, setFormValues] = useState({
    firstName: "",
    lastName: "",
    userName: "",
    email: "",
    firstPassword: "",
    secondPassword: ""
  });

  function submitForm(event) {
    event.prevent.default;
  }
  function handleChange(event) {
    let { name, value } = event.target;
    setFormValues({ [name]: value });
  }

  console.log(formValues.email);
  console.log(formValues.password);

  return (
    <div>
      <Form onSubmit={submitForm} className='pt-3 pb-5'>
        <Form.Group className='mb-3' controlId='formBasicFirstName'>
          <Form.Label>First Name</Form.Label>
          <Form.Control
            type='text'
            value={formValues.firstName}
            onChange={handleChange}
            placeholder=''
          />
        </Form.Group>

        <Form.Group className='mb-3' controlId='formBasicLastName'>
          <Form.Label>Last Name</Form.Label>
          <Form.Control
            type='text'
            value={formValues.lastName}
            onChange={handleChange}
            placeholder=''
          />
        </Form.Group>

        <Form.Group className='mb-3' controlId='formBasicUserName'>
          <Form.Label>User name</Form.Label>
          <Form.Control
            type='text'
            value={formValues.userName}
            onChange={handleChange}
            placeholder=''
          />
          <Form.Text className='text-muted'>
            This is the name your friends will se.
          </Form.Text>
        </Form.Group>

        <Form.Group className='mb-3' controlId='formBasicEmail'>
          <Form.Label>Email address</Form.Label>
          <Form.Control
            type='email'
            value={formValues.email}
            onChange={handleChange}
            placeholder='Enter email'
          />
        </Form.Group>

        <Form.Group className='mb-3' controlId='formBasicPassword'>
          <Form.Label>Password</Form.Label>
          <Form.Control
            type='password'
            value={formValues.firstPassword}
            onChange={handleChange}
            placeholder='Password'
          />
        </Form.Group>
        <Form.Group className='mb-3' controlId='formBasicPassword'>
          <Form.Label>Repeat password</Form.Label>
          <Form.Control
            type='password'
            value={formValues.secondPassword}
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

export default RegisterForm;
