import React from 'react'
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import { Logout } from './Logout';

const MenuBar = () => {
  return (
    <>
    <Navbar bg="dark" data-bs-theme="dark">
        <Container>
          <Nav className="me-auto">
          <Nav.Link href="home">Profile</Nav.Link>
            <Nav.Link href="postNotes">Post images</Nav.Link>
            <Nav.Link href="getNotes">View Posts</Nav.Link>
          </Nav>
        </Container>
        <Logout/>
      </Navbar>
    </>
  )
}

export default MenuBar