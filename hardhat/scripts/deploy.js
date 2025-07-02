const hre = require("hardhat");

async function main() {
  const ModularCarvID = await hre.ethers.getContractFactory("ModularCarvID");
  const contract = await ModularCarvID.deploy();
  console.log("ModularCarvID deployed to:", contract.target);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
}); 