import React, { Component } from "react";
import { Switch, Route } from "react-router-dom";
import _ from "lodash";

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
      Connect();
      // SubmitContractTx();
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
export default App;
