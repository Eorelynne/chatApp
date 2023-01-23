import React from "react";
import { useEffect } from "react";
import { Container, Col } from "react-bootstrap";
import ConversationListItem from "./ConversationListItem";

import "../../public/css/myPage.css";

function MyConversationPits(props) {
  const { conversationList, setConversationList, loggedIn, setLoggedIn } =
    props;

  return (
    <>
      <Container className='scrollContainer'>
        <ul>
          {conversationList.map((conversation, index) => (
            <ConversationListItem
              key={index}
              conversation={conversation}
              {...{ loggedIn, setLoggedIn }}
            />
          ))}
        </ul>
      </Container>
    </>
  );
}

export default MyConversationPits;
