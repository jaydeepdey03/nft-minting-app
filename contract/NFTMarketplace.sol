// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

//import openzeppelin
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract NFTMarketplace is ERC721URIStorage {
    address payable owner;
    using Counters for Counters.Counter;

    Counters.Counter private _tokenIds;
    Counters.Counter private _itemSold;

    uint256 listPrice = 0.001 ether;

    constructor() ERC721("NFTMarketplace", "NFTM") {
        owner = payable(msg.sender);
    }

    // NFT Structure

    struct ListedToken {
        uint256 tokenId;
        address payable owner;
        address payable seller;
        uint256 price;
        bool currentlyListed;
    }

    mapping(uint256 => ListedToken) private idToToken;

    event TokenListedSuccess(
        uint256 indexed tokenId,
        address owner,
        address seller,
        uint256 price,
        bool currentlyListed
    );

    // helper function

    function updatePrice(uint256 _listprice) public payable {
        require(owner == msg.sender, "Only Owner can update price");
        listPrice = _listprice;
    }

    function getListPrice() public view returns (uint256) {
        return listPrice;
    }

    function getLatestIdtoListedToken()
        public
        view
        returns (ListedToken memory)
    {
        uint256 currentToken = _tokenIds.current();
        return idToToken[currentToken];
    }

    function getListedforTokenId(uint256 tokenId)
        public
        view
        returns (ListedToken memory)
    {
        return idToToken[tokenId];
    }

    function getCurrentToken() public view returns (uint256) {
        return _tokenIds.current();
    }

    // important function

    function createToken(string memory _tokenURI, uint256 price)
        public
        payable
        returns (uint256)
    {
        require(msg.value == listPrice, "Insufficient Listing Price");
        require(price > 0, "Negative Price not valid");
        _tokenIds.increment();
        uint256 currentTokenId = _tokenIds.current();
        _safeMint(msg.sender, currentTokenId);
        _setTokenURI(currentTokenId, _tokenURI);

        createListedToken(currentTokenId, price);

        return currentTokenId;
    }

    function createListedToken(uint256 _tokenId, uint256 price) private {
        idToToken[_tokenId] = ListedToken(
            _tokenId,
            payable(address(this)),
            payable(msg.sender),
            price,
            true
        );

        _transfer(msg.sender, address(this), _tokenId);

        emit TokenListedSuccess(
            _tokenId,
            address(this),
            msg.sender,
            price,
            true
        );
    }

    function getAllNFTs() public view returns (ListedToken[] memory) {
        uint256 nftCount = _tokenIds.current();
        ListedToken[] memory tokens = new ListedToken[](nftCount);
        uint256 currentIndex = 0;

        for (uint256 i = 0; i < nftCount; i++) {
            uint256 currentId = i + 1;
            ListedToken storage currentItem = idToToken[currentId];
            tokens[currentIndex] = currentItem;
            currentIndex += 1;
        }

        return tokens;
    }

    function getMyNFT() public view returns (ListedToken[] memory) {
        uint256 nftCount = _tokenIds.current();
        uint256 totalMyNFT = 0;
        uint256 currentIndex = 0;

        // loop to get number of my NFTs
        for (uint256 i = 0; i < nftCount; i++) {
            if (
                idToToken[i + 1].owner == msg.sender ||
                idToToken[i + 1].seller == msg.sender
            ) {
                totalMyNFT += 1;
            }
        }

        ListedToken[] memory nfts = new ListedToken[](totalMyNFT);
        for (uint256 i = 0; i < nftCount; i++) {
            if (
                idToToken[i + 1].owner == msg.sender ||
                idToToken[i + 1].seller == msg.sender
            ) {
                uint256 currentId = i + 1;
                ListedToken storage currentItem = idToToken[currentId];
                nfts[currentIndex] = currentItem;
                currentIndex += 1;
            }
        }

        return nfts;
    }

    function executeSales(uint256 tokenId) public payable {
        uint256 price = idToToken[tokenId].price;
        require(msg.value == price, "Please submit the asking price");

        address seller = idToToken[tokenId].seller;

        idToToken[tokenId].currentlyListed = true;
        idToToken[tokenId].seller = payable(msg.sender);
        _itemSold.increment();

        _transfer(address(this), msg.sender, tokenId);

        approve(address(this), tokenId); // give approval to this contract to execute sale even when the       ownership is not with contract

        payable(owner).transfer(listPrice);
        payable(seller).transfer(msg.value);
    }
}
