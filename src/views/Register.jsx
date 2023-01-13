import React from "react";
import { Row, Col } from "react-bootstrap";
import Header from "../components/Header";
import RegisterForm from "../components/RegisterForm";

function Register() {
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
