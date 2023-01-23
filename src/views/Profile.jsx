import React from "react";
import { Container } from "react-bootstrap";
import ProfileForm from "../components/ProfileForm";
import Header from "../components/Header";

function Profile(props) {
  const { loggedIn, setLoggedIn } = props;
  return (
    <>
      <Header />
      <Container>
        <ProfileForm loggedIn={loggedIn} setLoggedIn={setLoggedIn} />
      </Container>
    </>
  );
}

export default Profile;
