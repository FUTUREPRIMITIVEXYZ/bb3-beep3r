import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import "@openzeppelin/hardhat-upgrades";

require("dotenv").config();

const config: HardhatUserConfig = {
  solidity: "0.8.17",
  paths: {
    sources: "./src",
  },
  networks: {
    goerli: {
      url: "https://eth-goerli.g.alchemy.com/v2/5p3QRor42JcFlS0GVX9XGrXO2Db4fNBg",
      accounts: [process.env.GOERLI_PRIVATE_KEY!],
      timeout: 1000000,
    },
  },
  etherscan: {
    apiKey: process.env.ETHERSCAN_API_KEY,
  },
  mocha: {
    timeout: 100000,
  },
};

export default config;
