import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import * as dotenv from "dotenv";
dotenv.config();

const config: HardhatUserConfig = {
  solidity: "0.8.18",
  networks: {
    sepolia: {
      url: `https://rpc.ankr.com/eth_sepolia`,
      accounts: [process.env.SEPOLIA_PRIVATE_KEY as string],
    },
  },
  mocha: {
    timeout: 100000000,
  },
};

export default config;
