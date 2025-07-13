// SPDX-License-Identifier: CC0-1.0
pragma solidity ^0.8.17;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Base64.sol";
import "@openzeppelin/contracts/utils/Strings.sol";

contract ModularCarvID is ERC721, Ownable {
    // Mapping from tokenId to identities root hash
    mapping(uint256 => bytes32) private _identitiesRoot;
    // Mapping from wallet address to tokenId (1:1 mapping)
    mapping(address => uint256) public walletToTokenId;
    // Mapping from tokenId to Web2 achievement hash
    mapping(uint256 => bytes32) private _web2AchievementHash;
    // Mapping from tokenId to reputation tier
    mapping(uint256 => string) private _reputationTier;

    event CarvIdMinted(address indexed user, uint256 indexed tokenId, bytes32 identitiesRoot);
    event Web2AchievementsUpdated(uint256 indexed tokenId, bytes32 achievementHash, string tier);

    uint256 private _nextTokenId = 1; // Start at 1 to avoid 0/null confusion

    constructor() ERC721("Modular CARV ID", "CARVID") Ownable(msg.sender) {}

    /**
     * @notice Mint a new CARV ID NFT, binding the user's identity hash.
     * @param identitiesRoot The hash of the user's aggregated identities (Web2 + Web3)
     */
    function mintCarvId(bytes32 identitiesRoot) external {
        require(walletToTokenId[msg.sender] == 0, "Already minted");
        uint256 tokenId = _nextTokenId++;
        _safeMint(msg.sender, tokenId);
        _identitiesRoot[tokenId] = identitiesRoot;
        walletToTokenId[msg.sender] = tokenId;
        emit CarvIdMinted(msg.sender, tokenId, identitiesRoot);
    }

    /**
     * @notice Update Web2 achievements for a CARV ID.
     * @param achievementHash Hash of the Web2 achievement data
     * @param tier Reputation tier (Bronze, Silver, Gold, Platinum)
     */
    function updateWeb2Achievements(bytes32 achievementHash, string memory tier) external {
        uint256 tokenId = walletToTokenId[msg.sender];
        require(tokenId != 0, "No CARV ID found");
        require(ownerOf(tokenId) == msg.sender, "Not token owner");
        
        _web2AchievementHash[tokenId] = achievementHash;
        _reputationTier[tokenId] = tier;
        
        emit Web2AchievementsUpdated(tokenId, achievementHash, tier);
    }

    /**
     * @notice Get the identities root for a given tokenId.
     */
    function getIdentitiesRoot(uint256 tokenId) external view returns (bytes32) {
        return _identitiesRoot[tokenId];
    }

    /**
     * @notice Get Web2 achievement hash for a given tokenId.
     */
    function getWeb2AchievementHash(uint256 tokenId) external view returns (bytes32) {
        return _web2AchievementHash[tokenId];
    }

    /**
     * @notice Get reputation tier for a given tokenId.
     */
    function getReputationTier(uint256 tokenId) external view returns (string memory) {
        return _reputationTier[tokenId];
    }

    /**
     * @notice Get comprehensive reputation data for a wallet address.
     */
    function getReputationData(address wallet) external view returns (
        uint256 tokenId,
        bytes32 identitiesRoot,
        bytes32 web2AchievementHash,
        string memory reputationTier
    ) {
        tokenId = walletToTokenId[wallet];
        require(tokenId != 0, "No CARV ID found");
        
        identitiesRoot = _identitiesRoot[tokenId];
        web2AchievementHash = _web2AchievementHash[tokenId];
        reputationTier = _reputationTier[tokenId];
    }

    /**
     * @notice (Optional) Allow the owner to update the identities root for a tokenId.
     */
    function setIdentitiesRoot(uint256 tokenId, bytes32 newRoot) external {
        require(ownerOf(tokenId) == msg.sender, "Not token owner");
        _identitiesRoot[tokenId] = newRoot;
    }

    /**
     * @notice Returns a base64-encoded JSON metadata for the NFT with Web2 achievements.
     */
    function tokenURI(uint256 tokenId) public view override returns (string memory) {
        require(_ownerOf(tokenId) != address(0), "ERC721Metadata: URI query for nonexistent token");
        
        string memory tier = bytes(_reputationTier[tokenId]).length > 0 ? _reputationTier[tokenId] : "Bronze";
        string memory achievementStatus = _web2AchievementHash[tokenId] != 0 ? "Verified" : "Pending";
        
        string memory json = Base64.encode(
            bytes(
                string(
                    abi.encodePacked(
                        '{"name":"CARV ID #', Strings.toString(tokenId), '",',
                        '"description":"Your Modular CARV ID with Web2 Achievement Binding",',
                        '"image":"https://api.dicebear.com/7.x/identicon/svg?seed=', Strings.toString(tokenId), '",',
                        '"attributes":[',
                            '{"trait_type":"Network","value":"BNB Testnet"},',
                            '{"trait_type":"Reputation Tier","value":"', tier, '"},',
                            '{"trait_type":"Web2 Achievements","value":"', achievementStatus, '"},',
                            '{"trait_type":"Identity Type","value":"Modular"},',
                            '{"trait_type":"Standard","value":"ERC-7231"}',
                        ']}'
                    )
                )
            )
        );
        return string(abi.encodePacked("data:application/json;base64,", json));
    }
}