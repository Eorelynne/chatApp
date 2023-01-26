import React from "react";
import { useEffect } from "react";
import { Container, Col } from "react-bootstrap";
import ConversationListItem from "./ConversationListItem";
import useStates from "../utilities/useStates.js";

import "../../public/css/myPage.css";

function MyConversationPits(props) {
  const {
    conversationList,
    setConversationList,
    bannedFromList,
    setBannedFromList
  } = props;
  let m = useStates("newMessage");

  function sortOnConversationName(a, b) {
    const nameA = a.name.toLowerCase();
    const nameB = b.name.toLowerCase();
    if (nameA > nameB) {
      return 1;
    } else if (nameA < nameB) {
      return -1;
    }
    return 0;
  }

  /*   function sortOnLastActiveConversation(a, b) {
    const messageTimeA = a.;
    const messageTime = b.
}
   */

  return (
    <>
      <Container className='scrollContainer'>
        <ul>
          {conversationList &&
            conversationList.map((conversation, index) => (
              <ConversationListItem key={index} conversation={conversation} />
            ))}
        </ul>
        <ul>
          {bannedFromList &&
            bannedFromList.map((conversation, index) => (
              <ConversationListItem key={index} conversation={conversation} />
            ))}
        </ul>
      </Container>
    </>
  );
}

export default MyConversationPits;
