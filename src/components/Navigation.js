import React from "react";
import { Col, Container, Row } from "react-bootstrap";
import { Link } from "react-router-dom";

const PageNavigation = ({ links }) => {
  return (
    <div className="page-navigation">
      <Container>
        <Row>
          <Col>
            <div className="page-navigation__wrapper">
              {links.map(({ name, link }) => (
                <Link to={link}>{name}</Link>
              ))}
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default PageNavigation;
