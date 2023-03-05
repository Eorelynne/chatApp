import React from "react";
import { Row, Col } from "react-bootstrap";
import AcceptBtn from "./AcceptBtn";
import DeclineBtn from "./DeclineBtn";

function InvitedConversation(props) {
  const {
    invitation,
    index,
    invitationList,
    setInvitationList,
    invitationAnswer,
    setInvitationAnswer
  } = props;

  return (
    <Row>
      <Col className='custom-text col-4 invitation-item'>
        <p>{invitation.conversationName}</p>
      </Col>
      <Col className='custom-text col-4 invitation-item'>
        {invitation.creatorUserName}
      </Col>

      <Col className='custom-text col-2 p-0'>
        <AcceptBtn
          invitation={invitation}
          invitationAnswer={invitationAnswer}
          setInvitationAnswer={setInvitationAnswer}
        />
      </Col>
      <Col className='custom-text col-2 p-0'>
        <DeclineBtn
          invitation={invitation}
          invitationAnswer={invitationAnswer}
          setInvitationAnswer={setInvitationAnswer}
        />
      </Col>
      <hr className='mt-1 mb-1' />
    </Row>
    /* </Container> */
  );
}

export default InvitedConversation;
