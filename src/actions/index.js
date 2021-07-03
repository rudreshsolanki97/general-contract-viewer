import { CHAIN_DATA } from "../helpers/constant";
import store from "../redux/store";
import * as Types from "./types";

export const WalletConnected = ({ address, chain_id, loader, ...rst }) => {
  return {
    type: Types.WALLET_CONNECTED,
    payload: { address, chain_id, loader, ...rst },
  };
};

export const WalletOpened = () => {
  return {
    type: Types.WALLET_OPENED,
  };
};

export const NetworkChanged = (chain_id) => {
  const state = store.getState();
  return {
    type: Types.WALLET_CHAIN_CHANGED,
    payload: { chain_id, address: state.wallet.address },
  };
};

export const AccountChanged = (address) => {
  return {
    type: Types.WALLET_ADDRESS_CHANGED,
    payload: { address },
  };
};

export const WalletDisconnected = () => {
  return {
    type: Types.WALLET_DISCONNECTED,
  };
};

export const NetworkValid = () => {
  return {
    type: Types.NETWORK_VALID,
  };
};

export const SetChainData = (chain_id) => {
  return {
    type: Types.SET_CHAIN_DATA,
    payload: CHAIN_DATA[`${chain_id}`],
  };
};

export const NetworkInValid = () => {
  return {
    type: Types.NETWORK_INVALID,
  };
};
