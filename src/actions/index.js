import * as Types from "./types";

export const WalletConnected = ({ address, chain_id }) => {
  return {
    type: Types.WALLET_CONNECTED,
    payload: { address, chain_id },
  };
};

export const NetworkChanged = (chain_id) => {
  return {
    type: Types.WALLET_CHAIN_CHANGED,
    payload: { chain_id },
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

export const NetworkInValid = () => {
  return {
    type: Types.NETWORK_INVALID,
  };
};
