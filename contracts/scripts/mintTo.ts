import { ethers, upgrades } from "hardhat";
import { ContractTransaction } from "ethers";

async function main() {
  const beeper = await ethers.getContractAt(
    "BEEPER",
    "0xe9d3fE575e44803613B6fbd64C8f4A55BE55ab83"
  );

  console.log("minting...");

  const mintTx = await beeper.safeMint(
    "0xC3eb8b7b5dD7a338Af0B8c692c378Fca5285aE72"
  );

  console.log(mintTx);

  await mintTx.wait();

  console.log("done.");
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
