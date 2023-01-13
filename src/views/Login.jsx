import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import Header from "../components/Header";
import LoginForm from "../components/LoginForm";

function Login() {
  return (
    <div>
      <Header />
      <Row className='mt-3'>
        <Col xs={1} md={2}></Col>
        <Col xs={10} md={8} className='form'>
          <LoginForm />
        </Col>
      </Row>
    </div>
  );
}

export default Login;
