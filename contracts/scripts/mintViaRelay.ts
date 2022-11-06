import { ethers, upgrades } from "hardhat";
import { ContractTransaction } from "ethers";
import { RelayClient } from "defender-relay-client";

import {
  DefenderRelayProvider,
  DefenderRelaySigner,
} from "defender-relay-client/lib/ethers";

async function main() {
  const beeper = await ethers.getContractAt(
    "BEEPER",
    process.env.BEEPER_ADDRESS!
  );

  const credentials = {
    apiKey: process.env.MAINNET_RELAY_API_KEY!,
    apiSecret: process.env.MAINNET_RELAY_SECRET_KEY!,
  };
  const provider = new DefenderRelayProvider(credentials);
  const signer = new DefenderRelaySigner(credentials, provider, {
    speed: "fast",
  });

  const mintTx = await beeper.connect(signer).safeMint("<WALLET HERE>");

  console.log(mintTx);

  await mintTx.wait();
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
