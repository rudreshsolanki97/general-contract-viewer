import Web3 from "web3";

import BoardroomAbi from "../abi/boardroom.json";

let addresses;

export function isWeb3Supported() {
  return Boolean(window.web3 || window.ethereum);
}

export async function initWeb3() {
  const isWeb3Supported = isWeb3Supported();
  if (!isWeb3Supported) return;

  window.web3 = new Web3(window.web3.currentProvider);
}

export async function Connect() {
  if (!window.ethereum) {
    window.web3 = new Web3(window.web3.currentProvider);
    return window.web3;
  }

  addresses = await window.ethereum.enable().catch((error) => {
    if (error == "User rejected provider access")
      alert("Need Metamask for functional site");
    // throw new Error("WEB3_CONNECT_FAILED_USER_REJECTED_PROVIDER_ACCESS");
  });
  return addresses;
}

export function GetCurrentProvider() {
  if (isWeb3Supported() !== true) return null;

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

export async function SubmitContractTx(method, ...params) {
  const boardRoomAddress = "0x8ad9662F33EA75e6AbB581DE62EEC52b43436C64";
  const abi = BoardroomAbi;

  const web3 = new Web3(window.web3.currentProvider);

  const contract = new web3.eth.Contract(abi, boardRoomAddress);

  const resp = await contract.methods[method](...params).call({
    from: addresses[0],
  });

  return resp;
}
