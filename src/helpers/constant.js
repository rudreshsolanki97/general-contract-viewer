import TokenAbi from "../abi/StorxToken.json";

import binance from "../assets/img/wallets/bnb.png";
import xinfin from "../assets/img/wallets/xinpay.png";

export const SubPath = "/";

export const PROJECT_NAME = "GCV";

export const RemoveExpo = (x) => {
  var data = String(x).split(/[eE]/);
  if (data.length === 1) return data[0];

  var z = "",
    sign = x < 0 ? "-" : "",
    str = data[0].replace(".", ""),
    mag = Number(data[1]) + 1;

  if (mag < 0) {
    z = sign + "0.";
    while (mag++) z += "0";
    return z + str.replace(/^\-/, "");
  }
  mag -= str.length;
  while (mag--) z += "0";
  return str + z;
};

export const CONTRACT_ADDRESS = {
  token: "xdc5d5f074837f5d4618b3916ba74de1bf9662a3fed",
  // matka: "0x7717FC488464efa40AaABB260D063d7783660C44",
};

export const CONTRACT_ABI = {
  token: TokenAbi,
  // matka: MatkaAbi,
};

/**
 * @constant VALID_CHAINS  correct chain id, in decimal
 */
export const VALID_CHAINS = [97, 56, 50, 51];

export const CHAIN_DATA = {
  97: "https://testnet.bscscan.com/",
  56: "https://bscscan.com/",
  50: "https://explorer.xinfin.network",
  51: "https://explorer.apothem.network",
};

export const RPC_TO_NETWORK = {
  "https://data-seed-prebsc-1-s1.binance.org:8545/": 97,
  "https://rpc.xinfin.network": 50,
  "https://rpc.apothem.network": 51,
};

export const HTTP_PROVIDER = {
  97: "https://data-seed-prebsc-1-s1.binance.org:8545/",
  50: "https://rpc.xinfin.network",
  51: "https://rpc.apothem.network",
};

export const NETWORK_ICON = {
  97: binance,
  50: xinfin,
  51: xinfin,
};

export const WS_PROVIDER = {};

export const ObjToArr = (obj) => Object.keys(obj).map((key) => obj[key]);

export const FilterStructResp = (obj) =>
  Object.keys(obj)
    .filter((e, i) => {
      if (i < Object.keys(obj).length / 2) return false;
      return true;
    })
    .reduce((acc, key) => {
      acc[key] = obj[key];
      return acc;
    }, {});

export const IsHex = (n) => {
  const re = /[0-9A-Fa-f]{6}/g;

  if (re.test(n)) {
    return true;
  } else {
    return false;
  }
};

export const GetTimerData = (seconds) => {
  const days = Math.floor(seconds / 86400);
  const hours = Math.floor((seconds % 86400) / 3600);
  const minutes = Math.floor(((seconds % 86400) % 3600) / 60);
  const sec = Math.floor(((seconds % 86400) % 3600) % 60);
  return { days, hours, minutes, seconds: sec };
};

export const FormatSeconds = (seconds) => {
  const { days, hours, minutes, seconds: sec } = GetTimerData(seconds);
  return (
    <span className="timer">
      <span className="days">{days}</span>:
      <span className="hours">{hours}</span>:
      <span className="minutes">{minutes}</span>::
      <span className="seconds">{sec}</span>
    </span>
  );
};

export const AddMultiplier = (amount) => {
  const multiplier = Math.pow(10, 18);

  return RemoveExpo(parseFloat(amount) * multiplier);
};

export const RemoveMultiplier = (amount) => {
  const multiplier = Math.pow(10, 18);

  return parseFloat(amount) / multiplier;
};

export const TIMER_FORMAT = "DD:HH:MM::SS";

export const IsJson = (abi) => {
  try {
    JSON.parse(abi);
  } catch (e) {
    return false;
  }
  return true;
};

export const BUILD_TX_LINK = (explorer, hash) => {
  let retLink = `${explorer}`;

  if (!retLink.endsWith("/")) retLink += "/";
  retLink += `tx/${hash}`;
  return retLink;
};

export const BUILD_BLOCK_LINK = (explorer, hash) => {
  let retLink = `${explorer}`;

  if (!retLink.endsWith("/")) retLink += "/";
  retLink += `block/${hash}`;
  return retLink;
};

export const DEFAULT_CHAIN_ID = 50;
export const DEFAULT_PROVIDER = HTTP_PROVIDER[VALID_CHAINS[2]];

export const EXPLORER = CHAIN_DATA[DEFAULT_CHAIN_ID];

export const LOADERS = {
  Xinpay: "xinpay",
  Keystore: "keystore",
  Privatekey: "privatekey",
  MetaMask: "metamask",
  DcentInApp: "dcent-inapp",
  DcentBridge: "dcent-bridge",
};

export const NETWORK_NAME = {
  50: "XinFin Mainnet",
  51: "XinFin Apothem",
  97: "BSC Testnet",
  56: "BSC Mainnet",
};

export const MODE = process.env.REACT_APP_MODE || "";
