import { ethers, upgrades } from "hardhat";
import { ContractTransaction } from "ethers";
import { RelayClient } from "defender-relay-client";

import { PrismaClient } from "@prisma/client";

import {
  DefenderRelayProvider,
  DefenderRelaySigner,
} from "defender-relay-client/lib/ethers";

async function main() {
  const beeper = await ethers.getContractAt(
    "BEEPER",
    "0xe9d3fE575e44803613B6fbd64C8f4A55BE55ab83"
  );

  const prisma = new PrismaClient();

  const usersWithWallets = await prisma.user.findMany({
    where: {
      wallet: {
        not: null,
      },
    },
  });

  const credentials = {
    apiKey: process.env.GOERLI_RELAY_API_KEY!,
    apiSecret: process.env.GOERLI_RELAY_SECRET_KEY!,
  };
  const provider = new DefenderRelayProvider(credentials);
  const signer = new DefenderRelaySigner(credentials, provider, {
    speed: "fast",
  });

  const results = await Promise.all(
    usersWithWallets.map(async (user) => {
      // const mintTx = await beeper
      //   .connect(signer)
      //   .safeMint(user.wallet);

      console.log(user.wallet);

      // await prisma.user.update({
      //   where: {
      //     id: user.id,
      //   },
      //   data: {
      //     hasClaimedAirdrop: true,
      //   },
      // });
    })
  );

  console.log(results);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
