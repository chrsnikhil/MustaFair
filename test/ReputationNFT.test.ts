import { expect } from "chai";
import { ethers } from "hardhat";
import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { time } from "@nomicfoundation/hardhat-network-helpers";

describe("ReputationNFT", function () {
  async function deployContractsFixture() {
    const [owner, user1, user2, user3] = await ethers.getSigners();

    // Deploy ModularCarvID first
    const ModularCarvID = await ethers.getContractFactory("ModularCarvID");
    const carvId = await ModularCarvID.deploy();
    await carvId.waitForDeployment();

    // Deploy ReputationNFT
    const ReputationNFT = await ethers.getContractFactory("ReputationNFT");
    const repNFT = await ReputationNFT.deploy(await carvId.getAddress());
    await repNFT.waitForDeployment();

    return { carvId, repNFT, owner, user1, user2, user3 };
  }

  describe("Deployment", function () {
    it("Should deploy with correct CARV ID contract address", async function () {
      const { carvId, repNFT } = await loadFixture(deployContractsFixture);
      expect(await repNFT.carvIdContract()).to.equal(await carvId.getAddress());
    });

    it("Should have correct name and symbol", async function () {
      const { repNFT } = await loadFixture(deployContractsFixture);
      expect(await repNFT.name()).to.equal("Reputation NFT");
      expect(await repNFT.symbol()).to.equal("REPNFT");
    });
  });

  describe("Minting", function () {
    it("Should mint a reputation NFT successfully", async function () {
      const { repNFT, user1 } = await loadFixture(deployContractsFixture);
      
      const contributionScore = 1500;
      const tier = 1; // Silver
      
      await expect(repNFT.connect(user1).mintReputationNFT(contributionScore, tier))
        .to.emit(repNFT, "ReputationNFTMinted")
        .withArgs(user1.address, 1, contributionScore, tier, "0x0000000000000000000000000000000000000000000000000000000000000000");
      
      expect(await repNFT.balanceOf(user1.address)).to.equal(1);
      expect(await repNFT.ownerOf(1)).to.equal(user1.address);
      expect(await repNFT.walletToRepNFT(user1.address)).to.equal(1);
    });

    it("Should prevent minting multiple NFTs for same address", async function () {
      const { repNFT, user1 } = await loadFixture(deployContractsFixture);
      
      await repNFT.connect(user1).mintReputationNFT(1000, 0);
      
      await expect(repNFT.connect(user1).mintReputationNFT(1500, 1))
        .to.be.revertedWith("Already has reputation NFT");
    });

    it("Should integrate with CARV ID when available", async function () {
      const { carvId, repNFT, user1 } = await loadFixture(deployContractsFixture);
      
      // First mint a CARV ID
      const identitiesRoot = ethers.keccak256(ethers.toUtf8Bytes("test_identity"));
      await carvId.connect(user1).mintCarvId(identitiesRoot);
      
      // Update Web2 achievements
      const achievementHash = ethers.keccak256(ethers.toUtf8Bytes("achievements"));
      await carvId.connect(user1).updateWeb2Achievements(achievementHash, "Gold");
      
      // Now mint reputation NFT
      await repNFT.connect(user1).mintReputationNFT(2000, 2);
      
      const repData = await repNFT.getReputationByWallet(user1.address);
      expect(repData.carvIdHash).to.not.equal("0x0000000000000000000000000000000000000000000000000000000000000000");
    });
  });

  describe("Tier Upgrade Proposals", function () {
    it("Should create a tier upgrade proposal", async function () {
      const { repNFT, user1, user2 } = await loadFixture(deployContractsFixture);
      
      // Mint NFT first
      await repNFT.connect(user1).mintReputationNFT(1000, 0); // Bronze
      
      // Propose upgrade to Silver
      await expect(repNFT.connect(user2).proposeTierUpgrade(1, 1))
        .to.emit(repNFT, "TierUpgradeProposed")
        .withArgs(1, 1, 0, 1, user2.address);
      
      const proposal = await repNFT.getProposal(1);
      expect(proposal.tokenId).to.equal(1);
      expect(proposal.proposedTier).to.equal(1);
      expect(proposal.isExecuted).to.be.false;
    });

    it("Should only allow upgrades to higher tiers", async function () {
      const { repNFT, user1, user2 } = await loadFixture(deployContractsFixture);
      
      await repNFT.connect(user1).mintReputationNFT(1000, 1); // Silver
      
      // Try to propose downgrade to Bronze
      await expect(repNFT.connect(user2).proposeTierUpgrade(1, 0))
        .to.be.revertedWith("Can only upgrade to higher tier");
    });

    it("Should allow voting on proposals", async function () {
      const { repNFT, user1, user2, user3 } = await loadFixture(deployContractsFixture);
      
      // Mint NFTs for voters
      await repNFT.connect(user1).mintReputationNFT(1000, 0);
      await repNFT.connect(user2).mintReputationNFT(1200, 0);
      await repNFT.connect(user3).mintReputationNFT(800, 0);
      
      // Create proposal
      await repNFT.connect(user1).proposeTierUpgrade(1, 1);
      
      // Vote on proposal
      await expect(repNFT.connect(user2).voteOnTierUpgrade(1, true, "Good contributor"))
        .to.emit(repNFT, "VoteCast")
        .withArgs(1, user2.address, true, "Good contributor");
      
      await repNFT.connect(user3).voteOnTierUpgrade(1, false, "Need more proof");
      
      const proposal = await repNFT.getProposal(1);
      expect(proposal.votesFor).to.equal(1);
      expect(proposal.votesAgainst).to.equal(1);
    });

    it("Should prevent double voting", async function () {
      const { repNFT, user1, user2 } = await loadFixture(deployContractsFixture);
      
      await repNFT.connect(user1).mintReputationNFT(1000, 0);
      await repNFT.connect(user2).mintReputationNFT(1200, 0);
      
      await repNFT.connect(user1).proposeTierUpgrade(1, 1);
      await repNFT.connect(user2).voteOnTierUpgrade(1, true, "First vote");
      
      await expect(repNFT.connect(user2).voteOnTierUpgrade(1, false, "Second vote"))
        .to.be.revertedWith("Already voted");
    });

    it("Should execute successful proposals", async function () {
      const { repNFT, user1, user2, user3, owner } = await loadFixture(deployContractsFixture);
      
      // Mint NFTs for voters
      await repNFT.connect(user1).mintReputationNFT(1000, 0);
      await repNFT.connect(user2).mintReputationNFT(1200, 0);
      await repNFT.connect(user3).mintReputationNFT(800, 0);
      await repNFT.connect(owner).mintReputationNFT(1500, 1);
      
      // Create proposal
      await repNFT.connect(user1).proposeTierUpgrade(1, 1);
      
      // Vote in favor (need at least 3 votes)
      await repNFT.connect(user2).voteOnTierUpgrade(1, true, "Support");
      await repNFT.connect(user3).voteOnTierUpgrade(1, true, "Agree");
      await repNFT.connect(owner).voteOnTierUpgrade(1, true, "Yes");
      
      // Fast forward past voting period
      await time.increase(7 * 24 * 60 * 60 + 1); // 7 days + 1 second
      
      // Execute proposal
      await expect(repNFT.connect(user1).executeTierUpgrade(1))
        .to.emit(repNFT, "TierUpgraded")
        .withArgs(1, 0, 1);
      
      const repData = await repNFT.getReputationByWallet(user1.address);
      expect(repData.tier).to.equal(1); // Should be upgraded to Silver
    });

    it("Should not execute failed proposals", async function () {
      const { repNFT, user1, user2, user3 } = await loadFixture(deployContractsFixture);
      
      await repNFT.connect(user1).mintReputationNFT(1000, 0);
      await repNFT.connect(user2).mintReputationNFT(1200, 0);
      await repNFT.connect(user3).mintReputationNFT(800, 0);
      
      await repNFT.connect(user1).proposeTierUpgrade(1, 1);
      
      // Vote against
      await repNFT.connect(user2).voteOnTierUpgrade(1, false, "Against");
      await repNFT.connect(user3).voteOnTierUpgrade(1, false, "No");
      
      await time.increase(7 * 24 * 60 * 60 + 1);
      
      await expect(repNFT.connect(user1).executeTierUpgrade(1))
        .to.be.revertedWith("Proposal did not pass");
    });
  });

  describe("Score Updates", function () {
    it("Should allow token owner to update score", async function () {
      const { repNFT, user1 } = await loadFixture(deployContractsFixture);
      
      await repNFT.connect(user1).mintReputationNFT(1000, 0);
      
      await expect(repNFT.connect(user1).updateContributionScore(1, 1500))
        .to.emit(repNFT, "ContributionScoreUpdated")
        .withArgs(1, 1000, 1500);
      
      const repData = await repNFT.getReputationByWallet(user1.address);
      expect(repData.contributionScore).to.equal(1500);
    });

    it("Should allow contract owner to update any score", async function () {
      const { repNFT, user1, owner } = await loadFixture(deployContractsFixture);
      
      await repNFT.connect(user1).mintReputationNFT(1000, 0);
      
      await expect(repNFT.connect(owner).updateContributionScore(1, 2000))
        .to.emit(repNFT, "ContributionScoreUpdated")
        .withArgs(1, 1000, 2000);
    });

    it("Should prevent unauthorized score updates", async function () {
      const { repNFT, user1, user2 } = await loadFixture(deployContractsFixture);
      
      await repNFT.connect(user1).mintReputationNFT(1000, 0);
      
      await expect(repNFT.connect(user2).updateContributionScore(1, 1500))
        .to.be.revertedWith("Not authorized to update score");
    });
  });

  describe("Token URI", function () {
    it("Should generate valid metadata", async function () {
      const { repNFT, user1 } = await loadFixture(deployContractsFixture);
      
      await repNFT.connect(user1).mintReputationNFT(1500, 2); // Gold
      
      const tokenURI = await repNFT.tokenURI(1);
      expect(tokenURI).to.include("data:application/json;base64,");
      
      // Decode and parse metadata
      const base64Data = tokenURI.replace("data:application/json;base64,", "");
      const metadata = JSON.parse(Buffer.from(base64Data, "base64").toString("utf8"));
      
      expect(metadata.name).to.equal("Reputation NFT #1");
      expect(metadata.description).to.include("Decentralized Reputation NFT");
      expect(metadata.attributes).to.be.an("array");
      
      // Check for required attributes
      const attributes = metadata.attributes;
      const scoreAttr = attributes.find((attr: any) => attr.trait_type === "Contribution Score");
      const tierAttr = attributes.find((attr: any) => attr.trait_type === "Tier");
      
      expect(scoreAttr.value).to.equal(1500);
      expect(tierAttr.value).to.equal("Gold");
    });
  });

  describe("Admin Functions", function () {
    it("Should allow owner to update CARV ID contract", async function () {
      const { repNFT, owner } = await loadFixture(deployContractsFixture);
      
      const newAddress = "0x1234567890123456789012345678901234567890";
      await repNFT.connect(owner).updateCarvIdContract(newAddress);
      
      expect(await repNFT.carvIdContract()).to.equal(newAddress);
    });

    it("Should allow owner to deactivate NFTs", async function () {
      const { repNFT, user1, owner } = await loadFixture(deployContractsFixture);
      
      await repNFT.connect(user1).mintReputationNFT(1000, 0);
      await repNFT.connect(owner).deactivateNFT(1);
      
      const repData = await repNFT.getReputationByWallet(user1.address);
      expect(repData.isActive).to.be.false;
    });

    it("Should prevent non-owners from admin functions", async function () {
      const { repNFT, user1 } = await loadFixture(deployContractsFixture);
      
      const newAddress = "0x1234567890123456789012345678901234567890";
      
      await expect(repNFT.connect(user1).updateCarvIdContract(newAddress))
        .to.be.revertedWithCustomError(repNFT, "OwnableUnauthorizedAccount");
      
      await expect(repNFT.connect(user1).deactivateNFT(1))
        .to.be.revertedWithCustomError(repNFT, "OwnableUnauthorizedAccount");
    });
  });
});
