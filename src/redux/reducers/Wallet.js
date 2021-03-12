import * as types from "../../actions/types";

const initialState = {
  connected: false,
  address: "",
};

const WalletReducer = (state = initialState, payload) => {
  switch (payload.type) {
    case types.WALLET_CONNECTED: {
      return { ...state, connected: true, address: payload.payload };
    }

    case types.WALLET_DISCONNECTED: {
      return { ...state, connected: false };
    }

    default:
      return state;
  }
};

export default WalletReducer;
