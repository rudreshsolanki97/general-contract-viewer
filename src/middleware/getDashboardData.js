import * as types from "../actions/types";
import { SubmitContractTxGeneral } from "../wallets/metamask";

const boardRoomAddress = "0x8ad9662F33EA75e6AbB581DE62EEC52b43436C64";
const shareAddress = "0xc2e1acef50aE55661855E8dcB72adB182A3cC259";
const cashAddress = "0xD1102332a213E21faF78B69C03572031F3552c33";

export const GetDashboardData = (store) => (next) => (action) => {
  if (action.type === types.WALLET_CONNECTED) {
    const address = action.payload;

    Promise.all([
      SubmitContractTxGeneral("balanceOf", "cash", "view", address),
      SubmitContractTxGeneral(
        "allowance",
        "share",
        "view",
        address,
        boardRoomAddress
      ),
      SubmitContractTxGeneral("balanceOf", "share", "view", address),
      SubmitContractTxGeneral("balanceOf", "boardroom", "view", address),
      SubmitContractTxGeneral("earned", "boardroom", "view", address),
      SubmitContractTxGeneral("epoch", "boardroom", "view"),
      SubmitContractTxGeneral("rewardPerShare", "boardroom", "view"),
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
        ] = resp;

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
