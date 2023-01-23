import React from "react";
import { useEffect, useState } from "react";
import { Container, Row, Col } from "react-bootstrap";
import useStates from "../../src/assets/helpers/useStates";
import User from "../components/User";

import "../../public/css/myPage.css";

function UserList(props) {
  const { userList, loggedIn, setLoggedIn } = props;
  const [loggedInConversationList, setLoggedInConversationList] = useState([]);
  //let l = useStates("loggedIn");
  //console.log("loggedIn");
  // console.log(l);

  useEffect(() => {
    if (loggedIn.id !== 0 && loggedIn.id !== undefined) {
      (async () => {
        let data = await (
          await fetch(`/api/conversation-by-creator/${loggedIn.id}`)
        ).json();
        setLoggedInConversationList([loggedInConversationList, ...data]);
      })();
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
        <Col className='mt-2 headlineContainer'>
          <h5>Users</h5>
        </Col>
      </Row>
      <Container className='userList scrollContainer pt-1'>
        <ul>
          {userList.sort(sortOnUserName).map((userItem, index) => (
            <User
              key={index}
              {...{ userItem }}
              loggedInConversationList={loggedInConversationList}
              setLoggedInConversationList={setLoggedInConversationList}
              loggedIn={loggedIn}
              setLoggedIn={setLoggedIn}
            />
          ))}
        </ul>
      </Container>
    </>
  );
}

export default UserList;
