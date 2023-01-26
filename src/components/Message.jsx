import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import useStates from "../utilities/useStates";
import "../../public/css/conversationPage.css";

function Message(props) {
  const { message, newMessage } = props;
  let l = useStates("loggedIn");

  return (
    <>
      {/*  {!!l.id && !!message.senderUserId && ( */}
      <Container>
        {!!message && (
          <Col
            /*  xs={8}
            sm={4} */
            className={
              l.id === message.senderUserId
                ? "sent-message message mt-2 col-md-4 col-8 ms-auto"
                : "recieved-message message mt-2 col-md-4 col-8 me-auto"
            }
          >
            <Row>
              <Col>
                <p>{new Date(message.time).toLocaleString()}</p>
              </Col>
            </Row>
            <Row>
              <Col>
                <p>{message.content}</p>
              </Col>
            </Row>
            <Row>
              <Col>
                <p>{message.userName}</p>
              </Col>
            </Row>
          </Col>
        )}
      </Container>
      {/* )} */}
    </>
  );
}

export default Message;
