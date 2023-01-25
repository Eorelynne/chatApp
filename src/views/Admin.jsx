import React from "react";
import { Row, Col } from "react-bootstrap";
import Header from "../components/Header";
import AdminUserEdit from "../components/AdminUserEdit";

function Admin() {
  return (
    <div>
      <Header />
      <Row className='mt-3'>
        <Col xs={1} md={2}></Col>
        <Col xs={10} md={8} className='form'>
          <AdminUserEdit />
        </Col>
      </Row>
    </div>
  );
}

export default Admin;
