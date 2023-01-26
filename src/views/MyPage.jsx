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

  let l = useStates("loggedIn");
  let m = useStates("newMessage");
  const navigate = useNavigate();
  const location = useLocation();
  const { state } = location;

  useEffect(() => {
    if (l.id === 0 || !l.id) {
      (async () => {
        let data = await (await fetch(`/api/login`)).json();
        if (!data.error) {
          Object.assign(l, data);
          l.loggedIn = true;
        } else if (data.error === "No entries found" || l.id === 0 || !l.id) {
          navigate("/");
        }
      })();
    }
  }, []);

  useEffect(() => {
    (async () => {
      let data = await (await fetch(`/api/user-get-users`)).json();
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

      if (!data.error) {
        setInvitationList(data);
      }
    })();
  }, []);

  useEffect(() => {
    console.log("running useEffect in Mypage - conversations");
    /* if (l.id !== 0 && l.id !== undefined) */ console.log(l.role);
    if (l.role === "admin") {
      (async () => {
        let data = await (await fetch(`/api/conversations`)).json();
        if (!data.error) {
          setConversationList(data);
        }
      })();
    } else
      (async () => {
        let data = await (await fetch(`/api/conversations-by-user`)).json();
        if (!data.error) {
          setConversationList(data);
        }
      })();
    let bannedList = conversationList.filter(x => x.isBanned);
    setBannedFromList(...bannedList);
    console.log(bannedFromList);
    let newConversationList = conversationList.filter(x => !x.isBanned);
    setConversationList(...newConversationList);
  }, []);

  useEffect(() => {
    (async () => {
      /*    for (let conversation of conversationList) { */
      /*  console.log("in myPage: ", conversation.conversationId); */
      let data = await (
        await fetch(`/api/conversation-latest-message/22`)
      ).json;
      //console.log(data);
      /* let latestMessage = {
          conversationId: data.conversationId,
          messageTime: data.latestMessageTime
        };
        console.log(latestMessage); 
      }*/
    })();
  }, [conversationList]);

  return (
    <>
      <Header />
      <Container>
        <Row className='mb-3 pt-2'>
          <Col className='listContainer m-2'>
            <InvitedToList
              invitationList={invitationList}
              setInvitationList={setInvitationList}
            />
          </Col>
        </Row>
        <Row gap={2} className='conversationUserListRow mb-3 pt-2'>
          <Col className='listContainer col-lg-4 col-sm-6'>
            <UserList userList={userList} />
          </Col>
          <Col className='listContainer col-lg-4 col-sm-6'>
            <h5 className='mt-2 text-center'>My conversation pits</h5>
            {!!conversationList && conversationList.length === 0 && (
              <p className='mt-3'>No active conversations</p>
            )}
            {!!conversationList && conversationList.length !== 0 && (
              <MyConversationPits
                conversationList={conversationList}
                setConversationList={setConversationList}
                bannedFromList={bannedFromList}
                setBannedFromList={setBannedFromList}
              />
            )}
          </Col>
          <Col className='listContainer pt-2 col-lg-4 col-sm-12'>
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
