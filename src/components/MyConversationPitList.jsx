import React from "react";
import { useEffect, useState } from "react";
import { Container, Row, Col, Form } from "react-bootstrap";
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
  const [filter, setFilter] = useState("");

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

  function sortOnLatestMessage(a, b) {
    const latestMessageTimeA = a.latestMessageTime;
    const latestMessageTimeB = b.latestMessageTime;
    if (
      latestMessageTimeA > latestMessageTimeB ||
      latestMessageTimeB === null
    ) {
      return -1;
    } else if (
      latestMessageTimeA < latestMessageTimeB ||
      latestMessageTimeA === null
    ) {
      return 1;
    }
    return 0;
  }

  function sortOnUsersLatestMessage(a, b) {
    const usersLastMessageTimeA = a.usersLastMessageTime;
    const usersLastMessageTimeB = b.usersLastMessageTime;
    if (
      usersLastMessageTimeA > usersLastMessageTimeB ||
      usersLastMessageTimeB === null
    ) {
      return -1;
    } else if (
      usersLastMessageTimeA < usersLastMessageTimeB ||
      usersLastMessageTimeA === null
    ) {
      return 1;
    }
    return 0;
  }

  return (
    <>
      <Row>
        <Col>
          <FilterForm filter={filter} setFilter={setFilter} />
        </Col>
      </Row>
      <Container className='scroll-container conversation-list'>
        <ul>
          {conversationList &&
            conversationList.length !== 0 &&
            conversationList
              .sort(eval(filter))
              .map((conversation, index) => (
                <ConversationListItem key={index} conversation={conversation} />
              ))}
        </ul>
        <ul>
          {bannedFromList &&
            bannedFromList !== 0 &&
            bannedFromList
              .sort(window[filter])
              .map((conversation, index) => (
                <ConversationListItem key={index} conversation={conversation} />
              ))}
        </ul>
      </Container>
    </>
  );
}

export default MyConversationPits;

function FilterForm(props) {
  const { filter, setFilter } = props;
  return (
    <Form>
      <Form.Group>
        <Form.Label>Filter</Form.Label>
        <Form.Select
          aria-label='Filter select '
          onChange={() => {
            console.log("Value", event.target.value);
            setFilter(event.target.value);
          }}
        >
          <option value='sortOnName'>Conversation name</option>
          <option value='sortOnLatestMessage'>Latest conversation</option>
          <option value='sortOnUsersLatestMessage'>My latest message</option>
        </Form.Select>
      </Form.Group>
    </Form>
  );
}
