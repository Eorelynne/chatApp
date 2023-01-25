import React from "react";
import { Row, Col } from "react-bootstrap";
import Header from "../components/Header";
import "../../public/css/appStyles.css";

function NotFound() {
  return (
    <div>
      <Header />
      <Row className='mt-5 pageNotFoundText'>
        <Col>
          <h1>404 Page not found</h1>
        </Col>
      </Row>
      <Row className='mt-3'>
        <img alt='not found' src='../../images/notFound.jpg'></img>
      </Row>
    </div>
  );
}

export default NotFound;
