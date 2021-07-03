import React from "react";
import { connect } from "react-redux";
import { Container, Row, Col, Modal, Button } from "react-bootstrap";

import Keystore from "./Keystore";
import PrivateKey from "./PrivateKey";

import { PROJECT_NAME, DEFAULT_CHAIN_ID, MODE } from "../../helpers/constant";
import { initXdc3 } from "../../wallets/xinpay";
import { initWeb3 } from "../../wallets/metamask";

import * as actions from "../../actions";

import MetamaskIcon from "../../assets/img/wallets/metamask.webp";
import XinPayIcon from "../../assets/img/wallets/xinpay.png";
// import DCent from "../../assets/img/wallets/dcent.png";

import { toast } from "react-toastify";
// import { initDcent } from "../../wallets/dcentInAppBrowser";

const Provider = {
  menu: "menu",
  keystore: "keystore",
  privateKey: "privatekey",
};

const WalletProviders = [
  {
    name: "metamask",
    icon: MetamaskIcon,
    provider: initWeb3,
    rowClass: MODE === "offline" ? "disabled" : "",
  },
  {
    type: "menu",
    name: "xinpay",
    icon: XinPayIcon,
    provider: initXdc3,
    rowClass: MODE === "offline" ? "disabled" : "",
  },
  {
    type: "privatekey",
    name: "privatekey",
    icon: XinPayIcon,
    provider: () => {},
    rowClass: "",
  },
  {
    type: "keystore",
    name: "keystore",
    icon: XinPayIcon,
    provider: () => {},
    rowClass: "",
  },
  // {
  //   type: "menu",
  //   name: "Dcent ( coming soon )",
  //   icon: DCent,
  //   provider: initDcent,
  //   rowClass: "disabled",
  // },
];

class WalletConnect extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      showModal: false,
      providerSelected: Provider.menu,
    };
  }

  componentDidUpdate(prevProps) {
    if (
      prevProps.wallet.connected !== this.props.wallet.connected &&
      this.props.wallet.connected
    ) {
      this.setState({ showModal: false }, () => {
        toast("Wallet Connected", { autoClose: 2000 });
      });
    }
  }

  accountCallback = (loader) => (account) => {
    if (account === null)
      toast("error while loading wallet", { autoClose: 2000, type: "error" });
    else {
      this.props.WalletConnected({
        account,
        chain_id: this.props.wallet.chain_id,
        address: account.address,
        loader,
      });
      this.setState({ showModal: false, providerSelected: Provider.menu });
    }
  };

  RenderWalletProvider() {
    if (this.state.providerSelected === Provider.menu)
      return (
        <Container>
          <Row>
            {WalletProviders.map(({ name, icon, provider, type, rowClass }) => (
              <Col sm={12}>
                <Container>
                  <Row
                    className={rowClass}
                    onClick={async () => {
                      await provider();
                      if (this.state.providerSelected !== type)
                        this.setState({ providerSelected: type });
                    }}
                  >
                    <Col className="wallet-icon--wrapper" sm={2} lg={2} md={2}>
                      <div className="wallet-icon">
                        <img src={icon} alt={"logo"} />
                      </div>
                    </Col>
                    <Col
                      className="wallet-name-wrapper"
                      sm={10}
                      lg={10}
                      md={10}
                    >
                      <div className="wallet-name">{name}</div>
                    </Col>
                  </Row>
                </Container>
              </Col>
            ))}
          </Row>
        </Container>
      );

    if (this.state.providerSelected === Provider.keystore)
      return (
        <Container>
          <Row>
            <Keystore cb={this.accountCallback(Provider.keystore)} />
          </Row>
          <Row>
            <Button
              onClick={() => {
                this.setState({ providerSelected: Provider.menu });
              }}
            >
              Back
            </Button>
          </Row>
        </Container>
      );

    if (this.state.providerSelected === Provider.privateKey)
      return (
        <Container>
          <Row>
            <PrivateKey cb={this.accountCallback(Provider.privateKey)} />
          </Row>
          <Row>
            <Button
              onClick={() => {
                this.setState({ providerSelected: Provider.menu });
              }}
            >
              Back
            </Button>
          </Row>
        </Container>
      );
  }

  render() {
    const BTN_MSG = this.props.btnName || "CONNECT";
    const disabled = this.props.disabled || false;

    return (
      <div className="wallet-connect">
        <Button
          variant={this.props.variant || "primary"}
          onClick={() => this.setState({ showModal: true })}
          disabled={disabled}
        >
          {BTN_MSG}
        </Button>
        <Modal
          className="wallet-connect"
          show={this.state.showModal}
          onHide={() => this.setState({ showModal: false })}
        >
          <Modal.Header closeButton>
            <Modal.Title>{PROJECT_NAME}</Modal.Title>
          </Modal.Header>
          <Modal.Body>{this.RenderWalletProvider()}</Modal.Body>
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

export default connect(mapStateToProps, actions)(WalletConnect);
