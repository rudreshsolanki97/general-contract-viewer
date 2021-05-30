import React, { Component } from "react";
import { Container, Row, Col } from "react-bootstrap";

import { GetPastEvents } from "../../wallets";

class PastEvents extends Component {
  constructor(props) {
    super(props);

    this.state = {
      data: [],
    };

    this.loaded = false;
  }

  renderReturnValues(returnValues) {
    return (
      <Container>
        {Object.keys(returnValues)
          .filter((x) => isNaN(x))
          .map((v, i) => (
            <Row key={i} style={{ textAlign: "left" }}>
              <Col lg={4}>{v}</Col>
              <Col lg={8}>{returnValues[v]}</Col>
            </Row>
          ))}
      </Container>
    );
  }

  componentDidMount() {
    this.getEvents();
  }

  componentDidUpdate() {
    if ((this.loaded = false)) {
      this.getEvents();
    }
  }

  getEvents() {
    if (this.props.wallet.connected && this.props.wallet.valid_network)
      GetPastEvents(this.props.abi, this.props.address).then((x) => {
        this.setState({ data: x });
        this.loaded = true;
      });
  }

  renderEvents() {
    return (
      <Container className="past-events">
        <Row className="header" key={0}>
          <Col lg={3}>TX HASH</Col>
          <Col lg={3}>EVENT NAME</Col>
          <Col lg={6}>RETURN VALUES</Col>
        </Row>
        {this.state.data
          .sort(({ blockNumber: a }, { blockNumber: b }) => b - a)
          .map((v, i) => (
            <Row className="event-row" key={i + 1}>
              <Col lg={3}>
                <a
                  target="_blank"
                  href={`${this.props.wallet.explorer}/tx/${v.transactionHash}`}
                >
                  HASH
                </a>
              </Col>
              <Col lg={3}>{v.event}</Col>
              <Col lg={6}>{this.renderReturnValues(v.returnValues)}</Col>
            </Row>
          ))}
      </Container>
    );
  }

  render() {
    if (this.props.wallet.connected && this.props.wallet.valid_network) {
      return (
        <div style={{ color: "white", textAlign: "center" }}>
          {this.renderEvents()}
        </div>
      );
    } else
      return (
        <div style={{ color: "white", textAlign: "center" }}>
          PLEASE CONNECT WALLET
        </div>
      );
  }
}

export default PastEvents;
