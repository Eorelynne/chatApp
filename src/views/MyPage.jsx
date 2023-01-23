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

function MyPage(props) {
  // const { loggedIn, setLoggedIn } = props;
  const [conversationName, setConversationName] = useState("");
  const [userList, setUserList] = useState([]);
  const [conversationList, setConversationList] = useState([]);
  const [invitationList, setInvitationList] = useState([]);
  const [invitationAnswer, setInvitationAnswer] = useState(false);
  let l = useStates("loggedIn");
  const navigate = useNavigate();
  const location = useLocation();
  const { state } = location;
  /* console.log("l in myPage");
  console.log(l); */

  /* useEffect(() => {
    if (l.id === 0 || l.id === undefined) {
       setLoggedIn(state); 
      l = { ...state };
    }
  }, []); */

  useEffect(() => {
    (async () => {
      let data = await (await fetch(`/api/login`)).json();
      if (data.message !== "No entries found") {
        //setLoggedIn({ ...data });
        l = { ...data };
      } else if (
        data.message === "No entries found" ||
        l.id === 0 ||
        l.id === undefined
      ) {
        navigate("/");
      }
    })();
    /*  console.log("LoggedIn in useEffect MYPAGE");
    console.log(l); */
    console.log("l in useEffect MYPAGE");
    console.log(l);
  }, []);

  useEffect(() => {
    (async () => {
      let data = await (await fetch(`/api/users`)).json();
      if (data.message !== "No entries found") {
        let prevList = userList;
        setUserList(data);
      } else if (data.error === "No entries found") {
        console.log(userList);
      }
    })();
  }, []);

  useEffect(() => {
    (async () => {
      let data = await (await fetch(`/api/invitations-user`)).json();

      if (data.message !== "No entries found") {
        setInvitationList(invitationList, ...data);
      } else if (data.message === "No entries found") {
        setInvitationList(invitationList, []);
      }
    })();
  }, []);

  useEffect(() => {
    console.log("loggedIn.id in mypage", l.id);
    if (l.id !== 0 && l.id !== undefined)
      (async () => {
        let data = await (
          await fetch(`/api/conversations-by-user/${l.id}`)
        ).json();
        console.log("DATAin mypage");
        console.log(data);
        if (data.message !== "No entries found") {
          setConversationList(data);
        } else if (data.message === "No entries found") {
          setConversationList([]);
          console.log("Empty List");
        }
      })();
  }, []);

  return (
    <>
      <Header /* {...{ loggedIn, setLoggedIn }} */ />
      <Container fluid>
        <Row className='ms-2 mt-3 me-2 mb-3 pt-2'>
          <Col className='listContainer'>
            <InvitedToList
              invitationList={invitationList}
              setInvitationList={setInvitationList}
              invitationAnswer={invitationAnswer}
              setInvitationAnswer={setInvitationAnswer}
              /* {...{ loggedIn, setLoggedIn }} */
            />
          </Col>
        </Row>
        <Row></Row>
        <Row className='conversationUserListRow mb-3 pt-2 ms-2 me-2'>
          <Col xs={5} className='listContainer ps-1'>
            <UserList
              userList={userList}
              /*  loggedIn={loggedIn}
              setLoggedIn={setLoggedIn} */
            />
          </Col>
          <Col xs={5} className='listContainer ps-1'>
            <Col className='headlineContainer'>
              <h5 className='mt-2'>My conversation pits</h5>
            </Col>
            {conversationList.length === 0 && (
              <p className='mt-3'>No active conversations</p>
            )}
            {conversationList.length !== 0 && (
              <MyConversationPits
                conversationList={conversationList}
                setConversationList={setConversationList}
                /* {...{ loggedIn, setLoggedIn }} */
              />
            )}
          </Col>
        </Row>
        <Row className=' pt-2 mb-3 mt-3 ms-2 me-2'>
          <Col className='listContainer pt-2'>
            <CreateConversation
              conversationName={conversationName}
              setConversationName={setConversationName}
              /* {...{ loggedIn, setLoggedIn }} */
            />
          </Col>
        </Row>
      </Container>
    </>
  );
}

export default MyPage;
