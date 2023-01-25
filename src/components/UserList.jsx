import React from "react";
import { useEffect, useState } from "react";
import { Container, Row, Col } from "react-bootstrap";
import useStates from "../utilities/useStates";
import User from "../components/User";

import "../../public/css/myPage.css";

function UserList(props) {
  const { userList } = props;
  const [loggedInConversationList, setLoggedInConversationList] = useState([]);
  let l = useStates("loggedIn");
  const [filter, setFilter] = useState("");

  useEffect(() => {
    if (l.id === 0 || !l.id) {
      (async () => {
        let data = await (await fetch("/api/login")).json();
        if (data.message !== "No entries found" && !data.error) {
          Object.assign(l, data);
          console.log("In useEffect in userList");
          console.log(l);
        }
      })();
    }
  }, []);

  useEffect(() => {
    if (l.id !== 0 && l.id !== undefined) {
      (async () => {
        let data = await (
          await fetch(`/api/conversation-by-creator/${l.id}`)
        ).json();
        console.log(data);
        setLoggedInConversationList([...data]);
      })();
      for (let conversation of loggedInConversationList) {
        console.log(conversation);
      }
    } else {
      console.log("No loggedIn.id in userList");
    }
  }, []);

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
      <Row>
        <Col>
          <input
            id='filter'
            name='filter'
            type='text'
            value={filter}
            onChange={event => setFilter(event.target.value)}
          />
        </Col>
      </Row>
      <Row>
        <Col className='mt-2 headlineContainer'>
          <h5>Users</h5>
        </Col>
      </Row>
      <Container className='userList scrollContainer pt-1'>
        <ul>
          {userList
            .filter(
              userItem =>
                userItem.userName.toLowerCase() !== l.userName.toLowerCase()
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
              />
            ))}
        </ul>
      </Container>
    </>
  );
}

export default UserList;
