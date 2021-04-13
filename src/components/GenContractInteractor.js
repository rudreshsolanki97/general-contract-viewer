import React, { Component } from "react";
import { Container, Row, Col, Modal, Button } from "react-bootstrap";
import _ from "lodash";

import FunctionCard from "./common/FunctionCard";
import AbiInput from "./common/AbiInput";
import AccordionWindow from "./common/AccordionWindow";

import DEFAULT_ABI from "../abi/Token.json";
import { PROJECT_NAME, CONTRACT_ADDRESS, IsJson } from "../helpers/constant";

const DEFAULT_ADDRESS = CONTRACT_ADDRESS.token;

class Dashboard extends Component {
  constructor(props) {
    super(props);

    this.state = {
      showModal: false,
      modalContent: "",

      contractAbi: DEFAULT_ABI,
      contractAddress: DEFAULT_ADDRESS,
    };

    this.setModalContent = this.setModalContent.bind(this);
    this.setShowModal = this.setShowModal.bind(this);

    this.setContractAbi = this.setContractAbi.bind(this);
    this.setContractAddress = this.setContractAddress.bind(this);
  }

  setShowModal() {
    this.setState({ showModal: true });
  }

  setModalContent(modalContent) {
    this.setState({ modalContent, showModal: true });
  }

  setContractAbi(abi) {
    if (typeof abi === "string") {
      if (!IsJson(abi)) {
        alert("Invalid JSON");
        return;
      }
      abi = JSON.parse(abi.trim());
    }
    this.setState({ contractAbi: abi });
  }

  setContractAddress(addr) {
    this.setState({ contractAddress: addr });
  }

  renderFunctionalityCards() {
    const cards = this.state.contractAbi;
    return cards
      .filter((e) => e.type === "function")
      .map(({ name, inputs = [], stateMutability }, i) => (
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
            setShowModal={this.setShowModal}
            setModalContent={this.setModalContent}
            abi={this.state.contractAbi}
            address={this.state.contractAddress}
          />
        </Col>
      ));
  }

  render() {
    return (
      <div className="main-panel general-contract-viewer">
        <Container>
          <Row>
            <AccordionWindow title="Enter Contract">
              <AbiInput
                setAbi={this.setContractAbi}
                setAddress={this.setContractAddress}
                abi={this.state.contractAbi}
                addr={this.state.contractAddress}
              />
            </AccordionWindow>
          </Row>
          <Row>{this.renderFunctionalityCards()}</Row>
        </Container>

        <Modal
          show={this.state.showModal}
          onHide={() => this.setState({ showModal: false })}
        >
          <Modal.Header closeButton>
            <Modal.Title>{PROJECT_NAME}</Modal.Title>
          </Modal.Header>
          <Modal.Body>{this.state.modalContent}</Modal.Body>
          <Modal.Footer>
            <Button
              variant="secondary"
              onClick={() => this.setState({ showModal: false })}
            >
              Close
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    );
  }
}

export default Dashboard;
