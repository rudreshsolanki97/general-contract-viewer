import * as types from "../../actions/types";
import { CHAIN_DATA, IsHex } from "../../helpers/constant";

const initialState = {
  connected: false,
  address: "",
  chain_id: null,
  valid_network: false,
  explorer: "",
  rpc_provider: "",
  ws_provider: "",
};

const WalletReducer = (state = initialState, payload) => {
  switch (payload.type) {
    case types.WALLET_CONNECTED: {
      const { address, chain_id } = payload.payload;
      let chainIdInt=chain_id;
      if (IsHex(chain_id)) {
        chainIdInt = parseInt(chain_id, 16);
      }
      return {
        ...state,
        connected: true,
        address: address,
        chain_id: chain_id,
        explorer:CHAIN_DATA[`${chainIdInt}`]
      };
    }

    case types.WALLET_DISCONNECTED: {
      return { ...state, connected: false };
    }

    case types.WALLET_ADDRESS_CHANGED: {
      const { address } = payload.payload;
      return {
        ...state,
        address: address,
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
