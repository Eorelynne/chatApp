import React from "react";
import { useEffect, useState } from "react";
import { Container, Row, Col, Form, InputGroup } from "react-bootstrap";
import useStates from "../utilities/useStates";
import User from "../components/User";
import { Search } from "react-bootstrap-icons";
import "../../public/css/myPage.css";

function UserList(props) {
  const { userList, isNewConversation, setIsNewConversation } = props;
  const [loggedInConversationList, setLoggedInConversationList] = useState([]);
  const [isInvitationSent, setIsInvitationSent] = useState(false);
  let l = useStates("appState");
  const [filter, setFilter] = useState("");

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
  }, [isInvitationSent, isNewConversation]);

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
            <InputGroup className='mb-3'>
              <InputGroup.Text id='basic-addon1'>
                <Search size={10} className='search-icon' />
              </InputGroup.Text>
              <Form.Control
                type='text'
                id='filter'
                name='filter'
                size='sm'
                value={filter}
                onChange={event => setFilter(event.target.value)}
              />
            </InputGroup>
          </Col>
        </Row>
      </Container>
      <Container className='user-list scroll-container pt-1'>
        <ul className='ms-2 ps-4'>
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
