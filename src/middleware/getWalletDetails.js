import * as types from "../actions/types";
import { SubmitContractTxGeneral, GetNativeBalance } from "../wallets/metamask";

export const GetWalletBalance = (store) => (next) => (action) => {
  if (
    [
      types.WALLET_CONNECTED,
      types.WALLET_CHAIN_CHANGED,
      types.WALLET_ADDRESS_CHANGED,
      types.WALLET_OPENED,
    ].includes(action.type)
  ) {
    const { address } = action.payload;

    if (_.isUndefined(address))
      store.dispatch({ type: types.WALLET_DISCONNECTED });
    else
      Promise.all([
        SubmitContractTxGeneral("balanceOf", "token", "view", address),
        GetNativeBalance(address),
      ])
        .then((resp) => {
          const [tokenBalance, nativeBalance] = resp;
          store.dispatch({
            type: types.WALLET_BALANCE_DATA,
            payload: {
              token: Multiplier(tokenBalance),
              native: Multiplier(nativeBalance),
            },
          });
        })
        .catch((e) => {
          alert("error");
        });
  }

  next(action);
};

function Multiplier(amount) {
  const multiplier = Math.pow(10, 18);
  return parseFloat(amount) / multiplier;
}
