import React from "react";
import { useState, useEffect } from "react";
import {
  Nav,
  Navbar,
  Dropdown,
  DropdownButton,
  NavItem,
  Container,
  Row,
  Col
} from "react-bootstrap";
import useStates from "../utilities/useStates.js";
import { Link, useNavigate } from "react-router-dom";
import "../../public/css/header.css";

function Header() {
  const navigate = useNavigate();
  let l = useStates("appState");

  /* useEffect(() => {
    (async () => {
      let data = await (await fetch("/api/login")).json();
      if (!data.error) {
        l = data;
        console.log("i header", l.id);
      }
    })();
  }, []); */

  async function logout() {
    let result = await (await fetch("/api/login", { method: "DELETE" })).json();
    console.log(result);
    for (let key in l.loggedIn) {
      delete l.loggedIn[key];
    }
    navigate("/");
  }
  if (l.loggedIn?.id !== 0)
    return (
      <Navbar style={{ background: "#062E53" }} className='navbar'>
        <Container fluid className='row'>
          <UsernameDisplay />
          <LogoContainer />
          <LoggedInDropdown />
        </Container>
      </Navbar>
    );
  else if (!l.loggedIn.id || l.loggedIn.id === 0)
    return (
      <Navbar style={{ background: "#062E53" }} className='navbar'>
        <Container fluid className='row'>
          <Col xs={2} style={{ color: "#e47521" }} className='pt-4' />
          <LogoContainer />
          <LoggedOutDropdown />
        </Container>
      </Navbar>
    );
  else return null;

  return (
    <>
      <Navbar style={{ background: "#062E53" }} className='navbar'>
        <Container fluid className='row'>
          {l.loggedIn.id !== 0 && <UsernameDisplay />}
          <LogoContainer />
          {(!l.loggedIn.id || l.loggedIn.id === 0) && <LoggedOutDropdown />}
          {(l.loggedIn.id || l.loggedIn.id !== 0) && <LoggedInDropdown />}
        </Container>
      </Navbar>
    </>
  );

  function UsernameDisplay() {
    return (
      <Col xs={2} style={{ color: "#e47521" }} className='pt-4'>
        <NavItem>{l.loggedIn.userName}</NavItem>
      </Col>
    );
  }

  function LoggedInDropdown() {
    return (
      <Col xs={1} className='dropdown-custom justify-content-end'>
        <Nav className='me-auto'>
          <Dropdown id='dropdown-basic-button' drop='start'>
            <h1>
              <Dropdown.Toggle className='btn-custom' id='dropdown-basic'>
                ...
              </Dropdown.Toggle>
            </h1>
            <Dropdown.Menu>
              {l.loggedIn.role && l.loggedIn.role === "user" && (
                <Dropdown.Item as={Link} to='/my-page'>
                  My Page
                </Dropdown.Item>
              )}
              {l.loggedIn.role && l.loggedIn.role === "admin" && (
                <Dropdown.Item as={Link} to='/admin'>
                  Admin
                </Dropdown.Item>
              )}
              <Dropdown.Item onClick={logout}>Logout</Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </Nav>
      </Col>
    );
  }
  function LoggedOutDropdown() {
    return (
      <Col xs={1} className='dropdown-custom justify-content-end'>
        <Nav className='me-auto'>
          <Dropdown id='dropdown-custom-button' drop='start'>
            <Dropdown.Toggle
              className='btn-custom'
              id='dropdown-basic'
            ></Dropdown.Toggle>
            <Dropdown.Menu>
              <Dropdown.Item as={Link} to='/login'>
                Login
              </Dropdown.Item>
              <Dropdown.Item as={Link} to='/register'>
                Register
              </Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </Nav>
      </Col>
    );
  }
  function LogoContainer() {
    return (
      <Col xs={8} className='logo-container'>
        <Container className='row'>
          <Navbar.Brand className='logo'>
            <Nav.Link as={Link} to='/'>
              <img alt='logo' src='/logo.png' className='logo-img' />
            </Nav.Link>
          </Navbar.Brand>
        </Container>
        <Container className='row nameContainer justify-content-center'>
          <Col>
            <h4>Conversation Pits</h4>
          </Col>
        </Container>
      </Col>
    );
  }
}

export default Header;
