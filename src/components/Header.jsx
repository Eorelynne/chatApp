import React from "react";
import { useState, useEffect } from "react";
import {
  Nav,
  Navbar,
  NavDropdown,
  NavItem,
  Container,
  Row,
  Col
} from "react-bootstrap";
import useStates from "../utilities/useStates.js";
import { Link, useNavigate } from "react-router-dom";
import "../../public/css/header.css";

function Header(props) {
  // const { loggedIn, setLoggedIn } = props;
  const navigate = useNavigate();
  let l = useStates("loggedIn");
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    (async () => {
      let data = await (await fetch("/api/login")).json();
      if (data.message !== "No entries found" && !data.error) {
        // setLoggedIn({ data });
        // console.log(loggedIn);
        l = { ...data };
        console.log(l.id);
      }
    })();
  }, []);

  useEffect(() => {
    let x = !l.id || l.id === 0 ? false : true;
    console.log("X", x);
    console.log("L.id", l.id);
    setIsLoggedIn(x);
  }, [l.id]);

  async function logout() {
    let result = await (await fetch("/api/login", { method: "DELETE" })).json();
    console.log(result);
    l = {};
    navigate("/");
  }

  /* #255b9b" */
  return (
    <>
      <Navbar
        style={{ background: "#062E53" }}
        //bg='white'
        //fixed='top'
        className='navbar'
      >
        <Container fluid className='row'>
          <Col xs={2} style={{ color: "#e47521" }} className='pt-4'>
            {isLoggedIn && (
              <NavItem>
                <Nav.Link as={Link} to='/my-profile-page'>
                  {l.userName}
                </Nav.Link>
              </NavItem>
            )}
          </Col>
          <Col xs={8} className='logo-container'>
            <Container className='row'>
              <Navbar.Brand className='logo'>
                <Nav.Link as={Link} to='/'>
                  <img
                    alt='logo'
                    src='../../public/logo.png'
                    className='logo-img'
                  />
                </Nav.Link>
              </Navbar.Brand>
            </Container>
            <Container className='row nameContainer justify-content-center'>
              <Col>
                <h4>Conversation Pits</h4>
              </Col>
            </Container>
          </Col>
          <Col xs={1} className='dropdown-custom justify-content-end'>
            <Nav className='me-auto'>
              <img
                alt='hamburger'
                src='../../public/hamburger2.png'
                className='hamburger-img'
              />
              <NavDropdown id='basic-nav-dropdown' drop='start'>
                {!isLoggedIn && (
                  <NavDropdown.Item href='/login'>Login</NavDropdown.Item>
                )}
                {!isLoggedIn && (
                  <NavDropdown.Item href='/register'>Register</NavDropdown.Item>
                )}
                {isLoggedIn && (
                  <NavDropdown.Item href='/my-page'>My Page</NavDropdown.Item>
                )}
                {/* {isLoggedIn && ( */}
                <NavDropdown.Item onClick={logout}>Logout</NavDropdown.Item>
                {/* )} */}
                {isLoggedIn && (
                  <NavDropdown.Item href='/my-profile-page'>
                    My profile
                  </NavDropdown.Item>
                )}
                {isLoggedIn && l.role === "admin" && (
                  <NavDropdown.Item href='/admin-page'>Admin</NavDropdown.Item>
                )}
              </NavDropdown>
            </Nav>
          </Col>
        </Container>
      </Navbar>
    </>
  );
}

export default Header;
