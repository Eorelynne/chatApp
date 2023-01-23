import React from "react";
import { useState, useEffect } from "react";
import { Form, Button, Modal, Container } from "react-bootstrap";
import { checkPassword, checkEmail } from "../utilities/inputCheck.js";
import useStates from "../utilities/useStates.js";

function ProfileForm(props) {
  let l = useStates("loggedIn");
  /* const { loggedIn, setLoggedIn } = props;
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [userName, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setpassword] = useState(""); */
  const [secondPassword, setSecondPassword] = useState("");

  useEffect(() => {
    (async () => {
      if (l.id === 0) {
        let data = await (await fetch(`/api/login`)).json();
        if (data.message !== "No entries found") {
          console.log("running useEffect");
          l = { data };
          //setLoggedIn(data);
          //console.log(loggedIn);
          console.log(l.firstName);
        } else if (data.error === "No entries found") {
          navigate("/");
        }
      }
    })();
  }, []);

  async function submitForm(event) {
    event.preventDefault();
    validatInputData();
    console.log("CHANGING MY INFO!!");
    let result = await (
      await fetch(`/api/edit-my-user-info/${l.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "Application/json"
        },
        body: JSON.stringify({
          firstName: l.firstName,
          lastName: l.lastName,
          userName: l.userName,
          email: l.email,
          password: l.password
        })
      })
    ).json;
    console.log(result);
  }

  function validatInputData() {
    let formInfoIsValid = false;
    while (!formInfoIsValid) {
      if (password !== secondPassword) {
        formInfoIsValid = false;
        /*  setMessage("The entered passwords must match");
      setShowModal(true); */
      } else {
        formInfoIsValid = true;
      }
      let isPasswordApproved = checkPassword(l.password);
      let isEmailApproved = checkEmail(l.email);
      if (!isEmailApproved || !isPasswordApproved) {
        formInfoIsValid = false;
        /* setMessage("Wrong email or password");
      setShowModal(true); */
      } else {
        formInfoIsValid = true;
      }
    }
  }

  return (
    <>
      <Form onSubmit={submitForm} className='pt-3 pb-5'>
        <Form.Group className='mb-3' controlId='formBasicFirstName'>
          <Form.Label>First Name</Form.Label>
          <Form.Control
            type='text'
            value={l.firstName}
            {...l.bind("firstName")}
            placeholder={l.firstName}
          />
        </Form.Group>

        <Form.Group className='mb-3' controlId='formBasicLastName'>
          <Form.Label>Last Name</Form.Label>
          <Form.Control
            type='text'
            value={l.lastName}
            {...l.bind("lastName")}
            placeholder={l.lastName}
          />
        </Form.Group>

        <Form.Group className='mb-3' controlId='formBasicUserName'>
          <Form.Label>User name</Form.Label>
          <Form.Control
            type='text'
            value={l.userName}
            {...l.bind("userName")}
            placeholder={l.userName}
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
            placeholder={l.email}
          />
        </Form.Group>

        <Form.Group className='mb-3' controlId='formBasicPassword'>
          <Form.Label>Password</Form.Label>
          <Form.Control
            type='password'
            value={l.password}
            {...l.bind("password")}
            placeholder=''
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
        {/*   <Modal show={showModal} onHide={handleClose}>
          <Modal.Header closeButton></Modal.Header>
          <Modal.Body>
            <p className='custom-label'>{message}</p>
          </Modal.Body>
          <Modal.Footer>
            <Button className='custom-button' onClick={handleClose}>
              Close
            </Button>
          </Modal.Footer>
        </Modal> */}
      </Form>
    </>
  );
}

export default ProfileForm;
