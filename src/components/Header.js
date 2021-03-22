import React from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";

import { Navbar, Button, Col, Container, Row } from "react-bootstrap";

import BalanceModal from "./modal/BalanceModal";

class Header extends React.Component {
  renderCurrentAddressBox() {
    return (
      <>
        <Col lg={12} sm={12} md={12}>
          <BalanceModal
            data={[
              { name: "test", balance: 1 },
              { name: "test", balance: 1 },
              { name: "test", balance: 1 },
              { name: "test", balance: 1 },
            ]}
          />
        </Col>
      </>
    );
  }

  getWalletBtn() {
    if (this.props.wallet.connected && this.props.wallet.valid_network) {
      return (
        <>
          <div className="ml-auto">{this.renderCurrentAddressBox()}</div>
          <div className="">
            <Button disabled={true} aria-controls="basic-navbar-nav">
              WALLET CONNECTED
            </Button>
          </div>
        </>
      );
    } else if (
      this.props.wallet.connected &&
      !this.props.wallet.valid_network
    ) {
      return (
        <>
          {/* <div className="ml-auto">{this.renderCurrentAddressBox()}</div> */}
          <div className="ml-auto">
            <Button disabled={true} aria-controls="basic-navbar-nav">
              INCORRECT NETWORK
            </Button>
          </div>
        </>
      );
    } else {
      <div className="ml-auto">
        <Button disabled={true} aria-controls="basic-navbar-nav">
          CONNECT WALLET
        </Button>
      </div>;
    }
  }

  render() {
    return (
      <Navbar className="custom-header" bg="light" expand="lg">
        <Link className="navbar-brand" to="/">
          MEDICI
        </Link>

        {this.getWalletBtn()}
      </Navbar>
    );
  }
}

function mapStateToProps({ wallet }) {
  return { wallet };
}

export default connect(mapStateToProps)(Header);
