import React from "react";
import { useEffect, useState } from "react";
import { Container, Row, Col, Modal } from "react-bootstrap";
import Header from "../components/Header";
import InvitedToList from "./../components/InvitedToList";
import MyConversationPits from "./../components/MyConversationPits";
import UserList from "./../components/UserList";
import CreateConversation from "../components/CreateConversation";

import "../../public/css/myPage.css";

function MyPage() {
  const [conversationName, setConversationName] = useState("");
  const [userList, setUserList] = useState([]);

  useEffect(() => {
    (async () => {
      let data = await (await fetch(`/api/users`)).json();

      setUserList([userList, ...data]);
    })();
    console.log("running useEffect");
  }, []);

  console.log("running mypage");
  /* console.log("Length", userList.length);
  if (userList.length > 0) {
    for (let i = 0; i < userList.length; i++) {
      console.log(userList[i].userName);
    }
  } */

  return (
    <>
      <Header />
      <Container fluid>
        <Row>
          <Col className='listContainer ms-2 mt-3 me-4 mb-3 pt-2'>
            <InvitedToList />
          </Col>
        </Row>
        <Row></Row>
        <Row>
          <Col xs={5} className='listContainer pt-2 ms-2'>
            <UserList userList={userList} />
          </Col>
          <Col xs={{ span: 5, offset: 1 }} className='listContainer'>
            <MyConversationPits />
          </Col>
        </Row>
        <Row>
          <Col className='listContainer'>
            <CreateConversation
              conversationName={conversationName}
              setConversationName={setConversationName}
            />
          </Col>
        </Row>
      </Container>
    </>
  );
}

export default MyPage;
