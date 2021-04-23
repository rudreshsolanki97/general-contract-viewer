import * as metamask from "./metamask";
import * as xinpay from "./xinpay";

import store from "../redux/store";

function GetFuncFromChainId(chainId) {
  switch (`${chainId}`) {
    case "50":
    case "51":
      return xinpay;
    default:
      return metamask;
  }
}

export async function SubmitContractTxGeneral(...params) {
  try {
    const wallet = store.getState();

    return await GetFuncFromChainId(
      wallet.wallet.chain_id
    ).SubmitContractTxGeneral(...params);
  } catch (e) {
    console.log("resp", IsJsonRpcError(e));
    console.log("resp", e);
    throw e;
  }
}

export async function GetPastEvents(abi, address) {
  console.log("eventsevents");
  const wallet = store.getState();
  return await GetFuncFromChainId(wallet.wallet.chain_id).GetPastEvents(
    abi,
    address
  );
}

export const IsJsonRpcError = (err) => {
  return err.message.split("\n")[0] === "Internal JSON-RPC error.";
};

export const GetJsonRpcError = (err) => {
  return JSON.parse(err.message.split("\n").slice(1).join("").trim());
};
