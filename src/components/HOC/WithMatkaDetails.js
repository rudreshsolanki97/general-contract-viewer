import React, { Component } from "react";
import Web3 from "web3";
import {
  HTTP_PROVIDER,
  CONTRACT_ABI,
  CONTRACT_ADDRESS,
  ObjToArr,
  FilterStructResp,
} from "../../helpers/constant";

const WithMatkaDetails = (ComposedComponent) => {
  class MatkaDetials extends Component {
    constructor(props) {
      super(props);

      this.state = {
        matkaDetails: {},
      };
    }

    async generalContractCall(contract, method, params) {
      return await contract.methods[method](...params).call();
    }

    componentDidMount() {
      const web3 = new Web3(new Web3.providers.HttpProvider(HTTP_PROVIDER));
      const abi = CONTRACT_ABI.matka,
        addr = CONTRACT_ADDRESS.matka;
      const contract = new web3.eth.Contract(abi, addr);
      Promise.all([
        this.generalContractCall(contract, "currentPool", []),
        this.generalContractCall(contract, "poolActive", []),
        this.generalContractCall(contract, "poolInterval", []),
        this.generalContractCall(contract, "operatorFee", []),
      ])
        .then((resp) => {
          const [currentPool, poolActive, poolInterval, operatorFee] = resp;

          this.setState({
            matkaDetails: {
              currentPool: FilterStructResp(currentPool),
              poolActive,
              poolInterval,
              operatorFee,
            },
          });
        })
        .catch((e) => {
          this.setState({
            matkaDetails: {
              currentPool: "",
              poolActive: "",
              poolInterval: "",
              operatorFee: "",
              allowance: "",
            },
          });
        });
    }

    render() {
      return <ComposedComponent {...this.state} />;
    }
  }

  return MatkaDetials;
};

export default WithMatkaDetails;
