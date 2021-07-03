import React from "react";
import { connect } from "react-redux";

class SignTx extends React.Component {}

function mapStateToProps({ wallet }) {
  return wallet;
}

export default connect(mapStateToProps)(SignTx);
