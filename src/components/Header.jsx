import React from "react";
import { useState, useEffect } from "react";
import { Nav, Navbar, NavDropdown, Container, Row, Col } from "react-bootstrap";
import useStates from "../assets/helpers/useStates.js";
import { Link, useNavigate } from "react-router-dom";
import "../../public/css/header.css";

function Header(props) {
  const { loggedIn, setLoggedIn } = props;
  const navigate = useNavigate();
  //let l = useStates("loggedIn");
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    let x = !loggedIn.id || loggedIn.id === 0 ? false : true;
    setIsLoggedIn(x);
  }, [loggedIn.id]);

  async function logout() {
    let result = await (await fetch("/api/login", { method: "DELETE" })).json();
    console.log(result);
    setLoggedIn({});
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
            {loggedIn.id !== 0 && <h3>{loggedIn.userName}</h3>}
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
                src='../../public/hamburger.png'
                className='hamburger-img'
              />
              <NavDropdown id='basic-nav-dropdown' drop='start'>
                <NavDropdown.Item>
                  <Nav.Link as={Link} to='/login'>
                    Login
                  </Nav.Link>
                </NavDropdown.Item>
                <NavDropdown.Item>
                  <Nav.Link as={Link} to='/register'>
                    Register
                  </Nav.Link>
                </NavDropdown.Item>
                <NavDropdown.Item>
                  <Nav.Link as={Link} to='/my-page'>
                    My page
                  </Nav.Link>
                </NavDropdown.Item>
                <NavDropdown.Item>
                  <Nav.Link onClick={logout}>Logout</Nav.Link>
                </NavDropdown.Item>
              </NavDropdown>
            </Nav>
          </Col>
        </Container>
      </Navbar>
    </>
  );
}

export default Header;
