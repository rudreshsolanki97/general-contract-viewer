import * as types from "../actions/types";
import { SubmitContractTxGeneral } from "../wallets/metamask";
import { CONTRACT_ADDRESS } from "../helpers/constant";

export const GetDashboardData = (store) => (next) => (action) => {
  if (action.type === types.WALLET_CONNECTED) {
    const { address } = action.payload;

    Promise.all([
      SubmitContractTxGeneral("balanceOf", "cash", "view", address),
      SubmitContractTxGeneral(
        "allowance",
        "share",
        "view",
        address,
        CONTRACT_ADDRESS.boardroom
      ),

      SubmitContractTxGeneral("balanceOf", "share", "view", address),
      SubmitContractTxGeneral("balanceOf", "boardroom", "view", address),
      SubmitContractTxGeneral("earned", "boardroom", "view", address),
      SubmitContractTxGeneral("epoch", "boardroom", "view"),
      SubmitContractTxGeneral("rewardPerShare", "boardroom", "view"),
      SubmitContractTxGeneral("balanceOf", "bond", "view", address),
      SubmitContractTxGeneral(
        "allowance",
        "share",
        "view",
        address,
        CONTRACT_ADDRESS.treasury
      ),
      SubmitContractTxGeneral("getDollarPrice", "treasury", "view"),
    ])
      .then((resp) => {
        const [
          cash,
          cashAllowance,
          share,
          stake,
          earned,
          epoch,
          rewardPerShare,
          bond,
          bondCashAllowance,
          dollarPrice,
        ] = resp;

        console.log("dollarPrice", dollarPrice);

        store.dispatch({
          type: types.DASHBOARD_DATA,
          payload: {
            cash: Multiplier(cash),
            share: Multiplier(share),
            stake: Multiplier(stake),
            earned: Multiplier(earned),
            cashAllowance: Multiplier(cashAllowance),
            epoch,
            rewardPerShare: Multiplier(rewardPerShare),
            bond: Multiplier(bond),
            bondCashAllowance: Multiplier(bondCashAllowance),
            dollarPrice: Multiplier(dollarPrice),
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
