import Xdc3 from "xdc3";

import _, { add } from "lodash";

import {
  CONTRACT_ABI,
  CONTRACT_ADDRESS,
  DEFAULT_PROVIDER,
} from "../helpers/constant";

import store from "../redux/store";
import { GetRevertReason } from "../helpers/crypto";

/**
 *
 * directly deals with an account represented in an object from Xdc3 / Web3
 *
 */

/**
 *
 * const account = {address, privateKey}
 *
 *
 */

export async function init() {}

export async function SubmitContractTxGeneral(
  method,
  type,
  stateMutability,
  abi,
  address,
  ...params
) {
  return new Promise(async (resolve, reject) => {
    const data = store.getState();
    const { account } = data.wallet;
    if (!account) reject("Account not loaded");
    const { privateKey } = account;
    if (_.isEmpty(privateKey)) reject("Account not loaded");

    const xdc3 = new Xdc3(
      new Xdc3.providers.HttpProvider(data.wallet.provider)
    );

    const contract = new xdc3.eth.Contract(abi, address);

    if (stateMutability === "view") {
      contract.methods[method](...params)
        .call()
        .then((resp) => {
          resolve(resp);
        })
        .catch(reject);
    } else if (stateMutability === "payable") {
      const [value] = params.splice(params.length - 1, 1);

      const data = contract.methods[method](...params).encodeABI();

      const state = store.getState();
      const { address: walletAddress } = state.wallet;

      const tx = {
        from: walletAddress.toLowerCase(),
        to: address,
        data,
        value,
      };

      let gasLimit;

      try {
        gasLimit = await xdc3.eth.estimateGas(tx);
      } catch (e) {
        const reason = await GetRevertReason(tx);
        reject({ message: reason });
        return;
      }

      tx["gas"] = gasLimit;

      const signed = await xdc3.eth.accounts.signTransaction(tx, privateKey);
      xdc3.eth
        .sendSignedTransaction(signed.rawTransaction)
        .once("receipt", (receipt) => {
          if (receipt !== null) {
            if (receipt.status) {
              resolve(receipt);
            } else {
              reject(receipt);
            }
          }
        });

      // })
      // .catch(reject);
    } else {
      const data = contract.methods[method](...params).encodeABI();

      const state = store.getState();
      const { address: walletAddress } = state.wallet;

      const tx = {
        from: walletAddress.toLowerCase(),
        to: address,
        data,
      };

      let gasLimit;

      try {
        gasLimit = await xdc3.eth.estimateGas(tx);
      } catch (e) {
        const reason = await GetRevertReason(tx);
        reject({ message: reason });
        return;
      }

      tx["gas"] = gasLimit;

      const signed = await xdc3.eth.accounts.signTransaction(tx, privateKey);
      xdc3.eth
        .sendSignedTransaction(signed.rawTransaction)
        .once("receipt", (receipt) => {
          if (receipt !== null) {
            if (receipt.status) {
              resolve(receipt);
            } else {
              reject(receipt);
            }
          }
        });
    }
  });
}

export const GetSignedTx = async (
  abi,
  address,
  method,
  { nonce, gasLimit, gasPrice, chainId },
  ...params
) => {
  const state = store.getState();
  const provider = state.wallet.provider;
  const xdc3 = new Xdc3(new Xdc3.providers.HttpProvider(provider));
  const contract = new xdc3.eth.Contract(abi, address);
  const data = contract.methods[method](...params).encodeABI();
  const tx = {
    to: address,
    nonce: nonce,
    gasPrice: gasPrice,
    gas: gasLimit,
    data: data,
    chainId: parseFloat(chainId),
  };
  const signed = await xdc3.eth.accounts.signTransaction(
    tx,
    state.wallet.account.privateKey
  );
  return signed.rawTransaction;
};

export const GetPastEvents = async (abi, address) => {
  const state = store.getState();
  const provider = state.wallet.provider;
  const xdc3 = new Xdc3(new Xdc3.providers.HttpProvider(provider));
  const contract = new xdc3.eth.Contract(abi, address);
  return await contract.getPastEvents("allEvents", {
    fromBlock: 0,
    toBlock: "latest",
  });
};
