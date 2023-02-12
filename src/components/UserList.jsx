import React from "react";
import { useEffect, useState } from "react";
import { Container, Row, Col, Form } from "react-bootstrap";
import useStates from "../utilities/useStates";
import User from "../components/User";

import "../../public/css/myPage.css";

function UserList(props) {
  const { userList } = props;
  const [loggedInConversationList, setLoggedInConversationList] = useState([]);
  const [isInvitationSent, setIsInvitationSent] = useState(false);
  let l = useStates("appState");
  const [filter, setFilter] = useState("");

  /*  useEffect(() => {
    if (l.id === 0 || !l.id) {
      (async () => {
        let data = await (await fetch("/api/login")).json();
        if (!data.error) {
          Object.assign(l, data);
          l.loggedIn = true;
        }
      })();
    }
  }, []); */

  useEffect(() => {
    if (l.loggedIn.id && l.loggedIn.id !== 0) {
      (async () => {
        let data = await (
          await fetch(`/api/conversation-by-creator/${l.loggedIn.id}`)
        ).json();
        if (!data.error) {
          setLoggedInConversationList(data);
        }
      })();
    }
  }, [isInvitationSent]);

  function sortOnUserName(a, b) {
    const userNameA = a.userName.toLowerCase();
    const userNameB = b.userName.toLowerCase();
    if (userNameA > userNameB) {
      return 1;
    } else if (userNameA < userNameB) {
      return -1;
    }
    return 0;
  }

  return (
    <>
      <Container>
        <Row>
          <Col className='mt-2 headlineContainer'>
            <h5 className='custom-headline'>Users</h5>
          </Col>
        </Row>
        <Row>
          <Col className=' col-lg-10 col-sm-10'>
            <Form>
              <Form.Group>
                <Form.Label className='custom-label'>Search</Form.Label>
                <Form.Control
                  type='text'
                  id='filter'
                  name='filter'
                  value={filter}
                  onChange={event => setFilter(event.target.value)}
                />
              </Form.Group>
            </Form>
          </Col>
        </Row>
      </Container>
      <Container className='user-list scroll-container pt-1'>
        <ul>
          {userList
            .filter(
              userItem =>
                userItem.userName.toLowerCase() !==
                l.loggedIn.userName.toLowerCase()
            )
            .sort(sortOnUserName)
            .filter(
              userItem =>
                userItem.userName
                  .toLowerCase()
                  .startsWith(filter.toLowerCase()) || filter === ""
            )
            .map((userItem, index) => (
              <User
                key={index}
                {...{ userItem }}
                loggedInConversationList={loggedInConversationList}
                setLoggedInConversationList={setLoggedInConversationList}
                isInvitationSent={isInvitationSent}
                setIsInvitationSent={setIsInvitationSent}
              />
            ))}
        </ul>
      </Container>
    </>
  );
}

export default UserList;
