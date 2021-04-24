import React from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";

import { Navbar, Button, Col } from "react-bootstrap";

import BalanceModal from "./common/BalanceModal";
import { PROJECT_NAME } from "../helpers/constant";
import { initWeb3 } from "../wallets/metamask";
import WalletConnect from "./wallet-connect/walletConnect";

import GCVLogo from "../assets/img/brand/header-logo.png";

class Header extends React.Component {
  renderCurrentAddressBox() {
    if (this.props.wallet.connected === false) return "Not Connected";

    if (!this.props.balance) return "Loading";

    const balances = ["native", "token"];

    const resp = Object.keys(this.props.balance).reduce((acc, curr) => {
      if (balances.includes(curr)) {
        acc.push({ name: curr, balance: this.props.balance[curr] });
      }
      return acc;
    }, []);

    return (
      <>
        <Col lg={12} sm={12} md={12}>
          <BalanceModal data={[...resp]} />
        </Col>
      </>
    );
  }

  getWalletBtn() {
    let btnName = "CONNECT",
      disabled = false;

    if (this.props.wallet.connected && this.props.wallet.valid_network) {
      btnName = "WALLET CONNECTED";
      disabled = true;
    } else if (
      this.props.wallet.connected &&
      !this.props.wallet.valid_network
    ) {
      btnName = "INCORRECT NETWORK";
      disabled = true;
    }
    return (
      <div className="ml-auto">
        <WalletConnect disabled={disabled} btnName={btnName} />
      </div>
    );
  }

  render() {
    return (
      <Navbar className="custom-header" bg="light" expand="lg">
        <Link className="navbar-brand" to="/">
          <img src={GCVLogo} />
        </Link>

        {this.getWalletBtn()}
      </Navbar>
    );
  }
}

function mapStateToProps({ wallet, balance }) {
  return { wallet, balance };
}

export default connect(mapStateToProps)(Header);
