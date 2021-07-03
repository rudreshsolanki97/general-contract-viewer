import React, { Component } from "react";
import { Container, Row, Col, Modal, Button } from "react-bootstrap";
import _ from "lodash";
import { connect } from "react-redux";

import FunctionCard from "../common/FunctionCard";
import AbiInput from "../common/AbiInput";
import AccordionWindow from "../common/AccordionWindow";
import PageNavigation from "../common/Navigation";

import store from "../../redux/store";
import * as actions from "../../actions";

import PastEvents from "./PastEvents";

import DEFAULT_ABI from "../../abi/StorxToken.json";
import {
  PROJECT_NAME,
  CONTRACT_ADDRESS,
  IsJson,
  NETWORK_NAME,
  RPC_TO_NETWORK,
  HTTP_PROVIDER,
  NETWORK_ICON,
  MODE,
  LOADERS,
} from "../../helpers/constant";

const DEFAULT_ADDRESS = CONTRACT_ADDRESS.token;

const LINKS = [
  {
    name: "HOME",
    link: "home",
  },
  {
    name: "READ",
    link: "read",
  },
  {
    name: "WRITE",
    link: "write",
  },
  {
    name: "EVENTS",
    link: "events",
    disabled: MODE === "offline",
  },
];

class Dashboard extends Component {
  constructor(props) {
    super(props);

    this.state = {
      showModal: false,
      modalContent: "",

      contractAbi: DEFAULT_ABI,
      contractAddress: DEFAULT_ADDRESS,

      openTab: "home",
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

  renderNetworkSwitch() {
    const networks = Object.keys(HTTP_PROVIDER);

    const content = (
      <div className="wallet-connect">
        <Container>
          <Row>
            <Col className="u-text-center">CHOOSE NETWORK</Col>
          </Row>

          <br />

          <Row>
            {networks.map((x) => (
              <Col sm={12}>
                <Container>
                  <Row
                    onClick={async () => {
                      store.dispatch(actions.NetworkChanged(x));
                      this.setState({ showModal: false });
                    }}
                  >
                    <Col className="wallet-icon--wrapper" sm={2} lg={2} md={2}>
                      <div className="wallet-icon">
                        <img src={NETWORK_ICON[x]} alt={"logo"} />
                      </div>
                    </Col>
                    <Col
                      className="wallet-name-wrapper"
                      sm={10}
                      lg={10}
                      md={10}
                    >
                      <div className="wallet-name">{NETWORK_NAME[x]}</div>
                    </Col>
                  </Row>
                </Container>
              </Col>
            ))}
          </Row>
        </Container>
      </div>
    );

    this.setState({ modalContent: content, showModal: true });
  }

  renderFunctionalityCards(type = "read") {
    const cards = this.state.contractAbi;
    const mutability = {
      read: (x) => x === "view",
      write: (x) => x !== "view",
    };
    if (type !== "read") {
      if (!this.props.wallet.connected || !this.props.wallet.valid_network) {
        return (
          <div style={{ color: "white", textAlign: "center" }}>
            PLEASE CONNECT WALLET
          </div>
        );
      }
    }
    return (
      <Container>
        <Row>
          {cards
            .filter(
              (e) =>
                e.type === "function" && mutability[type](e.stateMutability)
            )
            .map(({ name, inputs = [], stateMutability }, i) => (
              <Col lg={6} key={i + 1 + type}>
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
            ))}
        </Row>
      </Container>
    );
  }

  renderContractInput() {
    return (
      <AccordionWindow title="Enter Contract" defActive={true}>
        <AbiInput
          setAbi={this.setContractAbi}
          setAddress={this.setContractAddress}
          abi={this.state.contractAbi}
          addr={this.state.contractAddress}
        />
      </AccordionWindow>
    );
  }

  renderDasboard() {
    switch (this.state.openTab) {
      case "home":
        return this.renderContractInput();
      case "read":
        return this.renderFunctionalityCards("read");
      case "write":
        return this.renderFunctionalityCards("write");
      case "events":
        return (
          <PastEvents
            abi={this.state.contractAbi}
            address={this.state.contractAddress}
            wallet={this.props.wallet}
          />
        );
      default:
        return this.renderContractInput();
    }
  }

  renderNetworkName() {
    if (
      !this.props.wallet.connected ||
      [LOADERS.Privatekey, LOADERS.Keystore].includes(this.props.wallet.loader)
    ) {
      const networkName =
        NETWORK_NAME[RPC_TO_NETWORK[this.props.wallet.provider]];
      return (
        <div
          className="network grey"
          onClick={() => this.renderNetworkSwitch()}
        >
          Default: {networkName}
        </div>
      );
    }
    if (!this.props.wallet.valid_network) {
      return (
        <div className="network red">invalid network connected</div>
      );
    }

    return (
      <div className="network green">
        {NETWORK_NAME[this.props.wallet.chain_id]}
      </div>
    );
  }

  render() {
    return (
      <div className="main-panel general-contract-viewer">
        <Container>
          <Row>
            <Col className="network-wrapper">{this.renderNetworkName()}</Col>
          </Row>
          <Row>
            <Col>
              <PageNavigation
                setactivePath={(x) => this.setState({ openTab: x })}
                activePath={this.state.openTab}
                links={LINKS}
              />
            </Col>
          </Row>

          <Row>
            <Col>{this.renderDasboard()}</Col>
          </Row>
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

function mapStateToProps({ wallet, balance }) {
  return { wallet, balance };
}

export default connect(mapStateToProps)(Dashboard);
