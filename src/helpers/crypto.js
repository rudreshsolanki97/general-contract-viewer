import store from "../redux/store";

const Xdc3 = require("xdc3");
const Accounts = require("xdc3-eth-accounts");
const { utils } = Xdc3;
const { TransferType, DEFAULT_PROVIDER } = require("./constant");

const generateStub = (type, params) => {
  switch (type) {
    case TransferType.token:
      return {
        params: [params.to, params.amount, params.token],
      };
    case TransferType.native:
    default:
      return {
        params: [params.to, params.amount],
      };
  }
};

export const Computehash = ({
  nonce,
  transferType = TransferType.native,
  ...params
}) => {
  const stub = generateStub(transferType, params);
  const hash = utils.soliditySha3(...stub.params, nonce).toString("hex");
  return hash;
};

export const Sign = (privateKey, msg) => {
  try {
    return new Accounts().sign(msg, privateKey);
  } catch (e) {
    return null;
  }
};

export const VerifyPrivateKey = (privateKey) => {
  if (privateKey.startsWith("0x")) privateKey = privateKey.replace("0x", "");
  return /^[0-9a-fA-F]{64}$/.test(privateKey);
};

export const GetAccountFromPK = (privateKey) => {
  try {
    if (!privateKey.startsWith("0x")) privateKey = "0x" + privateKey;
    return new Accounts().privateKeyToAccount(privateKey);
  } catch (e) {
    return null;
  }
};

export const GetAccountFromKeystore = (keystore, pwd) => {
  try {
    if (typeof keystore !== "string") keystore = keystore.toString();
    return new Accounts().decrypt(keystore, pwd);
  } catch (e) {
    console.log(e);
    return null;
  }
};

export const IsValidAddress = (address) => {
  return utils.isAddress(address);
};

export const GetRevertReason = (tx) => {
  const data = store.getState();
  return new Promise((resolve, reject) => {
    const xdc3 = new Xdc3(
      new Xdc3.providers.HttpProvider(data.wallet.provider)
    );
    xdc3.eth
      .call(tx)
      .then((x) => {
        console.log("x", x, utils.toAscii(x));
        const other = x.replace("0x", "").slice(8);
        const buf = Buffer.from(other, "hex");
        const reason = buf
          .toString()
          .split("")
          .filter((x) => /^[a-zA-Z\d\s:]+$/i.test(x))
          .join("");
        console.log(reason);
        resolve(reason);
      })
      .catch(reject);
  });
};
