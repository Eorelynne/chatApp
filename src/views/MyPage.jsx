import React from "react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import useStates from "../assets/helpers/useStates.js";
import { Container, Row, Col, Modal } from "react-bootstrap";
import Header from "../components/Header";
import InvitedToList from "./../components/InvitedToList";
import MyConversationPits from "./../components/MyConversationPits";
import UserList from "./../components/UserList";
import CreateConversation from "../components/CreateConversation";

import "../../public/css/myPage.css";

function MyPage(props) {
  const [conversationName, setConversationName] = useState("");
  const [userList, setUserList] = useState([]);
  const [conversationList, setConversationList] = useState([]);
  const [invitationList, setInvitationList] = useState([]);
  const [invitationAnswer, setInvitationAnswer] = useState(false);
  let l = useStates("loggedIn");
  const navigate = useNavigate();

  useEffect(() => {
    (async () => {
      if (l.id === 0) {
        /*      let data = await (await fetch(`/api/login`)).json();
        if (data.message !== "No entries found") {
          l = { ...data };
        } else if (data.error === "No entries found")  { */
        navigate("/");
        /*  } */
      }
    })();
  }, []);

  useEffect(() => {
    (async () => {
      let data = await (await fetch(`/api/users`)).json();
      if (data.message !== "No entries found") {
        let prevList = userList;
        prevList.push(...data);
        setUserList([...prevList]);
      } else if (data.error === "No entries found") {
        setUserList(userList, []);
      }
    })();
  }, []);

  useEffect(() => {
    (async () => {
      let data = await (await fetch(`/api/invitations-user`)).json();

      if (data.message !== "No entries found") {
        setInvitationList([invitationList, ...data]);
      } else if (data.error === "No entries found") {
        setInvitationList(invitationList, []);
      }
    })();
  }, []);

  useEffect(() => {
    (async () => {
      console.log("userid", l.id);
      let data = await (
        await fetch(`/api/conversations-by-user/${l.id}`)
      ).json();
      console.log(data);
      if (data.message === "No entries found") {
        console.log("Empty List");
        return;
      }
      setConversationList([conversationList, ...data]);
    })();
    if (conversationList.length !== 0) {
      for (let conversation of conversationList) {
        console.log(conversation);
      }
    }
  }, []);

  return (
    <>
      <Header />
      <Container fluid>
        <Row className='ms-2 mt-3 me-2 mb-3 pt-2'>
          <Col className='listContainer'>
            <InvitedToList
              invitationList={invitationList}
              setInvitationList={setInvitationList}
              invitationAnswer={invitationAnswer}
              setInvitationAnswer={setInvitationAnswer}
            />
          </Col>
        </Row>
        <Row></Row>
        <Row className='conversationUserListRow mb-3 pt-2 ms-2 me-2'>
          <Col xs={5} className='listContainer ps-1'>
            <UserList userList={userList} />
          </Col>
          <Col xs={5} className='listContainer ps-1'>
            <h5>My conversation pits</h5>
            {conversationList.length === 0 && <p>No active conversations</p>}
            {conversationList.length !== 0 && (
              <MyConversationPits
                conversationList={conversationList}
                setConversationList={setConversationList}
              />
            )}
          </Col>
        </Row>
        <Row className=' pt-2 mb-3 mt-3 ms-2 me-2'>
          <Col className='listContainer pt-2'>
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
