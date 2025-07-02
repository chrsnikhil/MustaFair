// SPDX-License-Identifier: CC0-1.0
pragma solidity ^0.8.17;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract ModularCarvID is ERC721, Ownable {
    // Mapping from tokenId to identities root hash
    mapping(uint256 => bytes32) private _identitiesRoot;
    // Mapping from wallet address to tokenId (1:1 mapping)
    mapping(address => uint256) public walletToTokenId;

    event CarvIdMinted(address indexed user, uint256 indexed tokenId, bytes32 identitiesRoot);

    constructor() ERC721("Modular CARV ID", "CARVID") Ownable(msg.sender) {}

    /**
     * @notice Mint a new CARV ID NFT, binding the user's identity hash.
     * @param identitiesRoot The hash of the user's aggregated identities (Web2 + Web3)
     */
    function mintCarvId(bytes32 identitiesRoot) external {
        require(walletToTokenId[msg.sender] == 0, "Already minted");
        uint256 tokenId = uint256(keccak256(abi.encodePacked(msg.sender, block.timestamp)));
        _safeMint(msg.sender, tokenId);
        _identitiesRoot[tokenId] = identitiesRoot;
        walletToTokenId[msg.sender] = tokenId;
        emit CarvIdMinted(msg.sender, tokenId, identitiesRoot);
    }

    /**
     * @notice Get the identities root for a given tokenId.
     */
    function getIdentitiesRoot(uint256 tokenId) external view returns (bytes32) {
        return _identitiesRoot[tokenId];
    }

    /**
     * @notice (Optional) Allow the owner to update the identities root for a tokenId.
     */
    function setIdentitiesRoot(uint256 tokenId, bytes32 newRoot) external {
        require(ownerOf(tokenId) == msg.sender, "Not token owner");
        _identitiesRoot[tokenId] = newRoot;
    }
}