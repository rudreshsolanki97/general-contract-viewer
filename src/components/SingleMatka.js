import React from "react";
import { Container, Row, Col, Modal, Button } from "react-bootstrap";
import { connect } from "react-redux";
import {
  CONTRACT_ADDRESS,
  RemoveMultiplier,
  TIMER_FORMAT,
} from "../helpers/constant";
import { SubmitContractTxGeneral, GetNativeBalance } from "../wallets/metamask";
import FunctionCard from "./common/FunctionCard";
import Timer from "./common/Timer";
import _ from "lodash";

const KeyFieldView = ({ k, v }) => (
  <Row>
    <Col className="key" sm={6} md={6} lg={6}>
      {k}
    </Col>
    <Col className="value" sm={6} md={6} lg={6}>
      {v}
    </Col>
  </Row>
);

class SingleMatka extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      showModal: false,
      modalContent: "",
      allowance: null,
    };

    this.setModalContent = this.setModalContent.bind(this);
    this.setShowModal = this.setShowModal.bind(this);
  }

  componentDidMount() {
    this.getAllowance();
    this.getEarning();
  }

  componentDidUpdate(prevProps) {
    if (this.props.wallet.address !== prevProps.wallet.address) {
      this.getAllowance();
      this.getEarning();
    }
  }

  getEarning() {
    SubmitContractTxGeneral(
      "pendingBalance",
      "matka",
      "view",
      this.props.wallet.address
    )
      .then((resp) => {
        console.log("yyy", resp);
        this.setState({ earning: resp });
      })
      .catch((e) => console.log(e));
  }

  getAllowance() {
    SubmitContractTxGeneral(
      "allowance",
      "token",
      "view",
      this.props.wallet.address,
      CONTRACT_ADDRESS.matka
    )
      .then((resp) => {
        this.setState({ allowance: resp });
      })
      .catch((e) => console.log(e));
  }

  setShowModal() {
    this.setState({ showModal: true });
  }

  setModalContent(modalContent) {
    this.setState({ modalContent, showModal: true });
  }

  renderAllMatkaDetails() {
    if (!this.props.matkaDetails.currentPool) return "";
    return (
      <Container>
        {Object.keys(this.props.matkaDetails.currentPool)
          .map((k) => {
            return { k, v: this.props.matkaDetails.currentPool[k] };
          })
          .map((x) => KeyFieldView(x))}
      </Container>
    );
  }

  renderCurrentPool() {
    if (!this.props.matkaDetails.currentPool) return "";
    return (
      <Container>
        {KeyFieldView({
          k: `Can Bet `,
          v: `${
            this.props.matkaDetails.poolActive &&
            new Date().getTime() <
              this.props.matkaDetails.currentPool.endTime * 1000
          }`,
        })}
        {KeyFieldView({
          k: `Pool Number`,
          v: `${this.props.matkaDetails.currentPool.poolId}`,
        })}
        {KeyFieldView({
          k: "Total Amount In Pool",
          v: RemoveMultiplier(
            this.props.matkaDetails.currentPool.totalPoolAmount
          ),
        })}
        {KeyFieldView({
          k: `Bet End In (${TIMER_FORMAT})`,
          v: (
            <Timer
              startDate={new Date().getTime()}
              endDate={this.props.matkaDetails.currentPool.endTime * 1000}
            />
          ),
        })}
      </Container>
    );
  }

  renderApprove() {
    const input = {
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
    };
    return (
      <FunctionCard
        title={input.name}
        key={1}
        contractType="token"
        inputs={input.inputs.map((e) => {
          if (_.isEmpty(e.name)) {
            e.name = e.type;
          }
          const q = { name: e.name, type: "text" };
          if (e.name === "spender") {
            q.disabled = true;
            q.value = CONTRACT_ADDRESS.matka;
          }
          return { ...q };
        })}
        stateMutability={input.stateMutability}
        setShowModal={this.setShowModal}
        setModalContent={this.setModalContent}
      />
    );
  }

  renderBet() {
    const input = {
      inputs: [
        {
          internalType: "uint256",
          name: "amount",
          type: "uint256",
        },
        {
          internalType: "uint256",
          name: "number",
          type: "uint256",
        },
      ],
      name: "bid",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    };
    return (
      <FunctionCard
        title={input.name}
        key={0}
        contractType="matka"
        inputs={input.inputs.map((e) => {
          if (_.isEmpty(e.name)) {
            e.name = e.type;
          }
          const q = { name: e.name, type: "text" };
          if (e.name === "amount") {
            q.defaultValue = RemoveMultiplier(this.state.allowance);
          }
          return { ...q };
        })}
        stateMutability={input.stateMutability}
        setShowModal={this.setShowModal}
        setModalContent={this.setModalContent}
      />
    );
  }

  renderClaimReward() {
    const input = {
      inputs: [],
      name: "withrawRewards",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    };
    return (
      <>
        <FunctionCard
          title={input.name}
          key={0}
          contractType="matka"
          inputs={input.inputs.map((e) => {
            if (_.isEmpty(e.name)) {
              e.name = e.type;
            }
            const q = { name: e.name, type: "text" };
            return { ...q };
          })}
          stateMutability={input.stateMutability}
          setShowModal={this.setShowModal}
          setModalContent={this.setModalContent}
        />
        <div className="u-float-r earning">
          Earning&nbsp;:&nbsp;{this.state.earning} Token
        </div>
      </>
    );
  }

  renderFunc() {
    if (this.state.allowance === null) return "loading";
    if (this.state.allowance == 0) return this.renderApprove();
    return this.renderBet();
  }

  render() {
    return (
      <div className="single-matka">
        <Container>
          <Row>
            <Col lg={6} sm={12} md={6} className="single-matka-section left">
              <div className="single-matka-section--title">Matka Details</div>
              <div className="single-matka-section--body">
                {this.renderClaimReward()}
              </div>
            </Col>
            <Col lg={6} sm={12} md={6} className="single-matka-section">
              <div className="single-matka-section--title">BET</div>
              <div className="single-matka-section--body">
                {this.renderFunc()}
              </div>
            </Col>
          </Row>
        </Container>

        <Modal
          show={this.state.showModal}
          onHide={() => this.setState({ showModal: false })}
        >
          <Modal.Header closeButton>
            <Modal.Title>MATKA</Modal.Title>
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

function mapStateToProps({ wallet }) {
  return { wallet };
}

export default connect(mapStateToProps)(SingleMatka);
