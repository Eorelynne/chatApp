import React from "react";
import { useContext } from "react";
import { Container, Row, Col } from "react-bootstrap";
import User from "../components/User";

import "../../public/css/myPage.css";

function UserList(props) {
  /*let userList = [
    { userName: "pelle1" },
    { userName: "stina2" },
    { userName: "rumpnisse" },
    { userName: "raffe" }
  ];*/
  const { userList } = props;

  console.log("Length", userList.length);
  if (userList.length > 0) {
    for (let i = 0; i < userList.length; i++) {
      console.log(userList[i].userName);
    }
  }

  return (
    <Container>
      <Row>
        <Col>
          <h5>Users</h5>
        </Col>
      </Row>
      {userList.map((user, index) => (
        <User key={index} {...{ user }} />
      ))}
    </Container>
  );
}

export default UserList;
