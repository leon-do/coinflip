import { ethers } from "hardhat";

async function main() {
  const Coinflip = await ethers.getContractFactory("Coinflip");
  const coinflip = await Coinflip.deploy();
  const response = await coinflip.deployed();
  console.log(response);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
