import React, { useState, useEffect } from "react";
import { Container, Row, Col, Button, Form } from "react-bootstrap";
import copy from "copy-to-clipboard";
import _ from "lodash";

import {
  GetJsonRpcError,
  IsJsonRpcError,
  SubmitContractTxGeneral,
} from "../../wallets";
import { EXPLORER, LOADERS, MODE } from "../../helpers/constant";
import { GeneralObjectViewer } from "./ObjectComponent";
import { GetSignedTx } from "../../wallets";
import { RenderQR } from "./common";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCopy } from "@fortawesome/free-solid-svg-icons";
import { toast } from "react-toastify";
import store from "../../redux/store";

const RenderInput = ({ field, ...inputProps }) => (
  <Row>
    <Col lg={4} md={4} sm={12}>
      <label className="form-control">{field}</label>
    </Col>
    <Col lg={8} md={8} sm={12}>
      <input className="form-control" {...inputProps} />
    </Col>
  </Row>
);
/**
 *
 * !FIX: DOB & File input types
 */
export const RenderInputCustomType = ({
  field,
  onChange: cb,
  type = "text",
  value,
  setInput,
  onBlur = () => {},
  formData,
  setFormData,
  ...inputProps
}) => {
  let customInput = null;
  switch (type) {
    case "text":
    case "number":
      customInput = (
        <input
          type={type}
          className="form-control"
          onChange={(e) => {
            cb(e.target.value);
          }}
          value={value}
          onBlur={(e) => onBlur(e, { setInput, formData, setFormData })}
          {...inputProps}
        />
      );
      break;
    case "select":
      customInput = (
        <select
          className="form-control"
          onChange={(e) => {
            cb(e.target.value);
          }}
          value={value}
        >
          {inputProps.options.map(({ label, value: curVal }, i) => (
            <option key={i + 1} value={curVal}>
              {label}
            </option>
          ))}
        </select>
      );
      break;
    case "radio":
      customInput = (
        <>
          {inputProps.options.map(({ value: curVal, label }, i) => (
            <div className="input-dynamic-form__input-radio" key={i + 1}>
              <Form.Label>
                <input
                  type={type}
                  value={curVal}
                  name={field}
                  key={i + 1}
                  onClick={(e) => {
                    cb(e.target.value);
                  }}
                  defaultChecked={curVal === value}
                />
                {label}
              </Form.Label>
            </div>
          ))}
        </>
      );
      break;
    default:
      return <></>;
  }
  return (
    <Row>
      <Col lg={4} md={4} sm={12}>
        <label className="form-control">{field}</label>
      </Col>
      <Col lg={8} md={8} sm={12}>
        {customInput}
      </Col>
    </Row>
  );
};

export const RenderInputCustomType2 = ({
  field,
  onChange: cb,
  type = "text",
  value,
  setInput,
  onBlur = () => {},
  formData,
  setFormData,
  ...inputProps
}) => {
  let customInput = null;
  switch (type) {
    case "text":
    case "number":
      customInput = (
        <input
          type={type}
          className="form-control"
          onChange={(e) => {
            cb(e.target.value);
          }}
          value={value}
          onBlur={(e) => onBlur(e, { setInput, formData, setFormData })}
          {...inputProps}
        />
      );
      break;
    case "select":
      customInput = (
        <select
          className="form-control"
          onChange={(e) => {
            cb(e.target.value);
          }}
          value={value}
        >
          {inputProps.options.map(({ label, value: curVal }, i) => (
            <option key={i + 1} value={curVal}>
              {label}
            </option>
          ))}
        </select>
      );
      break;
    case "radio":
      customInput = (
        <>
          {inputProps.options.map(({ value: curVal, label }, i) => (
            <div className="input-dynamic-form__input-radio" key={i + 1}>
              <Form.Label>
                <input
                  type={type}
                  value={curVal}
                  name={field}
                  key={i + 1}
                  onClick={(e) => {
                    cb(e.target.value);
                  }}
                  defaultChecked={curVal === value}
                />
                {label}
              </Form.Label>
            </div>
          ))}
        </>
      );
      break;
    default:
      return <></>;
  }
  return (
    <Row>
      <Col lg={12} md={12} sm={12}>
        <label className="form-control field-label">{field}</label>
      </Col>
      <Col className="field-input" lg={12} md={12} sm={12}>
        {customInput}
      </Col>
    </Row>
  );
};

function RawTxForm({ cb, data, params }) {
  const state = store.getState();

  const [nonce, setnonce] = useState(0);
  const [gasPrice, setgasPrice] = useState(9000);
  const [gasLimit, setgasLimit] = useState(50000);
  const [chainId, setchainId] = useState(state.wallet.chain_id);

  if (![LOADERS.Privatekey, LOADERS.Keystore].includes(state.wallet.loader)) {
    return "Only compatible with Private Key & Keystore connections";
  }

  return (
    <Container>
      <hr />
      <br />

      <Row>
        <Col sm={12} lg={4} md={4}>
          Chain ID
        </Col>
        <Col sm={12} lg={8} md={8}>
          <input
            type="number"
            className="form-control"
            value={chainId}
            onChange={(e) => setchainId(e.target.value)}
          />
        </Col>
      </Row>
      <Row>
        <Col sm={12} lg={4} md={4}>
          Nonce
        </Col>
        <Col sm={12} lg={8} md={8}>
          <input
            type="number"
            className="form-control"
            value={nonce}
            onChange={(e) => setnonce(e.target.value)}
          />
        </Col>
      </Row>

      <Row>
        <Col sm={12} lg={4} md={4}>
          Gas Price
        </Col>
        <Col sm={12} lg={8} md={8}>
          <input
            type="number"
            className="form-control"
            value={gasPrice}
            onChange={(e) => setgasPrice(e.target.value)}
          />
        </Col>
      </Row>

      <Row>
        <Col sm={12} lg={4} md={4}>
          Gas Limit
        </Col>
        <Col sm={12} lg={8} md={8}>
          <input
            type="number"
            className="form-control"
            value={gasLimit}
            onChange={(e) => setgasLimit(e.target.value)}
          />
        </Col>
      </Row>

      <Row>
        <Col className={"u-float-r"}>
          <Button
            onClick={async () => {
              console.log("{ nonce, gasLimit, gasPrice, chainId }", {
                nonce,
                gasLimit,
                gasPrice,
                chainId,
              });
              const rawTx = await GetSignedTx(
                data.abi,
                data.address,
                data.method,
                { nonce, gasLimit, gasPrice, chainId },
                ...params
              );
              cb(rawTx);
            }}
          >
            Get QR
          </Button>
        </Col>
      </Row>
    </Container>
  );
}

