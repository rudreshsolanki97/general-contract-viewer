import React, { Component } from "react";
import { Container, Row, Col } from "react-bootstrap";
import _ from "lodash";
import { connect } from "react-redux";

import cover from "../assets/img/cover.jpg";

class Dashboard extends Component {
  render() {
    return (
      <div className="main-panel dashboard">
        <Container>
          <Row>
            <Col lg={12} sm={12} md={12} className="boardroom__banner">
              MEDICI
            </Col>
          </Row>
        </Container>
      </div>
    );
  }
}

function mapStateToProps({ wallet, dashboard }) {
  return { wallet, dashboard };
}

export default connect(mapStateToProps)(Dashboard);
