import Xdc3, { utils } from "xdc3";

import detectEthereumProvider from "@metamask/detect-provider";

import * as actions from "../actions";
import store from "../redux/store";
import { LOADERS } from "../helpers/constant";
import { GetRevertReason } from "../helpers/crypto";

let addresses, xdc3;

export function IsXdc3Supported() {
  return Boolean(window.ethereum);
}

export async function GetProvider() {
  const provider = await detectEthereumProvider();
  return provider;
}

export async function GetChainId() {
  let xdc3 = new Xdc3(await GetProvider());
  return await xdc3.eth.net.getId();
}

export async function initXdc3() {
  try {
    const isXdc3Supported = IsXdc3Supported();
    if (!isXdc3Supported) return store.dispatch(actions.WalletDisconnected());
    if ((await GetCurrentProvider()) !== "xinpay")
      return store.dispatch(actions.WalletDisconnected());
    // const isConnected = await window.ethereum.isConnected();
    await window.ethereum.enable();
    _initListerner();
    const provider = await GetProvider();
    xdc3 = new Xdc3(provider);
    const accounts = await xdc3.eth.getAccounts();
    addresses = accounts;
    const chain_id = await xdc3.eth.getChainId();
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
    const accounts = await xdc3.eth.getAccounts();
    addresses = accounts;
    store.dispatch(actions.AccountChanged(accounts[0]));
  });

  window.ethereum.on("chainChanged", async (data) => {
    const chain_id = await xdc3.eth.getChainId();
    store.dispatch(actions.NetworkChanged(chain_id));
  });

  window.ethereum.on("connect", async (data) => {
    xdc3 = new Xdc3(await GetProvider());
    const accounts = await xdc3.eth.getAccounts();
    const chain_id = await xdc3.eth.getChainId();
    addresses = accounts;
    return store.dispatch(
      actions.WalletConnected({
        address: accounts[0],
        chain_id,
        loader: LOADERS.Xinpay,
      })
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

export async function GetCurrentProvider() {
  if (IsXdc3Supported() !== true) return null;

  if (window.web3.currentProvider.isMetaMask) {
    const chainId = await GetChainId();
    console.log("chainId", chainId, [50, 51].includes(chainId));
    if ([50, 51].includes(chainId)) return "xinpay";
    return "metamask";
  }

  if (window.web3.currentProvider.isTrust) return "trust";

  if (window.web3.currentProvider.isStatus) return "status";

  if (typeof window.SOFA !== "undefined") return "coinbase";

  if (typeof window.__CIPHER__ !== "undefined") return "cipher";

  if (window.web3.currentProvider.constructor.name === "EthereumProvider")
    return "mist";

  if (window.web3.currentProvider.constructor.name === "Xdc3FrameProvider")
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

export const GetNativeBalance = (address) => {
  const xdc3 = new Xdc3(window.web3.currentProvider);
  return xdc3.eth.getBalance(address);
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
    const state = store.getState();
    const xdc3 = new Xdc3(await GetProvider());

    // const { address, abi } = getContractAddress(type);

    const contract = new xdc3.eth.Contract(abi, address);

    if (stateMutability === "view") {
      const resp = await contract.methods[method](...params).call();

      return resp;
    } else {
      const gasLimit = await contract.methods[method](...params).estimateGas({
        from: state.wallet.address,
      });
      const resp = await contract.methods[method](...params).send({
        from: state.wallet.address,
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

export const IsJsonRpcError = (err) => {
  return err.message.split("\n")[0] === "Internal JSON-RPC error.";
};

export const GetPastEvents = async (abi, address) => {
  const xdc3 = new Xdc3(await GetProvider());
  const contract = new xdc3.eth.Contract(abi, address);
  return await contract.getPastEvents("allEvents", {
    fromBlock: 0,
    toBlock: "latest",
  });
};

export const GetJsonRpcError = (err) => {
  return JSON.parse(err.message.split("\n").slice(1).join("").trim());
};

export function fromXdcAddress(address) {
  return utils.fromXdcAddress(address);
}

export function toXdcAddress(address) {
  return utils.toXdcAddress(address).toLowerCase();
}