function RenderRawTx(x) {
  return (
    <Container>
      <Row>
        <Col className="u-text-center">
          <h3>Signed TX HASH</h3>
        </Col>
      </Row>

      <hr />

      <Row>
        <Col className="u-text-center qr-code-wrapper">{RenderQR(x, 200)}</Col>
      </Row>

      <Row>
        <Col>
          <Button
            className="u-float-r"
            onClick={() => {
              copy(x);
              toast("copied", { autoClose: 1000 });
            }}
          >
            <FontAwesomeIcon icon={faCopy} />
          </Button>
        </Col>
      </Row>
    </Container>
  );
}

/**
 *
 * @param {*} props class properties
 */
export const DynamicForm = (props) => {
  const [inputs, setInputs] = useState(
    props.data.map(({ value = "", defaultValue = "" }) => {
      if (value !== "") {
        return value;
      } else if (defaultValue !== "") {
        return defaultValue;
      }
    })
  );

  const [loading, setLoading] = useState(false);
  const [showRawTxForm, setshowRawTx] = useState(false);
  const [formData, setFormDatas] = useState(props.data);

  useEffect(() => {
    setFormDatas(props.data);
  }, [props.data]);

  const setInput = (i, v) => setInputs(Object.assign([...inputs], { [i]: v }));
  const setFormData = (i, v) =>
    setFormDatas(Object.assign([...formData], { [i]: v }));

  return (
    <Container className="custom-input-1 dynamic-form">
      {formData.map(({ name, type, ...rest }, i) => (
        <RenderInputCustomType2
          field={name}
          type={type}
          value={inputs[i]}
          key={i}
          setInput={(i, e) => setInput(i, e)}
          onChange={(e) => setInput(i, e)}
          formData={formData}
          setFormData={setFormData}
          {...rest}
        />
      ))}
      {props.stateMutability !== "view" ? (
        <Button onClick={() => setshowRawTx(!showRawTxForm)}>Sign</Button>
      ) : (
        ""
      )}

      <Button
        onClick={() => {
          setLoading(true);
          SubmitContractTxGeneral(
            props.method,
            props.contractType || "token",
            props.stateMutability,
            props.abi,
            props.address,
            ...inputs
          )
            .then((resp) => {
              let respStr;
              if (_.isObject(resp) === true)
                respStr = GeneralObjectViewer(resp);
              else respStr = `${resp}`;

              if (resp && resp.transactionHash) {
                const content = (
                  <Container>
                    <Row>
                      <Col lg={4} md={4} sm={4}>
                        <span>Transaction Hash</span>
                      </Col>
                      <Col lg={8} md={8} sm={8}>
                        <span>
                          {/* <a
                            target="_blank"
                            href={`${EXPLORER}/tx/${resp.transactionHash}`}
                          >
                            TX HASH
                          </a> */}
                        </span>
                      </Col>
                    </Row>
                  </Container>
                );
                props.setModalContent(content);
              } else if (resp !== null) {
                const content = (
                  <Container>
                    <Row>
                      <Col lg={4} md={4} sm={4}>
                        <span>Response</span>
                      </Col>
                      <Col lg={8} md={8} sm={8}>
                        <span>{respStr}</span>
                      </Col>
                    </Row>
                  </Container>
                );
                props.setModalContent(content);
              } else {
                props.setModalContent("error");
              }

              setLoading(false);
            })
            .catch((e) => {
              console.log("err", e);
              if (IsJsonRpcError(e)) {
                const err = GetJsonRpcError(e);
                props.setModalContent(`Error: ${err.message}`);
                setLoading(false);
                return;
              }
              alert("Error");
              setLoading(false);
            });
        }}
        variant="primary"
        style={{ width: "10rem", float: "right" }}
        disabled={loading || MODE === "offline"}
      >
        Submit
      </Button>

      <Row>
        <Col>
          {showRawTxForm ? (
            <RawTxForm
              data={props}
              params={inputs}
              cb={(x) => {
                console.log("rawTX", x);
                props.setModalContent(RenderRawTx(x));
              }}
            />
          ) : (
            ""
          )}
        </Col>
      </Row>
    </Container>
  );
};

export const SelectOption = [{ label: "Select", value: null }];

export const DynamicActionBtn = (props) => {
  const [loading, setLoading] = useState(false);
  let customBtn = null;
  switch (props.type) {
    case "actionBtn":
      customBtn = (
        <Button
          variant={props.options.variant}
          onClick={() => {
            setLoading(false);
            // PostApi(props.api, "", () => setLoading(true));
          }}
        >
          {" "}
          {props.options.name}
        </Button>
      );
      break;
    default:
      return <></>;
  }
  return customBtn;
};
