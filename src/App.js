import React, { Component } from "react";
import { Switch, Route } from "react-router-dom";
import _ from "lodash";
import { connect } from "react-redux";

import * as actions from "./actions/index";

import Header from "./components/Header";
import Dashboard from "./components/Dashboard";

import "./assets/scss/main.scss";
import {
  GetCurrentProvider,
  Connect,
  SubmitContractTx,
} from "./wallets/metamask";

class App extends Component {
  componentDidMount() {
    const provider = GetCurrentProvider();
    if (!_.isEqual("metamask", provider)) {
      alert("please install / login into metamask");
    } else {
      Connect()
        .then((address) => {
          this.props.WalletConnected(address[0]);
        })
        .catch((e) => {
          console.log(e);
          this.props.walletDisconnected();
        });
    }
  }

  render() {
    return (
      <div className="App">
        <Header />

        <Switch>
          <Route path="/">
            <Dashboard />
          </Route>
        </Switch>
      </div>
    );
  }
}

export default connect(null, actions)(App);
