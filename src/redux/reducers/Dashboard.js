import * as types from "../../actions/types";

const initialState = {
  cash: null,
  share: null,
  stake: null,
  earned: null,
  cashAllowance: null,
  epoch: null,
  rewardPerShare: null,
  dollarPrice: null,
  bondCashAllowance: null,
};

const DashboardReducer = (state = initialState, payload) => {
  switch (payload.type) {
    case types.DASHBOARD_DATA: {
      return { ...state, ...payload.payload };
    }

    default:
      return state;
  }
};

export default DashboardReducer;
