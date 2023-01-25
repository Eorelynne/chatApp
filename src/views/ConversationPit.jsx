import React from "react";
import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { Container, Row, Col, Form, InputGroup, Button } from "react-bootstrap";
import MessageList from "../components/MessageList";
import MessageForm from "../components/MessageForm";
import Header from "../components/Header";
import Message from "../components/Message";
import NewMessage from "../components/NewMessage";
import "../../public/css/conversationPage.css";
import useStates from "../utilities/useStates.js";

function ConversationPit() {
  const location = useLocation();
  const { state } = location;
  const [messageList, setMessageList] = useState([]);
  const [newMessage, setNewMessage] = useState({});
  const [userList, setUserList] = useState([]);
  const [connected, setConnected] = useState([]);
  const [connectionMessage, setConnectionMessage] = useState([]);

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
    console.log("messageList.length", messageList.length);
  }, []);

  useEffect(() => {
    console.log("Running useEffect getting userList in conversationPit");
    console.log(state.conversation.conversationId);
    if (state.conversation.conversationId) {
      (async () => {
        let data = await (
          await fetch(
            `/api/users-in-conversation/${state.conversation.conversationId}`
          )
        ).json();
        console.log(data);
        if (!data.error) {
          setUserList(data);
        }
        for (let user of userList) {
          console.log("user");
          console.log(user);
        }
      })();
    }
  }, []);

  useEffect(() => {
    if (state.conversation.conversationId === m.conversationId) {
      setNewMessage(m);
    }
  }, [m]);

  useEffect(() => {
    startSSE();
  }, []);

  let sse;
  function startSSE() {
    if (sse) {
      sse.close();
    }

    sse = new EventSource(`/api/sse/${state.conversation.conversationId}`);

    sse.addEventListener("connect", message => {
      let data = JSON.parse(message.data);
      setConnected([...connected, ...data.user]);
      setConnectionMessage(data.message);
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
      Object.assign(m, data);
    });
  }

  return (
    <>
      <Header />
      <Container>
        <Row>
          <Col>
            <ul>
              {userList.length !== 0 &&
                userList.map((user, index) => (
                  <li key={index}>{user.userName}</li>
                ))}
            </ul>
          </Col>
        </Row>
      </Container>
      <Container
        sm={{ span: 6, offset: 3 }}
        lg={{ span: 4, offset: 4 }}
        className='messageFormContainer mt-4'
      >
        <Row>
          <Col xs={{ span: 6, offset: 3 }} className='mt-2 mb-2'>
            <h3> {state.name}</h3>
          </Col>
        </Row>
        <Container className='messageListContainer mb-5 pt-2 pb-2'>
          <Col>
            <MessageList
              messageList={messageList}
              setMessageList={setMessageList}
              state={state}
            />
          </Col>
          <Col>
            <NewMessage newMessage={newMessage} />
          </Col>
        </Container>
        <MessageForm state={state} />
      </Container>
    </>
  );
}

export default ConversationPit;
