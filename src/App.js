import React, { Component } from "react";
import { Switch, Route } from "react-router-dom";
import _ from "lodash";
import { connect } from "react-redux";

import * as actions from "./actions/index";

import Header from "./components/Header";
import PageNavigation from "./components/Navigation";

import Dashboard from "./components/Dashboard";
import Boardroom from "./components/Boardroom";
import Bonds from "./components/Bonds";

import "./assets/scss/main.scss";
import { initWeb3 } from "./wallets/metamask";

class App extends Component {
  componentDidMount() {
    initWeb3();
  }

  render() {
    const links = [
      { link: "/", name: "home" },
      { link: "/boardroom", name: "boardroom" },
      { link: "/bonds", name: "bonds" },
      // { link: "/", name: "bank" },
    ];

    return (
      <div className="App">
        <Header />
        <PageNavigation links={[...links]} />

        <Switch>
          <Route path="/" exact={true}>
            <Dashboard />
          </Route>

          <Route path="/boardroom" exact={true}>
            <Boardroom />
          </Route>

          <Route path="/bonds" exact={true}>
            <Bonds />
          </Route>
        </Switch>
      </div>
    );
  }
}

export default connect(null, actions)(App);
