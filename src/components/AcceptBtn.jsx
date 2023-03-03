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
    let result = await (
      await fetch(`/api/conversations-join/${conversationId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(conversationData)
      })
    ).json();
    if (!result.error) {
      await updateInvitation();
      setInvitationAnswer(!invitationAnswer);
    } else if (result.error == "Record already exist in database") {
      setModalMessage(
        "You can't join a conversation you are already in or have been banned from. Please decline."
      );
      setShowModal(true);
    } else {
      setModalMessage("Something went wrong");
      setShowModal(true);
    }
  }

  async function updateInvitation() {
    let result = await (
      await fetch(`/api/conversations-invite/${invitation.invitationId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ isInvitePending: false })
      })
    ).json();
    if (result.error) {
      setModalMessage("Something went wrong. Invite is still pending.");
      setShowModal(true);
    }
    return;
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
