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

  const relayAddress = process.env.MAINNET_RELAY_ADDRESS!;

  // const credentials = {
  //   apiKey: process.env.GOERLI_RELAY_API_KEY!,
  //   apiSecret: process.env.GOERLI_RELAY_SECRET_KEY!,
  // };
  // const provider = new DefenderRelayProvider(credentials);
  // const signer = new DefenderRelaySigner(credentials, provider, {
  //   speed: "fast",
  // });

  const grantRelayMinterRoleTx = await beeper.grantRole(
    beeper.MINTER_ROLE(),
    relayAddress
  );

  console.log(grantRelayMinterRoleTx);

  await grantRelayMinterRoleTx.wait();
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
