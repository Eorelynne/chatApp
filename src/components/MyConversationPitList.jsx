import React from "react";
import { useState } from "react";
import { Container, Row, Col, Form, InputGroup } from "react-bootstrap";
import ConversationListItem from "./ConversationListItem";
import { Filter } from "react-bootstrap-icons";
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
    const latestUserMessageA = a.latestUserMessage;
    const latestUserMessageB = b.latestUserMessage;
    if (
      latestUserMessageA > latestUserMessageB ||
      latestUserMessageB === null
    ) {
      return -1;
    } else if (
      latestUserMessageA < latestUserMessageB ||
      latestUserMessageA === null
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
        {!!conversationList && conversationList.length === 0 && (
          <p className='custom-label text-center mt-3'>
            No active conversations
          </p>
        )}
        <ul className='ps-3'>
          {conversationList &&
            conversationList.length !== 0 &&
            conversationList
              .sort(eval(filter))
              .map((conversation, index) => (
                <ConversationListItem key={index} conversation={conversation} />
              ))}
        </ul>
      </Container>
      <hr />
      <Container className='scroll-container banned-list'>
        {bannedFromList && bannedFromList.length !== 0 && (
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
    <InputGroup className='mb-3'>
      <InputGroup.Text id='basic-addon1'>
        <Filter size={10} className='filter-icon' />
      </InputGroup.Text>
      <Form.Select
        className='custom-text'
        size='sm'
        aria-label='Filter select '
        onChange={() => {
          setFilter(event.target.value);
        }}
      >
        <option value='sortOnName'>Choose filter</option>
        <option value='sortOnName'>Conversation name</option>
        <option value='sortOnLatestMessage'>Latest conversation</option>
        <option value='sortOnUsersLatestMessage'>My latest message</option>
      </Form.Select>
    </InputGroup>
  );
}

function BannedFromListItems(props) {
  const { bannedFromList } = props;

  return (
    <Col>
      <h5 className='custom-label'>Banned from</h5>
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
