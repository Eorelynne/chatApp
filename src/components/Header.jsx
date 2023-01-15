import React from "react";
import { Nav, Navbar, Container } from "react-bootstrap";
import { Link } from "react-router-dom";
import NavDropdown from "react-bootstrap/NavDropdown";

function Header() {
  return (
    <div>
      <Navbar style={{ background: "white" }} expand='lg' className='navbar'>
        <Container fluid className='row'>
          <Container className='col-2 ms-1'>
            <Nav className='me-auto'>
              <Nav.Item>
                <Nav.Link as={Link} to='/login'>
                  Login
                </Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link as={Link} to='/register'>
                  Register
                </Nav.Link>
              </Nav.Item>
            </Nav>
          </Container>
          <Container className='col-4'>
            <Navbar.Brand>
              <Nav.Link as={Link} to='/'>
                Logo
                {/* <img alt="" src="../images/logo.svg" className="logo-img" /> */}
              </Nav.Link>
            </Navbar.Brand>
          </Container>
        </Container>
      </Navbar>
    </div>
  );
}

export default Header;
