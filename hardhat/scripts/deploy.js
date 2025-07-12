const { ethers } = require("hardhat");

async function main() {
  console.log("Deploying CarvIdPostVoting contract...");

  // Get the contract factory
  const CarvIdPostVoting = await ethers.getContractFactory("CarvIdPostVoting");
  
  // Use the existing CARV ID contract address from deployments.json
  const carvIdContractAddress = "0x59C3fed3153866A139e8efBA185da2BD083fF034"; // From your existing deployment
  
  const carvIdPostVoting = await CarvIdPostVoting.deploy(carvIdContractAddress);
  
  await carvIdPostVoting.waitForDeployment();
  
  const address = await carvIdPostVoting.getAddress();
  console.log("CarvIdPostVoting deployed to:", address);

  // Save deployment info
  const deploymentInfo = {
    contracts: {
      CarvIdPostVoting: {
        address: address,
        network: "BNB Testnet",
        chainId: 97
      }
    },
    deploymentTime: new Date().toISOString()
  };

  const fs = require('fs');
  const path = require('path');
  const deploymentsPath = path.join(__dirname, '..', 'deployments.json');
  
  fs.writeFileSync(deploymentsPath, JSON.stringify(deploymentInfo, null, 2));
  console.log("Deployment info saved to:", deploymentsPath);

  console.log("Deployment completed successfully!");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  }); 