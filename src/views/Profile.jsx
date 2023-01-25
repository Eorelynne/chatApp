import React from "react";
import { Container } from "react-bootstrap";
import ProfileForm from "../components/ProfileForm";
import Header from "../components/Header";

function Profile() {
  return (
    <>
      <Header />
      <Container>
        <ProfileForm />
      </Container>
    </>
  );
}

export default Profile;
