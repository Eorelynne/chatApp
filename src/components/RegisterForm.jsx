import React from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Form, Button, Container, Modal } from "react-bootstrap";
import { checkPassword, checkEmail } from "../assets/helpers/inputCheck.js";
import "../../public/css/form.css";

function RegisterForm() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [userName, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [firstPassword, setFirstPassword] = useState("");
  const [secondPassword, setSecondPassword] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [message, setMessage] = useState("");
  const handleClose = () => setShowModal(false);
  const navigate = useNavigate();

  function resetForm() {
    setFirstName("");
    setLastName("");
    setUserName("");
    setEmail("");
    setFirstPassword("");
    setSecondPassword("");
  }

  function goToLogin() {
    navigate("/login");
  }

  async function submitForm(event) {
    event.preventDefault();

    let formInfoIsValid = false;
    while (!formInfoIsValid) {
      if (
        firstName.length === 0 ||
        lastName.length === 0 ||
        userName.length === 0 ||
        email.length === 0 ||
        firstPassword.length === 0 ||
        secondPassword.length === 0
      ) {
        formInfoIsValid = false;
        setMessage("All fields must be filled");
        setShowModal(true);
      } else {
        formInfoIsValid = true;
      }
      if (firstPassword !== secondPassword) {
        formInfoIsValid = false;
        setMessage("The entered passwords must match");
        setShowModal(true);
      } else {
        formInfoIsValid = true;
      }
      let isPasswordApproved = checkPassword(firstPassword);
      let isEmailApproved = checkEmail(email);
      if (!isEmailApproved || !isPasswordApproved) {
        formInfoIsValid = false;
        setMessage("Wrong email or password");
        setShowModal(true);
      } else {
        formInfoIsValid = true;
      }
    }

    let userToSave = {
      firstName: firstName,
      lastName: lastName,
      userName: userName,
      email: email,
      password: firstPassword
    };
    let result = await (
      await fetch("/api/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userToSave)
      })
    ).json();
    console.log(result);
    resetForm();
    setMessage("You are now registered");
    setShowModal(true);
    setTimeout(goToLogin, 3000);
  }

  return (
    <div>
      <Form onSubmit={submitForm} className='pt-3 pb-5'>
        <Form.Group className='mb-3' controlId='formBasicFirstName'>
          <Form.Label>First Name</Form.Label>
          <Form.Control
            type='text'
            value={firstName}
            onChange={event => {
              setFirstName(event.target.value);
            }}
            placeholder=''
          />
        </Form.Group>

        <Form.Group className='mb-3' controlId='formBasicLastName'>
          <Form.Label>Last Name</Form.Label>
          <Form.Control
            type='text'
            value={lastName}
            onChange={event => {
              setLastName(event.target.value);
            }}
            placeholder=''
          />
        </Form.Group>

        <Form.Group className='mb-3' controlId='formBasicUserName'>
          <Form.Label>User name</Form.Label>
          <Form.Control
            type='text'
            value={userName}
            onChange={event => {
              setUserName(event.target.value);
            }}
            placeholder=''
          />
          <Form.Text className='text-muted'>
            This is the name your friends will see.
          </Form.Text>
        </Form.Group>

        <Form.Group className='mb-3' controlId='formBasicEmail'>
          <Form.Label>Email address</Form.Label>
          <Form.Control
            type='email'
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
            value={firstPassword}
            onChange={event => {
              setFirstPassword(event.target.value);
            }}
            placeholder='Password'
          />
          <Form.Text className='text-muted'>
            At least 8 characters, one upper case letter and one non-letter
            character.
          </Form.Text>
        </Form.Group>
        <Form.Group className='mb-3' controlId='formBasicPassword'>
          <Form.Label>Repeat password</Form.Label>
          <Form.Control
            type='password'
            value={secondPassword}
            onChange={event => {
              setSecondPassword(event.target.value);
            }}
            placeholder='Password'
          />
        </Form.Group>
        <Container className='justify-content-end'>
          <Button className='btn mt-3 mb-5' type='submit'>
            Register
          </Button>
        </Container>
        <Modal show={showModal} onHide={handleClose}>
          <Modal.Header closeButton></Modal.Header>
          <Modal.Body>
            <p className='custom-label'>{message}</p>
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

export default RegisterForm;
