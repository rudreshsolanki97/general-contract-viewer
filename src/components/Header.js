import React from "react";
import { Navbar } from "react-bootstrap";

import { Link } from "react-router-dom";

function Header() {
  return (
    <Navbar className="custom-header" bg="light" expand="lg">
      <Link className="navbar-brand" to="/raw-tx">
        Contract Viewer
      </Link>
      <Navbar.Toggle aria-controls="basic-navbar-nav" />
      <Navbar.Collapse id="basic-navbar-nav"></Navbar.Collapse>
    </Navbar>
  );
}

export default Header;
