import React from "react";
import { useEffect } from "react";
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

  useEffect(() => {
    (async () => {
      let data = await (await fetch(`/api/invitations-user`)).json();

      if (!data.error) {
        setInvitationList(data);
      }
    })();
  }, [invitationAnswer]);

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
      {invitationList && invitationList.length !== 0 && (
        <Container className='scroll-container invited-to-list'>
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
