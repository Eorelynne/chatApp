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
  ButtonGroup,
  Modal,
  Form
} from "react-bootstrap";
import MessageList from "../components/MessageList";
import MessageForm from "../components/MessageForm";
import Header from "../components/Header";
import Message from "../components/Message";
/* import NewMessage from "../components/NewMessage"; */
import "../../public/css/conversationPage.css";
import "../../public/css/MyPage.css";
import useStates from "../utilities/useStates.js";

function ConversationPit() {
  const location = useLocation();
  const { state } = location;
  const [messageList, setMessageList] = useState([]);
  const [userList, setUserList] = useState([]);
  const [connected, setConnected] = useState([]);
  const [connectionMessage, setConnectionMessage] = useState([]);
  const [banInput, setBanInput] = useState("");
  const [showMessageModal, setShowMessageModal] = useState(false);
  const [showInputModal, setShowInputModal] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [activeUser, setActiveUser] = useState({});

  /* const ServicesRef = useRef(null); */

  //console.log(state);
  let l = useStates("loggedIn");
  let m = useStates("newMessage");

  /*  console.log("conversationPitL", l); */
  /*  useEffect(() => {
    if (!l.id || l.id === 0) {
      (async () => {
        let data = await (await fetch(`/api/login`)).json();
        if (!data.error) {
          Object.assign(l, data);
        } else if (data.error) {
          navigate("/");
        }
      })();
    }
  }, []); */

  useEffect(() => {
    if (state.conversation.conversationId) {
      (async () => {
        let data = await (
          await fetch(
            `/api/conversation-messages/${state.conversation.conversationId}`
          )
        ).json();
        if (!data.error) {
          setMessageList(data);
        }
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
          console.log("userList", userList);
          setUserList(data);
        }
      })();
    }
  }, []);
  let sse;

  useEffect(() => {
    startSSE();
    return () => {
      sse.close();
    };
  }, []);

  /* useEffect(() => {
    gotoServices();
  }, []); */
  function startSSE() {
    if (sse) {
      sse.close();
    }
    console.log(
      "state.conversation.conversationId",
      state.conversation.conversationId
    );
    sse = new EventSource(`/api/sse/${state.conversation.conversationId}`);

    sse.addEventListener("connect", message => {
      let data = JSON.parse(message.data);
      setConnected([...connected, data.user]);
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
      /* setConnectionMessage(data.message); */
    });
    sse.addEventListener("new-message", message => {
      let data = JSON.parse(message.data);
      console.log("[new-message]", data);
      /* Object.assign(m, data); */
      m.message = data;
      setMessageList(messageList => [...messageList, m.message]);
    });
  }
  console.log("connected");
  console.log(connected);

  const scrollToNewMessage = () => {
    document.getElementById("new-message:nth-last-child(1)").scrollIntoView();
  };
  /*  scrollToNewMessage(); */
  /* function gotoServices() {
    window.scrollTo({
      top: ServicesRef.current.offsetTop,
      behavior: "smooth"
    });
  } */
  function handleClose() {
    setShowMessageModal(false);
    setShowInputModal(false);
  }

  async function banFromChat(usersConversationsId, userRole, userId) {
    if (
      (l.role === "admin" && userRole !== "admin") ||
      (l.id === state.conversation.creatorId &&
        state.conversation.creatorId !== userId &&
        userRole !== "admin")
    ) {
      await (
        await fetch(`/api/ban-from-chat/${usersConversationsId}`, {
          method: "put",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            creatorId: state.conversation.creatorId,
            banReason: banInput,
            bannedUserRole: userRole
          })
        })
      ).json;
      setShowInputModal(false);
      setBanInput("");
    } else if (userRole === "admin") {
      setModalMessage("You can't ban admin");
      setShowMessageModal(true);
    } else {
      setShowInputModal(false);
      setModalMessage(
        "Only admin or conversation creator can ban from conversation"
      );
      setShowMessageModal(true);
    }
  }
  console.log("activeUser", activeUser);
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
                            onClick={() => {
                              setActiveUser(user);
                              setShowInputModal(true);
                            }}
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
            className='messageFormContainer mt-4 col-lg-10 col-sm-10'
          >
            <Row>
              <Col
                /* xs={{ span: 6, offset: 3 }} */ className='lg-10 xs-10 mt-2 mb-2'
              >
                <h3> {state.name}</h3>
              </Col>
            </Row>
            <Row id='newMessage'>
              <Col className='messageListContainer mb-5 pt-2 pb-2'>
                <MessageList
                  messageList={messageList}
                  setMessageList={setMessageList}
                  state={state}
                />
              </Col>
            </Row>
            {/*  <Row>
              <Col id='newMessage'  ref={ServicesRef} >
                <NewMessage newMessage={m.message} />
              </Col>
            </Row> */}
          </Col>
        </Row>
      </Container>
      <Modal show={showMessageModal} onHide={handleClose}>
        <Modal.Header></Modal.Header>
        <Modal.Body>
          <p className='custom-label'>{modalMessage}</p>
        </Modal.Body>
        <Modal.Footer>
          <Button className='custom-button' onClick={handleClose}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
      {Object.keys(activeUser).length !== 0 && (
        <Modal show={showInputModal} onHide={handleClose}>
          <Modal.Header></Modal.Header>
          <Modal.Body>
            <Form>
              <Form.Group>
                <Form.Label>Why are you banning this user?</Form.Label>
                <Form.Control
                  type='text'
                  id='banInput'
                  name='banInput'
                  value={banInput}
                  onChange={event => setBanInput(event.target.value)}
                />
                <Button
                  onClick={() => {
                    banFromChat(
                      activeUser.usersConversationsId,
                      activeUser.role,
                      activeUser.userId
                    );
                  }}
                >
                  Register ban
                </Button>
                <Button onClick={handleClose}>Cancel</Button>
              </Form.Group>
            </Form>
          </Modal.Body>
          {/*  <Modal.Footer>
          <Button className='custom-button' onClick={handleClose}></Button>
        </Modal.Footer> */}
        </Modal>
      )}
    </>
  );
}

export default ConversationPit;
