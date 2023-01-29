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
      <Container>
        <Row>
          <Col>
            <h5 className='mt-2 text-center custom-headline'>
              My Conversations
            </h5>
          </Col>
        </Row>
        <Row>
          <Col className='col-lg-10 col-sm-10'>
            <FilterForm filter={filter} setFilter={setFilter} />
          </Col>
        </Row>
      </Container>
      <Container className='scroll-container conversation-list pt-1'>
        <ul>
          {conversationList &&
            conversationList.length !== 0 &&
            conversationList
              .sort(eval(filter))
              .map((conversation, index) => (
                <ConversationListItem key={index} conversation={conversation} />
              ))}
        </ul>
        {bannedFromList && bannedFromList !== 0 && (
          <BannedFromListItems bannedFromList={bannedFromList} />
        )}
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
        <Form.Label className='custom-label'>Filter</Form.Label>
        <Form.Select
          className='custom-text'
          aria-label='Filter select '
          onChange={() => {
            console.log("Value", event.target.value);
            setFilter(event.target.value);
          }}
        >
          <option value='sortOnName'>Choose filter</option>
          <option value='sortOnName'>Conversation name</option>
          <option value='sortOnLatestMessage'>Latest conversation</option>
          <option value='sortOnUsersLatestMessage'>My latest message</option>
        </Form.Select>
      </Form.Group>
    </Form>
  );
}

function BannedFromListItems(props) {
  const { bannedFromList } = props;

  return (
    <Col>
      <hr />
      <h5 className='custom-headline'>Banned from</h5>
      <ul>
        {bannedFromList.map((conversation, index) => (
          <li key={index}>
            <p className='custom-text'>{conversation.name}</p>
          </li>
        ))}
      </ul>
    </Col>
  );
}
