import React from "react";
import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import useStates from "../utilities/useStates.js";
import { Container, Row, Col, Modal } from "react-bootstrap";
import Header from "../components/Header";
import InvitedToList from "./../components/InvitedToList";
import AdminConversations from "../components/AdminConversations";
import UserList from "./../components/UserList";

import "../../public/css/myPage.css";

function Admin() {
  const [conversationName, setConversationName] = useState("");
  const [userList, setUserList] = useState([]);
  const [conversationList, setConversationList] = useState([]);
  /*  const [listIsSet, setListIsSet] = useState(false);
   */

  let l = useStates("appState");
  /* let m = useStates("newMessage", { message: null }); */
  const navigate = useNavigate();
  const location = useLocation();
  const { state } = location;

  useEffect(() => {
    if (!l.loggedIn.role || l.loggedIn.role !== "admin") {
      navigate("/");
    }
  }, []);

  useEffect(() => {
    (async () => {
      let data = await (await fetch(`/api/user-get-users`)).json();
      if (!data.error) {
        setUserList(data);
      }
    })();
  }, []);

  useEffect(() => {
    if (l.loggedIn.id && l.loggedIn.id !== 0) {
      (async () => {
        let data = await (await fetch(`/api/conversations-admin`)).json();
        if (!data.error) {
          setConversationList(data);
        }
      })();
    }
    /* setListIsSet(true) */
  }, []);

  console.log(conversationList);
  return (
    <>
      <Header />
      <Container>
        <Row className='conversationUserListRow mb-3 pt-2 d-flex justify-content-between'>
          <Col
            xs={{ span: 10, offset: 1 }}
            sm={5}
            className='listContainer mb-3 '
          >
            <UserList userList={userList} />
          </Col>
          <Col
            xs={{ span: 10, offset: 1 }}
            sm={5}
            className='listContainer mb-3 col-lg-5 col-sm-5'
          >
            {!!conversationList && conversationList.length === 0 && (
              <p className='mt-3'>No active conversations</p>
            )}
            {!!conversationList && conversationList.length !== 0 && (
              <AdminConversations
                conversationList={conversationList}
                setConversationList={setConversationList}
              />
            )}
          </Col>
        </Row>
      </Container>
    </>
  );
}

export default Admin;
