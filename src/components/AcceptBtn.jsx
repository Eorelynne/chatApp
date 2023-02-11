import React from "react";
import { useState } from "react";
import { Button, Modal } from "react-bootstrap";
import "../../public/css/myPage.css";

function AcceptBtn(props) {
  const { invitation, invitationAnswer, setInvitationAnswer } = props;
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const handleClose = () => setShowModal(false);

  async function joinConversation() {
    let conversationData = { creatorId: invitation.creatorId };
    let conversationId = invitation.conversationId;
    console.log(invitation.creatorId, conversationId);
    let result = await (
      await fetch(`/api/conversations-join/${conversationId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(conversationData)
      })
    ).json;

    updateInvitation();
    setModalMessage("You joined the conversation");
    setShowModal(true);
    setInvitationAnswer(true);
  }

  async function updateInvitation() {
    await (
      await fetch(`/api/conversations-invite/${invitation.invitationId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ isInvitePending: false })
      })
    ).json;
  }

  return (
    <>
      <Button onClick={joinConversation} size='sm' className='accept-btn'>
        Join
      </Button>
      <Modal show={showModal} onHide={handleClose}>
        <Modal.Header></Modal.Header>
        <Modal.Body>
          <p className='custom-label'>{modalMessage}</p>
        </Modal.Body>
        <Modal.Footer>
          <Button className='custom-button' onClick={handleClose}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default AcceptBtn;
