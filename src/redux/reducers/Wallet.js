import * as types from "../../actions/types";

const initialState = {
  connected: false,
  address: "",
  chain_id: null,
  valid_network: false,
};

const WalletReducer = (state = initialState, payload) => {
  switch (payload.type) {
    case types.WALLET_CONNECTED: {
      const { adddress, chain_id } = payload.payload;
      return {
        ...state,
        connected: true,
        address: adddress,
        chain_id: chain_id,
      };
    }

    case types.WALLET_DISCONNECTED: {
      return { ...state, connected: false };
    }

    case types.WALLET_ADDRESS_CHANGED: {
      const { adddress } = payload.payload;
      return {
        ...state,
        address: adddress,
      };
    }

    case types.WALLET_CHAIN_CHANGED: {
      const { chain_id } = payload.payload;

      return {
        ...state,
        chain_id: chain_id,
      };
    }

    case types.NETWORK_VALID: {
      return {
        ...state,
        valid_network: true,
      };
    }

    case types.NETWORK_INVALID: {
      return {
        ...state,
        valid_network: false,
      };
    }

    default:
      return state;
  }
};

export default WalletReducer;
