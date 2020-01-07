import React from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";

const Nav = styled.nav`
  position: fixed;
  left: 0;
  right: 0;
  top: 0;
  padding: 0.5rem 1rem;
  display: flex;
`;

function MyHeader() {
  return (
    <Nav className="nav">
      <div className="nav-inner">
        <div className="nav-items">
          {/* <Link to="/" className="nav-logo">
            <strong className="header-title">Echo Yang</strong>
          </Link> */}
        </div>
        <div className="nav-items nav-items-right">
          <Link to="/" className="nav-item nav-link">
            Coloooor
          </Link>
          <Link to="/about" className="nav-item nav-link">
            About
          </Link>
        </div>
      </div>
    </Nav>
  );
}

export default MyHeader;
