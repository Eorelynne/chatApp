import React from "react";
import { Nav, Navbar, NavDropdown, Container, Row, Col } from "react-bootstrap";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars } from "@fortawesome/free-solid-svg-icons";
import "../../public/css/header.css";

function Header() {
  const navigate = useNavigate();

  async function logout() {
    let result = await (await fetch("/api/login", { method: "DELETE" })).json();
    console.log(result);
    navigate("/");
  }

  const user = {
    userName: "pelle1"
  };

  return (
    <div>
      <Navbar
        style={{ background: "#255b9b" }}
        expand={false}
        //bg='white'
        //fixed='top'
        //collapseOnSelect
        className='navbar'
      >
        <Container fluid className=''>
          <Row>
            <Col xs={4}>{user.userName}</Col>
            <Col xs={4}>
              <Navbar.Brand className='logo'>
                <Nav.Link as={Link} to='/'>
                  Logo
                  {/*<img alt="" src="../images/logo.svg" className="logo-img" /> */}
                </Nav.Link>
              </Navbar.Brand>
            </Col>
            <Col xs={4} className='dropdown-custom'>
              <Nav className='me-auto'>
                <NavDropdown id='basic-nav-dropdown'>
                  {/*  <FontAwesomeIcon icon='fa-regular fa-bars' /> */}
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
                    <Nav.Link onClick={logout}>Logout</Nav.Link>
                  </NavDropdown.Item>
                </NavDropdown>
              </Nav>
            </Col>
          </Row>
        </Container>
      </Navbar>
    </div>
  );
}

export default Header;
