import React from "react";
import { useContext } from "react";
import { Container, Row, Col } from "react-bootstrap";
import User from "../components/User";

import "../../public/css/myPage.css";

function UserList(props) {
  const { userList } = props;

  return (
    <>
      <Row>
        <Col>
          <h5>Users</h5>
        </Col>
      </Row>
      <Container className='userList scrollContainer pt-1'>
        <ul>
          {userList.map((userItem, index) => (
            <User key={index} {...{ userItem }} />
          ))}
        </ul>
      </Container>
    </>
  );
}

export default UserList;
