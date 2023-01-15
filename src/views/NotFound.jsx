import React from "react";
import { Row, Col } from "react-bootstrap";
import Header from "../components/Header";

function NotFound() {
  return (
    <div>
      <Header />
      <Row className='mt-3'>
        <img alt='not found' src='../../images/notFound.jpg'></img>
      </Row>
      <Row className='mt-3 justify-content-center'>
        <Col xs={1}></Col>
        <Col xs={10}>
          <h1>404 Page not found</h1>
        </Col>
      </Row>
    </div>
  );
}

export default NotFound;
