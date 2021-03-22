import React, { Component } from "react";
import { Switch, Route } from "react-router-dom";
import _ from "lodash";
import { connect } from "react-redux";

import * as actions from "./actions/index";

import Header from "./components/Header";
import PageNavigation from "./components/Navigation";
import Dashboard from "./components/Dashboard";

import "./assets/scss/main.scss";
import { initWeb3 } from "./wallets/metamask";

class App extends Component {
  componentDidMount() {
    initWeb3();
  }

  render() {
    const links = [
      { link: "/", name: "home" },
      { link: "/", name: "boardroom" },
      { link: "/", name: "bonds" },
      { link: "/", name: "bank" },
    ];

    return (
      <div className="App">
        <Header />
        <PageNavigation links={[...links]} />

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
