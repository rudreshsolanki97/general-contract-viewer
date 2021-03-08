export const GetFunctionSignature = (abi) => {
  return abi.filter(({ type }) => type === "function");
};
