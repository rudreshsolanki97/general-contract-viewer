import React, { Component } from "react";
import { connect } from "react-redux";

const RequireWalletConnected = (FallbackComponent = null) => (
  ComposedComponent
) => {
  class Connected extends Component {
    render() {
      if (this.props.wallet.connected === true)
        return <ComposedComponent {...this.props} />;
      if (!FallbackComponent) return null;
      return <FallbackComponent />;
    }
  }

  function mapStateToProps({ wallet }) {
    return { wallet };
  }

  return connect(mapStateToProps)(Connected);
};

export default RequireWalletConnected;
