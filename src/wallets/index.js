import Xdc3 from "xdc3";
import { toast } from "react-toastify";

import * as xinpay from "./xinpay";
import * as account from "./account";

import store from "../redux/store";
import {
  EXPLORER,
  LOADERS,
  DEFAULT_PROVIDER,
  BUILD_TX_LINK,
} from "../helpers/constant";

function GetFuncFromLoader(loader) {
  switch (loader) {
    case LOADERS.Xinpay:
      return xinpay;
    case LOADERS.Keystore:
      return account;
    case LOADERS.Privatekey:
      return account;
    default:
      return xinpay;
  }
}

/**
 *
 *
 * @note directly get from default provider
 *
 */
export function GetNativeBalance() {
  const state = store.getState();
  return new Promise((resolve, reject) => {
    const xdc3 = new Xdc3(
      new Xdc3.providers.HttpProvider(state.wallet.provider)
    );
    const wallet = store.getState();
    const address = wallet.wallet.address;
    xdc3.eth.getBalance(address).then(resolve).catch(reject);
  });
}

export function IsLocked(...params) {
  return new Promise((resolve, reject) => {
    const wallet = store.getState();
    GetFuncFromLoader(wallet.wallet.chain_id)
      .IsLocked(...params)
      .then((resp) => {
        resolve(resp);
      })
      .catch((e) => {
        console.log("resp", IsJsonRpcError(e));
        console.log("resp", e);
        reject(e);
      });
  });
}

export function SubmitContractTxGeneral(...params) {
  return new Promise((resolve, reject) => {
    const wallet = store.getState();
    let toastId;
    if (params[2] !== "view")
      toastId = toast("Processing TX ...", {
        position: "bottom-right",
        type: "processing-tx",
        autoClose: false,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: true,
        draggable: false,
        progress: undefined,
        closeButton: false,
      });

    GetFuncFromLoader(wallet.wallet.loader)
      .SubmitContractTxGeneral(...params)
      .then((resp) => {
        if (resp.transactionHash) {
          const { transactionHash } = resp;
          toast(
            <div>
              Sucsess&nbsp;
              <a
                href={BUILD_TX_LINK(EXPLORER, transactionHash)}
                // href={`${EXPLORER}/tx/${transactionHash}`}
                rel="noreferrer"
                target="_blank"
              >
                HASH
              </a>
            </div>,
            {
              position: "bottom-right",
              type: "success-tx",
              autoClose: false,
              hideProgressBar: false,
              closeButton: true,
              closeOnClick: false,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
            }
          );
        }

        resolve(resp);
      })
      .catch((e) => {
        console.log("resp", IsJsonRpcError(e));
        console.log("resp", e, e.message);
        const message = e.message || <>Failing Transaction</>;
        toast(
          <div>
            <b>Error</b>:{message}
          </div>,
          {
            position: "bottom-right",
            type: "error",
            autoClose: false,
            hideProgressBar: false,
            closeButton: true,
            closeOnClick: false,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
          }
        );
        reject(e);
      })
      .finally(() => {
        if (toastId) toast.dismiss(toastId);
      });
  });
}

export async function GetFromAddress(hash) {
  const wallet = store.getState();
  return await GetFuncFromLoader(wallet.wallet.chain_id).GetFromAddress(hash);
}

export const IsJsonRpcError = (err) => {
  return err.message.split("\n")[0] === "Internal JSON-RPC error.";
};

export const GetJsonRpcError = (err) => {
  return JSON.parse(err.message.split("\n").slice(1).join("").trim());
};

export const IsAddressEqual = (a, b) => {
  a = xinpay.fromXdcAddress(a).toLowerCase();
  b = xinpay.fromXdcAddress(b).toLowerCase();
  return a === b;
};

export async function GetPastEvents(abi, address) {
  const wallet = store.getState();
  return await GetFuncFromLoader(wallet.wallet.loader).GetPastEvents(
    abi,
    address
  );
}

export function GetSignedTx(...params) {
  const wallet = store.getState();
  return GetFuncFromLoader(wallet.wallet.loader).GetSignedTx(...params);
}
