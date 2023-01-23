import React from "react";
import { useState } from "react";

import { Container, Row, Col, Modal } from "react-bootstrap";
import Header from "../components/Header";
import LoginForm from "../components/LoginForm";

function Login(props) {
  const { loggedIn, setLoggedIn } = props;
  const [showModal, setShowModal] = useState(false);

  return (
    <div>
      <Header {...{ loggedIn, setLoggedIn }} />
      <Row className='mt-3'>
        <Col xs={1} md={2}></Col>
        <Col xs={10} md={8} className='form'>
          <LoginForm
            {...{
              showModal,
              setShowModal
            }}
            loggedIn={loggedIn}
            setLoggedIn={setLoggedIn}
          />
        </Col>
      </Row>
    </div>
  );
}

export default Login;
