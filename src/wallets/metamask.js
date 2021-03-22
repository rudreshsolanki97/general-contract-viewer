import Web3 from "web3";
import detectEthereumProvider from "@metamask/detect-provider";

import BoardroomAbi from "../abi/boardroom.json";
import ShareAbi from "../abi/share.json";
import CashAbi from "../abi/cash.json";
import {
  CONTRACT_ABI,
  CONTRACT_ADDRESS,
  RemoveExpo,
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
  const provider = await detectEthereumProvider();
  return await web3.eth.net.getId();
}

export async function initWeb3() {
  const isWeb3Supported = IsWeb3Supported();
  if (!isWeb3Supported) return store.dispatch(actions.WalletDisconnected());
  if (GetCurrentProvider() !== "metamask")
    return store.dispatch(actions.WalletDisconnected());
  const isConnected = await window.ethereum.isConnected();
  if (isConnected !== true) {
    await window.ethereum.enable();
  }
  _initListerner();
  web3 = new Web3(await GetProvider());
  const accounts = await web3.eth.getAccounts();
  addresses = accounts;
  const chain_id = await web3.eth.getChainId();
  return store.dispatch(
    actions.WalletConnected({ address: accounts[0], chain_id })
  );
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

export async function SubmitContractTx(method, stateMutability, ...params) {
  try {
    const boardRoomAddress = "0x8ad9662F33EA75e6AbB581DE62EEC52b43436C64";
    const shareAddress = "0xc2e1acef50aE55661855E8dcB72adB182A3cC259";
    const cashAddress = "0xD1102332a213E21faF78B69C03572031F3552c33";

    const abi = BoardroomAbi;

    const web3 = new Web3(window.web3.currentProvider);

    const contract = new web3.eth.Contract(abi, boardRoomAddress);
    const shareContract = new web3.eth.Contract(ShareAbi, shareAddress);

    if (stateMutability === "view") {
      const resp = await contract.methods[method](...params).call({
        from: addresses[0],
      });

      return resp;
    } else {
      if (method === "stake") {
        let amount = params[0];
        amount = RemoveExpo(parseFloat(amount) * 10 ** 18);
        console.log("from", addresses[0], amount);

        const gasLimit = await contract.methods[method](amount).estimateGas({
          from: addresses[0],
        });
        const resp = await contract.methods[method](amount).send({
          from: addresses[0],
          gas: gasLimit,
        });

        return resp;
      } else if (method === "approve") {
        let [spender, amount] = params;
        amount = RemoveExpo(parseFloat(amount) * 10 ** 18);
        const gasLimit = await shareContract.methods[method](
          spender,
          amount
        ).estimateGas({
          from: addresses[0],
        });
        const resp = await shareContract.methods[method](spender, amount).send({
          from: addresses[0],
          gas: gasLimit,
        });

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
    }
  } catch (e) {
    console.log("error", e);
    return null;
  }
}

export async function SubmitContractTxGeneral(
  method,
  type,
  stateMutability,
  ...params
) {
  try {
    const web3 = new Web3(window.web3.currentProvider);

    const { address, abi } = getContractAddress(type);

    const contract = new web3.eth.Contract(abi, address);

    if (stateMutability === "view") {
      const resp = await contract.methods[method](...params).call({
        from: addresses[0],
      });

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
    console.log("resp", e);
    return null;
  }
}

function getContractAddress(type) {
  return {
    address: CONTRACT_ADDRESS[type],
    abi: CONTRACT_ABI[type],
  };
}
