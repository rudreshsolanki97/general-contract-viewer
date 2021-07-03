import React, { useState } from "react";
import _ from "lodash";

import { Container, Row, Button, Col } from "react-bootstrap";

import { GetAccountFromPK, VerifyPrivateKey } from "../../helpers/crypto";
import { LOADER_BOX } from "../common/common";

const PrivateKey = ({ cb, loading }) => {
  const [privateKey, setPrivateKey] = useState("");

  function renderMessage() {
    if (_.isEmpty(privateKey))
      return <div className="no-key">Enter Private Key</div>;
    const isValid = VerifyPrivateKey(privateKey);
    if (isValid)
      return <div className="valid-private-key">Private Key is valid</div>;
    else if (isValid === false)
      return <div className="invalid-private-key">Invalid Private Key</div>;
  }

  let btnName = "Submit";

  if (loading) {
    btnName = LOADER_BOX;
  }

  return (
    <div className="private-key">
      <Container>
        <Row>
          <input
            className="private-key__input"
            value={privateKey}
            onChange={(x) => setPrivateKey(x.target.value)}
          />
        </Row>

        <Row>
          <div className="private-key__message">{renderMessage()}</div>
        </Row>

        <Row>
          <Col>
            <Button
              className="u-float-r"
              onClick={() => {
                const account = GetAccountFromPK(privateKey);
                cb(account);
              }}
              disabled={loading}
            >
              {btnName}
            </Button>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default PrivateKey;
