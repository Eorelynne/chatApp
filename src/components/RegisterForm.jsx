import React from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Form, Button, Container, Modal } from "react-bootstrap";
import { checkPassword, checkEmail } from "../utilities/inputCheck.js";
import useStates from "../utilities/useStates.js";
import "../../public/css/form.css";

function RegisterForm() {
  let l = useStates("appState");
  const [password, setPassword] = useState("");
  const [secondPassword, setSecondPassword] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const handleClose = () => setShowModal(false);
  const navigate = useNavigate();

  function resetForm() {
    l.loggedIn.firstName = "";
    l.loggedIn.lastName = "";
    l.loggedIn.userName = "";
    l.loggedIn.email = "";
    setPassword("");
    setSecondPassword("");
  }

  function goToLogin() {
    navigate("/login");
  }

  async function submitForm(event) {
    event.preventDefault();

    if (
      l.loggedIn.firstName.length === 0 ||
      l.loggedIn.lastName.length === 0 ||
      l.loggedIn.userName.length === 0 ||
      l.loggedIn.email.length === 0 ||
      password.length === 0 ||
      secondPassword.length === 0
    ) {
      setModalMessage("All fields must be filled");
      setShowModal(true);
      return;
    }

    if (password !== secondPassword) {
      setModalMessage("The entered passwords must match");
      setShowModal(true);
      return;
    }

    let isPasswordApproved = checkPassword(password);
    let isEmailApproved = checkEmail(l.loggedIn.email);
    if (!isEmailApproved || !isPasswordApproved) {
      setModalMessage("Wrong format in email or password");
      setShowModal(true);
      return;
    }

    let userToSave = {
      firstName: l.loggedIn.firstName,
      lastName: l.loggedIn.lastName,
      userName: l.loggedIn.userName,
      email: l.loggedIn.email,
      password: password
    };

    let result = await (
      await fetch("/api/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userToSave)
      })
    ).json();
    console.log(result);
    if (result.error === "Wrong email format") {
      setModalMessage(result.error);
      setShowModal(true);
      return;
    } else if (!result.error) {
      console.log("Registered");
      resetForm();
      setModalMessage("You are now registered");
      setShowModal(true);
      setTimeout(goToLogin, 3000);
    } else if (result.error.startsWith("Record already exist in database")) {
      setModalMessage("Username or email already exist");
      setShowModal(true);
      return;
    }
  }

  return (
    <div>
      <Form onSubmit={submitForm} className='pt-3 pb-5'>
        <Form.Group className='mb-3' controlId='formBasicFirstName'>
          <Form.Label>First Name</Form.Label>
          <Form.Control
            type='text'
            value={l.loggedIn.firstName}
            {...l.loggedIn.bind("firstName")}
          />
        </Form.Group>

        <Form.Group className='mb-3' controlId='formBasicLastName'>
          <Form.Label>Last Name</Form.Label>
          <Form.Control
            type='text'
            value={l.loggedIn.lastName}
            {...l.loggedIn.bind("lastName")}
          />
        </Form.Group>

        <Form.Group className='mb-3' controlId='formBasicUserName'>
          <Form.Label>User name</Form.Label>
          <Form.Control
            type='text'
            value={l.loggedIn.userName}
            {...l.loggedIn.bind("userName")}
          />
          <Form.Text className='text-muted'>
            This is the name your friends will see.
          </Form.Text>
        </Form.Group>

        <Form.Group className='mb-3' controlId='formBasicEmail'>
          <Form.Label>Email address</Form.Label>
          <Form.Control
            type='email'
            value={l.loggedIn.email}
            {...l.loggedIn.bind("email")}
          />
        </Form.Group>

        <Form.Group className='mb-3' controlId='formBasicPassword'>
          <Form.Label>Password</Form.Label>
          <Form.Control
            type='password'
            value={password}
            onChange={event => {
              setPassword(event.target.value);
            }}
          />
          <Form.Text className='text-muted'>
            At least 8 characters, one upper case letter and one non-letter
            character.
          </Form.Text>
        </Form.Group>
        <Form.Group className='mb-3' controlId='formBasicRepeatPassword'>
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
      </Form>
    </div>
  );
}

export default RegisterForm;
