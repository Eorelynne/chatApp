import React from "react";
import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
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

import "../../public/css/conversationPage.css";
import "../../public/css/MyPage.css";
import useStates from "../utilities/useStates.js";

function ConversationPit() {
  const location = useLocation();
  const { state } = location;
  const [messageList, setMessageList] = useState([]);
  const [userList, setUserList] = useState([]);
  const [connectionMessage, setConnectionMessage] = useState("");
  const [banInput, setBanInput] = useState("");
  const [showMessageModal, setShowMessageModal] = useState(false);
  const [showInputModal, setShowInputModal] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [activeUser, setActiveUser] = useState({});
  const navigate = useNavigate();

  //console.log(state);
  let l = useStates("appState");
  /* let m = useStates("newMessage"); */

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
      setMessageList([]);
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
  let sse;

  useEffect(() => {
    startSSE();
    return () => {
      sse.close();
    };
  }, []);

  function startSSE() {
    if (sse) {
      sse.close();
    }

    sse = new EventSource(`/api/sse/${state.conversation.conversationId}`);

    sse.addEventListener("connect", message => {
      let data = JSON.parse(message.data);
      setConnectionMessage(data.message);

      console.log("[connect]", data);
    });
    sse.addEventListener("disconnect", message => {
      let data = JSON.parse(message.data);
      setConnectionMessage(data.message);
      console.log("[disconnect]", data);
    });
    sse.addEventListener("new-message", message => {
      let data = JSON.parse(message.data);
      console.log("[new-message]", data);
      l.loggedIn.message = data;
      setMessageList(messageList => [...messageList, l.loggedIn.message]);
    });
  }

  function handleClose() {
    setShowMessageModal(false);
    setShowInputModal(false);
  }

  async function banFromChat(usersConversationsId, userRole, userId) {
    if (
      (l.loggedIn.role === "admin" && userRole !== "admin") ||
      (+l.loggedIn.id === +state.conversation.creatorId &&
        +state.conversation.creatorId !== +userId &&
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
              <Col>
                <h5>Members</h5>
              </Col>
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
          </Col>

          <Col
            /* sm={{ span: 6, offset: 3 }}
            lg={{ span: 4, offset: 4 }} */
            className='messageFormContainer mt-4 col-lg-10 col-sm-10 col-8'
          >
            <Row>
              <Col
              /* className='col-lg-10 xs-10 mt-2 mb-2' */
              >
                <h3> {state.name}</h3>
              </Col>
            </Row>
            <Row>
              <Col className='messageListContainer mb-5 pt-2 pb-2 col-xs-10'>
                <DisplayConnected
                  connectionMessage={connectionMessage}
                  setConnectionMessage={setConnectionMessage}
                />
                <MessageList
                  messageList={messageList}
                  setMessageList={setMessageList}
                  state={state}
                />
              </Col>
            </Row>
          </Col>
        </Row>
        <Row className=''>
          <Col className='col-xs-3 col-sm-3 col-md-2 col-lg-2'>
            <MessageForm state={state} />
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

function DisplayConnected(props) {
  const { connectionMessage, setConnectionMessage } = props;
  return (
    <>
      <p>{connectionMessage}</p>
    </>
  );
}
