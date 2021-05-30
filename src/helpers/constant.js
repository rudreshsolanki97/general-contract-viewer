import TokenAbi from "../abi/StorxToken.json";

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
  token: "xdc8a000e77af0dc2c1ae42b8cf47ef78f4fd429e66",
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

export const HTTP_PROVIDER = {
  97: "https://data-seed-prebsc-1-s1.binance.org:8545/",
  50: "https://rpc.xinfin.network",
  51: "https://rpc.apothem.network",
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
