import { ethers, upgrades } from "hardhat";
import { ContractTransaction } from "ethers";

async function main() {
  console.log("Deploying address...");

  const BEEPER = await ethers.getContractFactory("BEEPER");
  const beeper = await upgrades.deployProxy(BEEPER);

  await beeper.deployed();

  console.log(`BEEPER Address: ${beeper.address}`);

  console.log("Setting baseURI...");

  const setBaseURITx = await beeper.setBaseURI(
    "https://beeper.bb3.xyz/api/metadata/"
  );

  console.log(setBaseURITx);

  await setBaseURITx.wait();

  console.log("done");
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
