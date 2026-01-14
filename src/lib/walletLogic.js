import { ethers } from "ethers";

export function createVault() {
  const wallet = ethers.Wallet.createRandom();

  const eccPrivateKey = wallet.privateKey;
  const eccPublicKey  = ethers.utils.computePublicKey(eccPrivateKey, false);

  const qsPublicKey  = ethers.utils.hexlify(ethers.utils.randomBytes(96));
  const qsPrivateKey = ethers.utils.hexlify(ethers.utils.randomBytes(96));

  return {
    wallet,
    address: wallet.address,
    eccPublicKey,
    eccPrivateKey,
    qsPublicKey,
    qsPrivateKey,
    // start at 0, user will deposit stablecoin
    balanceWei: ethers.utils.parseEther("0.0"),
  };
}

export async function simulateTransaction({
  wallet,
  from,
  to,
  amountWei,
  gasLimit = 21000,
  maxFeePerGasGwei = 20,
  maxPriorityFeePerGasGwei = 5,
  nonce = 0,
  chainId = 1,
}) {
  const payload = JSON.stringify({
    from,
    to,
    amountWei: amountWei.toString(),
    gasLimit,
    maxFeePerGasGwei,
    maxPriorityFeePerGasGwei,
    nonce,
    chainId,
  });

  const txHash = ethers.utils.keccak256(ethers.utils.toUtf8Bytes(payload));

  const eccSignatureHex = await wallet.signMessage(
    ethers.utils.toUtf8Bytes(txHash)
  );
  const eccSig = ethers.utils.splitSignature(eccSignatureHex);

  const saltHex = ethers.utils
    .hexlify(ethers.utils.randomBytes(16))
    .replace("0x", "");
  const qsSignature = ethers.utils.keccak256(
    ethers.utils.toUtf8Bytes(
      txHash + eccSig.r.replace("0x", "") + eccSig.s.replace("0x", "") + saltHex
    )
  );

  return {
    tx: {
      hash: txHash,
      from,
      to,
      valueWei: amountWei,
      gasLimit,
      maxFeePerGasGwei,
      maxPriorityFeePerGasGwei,
      nonce,
      chainId,
    },
    ecc: {
      signatureHex: eccSignatureHex,
      v: "0x" + eccSig.v.toString(16),
      r: eccSig.r,
      s: eccSig.s,
    },
    qs: {
      signature: qsSignature,
    },
  };
}


export function formatAmount(weiBigNumber, unitLabel = "") {
  const as = Number(ethers.utils.formatEther(weiBigNumber)).toFixed(3);
  return unitLabel ? `${as} ${unitLabel}` : as;
}

export function parseEthToWei(amountEth) {
  return ethers.utils.parseEther(String(amountEth));
}
