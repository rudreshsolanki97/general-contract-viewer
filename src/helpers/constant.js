import BoardroomAbi from "../abi/boardroom.json";
import ShareAbi from "../abi/share.json";
import CashAbi from "../abi/cash.json";
import BondAbi from "../abi/bond.json";
import TreasuryAbi from "../abi/treasurey.json";

export const SubPath = "/";

export const RemoveExpo = (x) => {
  var data = String(x).split(/[eE]/);
  if (data.length == 1) return data[0];

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
  cash: "0x250166887a349b1f64aBB1eB01bAe353b2E3f050",
  boardroom: "0xA58524d9D021E55eb235c09179954eAdC020a9A4",
  share: "0x4C2eD67B03A1F1f555CA2efA959E57645681215d",
  bond: "0x9dBc9DBe8cD506394E7B25E7167A7128778c71B4",
  treasury: "0xA5cF812Ec50EC1cAa500a2e3bdeD8B51D107ec1c",
  oracle: "0x4B5BfC44Ca8C01b98e4399949BCCF28B7fB6E8ed",
};

export const CONTRACT_ABI = {
  cash: CashAbi,
  boardroom: BoardroomAbi,
  share: ShareAbi,
  bond: BondAbi,
  treasury: TreasuryAbi,
};

/**
 * @constant RUNNING_CHAIN  correct chain id, in decimal
 */
export const RUNNING_CHAIN = 97;

export const EXPLORER = "https://testnet.bscscan.com/";

export const IsHex = (n) => {
  const re = /[0-9A-Fa-f]{6}/g;

  if (re.test(n)) {
    return true;
  } else {
    return false;
  }
};
