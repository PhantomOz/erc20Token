import { ethers } from "hardhat";

async function main() {
  const NAME = "FavourToken";
  const SYMBOL = "FAVT";
  const DECIMAL = 18;
  const TOTALSUPPLY = 200000000000;

  const token = await ethers.deployContract("ERC20Token", [NAME, SYMBOL, DECIMAL, TOTALSUPPLY]);

  await token.waitForDeployment();

  console.log(
    `deployed to ${token.target}`
  );
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
