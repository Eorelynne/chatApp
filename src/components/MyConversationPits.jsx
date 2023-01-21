import React from "react";
import { useEffect } from "react";
import { Container, Col } from "react-bootstrap";
import ConversationListItem from "./ConversationListItem";

import "../../public/css/myPage.css";

function MyConversationPits(props) {
  const { conversationList, setConversationList } = props;

  /* useEffect(() => {
    (async () => {
      let data = await (await fetch(`/api/conversation-messages/:id`)).json();
      setConversationList([conversationList, ...data]);
    })();
  });*/

  return (
    <>
      <Container className='scrollContainer'>
        <ul>
          {conversationList.map((conversation, index) => (
            <ConversationListItem key={index} conversation={conversation} />
          ))}
        </ul>
      </Container>
    </>
  );
}

export default MyConversationPits;
