import { ethers, upgrades } from "hardhat";
import { ContractTransaction } from "ethers";
import { RelayClient } from "defender-relay-client";

import { PrismaClient } from "@prisma/client";

import { BigNumber } from "ethers";

import {
  DefenderRelayProvider,
  DefenderRelaySigner,
} from "defender-relay-client/lib/ethers";

async function main() {
  const beeper = await ethers.getContractAt(
    "BEEPER",
    process.env.BEEPER_ADDRESS!
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
    apiKey: process.env.MAINNET_RELAY_API_KEY!,
    apiSecret: process.env.MAINNET_RELAY_SECRET_KEY!,
  };
  const provider = new DefenderRelayProvider(credentials);
  const signer = new DefenderRelaySigner(credentials, provider, {
    speed: "fast",
  });

  const results = await Promise.all(
    usersWithWallets.map(async (user) => {
      if (user.wallet) {
        const walletBalance = (await beeper.balanceOf(user.wallet)).toNumber();

        if (walletBalance === 0) {
          console.log(`Airdropping beeper to ${user.wallet}`);

          const mintTx = await beeper.connect(signer).safeMint(user.wallet);

          console.log(mintTx);

          await mintTx.wait();

          console.log(`Successfully airdropped to ${user.wallet}`);

          await prisma.user.update({
            where: {
              id: user.id,
            },
            data: {
              hasClaimedAirdrop: true,
            },
          });
        }
      }
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
