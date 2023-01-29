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

  let l = useStates("loggedIn");
  let m = useStates("newMessage", { message: null });
  const navigate = useNavigate();
  const location = useLocation();
  const { state } = location;

  useEffect(() => {
    if (!l.role || l.role !== "admin") {
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

  /*  useEffect(() => {
    (async () => {
      let data = await (await fetch(`/api/invitations-user`)).json();

      if (!data.error) {
        setInvitationList(data);
      }
    })();
  }, [invitationAnswer]); */

  useEffect(() => {
    if (l.id && l.id !== 0) {
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
        <Row gap={2} className='conversationUserListRow mb-3 pt-2'>
          <Col className='listContainer col-lg-4 col-sm-6'>
            <UserList userList={userList} />
          </Col>
          <Col className='listContainer col-lg-4 col-sm-6'>
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
