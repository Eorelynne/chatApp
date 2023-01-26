import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import InvitedConversation from "./InvitedConversation";
import "../../public/css/myPage.css";

function InvitedToList(props) {
  const {
    invitationList,
    setInvitationList,
    invitationAnswer,
    setInvitationAnswer
  } = props;

  return (
    <Container className='invitationsHeadline'>
      <Row className='mt-2'>
        <h5>Invitations</h5>
      </Row>
      <Row className='pb-1'>
        <Col xs={3} className='custom-label'>
          Conversation Pit
        </Col>
        <Col xs={3} className='custom-label'>
          Invited by
        </Col>
      </Row>
      <hr />
      {invitationList.length !== 0 && (
        <Container className='scrollContainer'>
          {invitationList.map((invitation, index) => (
            <InvitedConversation
              key={index}
              invitation={invitation}
              invitationAnswer={invitationAnswer}
              setInvitationAnswer={setInvitationAnswer}
              invitationList={invitationList}
              setInvitationList={setInvitationList}
            />
          ))}
        </Container>
      )}
      {invitationList.length === 0 && (
        <Col className='custom-label'>
          <p>No pending invitations</p>
        </Col>
      )}
    </Container>
  );
}

export default InvitedToList;
