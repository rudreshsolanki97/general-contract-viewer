import React, { useState, useEffect } from "react";
import { Container, Row, Col, Button, Form } from "react-bootstrap";
import _ from "lodash";

import { SubmitContractTx } from "../wallets/metamask";

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
      return "";
    })
  );

  const [loading, setLoading] = useState(false);
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
        <RenderInputCustomType
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
      <Button
        onClick={() => {
          setLoading(true);
          SubmitContractTx(props.method, props.stateMutability, ...inputs)
            .then((resp) => {
              if (_.isObject(resp)) resp = JSON.stringify(resp);
              console.log("error", resp);
              alert(`success ${resp}`);
              setLoading(false);
            })
            .catch((e) => {
              console.log("error", e);
              alert("Error");
              setLoading(false);
            });
        }}
        variant="primary"
        style={{ width: "10rem", float: "right" }}
        disabled={loading}
      >
        Submit
      </Button>
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
