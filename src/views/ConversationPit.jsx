import React from "react";
import { useState, useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import {
  Container,
  Row,
  Col,
  Dropdown,
  ListGroup,
  Button,
  ButtonGroup
} from "react-bootstrap";
import MessageList from "../components/MessageList";
import MessageForm from "../components/MessageForm";
import Header from "../components/Header";
import Message from "../components/Message";
import NewMessage from "../components/NewMessage";
import "../../public/css/conversationPage.css";
import "../../public/css/MyPage.css";
import useStates from "../utilities/useStates.js";

function ConversationPit() {
  const location = useLocation();
  const { state } = location;
  const [messageList, setMessageList] = useState([]);
  const [newMessage, setNewMessage] = useState({});
  const [userList, setUserList] = useState([]);
  const [connected, setConnected] = useState([]);
  const [connectionMessage, setConnectionMessage] = useState([]);
  const [banInput, setBanInput] = useState([]);

  const ServicesRef = useRef(null);

  console.log(state);
  let l = useStates("loggedIn");
  let m = useStates("newMessage");

  useEffect(() => {
    if (l.id === 0 || !l.id) {
      (async () => {
        let data = await (await fetch(`/api/login`)).json();
        if (data.message !== "No entries found") {
          Object.assign(l, data);
        } else if (
          data.message === "No entries found" ||
          l.id === 0 ||
          l.id === undefined
        ) {
          navigate("/login");
        }
      })();
    }
  }, []);

  useEffect(() => {
    if (state.conversation.conversationId) {
      (async () => {
        let data = await (
          await fetch(
            `/api/conversation-messages/${state.conversation.conversationId}`
          )
        ).json();
        setMessageList([...data]);
      })();
    } else {
      console.log("No state.id");
    }
  }, []);

  useEffect(() => {
    if (state.conversation.conversationId) {
      (async () => {
        let data = await (
          await fetch(
            `/api/users-in-conversation/${state.conversation.conversationId}`
          )
        ).json();
        if (!data.error) {
          setUserList(data);
        }
      })();
    }
  }, []);

  useEffect(() => {
    console.log("Running useEffect newMessage");
    console.log(state.conversation.conversationId);
    if (state.conversation.conversationId === m.conversationId) {
      setMessageList(messageList => [...messageList, newMessage]);
      setNewMessage(m);
      console.log("newmessage");
      console.log(newMessage);
    }
  }, [m]);

  useEffect(() => {
    startSSE();
  }, []);

  useEffect(() => {
    gotoServices();
  }, []);
  let sse;
  function startSSE() {
    if (sse) {
      sse.close();
    }

    sse = new EventSource(`/api/sse/${state.conversation.conversationId}`);

    sse.addEventListener("connect", message => {
      let data = JSON.parse(message.data);
      setConnected([...connected, data.user]);
      setConnectionMessage(data.message);
      console.log(connected);
      console.log("[connect]", data);
    });
    sse.addEventListener("disconnect", message => {
      let data = JSON.parse(message.data);
      let filteredConnected = connected.filter(
        x => x.user.userId !== data.user.userId
      );
      setConnected(filteredConnected);
      console.log("[disconnect]", data);
      setConnectionMessage(data.message);
    });

    sse.addEventListener("new-message", message => {
      let data = JSON.parse(message.data);
      console.log("[new-message]", data);
      /* Object.assign(m, data); */
      m = data;
      console.log("m");
      console.log(m);
    });
  }
  console.log("connected");
  console.log(connected);

  function gotoServices() {
    window.scrollTo({
      top: ServicesRef.current.offsetTop,
      behavior: "smooth"
    });
  }

  async function banFromChat(users_conversationId) {
    if (l.role === "admin" || l.id === state.conversation.creatorId) {
      /*   await (
        await fetch(`/api/ban-from-chat/${users_conversationId}`, {
          method: "put",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            creatorId: state.conversation.creatorId,
            banReason: banInput
          })
        })
      ).json;
      console.log("BANNED"); */
    }
  }

  return (
    <>
      <Header />
      <Container>
        <Col className='conversationPitHeadline pt-2'>
          {state.conversation && <h5>{state.conversation.name}</h5>}
        </Col>
        <Row>
          <Col className='lg-1 md-1 xs-1'>
            <Row>
              <Dropdown>
                {userList.length !== 0 &&
                  userList.map((user, index) => (
                    <Dropdown.Item key={index}>
                      <Dropdown sm={3} as={ButtonGroup}>
                        <Button className='userNameDropdown-btn'>
                          {user.userName}
                        </Button>
                        <Dropdown.Toggle className='userNameDropdown-toggle custom-toggle'></Dropdown.Toggle>
                        <Dropdown.Menu>
                          <Dropdown.Item
                            onClick={banFromChat(user.users_conversationsId)}
                          >
                            Ban from chat
                          </Dropdown.Item>
                        </Dropdown.Menu>
                      </Dropdown>
                    </Dropdown.Item>
                  ))}
              </Dropdown>
            </Row>
            <Row>
              <Col className='xs-1'>
                <MessageForm state={state} />
              </Col>
            </Row>
          </Col>

          <Col
            /* sm={{ span: 6, offset: 3 }}
            lg={{ span: 4, offset: 4 }} */
            className='messageFormContainer mt-4 lg-10 xs-10'
          >
            <Row>
              <Col
                /* xs={{ span: 6, offset: 3 }} */ className='lg-10 xs-10 mt-2 mb-2'
              >
                <h3> {state.name}</h3>
              </Col>
            </Row>
            <Row>
              <Col className='messageListContainer mb-5 pt-2 pb-2'>
                <MessageList
                  messageList={messageList}
                  setMessageList={setMessageList}
                  state={state}
                />
              </Col>
            </Row>
            <Row>
              <Col ref={ServicesRef}>
                <NewMessage newMessage={newMessage} />
              </Col>
            </Row>
          </Col>
        </Row>
      </Container>
    </>
  );
}

export default ConversationPit;
