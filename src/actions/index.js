import * as Types from "./types";

export const WalletConnected = (address) => {
  return {
    type: Types.WALLET_CONNECTED,
    payload: address,
  };
};

export const WalletDisconnected = () => {
  return {
    type: Types.WALLET_DISCONNECTED,
  };
};
