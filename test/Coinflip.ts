import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { expect } from "chai";
import { ethers } from "hardhat";

describe("Coinflip", function () {
  // We define a fixture to reuse the same setup in every test.
  // We use loadFixture to run this setup once, snapshot that state,
  // and reset Hardhat Network to that snapshot in every test.
  async function deployed() {
    // Contracts are deployed using the first signer/account by default
    const [owner, otherAccount] = await ethers.getSigners();

    const Coinflip = await ethers.getContractFactory("Coinflip");
    const coinflip = await Coinflip.deploy();

    // send ether to the contract
    const value = (await owner.getBalance()).div(2);
    await owner.sendTransaction({
      to: coinflip.address,
      value,
    });

    return { coinflip, owner, otherAccount, value };
  }

  describe("Deployment", function () {
    it("Should have ETH in contract", async function () {
      const { coinflip, value } = await loadFixture(deployed);
      expect(await ethers.provider.getBalance(coinflip.address)).to.equal(value);
    });
  });

  describe("Play Game", function () {
    it("Should revert if no value is sent", async function () {
      const { coinflip } = await loadFixture(deployed);
      const entropy = ethers.BigNumber.from(ethers.utils.randomBytes(32));
      coinflip.commit(entropy);
      coinflip.reveal({ value: 0 });
      await expect(coinflip.reveal()).to.be.revertedWith("Must send value");
    });

    it("Should flip a coin a bunch of times", async function () {
      let contractBalance;
      const { coinflip, owner } = await loadFixture(deployed);
      for (let i = 0; i < 5000; i++) {
        const entropy = ethers.BigNumber.from(ethers.utils.randomBytes(32));
        coinflip.commit(entropy);
        coinflip.reveal({ value: "100000000000000000" });
        contractBalance = await ethers.provider.getBalance(coinflip.address);
        console.log(`\nCasino Balance Game #${i}: ${contractBalance.toString()}`);
        console.log(`Player Balance: ${(await owner.getBalance()).toString()}`);
      }
      expect(contractBalance).to.greaterThan(await owner.getBalance());
    });
  });
});
