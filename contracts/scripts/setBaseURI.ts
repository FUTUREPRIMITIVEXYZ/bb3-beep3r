import { ethers, upgrades } from "hardhat";
import { ContractTransaction } from "ethers";

async function main() {
  const beeper = await ethers.getContractAt(
    "BEEPER",
    process.env.BEEPER_ADDRESS!
  );

  console.log("Setting baseURI...");

  const setBaseURITx = await beeper.setBaseURI(
    "https://beeper.bb3.xyz/api/metadata/"
  );

  console.log(setBaseURITx);

  await setBaseURITx.wait();

  console.log(`BEEPER Address: ${beeper.address}`);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
