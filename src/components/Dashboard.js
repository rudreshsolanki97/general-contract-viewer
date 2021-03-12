import React, { Component } from "react";
import { Container, Row, Col, Modal, Button } from "react-bootstrap";
import _ from "lodash";
import Switch from "react-switch";
import { connect } from "react-redux";

import { SwitchStyle2 } from "./Switch";
import FunctionCard from "./FunctionCard";
import DataCard from "./DataCard";

import {
  GetFunctionSignature,
  GetFunctionSignatureAll,
  GetRewardFunc,
} from "../helpers/AbiParser";
import BoardRoomAbi from "../abi/boardroom.json";

class Dashboard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showAllFunction: false,
      walletConnected: false,
      showApprove: false,
      showModal: false,
      modalContent: "",
    };

    this.setModalContent = this.setModalContent.bind(this);
    this.setShowModal = this.setShowModal.bind(this);
  }

  setShowModal() {
    this.setState({ showModal: true });
  }

  setModalContent(modalContent) {
    this.setState({ modalContent, showModal: true });
  }

  renderAllFunc() {
    const cards = [...GetFunctionSignatureAll(BoardRoomAbi)];
    return cards.map(({ name, inputs = [], stateMutability }, i) => (
      <Col key={i + 1} lg={6} md={6} sm={6}>
        <FunctionCard
          title={name}
          inputs={inputs.map((e) => {
            if (_.isEmpty(e.name)) {
              e.name = e.type;
            }
            return { name: e.name, type: "text" };
          })}
          stateMutability={stateMutability}
          setModalContent={this.setModalContent}
        />
      </Col>
    ));
  }

  renderStakeFunc() {
    const cards = [...GetFunctionSignature(BoardRoomAbi)];

    if (this.state.showApprove) {
      cards.splice(0, 0, {
        inputs: [
          {
            internalType: "address",
            name: "spender",
            type: "address",
          },
          {
            internalType: "uint256",
            name: "amount",
            type: "uint256",
          },
        ],
        name: "approve",
        outputs: [
          {
            internalType: "bool",
            name: "",
            type: "bool",
          },
        ],
        stateMutability: "nonpayable",
        type: "function",
      });
    }

    return cards.map(({ name, inputs = [], stateMutability }, i) => (
      <FunctionCard
        title={name}
        key={i + 1}
        inputs={inputs.map((e) => {
          if (_.isEmpty(e.name)) {
            e.name = e.type;
          }
          return { name: e.name, type: "text" };
        })}
        stateMutability={stateMutability}
        setShowModal={this.setShowModal}
        setModalContent={this.setModalContent}
      />
    ));
  }

  renderClaimRewardFunc() {
    const cards = [...GetRewardFunc(BoardRoomAbi)];
    return cards.map(({ name, inputs = [], stateMutability }, i) => (
      <FunctionCard
        title={name}
        key={i + 1}
        inputs={inputs.map((e) => {
          if (_.isEmpty(e.name)) {
            e.name = e.type;
          }
          return { name: e.name, type: "text" };
        })}
        stateMutability={stateMutability}
        setShowModal={this.setShowModal}
        setModalContent={this.setModalContent}
      />
    ));
  }

  renderCurrentAddressBox() {
    return (
      <>
        <Col lg={12} sm={12} md={12} className="current-address top-row">
          <div className="current-address--wrapper">
            <div className="current-address--wrapper__label">
              Current Address
            </div>
            <div className="current-address--wrapper__address">
              {this.props.wallet.address}
            </div>
          </div>
        </Col>
        <Col lg={12} sm={12} md={12} className="address-balance top-row">
          <Row className="address-balance--wrapper">
            <Col
              className="address-balance--wrapper__title"
              lg={12}
              md={12}
              sm={12}
            >
              Balances
            </Col>
            <Col lg={8} md={8} sm={8}>
              <b>Cash</b>
            </Col>
            <Col lg={4} md={4} sm={4}>
              {this.props.dashboard.cash}
            </Col>
            <Col lg={8} md={8} sm={8}>
              <b>share</b>
            </Col>
            <Col lg={4} md={4} sm={4}>
              {this.props.dashboard.share}
            </Col>
            <Col lg={8} md={8} sm={8}>
              <b>stake</b>
            </Col>
            <Col lg={4} md={4} sm={4}>
              {this.props.dashboard.stake}
            </Col>
          </Row>
        </Col>
      </>
    );
  }

  render() {
    return (
      <div className="main-panel dashboard">
        <Container>
          <Row>{this.renderCurrentAddressBox()}</Row>

          <Row>
            <Col lg={12} sm={12} md={12} className="epoch">
              <DataCard title="Current Epoch">
                <div className="epoch--count">{this.props.dashboard.epoch}</div>
                <div className="epoch--timer"></div>
              </DataCard>
            </Col>
          </Row>

          <Row>
            <Col lg={6} sm={6} md={6} className="staked-share">
              <DataCard title="Staked Shares">
                <div className="staked-share--amount">
                  {this.props.dashboard.stake}
                </div>
              </DataCard>
            </Col>
            <Col lg={6} sm={6} md={6} className="staked-share-usd">
              <DataCard title="Reward Per Share">
                <div className="staked-share-usd--amount">
                  {this.props.dashboard.rewardPerShare}
                </div>
              </DataCard>
            </Col>
          </Row>

          <Row></Row>

          <Row>
            <Col lg={6} sm={6} md={6}>
              <div className="claim-reward">
                <Row>
                  <Col className="claim-reward--title" lg={12} sm={12} md={12}>
                    Claim Rewards
                  </Col>

                  <Col
                    lg={12}
                    sm={12}
                    md={12}
                    className="stake-func--approved-amount"
                  >
                    Earned: xx
                  </Col>
                </Row>

                <Row>
                  <Col>{this.renderClaimRewardFunc()}</Col>
                </Row>
              </div>
            </Col>

            <Col lg={6} sm={6} md={6}>
              <div className="stake-func">
                <Row>
                  <Col className="stake-func--title" lg={12} sm={12} md={12}>
                    Stake
                  </Col>

                  <Col
                    lg={12}
                    sm={12}
                    md={12}
                    className="stake-func--approved-amount"
                  >
                    Appoved Amount: {this.props.dashboard.cashAllowance} Cash
                  </Col>

                  <Col
                    lg={12}
                    sm={12}
                    md={12}
                    className="stake-func--approved-amount"
                  >
                    Staked Balance: {this.props.dashboard.share} Share
                  </Col>

                  <br />

                  <Col
                    lg={12}
                    sm={12}
                    md={12}
                    className="stake-func--approved-amount"
                  >
                    <Switch
                      className="act-btn"
                      {...SwitchStyle2}
                      onChange={(showApprove) => this.setState({ showApprove })}
                      checked={this.state.showApprove}
                    />
                    Show Approve:&nbsp;&nbsp;&nbsp;
                  </Col>
                </Row>
                <Row>
                  <Col>{this.renderStakeFunc()}</Col>
                </Row>
              </div>
            </Col>
          </Row>

          <br />

          <Row>
            <Col lg={12} sm={12} md={12} className="show-all-func">
              <Switch
                className="act-btn"
                {...SwitchStyle2}
                onChange={(showAllFunction) =>
                  this.setState({ showAllFunction })
                }
                checked={this.state.showAllFunction}
              />
              Show Contract Interface:&nbsp;&nbsp;&nbsp;
            </Col>
          </Row>

          <br />

          <Row>{this.state.showAllFunction ? this.renderAllFunc() : ""}</Row>
        </Container>

        <Modal
          show={this.state.showModal}
          onHide={() => this.setState({ showModal: false })}
        >
          <Modal.Header closeButton>
            <Modal.Title>Contract Viewer</Modal.Title>
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

function mapStateToProps({ wallet, dashboard }) {
  return { wallet, dashboard };
}

export default connect(mapStateToProps)(Dashboard);
