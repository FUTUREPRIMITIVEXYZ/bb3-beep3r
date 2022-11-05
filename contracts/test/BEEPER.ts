import { time, loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { anyValue } from "@nomicfoundation/hardhat-chai-matchers/withArgs";
import { expect } from "chai";
import { ethers, upgrades } from "hardhat";

import { ContractTransaction } from "ethers";

describe("BEEPER", function () {
  it("Should deploy upgradable", async function () {
    const BEEPER = await ethers.getContractFactory("BEEPER");
    const beeper = await upgrades.deployProxy(BEEPER);
    await beeper.deployed();
  });

  it("Should set baseURI", async function () {
    const BEEPER = await ethers.getContractFactory("BEEPER");
    const beeper = await upgrades.deployProxy(BEEPER);
    await beeper.deployed();

    await beeper
      .setBaseURI("https://beeper.bb3.xyz/api/metadata/")
      .then((tx: ContractTransaction) => tx.wait());

    const [deployer] = await ethers.getSigners();

    await beeper
      .safeMint(deployer.address)
      .then((tx: ContractTransaction) => tx.wait());

    expect(await beeper.tokenURI(1)).to.eq(
      "https://beeper.bb3.xyz/api/metadata/1"
    );
  });
});
