import React, { useEffect, useState } from "react";

import { Container, Row, Col, Button } from "react-bootstrap";

import { GetAccountFromKeystore } from "../../helpers/crypto";

const ImportFromFilerBodyComponent = ({ cb, defaultPath }) => {
  let fileReader;

  useEffect(() => {
    if (defaultPath) {
      handleFileChosen(defaultPath);
    }
  });

  const handleFileRead = () => {
    const content = fileReader.result;
    cb(content);
  };

  const handleFileChosen = (file) => {
    fileReader = new FileReader();
    fileReader.onloadend = handleFileRead;
    fileReader.readAsText(file);
  };

  return (
    <div>
      <input
        type="file"
        id="input-file"
        accept=".json"
        onChange={(e) => handleFileChosen(e.target.files[0])}
      />
    </div>
  );
};

const Keystore = ({ cb }) => {
  const [keystore, setKeystore] = useState("");
  const [pwd, setPwd] = useState("");
  const [statusMessage, setStatusMessage] = useState("");
  // const [loading, setLoading] = useState(false);

  let btnName = "Submit";

  // if (loading) {
  //   btnName = LOADER_BOX;
  // }

  return (
    <div className="keystore">
      <Container>
        <Row>
          <ImportFromFilerBodyComponent
            className="keystore-path__input"
            cb={setKeystore}
          />
        </Row>

        <Row>
          <input
            className="keystore-pwd__input"
            value={pwd}
            type="password"
            onChange={(x) => setPwd(x.target.value)}
          />
        </Row>

        <Row>
          <div className="private-key__message">{statusMessage}</div>
        </Row>

        <Row>
          <Col>
            <Button
              className="u-float-r"
              onClick={(e) => {
                const account = GetAccountFromKeystore(keystore, pwd);
                if (account === null) {
                  setStatusMessage("Invalid Password / Keystore");
                } else {
                  setStatusMessage("Successfully got the account");
                }
                cb(account);
              }}
            >
              {btnName}
            </Button>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default Keystore;
