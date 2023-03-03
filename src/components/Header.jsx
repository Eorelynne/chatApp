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

  /*  useEffect(() => {
    if (l.loggedIn.id === 0 || !l.loggedIn.id) {
      (async () => {
        let data = await (await fetch("/api/login")).json();
        if (!data.error) {
          l.loggedIn.id = data.id;
          l.loggedIn.firstName = data.firstName;
          l.loggedIn.lastName = data.lastName;
          l.loggedIn.userName = data.userName;
          l.loggedIn.email = data.email;
          l.loggedIn.role = data.role;
        }
      })();
    }
  }, []); */

  async function logout() {
    let result = await (await fetch("/api/login", { method: "DELETE" })).json();
    for (let key in l.loggedIn) {
      delete l.loggedIn[key];
    }
    navigate("/");
  }
  if (l.loggedIn?.id !== 0)
    return (
      <Navbar
        style={{ background: "#062E53" }}
        className='navbar d-flex justify-content-evenly mb-2 pe-0'
      >
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
        <Container
          fluid
          className='row d-flex justify-content-evenly mb-2 pe-0'
        >
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
      <Col
        xs={2}
        style={{ color: "#e47521" }}
        className='pt-4 ps-0 pe-0 user-name-display'
      >
        <NavItem className='custom-label'>{l.loggedIn.userName}</NavItem>
      </Col>
    );
  }

  function LoggedInDropdown() {
    return (
      <Col xs={2} className='dropdown-custom '>
        <Nav className='me-auto d-flex justify-content-end '>
          <Dropdown id='dropdown-custom-btn' drop='start'>
            <Dropdown.Toggle className='btn-custom' id='dropdown-basic'>
              <h1 className='header-btn-txt'> ...</h1>
            </Dropdown.Toggle>
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
      <Col xs={2} className='dropdown-custom justify-content-end'>
        <Nav className='me-auto d-flex justify-content-end '>
          <Dropdown id='dropdown-custom-btn' drop='start'>
            <Dropdown.Toggle className='btn-custom' id='dropdown-basic'>
              <h1 className='header-btn-txt'>...</h1>
            </Dropdown.Toggle>
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
      <Row className='col-7 logo-container ps-0 pe-0'>
        <Col className='col-12'>
          <Navbar.Brand className='logo'>
            <Nav.Link as={Link} to='/'>
              <img
                alt='logo'
                src='/logo.png'
                className='logo-img d-inline-block align-top'
              />
            </Nav.Link>
          </Navbar.Brand>
        </Col>
        <Col className='col-12 custom-headline nameContainer text-center'>
          Conversation Pits
        </Col>
      </Row>
    );
  }
}

export default Header;
