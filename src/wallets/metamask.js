import Web3 from "web3";

import BoardroomAbi from "../abi/boardroom.json";
import ShareAbi from "../abi/share.json";
import CashAbi from "../abi/cashAbi.json";
import { RemoveExpo } from "../helpers/constant";

let addresses;

export function isWeb3Supported() {
  return Boolean(window.web3 || window.ethereum);
}

export async function initWeb3() {
  const isWeb3Supported = isWeb3Supported();
  if (!isWeb3Supported) return;

  window.web3 = new Web3(window.web3.currentProvider);
}

export async function Connect() {
  if (!window.ethereum) {
    window.web3 = new Web3(window.web3.currentProvider);
    return window.web3;
  }

  addresses = await window.ethereum.enable();
  return addresses;
}

export function GetCurrentProvider() {
  if (isWeb3Supported() !== true) return null;

  if (window.web3.currentProvider.isMetaMask) return "metamask";

  if (window.web3.currentProvider.isTrust) return "trust";

  if (window.web3.currentProvider.isStatus) return "status";

  if (typeof window.SOFA !== "undefined") return "coinbase";

  if (typeof window.__CIPHER__ !== "undefined") return "cipher";

  if (window.web3.currentProvider.constructor.name === "EthereumProvider")
    return "mist";

  if (window.web3.currentProvider.constructor.name === "Web3FrameProvider")
    return "parity";

  if (
    window.web3.currentProvider.host &&
    window.web3.currentProvider.host.indexOf("infura") !== -1
  )
    return "infura";

  if (
    window.web3.currentProvider.host &&
    window.web3.currentProvider.host.indexOf("localhost") !== -1
  )
    return "localhost";

  return "unknown";
}

export async function SubmitContractTx(method, stateMutability, ...params) {
  try {
    const boardRoomAddress = "0x8ad9662F33EA75e6AbB581DE62EEC52b43436C64";
    const shareAddress = "0xc2e1acef50aE55661855E8dcB72adB182A3cC259";
    const cashAddress = "0xD1102332a213E21faF78B69C03572031F3552c33";

    const abi = BoardroomAbi;

    const web3 = new Web3(window.web3.currentProvider);

    const contract = new web3.eth.Contract(abi, boardRoomAddress);
    const shareContract = new web3.eth.Contract(ShareAbi, shareAddress);

    if (stateMutability === "view") {
      const resp = await contract.methods[method](...params).call({
        from: addresses[0],
      });

      return resp;
    } else {
      if (method === "stake") {
        let amount = params[0];
        amount = RemoveExpo(parseFloat(amount) * 10 ** 18);
        console.log("from", addresses[0], amount);

        const gasLimit = await contract.methods[method](amount).estimateGas({
          from: addresses[0],
        });
        const resp = await contract.methods[method](amount).send({
          from: addresses[0],
          gas: gasLimit,
        });

        return resp;

        // const approveGasLimit = await shareContract.methods
        //   .approve(boardRoomAddress, amount)
        //   .estimateGas({ from: addresses[0] });
        // const approveData = shareContract.methods
        //   .approve(boardRoomAddress, amount)
        //   .encodeABI();
        // const approveTx = web3.eth.sendTransaction.request(
        //   {
        //     to: shareAddress,
        //     from: addresses[0],
        //     data: approveData,
        //     gas: approveGasLimit,
        //   },
        //   (error, data) => {
        //     console.log(data, error);
        //   }
        // );

        // batch.add(approveTx);

        // const stkeGasLimit = await contract.methods[method](
        //   ...params
        // ).estimateGas({ from: addresses[0] });
        // const stakeData = contract.methods.stake(amount).encodeABI();
        // const stakeTx = web3.eth.sendTransaction.request(
        //   {
        //     to: boardRoomAddress,
        //     from: addresses[0],
        //     data: stakeData,
        //     gas: stkeGasLimit,
        //   },
        //   (error, data) => {
        //     console.log(data, error);
        //   }
        // );

        // batch.add(stakeTx);

        // batch.execute();
      } else if (method === "approve") {
        let [spender, amount] = params;
        amount = RemoveExpo(parseFloat(amount) * 10 ** 18);
        const gasLimit = await shareContract.methods[method](
          spender,
          amount
        ).estimateGas({
          from: addresses[0],
        });
        const resp = await shareContract.methods[method](spender, amount).send({
          from: addresses[0],
          gas: gasLimit,
        });

        return resp;
      } else {
        const gasLimit = await contract.methods[method](...params).estimateGas({
          from: addresses[0],
        });
        const resp = await contract.methods[method](...params).send({
          from: addresses[0],
          gas: gasLimit,
        });

        return resp;
      }
    }
  } catch (e) {
    console.log("error", e);
    return null;
  }
}

export async function SubmitContractTxGeneral(
  method,
  type,
  stateMutability,
  ...params
) {
  try {
    const web3 = new Web3(window.web3.currentProvider);

    const { address, abi } = getContractAddress(type);

    const contract = new web3.eth.Contract(abi, address);

    if (stateMutability === "view") {
      const resp = await contract.methods[method](...params).call({
        from: addresses[0],
      });

      return resp;
    } else {
      const gasLimit = await contract.methods[method](...params).estimateGas({
        from: addresses[0],
      });
      const resp = await contract.methods[method](...params).send({
        from: addresses[0],
        gas: gasLimit,
      });

      return resp;
    }
  } catch (e) {
    console.log(e);
    return null;
  }
}

function getContractAddress(type) {
  const boardRoomAddress = "0x8ad9662F33EA75e6AbB581DE62EEC52b43436C64";
  const shareAddress = "0xc2e1acef50aE55661855E8dcB72adB182A3cC259";
  const cashAddress = "0xD1102332a213E21faF78B69C03572031F3552c33";

  switch (type) {
    case "cash": {
      return {
        address: cashAddress,
        abi: CashAbi,
      };
    }
    case "share": {
      return {
        address: shareAddress,
        abi: ShareAbi,
      };
    }
    case "boardroom": {
      return {
        address: boardRoomAddress,
        abi: BoardroomAbi,
      };
    }
  }
}
