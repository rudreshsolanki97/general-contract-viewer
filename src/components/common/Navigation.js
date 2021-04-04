import React, { useState } from "react";
import { Col, Container, Row } from "react-bootstrap";
import { Link } from "react-router-dom";

const PageNavigation = ({ links, active }) => {
  const [activePath, setactivePath] = useState(active);

  return (
    <div className="page-navigation">
      <Container>
        <Row>
          <Col>
            <div className="page-navigation__wrapper">
              {links.map(({ name, link }) => (
                <Link
                  className={link === activePath ? "active" : ""}
                  to={link}
                  onClick={() => setactivePath(link)}
                >
                  {name}
                </Link>
              ))}
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default PageNavigation;
