import React from "react";
import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import useStates from "../utilities/useStates.js";
import { Container, Row, Col, Modal } from "react-bootstrap";
import Header from "../components/Header";
import InvitedToList from "./../components/InvitedToList";
import MyConversationPits from "../components/MyConversationPitList";
import UserList from "./../components/UserList";
import CreateConversation from "../components/CreateConversation";

import "../../public/css/myPage.css";

function MyPage() {
  const [conversationName, setConversationName] = useState("");
  const [userList, setUserList] = useState([]);
  const [conversationList, setConversationList] = useState([]);
  const [invitationList, setInvitationList] = useState([]);
  const [bannedFromList, setBannedFromList] = useState([]);
  const [listIsSet, setListIsSet] = useState(false);
  const [invitationAnswer, setInvitationAnswer] = useState(false);
  const [isNewConversation, setIsNewConversation] = useState(false);

  let l = useStates("appState");
  //let m = useStates("newMessage", { message: null });
  const navigate = useNavigate();
  const location = useLocation();
  const { state } = location;

  useEffect(() => {
    if (l.loggedIn.id === 0 || !l.loggedIn.id) {
      (async () => {
        let data = await (await fetch("/api/login")).json();
        if (!data.error) {
          l.loggedIn.id = data.id;
          l.loggedIn.firstName = data.firstName;
          l.loggedIn.lastName = data.lastName;
          l.loggedIn.userName = data.userName;
          l.loggedIn.email = data.email;
          l.loggedIn.role = data.role;
        } else if (data.error) {
          navigate("/");
        }
      })();
    }
  }, []);

  useEffect(() => {
    (async () => {
      let data = await (await fetch(`/api/user-get-users`)).json();
      if (!data.error) {
        setUserList(data);
      } else {
        setUserList([]);
      }
    })();
  }, []);

  useEffect(() => {
    (async () => {
      let data = await (await fetch(`/api/invitations-user`)).json();
      if (!data.error) {
        setInvitationList(data);
      } else {
        setInvitationList([]);
      }
    })();
  }, [invitationAnswer]);

  useEffect(() => {
    if (l.loggedIn.id && l.loggedIn.id !== 0) {
      (async () => {
        let data = await (await fetch(`/api/conversations-by-user`)).json();
        if (!data.error) {
          setConversationList(data);
        } else {
          setConversationList([]);
        }
      })();
    }
    /* setListIsSet(true); */
  }, [invitationAnswer, isNewConversation, l.loggedIn.id]);

  useEffect(() => {
    setIsNewConversation(false);
  }, []);

  useEffect(() => {
    setInvitationAnswer(false);
  }, []);

  useEffect(() => {
    "Running useEffect banlist";
    (async () => {
      let data = await (await fetch(`/api/conversations-banned`)).json();
      if (!data.error) {
        setBannedFromList(data);
      } else {
        setBannedFromList([]);
      }
    })();
  }, [l.loggedIn.id]);

  return (
    <>
      <Header />
      <Container className='mb-3'>
        <Row className='mb-2 pt-2 me-1 ms-1'>
          <Col className='listContainer'>
            <InvitedToList
              invitationList={invitationList}
              setInvitationList={setInvitationList}
              invitationAnswer={invitationAnswer}
              setInvitationAnswer={setInvitationAnswer}
            />
          </Col>
        </Row>
        <Row
          /* gap={1} */ className='conversationUserListRow me-1 ms-1 mb-3 pt-2 d-flex justify-content-between'
        >
          <Col className='listContainer col-lg-4 col-sm-5 col-12 mb-3'>
            <UserList userList={userList} />
          </Col>
          <Col className='listContainer col-lg-4 col-sm-5 col-12 mb-3'>
            {/*  {!!conversationList && conversationList.length === 0 && (
              <p className='mt-3'>No active conversations</p>
            )} */}
            {/* {!!conversationList && conversationList.length !== 0 && ( */}
            <MyConversationPits
              conversationList={conversationList}
              setConversationList={setConversationList}
              bannedFromList={bannedFromList}
              setBannedFromList={setBannedFromList}
            />
            {/* )} */}
          </Col>
          <Col className='listContainer col-lg-4 col-xs-12 mb-3'>
            <CreateConversation
              conversationName={conversationName}
              setConversationName={setConversationName}
              isNewConversation={isNewConversation}
              setIsNewConversation={setIsNewConversation}
            />
          </Col>
        </Row>
      </Container>
    </>
  );
}

export default MyPage;
