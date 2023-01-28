import React from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Form, Button, Container, Modal } from "react-bootstrap";
import { checkPassword, checkEmail } from "../utilities/inputCheck.js";
import useStates from "../utilities/useStates.js";
import "../../public/css/form.css";

function RegisterForm() {
  /* const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [userName, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [firstPassword, setFirstPassword] = useState(""); */
  let l = useStates("loggedIn");
  const [secondPassword, setSecondPassword] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const handleClose = () => setShowModal(false);
  const navigate = useNavigate();

  function resetForm() {
    l.firstName = "";
    l.lastName = "";
    l.userName = "";
    l.email = "";
    l.password = "";
    setSecondPassword("");
  }

  function goToLogin() {
    navigate("/login");
  }

  async function submitForm(event) {
    event.preventDefault();
    /* let formInfoIsValid = false;
    while (!formInfoIsValid) { */
    if (
      l.firstName.length === 0 ||
      l.lastName.length === 0 ||
      l.userName.length === 0 ||
      l.email.length === 0 ||
      l.password.length === 0 ||
      secondPassword.length === 0
    ) {
      console.log("ininputCheck");
      /* formInfoIsValid = false; */
      setModalMessage("All fields must be filled");
      setShowModal(true);
    } /* else {
        formInfoIsValid = true;
      }
    } 
    formInfoIsValid = false;
     while (!formInfoIsValid) { */
    if (l.password !== secondPassword) {
      console.log("inMatchCheck");
      /* formInfoIsValid = false; */
      setModalMessage("The entered passwords must match");
      setShowModal(true);
    } /* else {
        formInfoIsValid = true;
      }
    } */
    /*  formInfoIsValid = false;
    while (!formInfoIsValid) { */
    let isPasswordApproved = checkPassword(l.password);
    let isEmailApproved = checkEmail(l.email);
    console.log("invalidationcheck");
    console.log(isPasswordApproved);
    console.log(isEmailApproved);
    if (!isEmailApproved || !isPasswordApproved) {
      /* formInfoIsValid = false; */
      setModalMessage("Wrong format in email or password");
      setShowModal(true);
    } /* else {
        formInfoIsValid = true;
      }
    } */

    let userToSave = {
      firstName: l.firstName,
      lastName: l.lastName,
      userName: l.userName,
      email: l.email,
      password: l.password
    };
    console.log(userToSave);
    let result = await (
      await fetch("/api/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userToSave)
      })
    ).json();
    console.log(result);
    resetForm();
    setModalMessage("You are now registered");
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
            value={l.firstName}
            {...l.bind("firstName")}
            placeholder=''
          />
        </Form.Group>

        <Form.Group className='mb-3' controlId='formBasicLastName'>
          <Form.Label>Last Name</Form.Label>
          <Form.Control
            type='text'
            value={l.lastName}
            {...l.bind("lastName")}
            placeholder=''
          />
        </Form.Group>

        <Form.Group className='mb-3' controlId='formBasicUserName'>
          <Form.Label>User name</Form.Label>
          <Form.Control
            type='text'
            value={l.userName}
            {...l.bind("userName")}
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
            value={l.email}
            {...l.bind("email")}
            placeholder='Enter email'
          />
        </Form.Group>

        <Form.Group className='mb-3' controlId='formBasicPassword'>
          <Form.Label>Password</Form.Label>
          <Form.Control
            type='password'
            value={l.password}
            {...l.bind("password")}
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
