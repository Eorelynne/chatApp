import React from "react";
import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Container,
  Row,
  Col,
  Dropdown,
  //ListGroup,
  Button,
  ButtonGroup,
  Modal,
  Form
} from "react-bootstrap";
import MessageList from "../components/MessageList";
import MessageForm from "../components/MessageForm";
import Header from "../components/Header";
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
  const [messageDeleted, setMessageDeleted] = useState(false);
  const navigate = useNavigate();

  let l = useStates("appState");

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
  }, [messageDeleted]);

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
    });
    sse.addEventListener("disconnect", message => {
      let data = JSON.parse(message.data);
      setConnectionMessage(data.message);
    });
    sse.addEventListener("new-message", message => {
      let data = JSON.parse(message.data);
      l.loggedIn.message = data;
      setMessageList(messageList => [...messageList, l.loggedIn.message]);
    });
  }

  function handleClose() {
    setShowMessageModal(false);
    setShowInputModal(false);
  }

  async function banFromChat(activeUser) {
    if (
      (l.loggedIn.role === "admin" && activeUser.role !== "admin") ||
      (+l.loggedIn.id === +state.conversation.creatorId &&
        activeUser.role !== "admin")
    ) {
      let result = await (
        await fetch(`/api/ban-from-chat/${activeUser.usersConversationsId}`, {
          method: "put",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            creatorId: state.conversation.creatorId,
            banReason: banInput,
            bannedUserRole: activeUser.role,
            conversationId: activeUser.conversationId,
            userId: activeUser.userId
          })
        })
      ).json();
      setShowInputModal(false);
      setBanInput("");
      if (!result.error) {
        setModalMessage(activeUser.userName + " is banned from chat");
        setShowMessageModal(true);
      } else if (result.error === "You can't ban yourself") {
        setModalMessage(result.error);
        setShowMessageModal(true);
      } else {
        setModalMessage("Something went wrong");
        setShowMessageModal(true);
      }
    } else if (activeUser.role === "admin") {
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
        <Row>
          <Col className='conversationPitHeadline mb-3 pt-2 col-12'>
            {state.conversation && (
              <h5 className='custom-headline'>{state.conversation.name}</h5>
            )}
          </Col>
        </Row>
        <Row className='ms-1 me-1'>
          <Col className='col-md-2 col-12 me-1 mb-2'>
            <h5 className='custom-label'>Members</h5>
            <ul>
              {userList.length !== 0 &&
                userList.map((user, index) => (
                  <li key={index}>
                    <Dropdown size='sm' as={ButtonGroup}>
                      <Dropdown.Toggle className='userNameDropdown-toggle custom-toggle'></Dropdown.Toggle>
                      <Button className='userNameDropdown-btn custom-text'>
                        {user.userName}
                      </Button>
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
                  </li>
                ))}
            </ul>
          </Col>
          <Col
            xs={12}
            md={8}
            className='messageListContainer mb-5 pt-2 pb-2 ps-0 pe-0 '
          >
            <Col className='pt-2'>
              <DisplayConnected
                connectionMessage={connectionMessage}
                setConnectionMessage={setConnectionMessage}
              />
            </Col>
            <Col>
              <MessageList
                messageList={messageList}
                setMessageList={setMessageList}
                messageDeleted={messageDeleted}
                setMessageDeleted={setMessageDeleted}
                state={state}
              />
            </Col>
          </Col>
        </Row>
        <Row className='d-flex justify-content-center'>
          <Col className='col-xs-12 col-sm-12 col-md-10 col-lg-10'>
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
                    banFromChat(activeUser);
                  }}
                >
                  Register ban
                </Button>
                <Button onClick={handleClose}>Cancel</Button>
              </Form.Group>
            </Form>
          </Modal.Body>
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
      <p className='custom-label text-center'>{connectionMessage}</p>
    </>
  );
}
