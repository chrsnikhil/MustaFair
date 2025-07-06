import { ethers } from "hardhat";
import { writeFileSync } from "fs";
import { join } from "path";

async function main() {
  console.log("🚀 Starting deployment to BNB Testnet...");
  
  const [deployer] = await ethers.getSigners();
  console.log("Deploying contracts with the account:", deployer.address);
  console.log("Account balance:", (await deployer.provider.getBalance(deployer.address)).toString());

  // Deploy ModularCarvID first
  console.log("\n📝 Deploying ModularCarvID contract...");
  const ModularCarvID = await ethers.getContractFactory("ModularCarvID");
  const carvId = await ModularCarvID.deploy();
  await carvId.waitForDeployment();
  
  const carvIdAddress = await carvId.getAddress();
  console.log("✅ ModularCarvID deployed to:", carvIdAddress);

  // Deploy ReputationNFT with CarvID address
  console.log("\n🏆 Deploying ReputationNFT contract...");
  const ReputationNFT = await ethers.getContractFactory("ReputationNFT");
  const repNFT = await ReputationNFT.deploy(carvIdAddress);
  await repNFT.waitForDeployment();
  
  const repNFTAddress = await repNFT.getAddress();
  console.log("✅ ReputationNFT deployed to:", repNFTAddress);

  // Save deployment addresses
  const deploymentInfo = {
    network: "BNB Testnet",
    chainId: 97,
    deployedAt: new Date().toISOString(),
    contracts: {
      ModularCarvID: {
        address: carvIdAddress,
        name: "Modular CARV ID",
        symbol: "CARVID"
      },
      ReputationNFT: {
        address: repNFTAddress,
        name: "Reputation NFT",
        symbol: "REPNFT",
        carvIdContract: carvIdAddress
      }
    },
    deployer: deployer.address
  };

  // Write to deployment file
  const deploymentPath = join(__dirname, "..", "deployments.json");
  writeFileSync(deploymentPath, JSON.stringify(deploymentInfo, null, 2));
  console.log("📋 Deployment info saved to:", deploymentPath);

  // Write ABI files for frontend integration
  const libPath = join(__dirname, "..", "..", "lib");
  
  // ModularCarvID ABI
  const carvIdArtifact = await ethers.getContractFactory("ModularCarvID");
  writeFileSync(
    join(libPath, "ModularCarvID_ABI.json"),
    JSON.stringify(carvIdArtifact.interface.format(), null, 2)
  );

  // ReputationNFT ABI
  const repNFTArtifact = await ethers.getContractFactory("ReputationNFT");
  writeFileSync(
    join(libPath, "ReputationNFT_ABI.json"),
    JSON.stringify(repNFTArtifact.interface.format(), null, 2)
  );

  console.log("📄 ABI files saved to lib/ directory");

  console.log("\n🎉 Deployment completed successfully!");
  console.log("🔗 Next steps:");
  console.log("1. Verify contracts on BSCScan:");
  console.log(`   npx hardhat verify --network bnbTestnet ${carvIdAddress}`);
  console.log(`   npx hardhat verify --network bnbTestnet ${repNFTAddress} ${carvIdAddress}`);
  console.log("2. Update frontend configuration with new contract addresses");
  console.log("3. Test minting functionality");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Deployment failed:", error);
    process.exit(1);
  });
