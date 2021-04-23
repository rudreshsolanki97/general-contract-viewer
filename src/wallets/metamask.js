import Web3 from "web3";
import detectEthereumProvider from "@metamask/detect-provider";

import {
  CONTRACT_ABI,
  CONTRACT_ADDRESS,
  AddMultiplier,
} from "../helpers/constant";

import * as actions from "../actions";
import store from "../redux/store";

let addresses, web3;

export function IsWeb3Supported() {
  return Boolean(window.ethereum);
}

export async function GetProvider() {
  const provider = await detectEthereumProvider();
  return provider;
}

export async function GetChainId() {
  return await web3.eth.net.getId();
}

export async function initWeb3() {
  try {
    const isWeb3Supported = IsWeb3Supported();
    if (!isWeb3Supported) return store.dispatch(actions.WalletDisconnected());
    if (GetCurrentProvider() !== "metamask")
      return store.dispatch(actions.WalletDisconnected());
    // const isConnected = await window.ethereum.isConnected();
    await window.ethereum.enable();
    _initListerner();
    web3 = new Web3(await GetProvider());
    const accounts = await web3.eth.getAccounts();
    addresses = accounts;
    const chain_id = await web3.eth.getChainId();
    return store.dispatch(
      actions.WalletConnected({ address: accounts[0], chain_id })
    );
  } catch (e) {
    console.log(e);
  }
}

export async function _initListerner() {
  window.ethereum.removeAllListeners();

  window.ethereum.on("accountsChanged", async (data) => {
    const accounts = await web3.eth.getAccounts();
    addresses = accounts;
    store.dispatch(actions.AccountChanged(accounts[0]));
  });

  window.ethereum.on("chainChanged", async (data) => {
    const chain_id = await web3.eth.getChainId();
    store.dispatch(actions.NetworkChanged(chain_id));
  });

  window.ethereum.on("connect", async (data) => {
    web3 = new Web3(await GetProvider());
    const accounts = await web3.eth.getAccounts();
    const chain_id = await web3.eth.getChainId();
    addresses = accounts;
    return store.dispatch(
      actions.WalletConnected({ address: accounts[0], chain_id })
    );
  });

  window.ethereum.on("disconnect", (data) => {
    console.log("disconnect", data);
    return store.dispatch(actions.WalletDisconnected());
  });

  window.ethereum.on("message", (data) => {
    console.log("message", data);
  });
}

export function GetCurrentProvider() {
  if (IsWeb3Supported() !== true) return null;

  if (window.web3.currentProvider.isMetaMask) return "metamask";

  if (window.web3.currentProvider.isTrust) return "trust";

  if (window.web3.currentProvider.isStatus) return "status";

  if (typeof window.SOFA !== "undefined") return "coinbase";

  if (typeof window.__CIPHER__ !== "undefined") return "cipher";

  if (window.web3.currentProvider.constructor.name === "EthereumProvider")
    return "mist";

  if (window.web3.currentProvider.constructor.name === "Web3FrameProvider")
    return "parity";

  if (
    window.web3.currentProvider.host &&
    window.web3.currentProvider.host.indexOf("infura") !== -1
  )
    return "infura";

  if (
    window.web3.currentProvider.host &&
    window.web3.currentProvider.host.indexOf("localhost") !== -1
  )
    return "localhost";

  return "unknown";
}

export const GetNativeBalance = async (address) => {
  const web3 = new Web3(await GetProvider());
  return web3.eth.getBalance(address);
};

export async function SubmitContractTxGeneral(
  method,
  type,
  stateMutability,
  abi,
  address,
  ...params
) {
  try {
    const web3 = new Web3(await GetProvider());

    // const { address, abi } = getContractAddress(type);

    const contract = new web3.eth.Contract(abi, address);

    if (stateMutability === "view") {
      const resp = await contract.methods[method](...params).call();

      return resp;
    } else {
      const gasLimit = await contract.methods[method](...params).estimateGas({
        from: addresses[0],
      });
      const resp = await contract.methods[method](...params).send({
        from: addresses[0],
        gas: gasLimit,
      });

      return resp;
    }
  } catch (e) {
    console.log("resp", IsJsonRpcError(e));
    console.log("resp", e);
    throw e;
  }
}

export const GetPastEvents = async (abi, address) => {
  const web3 = new Web3(await GetProvider());
  const contract = new web3.eth.Contract(abi, address);
  return await contract.getPastEvents(
    "allEvents",
    {
      fromBlock: 0,
      toBlock: "latest",
    },
    function (error, events) {
      console.log("eventsevents",events);
    }
  );
};

export const IsJsonRpcError = (err) => {
  return err.message.split("\n")[0] === "Internal JSON-RPC error.";
};

export const GetJsonRpcError = (err) => {
  return JSON.parse(err.message.split("\n").slice(1).join("").trim());
};

function getContractAddress(type) {
  return {
    address: CONTRACT_ADDRESS[type],
    abi: CONTRACT_ABI[type],
  };
}
