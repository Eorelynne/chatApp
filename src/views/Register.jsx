import React from "react";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useStates from "../utilities/useStates.js";
import { Row, Col } from "react-bootstrap";
import Header from "../components/Header";
import RegisterForm from "../components/RegisterForm";

function Register() {
  /*  const navigate = useNavigate();
  let l = useStates("appState");

   if (l.loggedIn.id === 0 || !l.loggedIn.id) {
      (async () => {
        let data = await (await fetch("/api/login")).json();
        if (!data.error) {
          l.loggedIn.id = data.id;
          l.loggedIn.firstName = data.firstName;
          l.loggedIn.lastName = data.lastName;
          l.loggedIn.userName = data.userName;
          l.loggedIn.email = data.email;
          l.loggedIn.role = data.role;
        } (data.error) {
          navigate("/");
        }
      })();
    }
  }, []); */

  return (
    <div>
      <Header />
      <Row className='mt-3'>
        <Col xs={1} md={2}></Col>
        <Col xs={10} md={8} className='form'>
          <RegisterForm />
        </Col>
      </Row>
    </div>
  );
}

export default Register;
