import React from "react";
import { useEffect, useState } from "react";
import { Container, Row, Col, Form } from "react-bootstrap";
import ConversationListItem from "./ConversationListItem";
import useStates from "../utilities/useStates.js";

import "../../public/css/myPage.css";

function AdminConversations(props) {
  const { conversationList, setConversationList } = props;

  function sortOnName(a, b) {
    const nameA = a.name.toLowerCase();
    const nameB = b.name.toLowerCase();
    if (nameA > nameB) {
      return 1;
    } else if (nameA < nameB) {
      return -1;
    }
    return 0;
  }

  return (
    <>
      <Container>
        <Row>
          <Col>
            <h5 className='mt-2 text-center custom-headline'>Conversations</h5>
          </Col>
        </Row>
      </Container>
      <Container className='scroll-container admin-conversation-list pt-1'>
        <ul className='pb-1'>
          {conversationList &&
            conversationList.length !== 0 &&
            conversationList
              .sort(sortOnName)
              .map((conversation, index) => (
                <ConversationListItem key={index} conversation={conversation} />
              ))}
        </ul>
      </Container>
    </>
  );
}

export default AdminConversations;
