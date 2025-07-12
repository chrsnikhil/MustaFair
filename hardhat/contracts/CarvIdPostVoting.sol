// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import "@openzeppelin/contracts/access/Ownable.sol";
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

contract CarvIdPostVoting is Ownable, ReentrancyGuard {
    
    // Simple post structure - only counters on-chain
    struct Post {
        uint256 postId;
        bool isActive;
        uint256 likes;
        uint256 dislikes;
        uint256 totalVotes;
    }
    
    // Vote tracking
    struct Vote {
        bool hasVoted;
        bool isLike;
        uint256 timestamp;
    }
    
    // State variables
    mapping(uint256 => Post) public posts; // postId => Post
    mapping(uint256 => mapping(address => Vote)) public votes; // postId => address => Vote
    
    IModularCarvID public carvIdContract;
    
    // Events
    event PostVoteCast(uint256 indexed postId, address indexed voter, bool isLike);
    event PostUpdated(uint256 indexed postId, uint256 likes, uint256 dislikes, uint256 totalVotes);
    
    constructor(address _carvIdContract) Ownable(msg.sender) {
        carvIdContract = IModularCarvID(_carvIdContract);
        
        // Initialize hardcoded posts (1-5) with only counters
        for (uint256 i = 1; i <= 5; i++) {
            posts[i] = Post({
                postId: i,
                isActive: true,
                likes: 0,
                dislikes: 0,
                totalVotes: 0
            });
        }
    }
    
    /**
     * @notice Check if user has CARV ID
     * @param user The user address to check
     */
    function hasUserCarvId(address user) public view returns (bool) {
        try carvIdContract.getReputationData(user) returns (
            uint256 carvTokenId,
            bytes32, // identitiesRoot - unused
            bytes32, // web2AchievementHash - unused
            string memory // reputationTier - unused
        ) {
            return carvTokenId != 0;
        } catch {
            return false;
        }
    }
    
    /**
     * @notice Vote on a hardcoded post (only CARV ID users)
     * @param postId The post ID (1-5)
     * @param isLike True for like, false for dislike
     */
    function voteOnPost(uint256 postId, bool isLike) external {
        require(hasUserCarvId(msg.sender), "Only CARV ID users can vote");
        require(postId >= 1 && postId <= 5, "Invalid post ID");
        require(posts[postId].isActive, "Post is not active");
        require(!votes[postId][msg.sender].hasVoted, "Already voted on this post");
        
        // Record the vote
        votes[postId][msg.sender] = Vote({
            hasVoted: true,
            isLike: isLike,
            timestamp: block.timestamp
        });
        
        // Update counters
        if (isLike) {
            posts[postId].likes++;
        } else {
            posts[postId].dislikes++;
        }
        posts[postId].totalVotes++;
        
        emit PostVoteCast(postId, msg.sender, isLike);
        emit PostUpdated(postId, posts[postId].likes, posts[postId].dislikes, posts[postId].totalVotes);
    }
    
    /**
     * @notice Get post counters
     * @param postId The post ID (1-5)
     */
    function getPost(uint256 postId) external view returns (
        uint256 id,
        bool isActive,
        uint256 likes,
        uint256 dislikes,
        uint256 totalVotes
    ) {
        require(postId >= 1 && postId <= 5, "Invalid post ID");
        Post memory post = posts[postId];
        return (
            post.postId,
            post.isActive,
            post.likes,
            post.dislikes,
            post.totalVotes
        );
    }
    
    /**
     * @notice Check if user has voted on a post
     * @param postId The post ID
     * @param user The user address
     */
    function hasUserVoted(uint256 postId, address user) external view returns (bool) {
        require(postId >= 1 && postId <= 5, "Invalid post ID");
        return votes[postId][user].hasVoted;
    }
    
    /**
     * @notice Get user's vote on a post
     * @param postId The post ID
     * @param user The user address
     */
    function getUserVote(uint256 postId, address user) external view returns (bool hasVoted, bool isLike) {
        require(postId >= 1 && postId <= 5, "Invalid post ID");
        Vote memory vote = votes[postId][user];
        return (vote.hasVoted, vote.isLike);
    }
    
    /**
     * @notice Get all posts counters
     */
    function getAllPosts() external view returns (
        uint256[5] memory postIds,
        bool[5] memory isActive,
        uint256[5] memory likes,
        uint256[5] memory dislikes,
        uint256[5] memory totalVotes
    ) {
        for (uint256 i = 0; i < 5; i++) {
            uint256 postId = i + 1;
            Post memory post = posts[postId];
            
            postIds[i] = post.postId;
            isActive[i] = post.isActive;
            likes[i] = post.likes;
            dislikes[i] = post.dislikes;
            totalVotes[i] = post.totalVotes;
        }
    }
    
    /**
     * @notice Update CARV ID contract address (only owner)
     */
    function updateCarvIdContract(address _carvIdContract) external onlyOwner {
        carvIdContract = IModularCarvID(_carvIdContract);
    }
    
    /**
     * @notice Toggle post active status (only owner)
     */
    function togglePostStatus(uint256 postId) external onlyOwner {
        require(postId >= 1 && postId <= 5, "Invalid post ID");
        posts[postId].isActive = !posts[postId].isActive;
    }
} 