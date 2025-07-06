// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Base64.sol";
import "@openzeppelin/contracts/utils/Strings.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

interface IModularCarvID {
    function getReputationData(address wallet) external view returns (
        uint256 tokenId,
        bytes32 identitiesRoot,
        bytes32 web2AchievementHash,
        string memory reputationTier
    );
    function walletToTokenId(address wallet) external view returns (uint256);
}

contract ReputationNFT is ERC721, Ownable, ReentrancyGuard {
    using Strings for uint256;

    // Reputation tiers
    enum Tier { Bronze, Silver, Gold, Platinum }
    
    // Reputation NFT metadata
    struct ReputationData {
        uint256 contributionScore;
        Tier tier;
        uint256 creationDate;
        bytes32 carvIdHash; // Link to CARV ID
        bool isActive;
    }

    // Voting system for tier upgrades
    struct TierUpgradeProposal {
        uint256 tokenId;
        Tier proposedTier;
        uint256 votesFor;
        uint256 votesAgainst;
        uint256 proposalDeadline;
        bool isExecuted;
        mapping(address => bool) hasVoted;
    }

    // Post voting system (gas-optimized)
    struct PostVote {
        uint256 votesFor;
        uint256 votesAgainst;
        uint256 votingDeadline;
        bool isExecuted;
        mapping(address => bool) hasVoted;
    }

    // State variables
    mapping(uint256 => ReputationData) public reputations;
    mapping(address => uint256) public walletToRepNFT;
    mapping(uint256 => TierUpgradeProposal) public tierUpgradeProposals;
    mapping(uint256 => PostVote) public postVotes; // New: Post voting storage
    
    IModularCarvID public carvIdContract;
    uint256 private _nextTokenId = 1;
    uint256 private _nextProposalId = 1;
    uint256 private _nextPostId = 1; // New: Post ID counter
    uint256 public constant VOTING_PERIOD = 7 days;
    uint256 public constant MIN_VOTES_REQUIRED = 3; // Minimum votes for proposal to pass
    uint256 public constant POST_VOTING_PERIOD = 7 days; // New: Post voting period

    // Events
    event ReputationNFTMinted(
        address indexed user, 
        uint256 indexed tokenId, 
        uint256 contributionScore, 
        Tier tier,
        bytes32 carvIdHash
    );
    event TierUpgradeProposed(
        uint256 indexed proposalId,
        uint256 indexed tokenId,
        Tier currentTier,
        Tier proposedTier,
        address proposer
    );
    event VoteCast(
        uint256 indexed proposalId,
        address indexed voter,
        bool support,
        string reason
    );
    event TierUpgraded(
        uint256 indexed tokenId,
        Tier oldTier,
        Tier newTier
    );
    event ContributionScoreUpdated(
        uint256 indexed tokenId,
        uint256 oldScore,
        uint256 newScore
    );
    // New: Post voting events
    event PostVoteCast(
        uint256 indexed postId,
        address indexed voter,
        bool support
    );
    event PostExecuted(
        uint256 indexed postId,
        bool passed
    );

    constructor(address _carvIdContract) ERC721("Reputation NFT", "REPNFT") Ownable(msg.sender) {
        carvIdContract = IModularCarvID(_carvIdContract);
    }

    /**
     * @notice Mint a new Reputation NFT with CARV ID integration
     * @param contributionScore Initial contribution score
     * @param tier Initial reputation tier
     */
    function mintReputationNFT(
        uint256 contributionScore,
        Tier tier
    ) external nonReentrant {
        require(walletToRepNFT[msg.sender] == 0, "Already has reputation NFT");
        
        // Get CARV ID data
        bytes32 carvIdHash = bytes32(0);
        try carvIdContract.getReputationData(msg.sender) returns (
            uint256 carvTokenId,
            bytes32 identitiesRoot,
            bytes32 web2AchievementHash,
            string memory reputationTier
        ) {
            if (carvTokenId != 0) {
                carvIdHash = keccak256(abi.encodePacked(identitiesRoot, web2AchievementHash));
            }
        } catch {
            // If no CARV ID exists, continue with empty hash
        }

        uint256 tokenId = _nextTokenId++;
        _safeMint(msg.sender, tokenId);
        
        reputations[tokenId] = ReputationData({
            contributionScore: contributionScore,
            tier: tier,
            creationDate: block.timestamp,
            carvIdHash: carvIdHash,
            isActive: true
        });
        
        walletToRepNFT[msg.sender] = tokenId;
        
        emit ReputationNFTMinted(msg.sender, tokenId, contributionScore, tier, carvIdHash);
    }

    /**
     * @notice Propose a tier upgrade for a reputation NFT
     * @param tokenId The NFT token ID to upgrade
     * @param proposedTier The proposed new tier
     */
    function proposeTierUpgrade(
        uint256 tokenId,
        Tier proposedTier
    ) external {
        require(_ownerOf(tokenId) != address(0), "Token does not exist");
        require(reputations[tokenId].isActive, "NFT is not active");
        require(proposedTier > reputations[tokenId].tier, "Can only upgrade to higher tier");
        
        uint256 proposalId = _nextProposalId++;
        TierUpgradeProposal storage proposal = tierUpgradeProposals[proposalId];
        
        proposal.tokenId = tokenId;
        proposal.proposedTier = proposedTier;
        proposal.proposalDeadline = block.timestamp + VOTING_PERIOD;
        proposal.isExecuted = false;
        
        emit TierUpgradeProposed(
            proposalId,
            tokenId,
            reputations[tokenId].tier,
            proposedTier,
            msg.sender
        );
    }

    /**
     * @notice Vote on a tier upgrade proposal
     * @param proposalId The proposal ID to vote on
     * @param support True to vote for, false to vote against
     * @param reason Optional reason for the vote
     */
    function voteOnTierUpgrade(
        uint256 proposalId,
        bool support,
        string memory reason
    ) external {
        TierUpgradeProposal storage proposal = tierUpgradeProposals[proposalId];
        
        require(block.timestamp <= proposal.proposalDeadline, "Voting period ended");
        require(!proposal.isExecuted, "Proposal already executed");
        require(!proposal.hasVoted[msg.sender], "Already voted");
        require(balanceOf(msg.sender) > 0, "Must own a reputation NFT to vote");
        
        proposal.hasVoted[msg.sender] = true;
        
        if (support) {
            proposal.votesFor++;
        } else {
            proposal.votesAgainst++;
        }
        
        emit VoteCast(proposalId, msg.sender, support, reason);
    }

    /**
     * @notice Execute a tier upgrade proposal if it passed
     * @param proposalId The proposal ID to execute
     */
    function executeTierUpgrade(uint256 proposalId) external {
        TierUpgradeProposal storage proposal = tierUpgradeProposals[proposalId];
        
        require(block.timestamp > proposal.proposalDeadline, "Voting period not ended");
        require(!proposal.isExecuted, "Proposal already executed");
        require(
            proposal.votesFor > proposal.votesAgainst && 
            proposal.votesFor >= MIN_VOTES_REQUIRED,
            "Proposal did not pass"
        );
        
        proposal.isExecuted = true;
        
        Tier oldTier = reputations[proposal.tokenId].tier;
        reputations[proposal.tokenId].tier = proposal.proposedTier;
        
        emit TierUpgraded(proposal.tokenId, oldTier, proposal.proposedTier);
    }

    /**
     * @notice Update contribution score (only owner or token holder)
     * @param tokenId The NFT token ID
     * @param newScore The new contribution score
     */
    function updateContributionScore(uint256 tokenId, uint256 newScore) external {
        require(
            ownerOf(tokenId) == msg.sender || owner() == msg.sender,
            "Not authorized to update score"
        );
        require(reputations[tokenId].isActive, "NFT is not active");
        
        uint256 oldScore = reputations[tokenId].contributionScore;
        reputations[tokenId].contributionScore = newScore;
        
        emit ContributionScoreUpdated(tokenId, oldScore, newScore);
    }

    /**
     * @notice Get reputation data for a wallet address
     * @param wallet The wallet address to query
     */
    function getReputationByWallet(address wallet) external view returns (
        uint256 tokenId,
        uint256 contributionScore,
        Tier tier,
        uint256 creationDate,
        bytes32 carvIdHash,
        bool isActive
    ) {
        tokenId = walletToRepNFT[wallet];
        require(tokenId != 0, "No reputation NFT found");
        
        ReputationData memory rep = reputations[tokenId];
        return (
            tokenId,
            rep.contributionScore,
            rep.tier,
            rep.creationDate,
            rep.carvIdHash,
            rep.isActive
        );
    }

    /**
     * @notice Get proposal details
     * @param proposalId The proposal ID to query
     */
    function getProposal(uint256 proposalId) external view returns (
        uint256 tokenId,
        Tier proposedTier,
        uint256 votesFor,
        uint256 votesAgainst,
        uint256 proposalDeadline,
        bool isExecuted
    ) {
        TierUpgradeProposal storage proposal = tierUpgradeProposals[proposalId];
        return (
            proposal.tokenId,
            proposal.proposedTier,
            proposal.votesFor,
            proposal.votesAgainst,
            proposal.proposalDeadline,
            proposal.isExecuted
        );
    }

    /**
     * @notice Check if an address has voted on a proposal
     * @param proposalId The proposal ID
     * @param voter The voter address
     */
    function hasVotedOnProposal(uint256 proposalId, address voter) external view returns (bool) {
        return tierUpgradeProposals[proposalId].hasVoted[voter];
    }

    /**
     * @notice Convert tier enum to string
     * @param tier The tier to convert
     */
    function tierToString(Tier tier) public pure returns (string memory) {
        if (tier == Tier.Bronze) return "Bronze";
        if (tier == Tier.Silver) return "Silver";
        if (tier == Tier.Gold) return "Gold";
        if (tier == Tier.Platinum) return "Platinum";
        return "Unknown";
    }

    /**
     * @notice Generate metadata JSON for the NFT
     * @param tokenId The token ID to generate metadata for
     */
    function tokenURI(uint256 tokenId) public view override returns (string memory) {
        require(_ownerOf(tokenId) != address(0), "ERC721Metadata: URI query for nonexistent token");
        
        ReputationData memory rep = reputations[tokenId];
        string memory tierStr = tierToString(rep.tier);
        
        // Generate dynamic image based on tier
        string memory imageUrl = string(abi.encodePacked(
            "https://api.dicebear.com/7.x/shapes/svg?seed=",
            tokenId.toString(),
            "&backgroundColor=",
            _getTierColor(rep.tier)
        ));
        
        string memory json = Base64.encode(
            bytes(
                string(
                    abi.encodePacked(
                        '{"name":"Reputation NFT #', tokenId.toString(), '",',
                        '"description":"Decentralized Reputation NFT with CARV ID Integration",',
                        '"image":"', imageUrl, '",',
                        '"attributes":[',
                            '{"trait_type":"Contribution Score","value":', rep.contributionScore.toString(), '},',
                            '{"trait_type":"Tier","value":"', tierStr, '"},',
                            '{"trait_type":"Creation Date","value":', rep.creationDate.toString(), '},',
                            '{"trait_type":"Network","value":"BNB Testnet"},',
                            '{"trait_type":"CARV ID Linked","value":"', (rep.carvIdHash != bytes32(0) ? "Yes" : "No"), '"},',
                            '{"trait_type":"Status","value":"', (rep.isActive ? "Active" : "Inactive"), '"}',
                        ']}'
                    )
                )
            )
        );
        return string(abi.encodePacked("data:application/json;base64,", json));
    }

    /**
     * @notice Get tier color for image generation
     * @param tier The tier to get color for
     */
    function _getTierColor(Tier tier) internal pure returns (string memory) {
        if (tier == Tier.Bronze) return "CD7F32";
        if (tier == Tier.Silver) return "C0C0C0";
        if (tier == Tier.Gold) return "FFD700";
        if (tier == Tier.Platinum) return "E5E4E2";
        return "8B4513"; // Default brown
    }

    /**
     * @notice Update CARV ID contract address (only owner)
     * @param _carvIdContract New CARV ID contract address
     */
    function updateCarvIdContract(address _carvIdContract) external onlyOwner {
        carvIdContract = IModularCarvID(_carvIdContract);
    }

    /**
     * @notice Emergency function to deactivate an NFT (only owner)
     * @param tokenId The token ID to deactivate
     */
    function deactivateNFT(uint256 tokenId) external onlyOwner {
        require(_ownerOf(tokenId) != address(0), "Token does not exist");
        reputations[tokenId].isActive = false;
    }

    /**
     * @notice Vote on a post (gas-optimized version)
     * @param postId The post ID to vote on
     * @param support True to vote for, false to vote against
     */
    function voteOnPost(
        uint256 postId,
        bool support
    ) external {
        PostVote storage vote = postVotes[postId];
        
        require(block.timestamp <= vote.votingDeadline, "Voting period ended");
        require(!vote.isExecuted, "Post already executed");
        require(!vote.hasVoted[msg.sender], "Already voted");
        require(balanceOf(msg.sender) > 0, "Must own a reputation NFT to vote");
        
        vote.hasVoted[msg.sender] = true;
        
        if (support) {
            vote.votesFor++;
        } else {
            vote.votesAgainst++;
        }
        
        emit PostVoteCast(postId, msg.sender, support);
    }

    /**
     * @notice Execute a post vote if it passed
     * @param postId The post ID to execute
     */
    function executePost(uint256 postId) external {
        PostVote storage vote = postVotes[postId];
        
        require(block.timestamp > vote.votingDeadline, "Voting period not ended");
        require(!vote.isExecuted, "Post already executed");
        require(
            vote.votesFor > vote.votesAgainst && 
            vote.votesFor >= MIN_VOTES_REQUIRED,
            "Post did not pass"
        );
        
        vote.isExecuted = true;
        
        emit PostExecuted(postId, true);
    }

    /**
     * @notice Create a new post for voting
     * @param votingDeadline The deadline for voting (timestamp)
     */
    function createPost(uint256 votingDeadline) external {
        require(votingDeadline > block.timestamp, "Deadline must be in the future");
        require(balanceOf(msg.sender) > 0, "Must own a reputation NFT to create posts");
        
        uint256 postId = _nextPostId++;
        PostVote storage vote = postVotes[postId];
        
        vote.votingDeadline = votingDeadline;
        vote.isExecuted = false;
    }

    /**
     * @notice Get post vote details
     * @param postId The post ID to query
     */
    function getPostVote(uint256 postId) external view returns (
        uint256 votesFor,
        uint256 votesAgainst,
        uint256 votingDeadline,
        bool isExecuted
    ) {
        PostVote storage vote = postVotes[postId];
        return (
            vote.votesFor,
            vote.votesAgainst,
            vote.votingDeadline,
            vote.isExecuted
        );
    }

    /**
     * @notice Check if an address has voted on a post
     * @param postId The post ID
     * @param voter The voter address
     */
    function hasVotedOnPost(uint256 postId, address voter) external view returns (bool) {
        return postVotes[postId].hasVoted[voter];
    }
}
