import React, { Component } from "react";
import { Container, Row, Col } from "react-bootstrap";
import _ from "lodash";

import FunctionCard from "./FunctionCard";

import { GetFunctionSignature } from "../helpers/AbiParser";

import BoardRoomAbi from "../abi/boardroom.json";

class Dashboard extends Component {
  renderFunctionalityCards() {
    const cards = GetFunctionSignature(BoardRoomAbi);
    return cards.map(({ name, inputs = [], stateMutability }, i) => (
      <Col lg={6} key={i + 1}>
        <FunctionCard
          title={name}
          inputs={inputs.map((e) => {
            if (_.isEmpty(e.name)) {
              e.name = e.type;
            }
            return { name: e.name, type: "text" };
          })}
          stateMutability={stateMutability}
        />
      </Col>
    ));
  }

  render() {
    return (
      <div className="main-panel">
        <Container>
          <Row>{this.renderFunctionalityCards()}</Row>
        </Container>
      </div>
    );
  }
}

export default Dashboard;
