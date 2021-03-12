export const GetFunctionSignature = (abi) => {
  return abi.filter(
    ({ type, name }) =>
      type === "function" && (name === "stake" || name === "withdraw")
  );
};

export const GetRewardFunc = (abi) => {
  return abi.filter(
    ({ type, name }) => type === "function" && name === "claimReward"
  );
};

export const GetFunctionSignatureAll = (abi) => {
  return abi.filter(({ type }) => type === "function");
};
