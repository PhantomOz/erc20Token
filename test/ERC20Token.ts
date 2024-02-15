import {
  loadFixture,
} from "@nomicfoundation/hardhat-toolbox/network-helpers";
import { anyValue } from "@nomicfoundation/hardhat-chai-matchers/withArgs";
import { expect } from "chai";
import { ethers } from "hardhat";

describe("ERC20Token", function () {
  async function deployToken() {
    const NAME = "FavourToken";
    const SYMBOL = "FAVT";
    const DECIMAL = 18;
    const TOTALSUPPLY = 200000000000;

    // Contracts are deployed using the first signer/account by default
    const [owner, otherAccount] = await ethers.getSigners();

    const Token = await ethers.getContractFactory("ERC20Token");
    const token = await Token.deploy(NAME,SYMBOL,DECIMAL,TOTALSUPPLY);

    return { token, owner, otherAccount, NAME, SYMBOL, DECIMAL, TOTALSUPPLY};
  }

  describe("Deployment", function(){
    it("Should get the correct properties for the token", async function () {
      const {token, NAME, SYMBOL, DECIMAL, TOTALSUPPLY} = await loadFixture(deployToken);
      await expect(await token.name()).to.be.equals(NAME);
      await expect(await token.symbol()).to.be.equals(SYMBOL);
      await expect(await token.decimals()).to.be.equals(DECIMAL);
      const totalSupply = Number(await token.totalSupply())/(10**18);
      await expect(Number(totalSupply.toFixed(0))).to.be.equals(TOTALSUPPLY);
    });
    it("Should mint the totalSupply to the owner", async function(){
      const {token, owner} = await loadFixture(deployToken);
      await expect(await token.balanceOf(owner)).to.be.equals(await token.totalSupply());
    })
  });
  describe("Transfer", function(){
    it("Should revert if amount is greater than balance", async function(){
      const {token, owner, otherAccount} = await loadFixture(deployToken);
      await expect(token.connect(otherAccount).transfer(owner, 200)).to.be.revertedWith("Insufficient Balance");
    });
    it("Should revert if recipient is zero address", async function(){
      const {token} = await loadFixture(deployToken);
      const zeroAddress = await ethers.ZeroAddress;
      const amount = Number(2000e18).toFixed(0);
      await expect(token.transfer(zeroAddress, parseInt(amount))).to.be.revertedWith("Can't send to zero address");
    });
    it("Should burn 10% of the token about to be transferred and send the rest to the recipient", async function(){
      const {token, owner, otherAccount} = await loadFixture(deployToken);
      const zeroAddress = await ethers.ZeroAddress;
      const amount = 2000000;
      const cut = amount * 10 / 100;
      const amountToSend = amount - cut;
      const newTotalSupply = (parseInt(`${await token.totalSupply()}`) - cut)/(10**18);

      await expect(await token.transfer(otherAccount, amount)).to
        .emit(token, "Transfer").withArgs(owner, zeroAddress, cut)
        .emit(token, "Transfer").withArgs(owner, otherAccount, amountToSend);
      
      const totalSupply = Number(await token.totalSupply())/(10**18);
      await expect(totalSupply).to.be.equals(newTotalSupply);
    });
  });

  describe("Approve", function(){
    it("Should revert if spender is zero address", async function(){
      const {token} = await loadFixture(deployToken);
      const zeroAddress = await ethers.ZeroAddress;
      await expect(token.approve(zeroAddress, 20000000000)).to.be.revertedWith("Zero Address can't be a spender");
    });
    it("Should approve spender and emit Approval event get spender value", async function(){
      const {token, owner, otherAccount} = await loadFixture(deployToken);
      await expect(await token.approve(otherAccount, 20000000000)).to
        .emit(token, "Approval").withArgs(owner,otherAccount, 20000000000);

      await expect(await token.allowance(owner,otherAccount)).to.be.equals(20000000000);
    });
  });

  
});