// SPDX-License-Identifier: MIT
pragma solidity 0.8.17;

import "./interfaces/IMedusa.sol";

contract CureDao {
    address private constant TREASURY = 0xC3A3362DC30588a027767063459dC533Dc4A421a;
    address private constant MEDUSA = 0xDbf5B82C9b3Cd8291878b4d355368ab6e32b9A14;

    mapping(address => bool) private whitelistedAddresses;

    modifier isWhitelisted() {
        require(whitelistedAddresses[msg.sender], "CureDao: Address not whitelisted");
        _;
    }

    constructor() {
        whitelistedAddresses[msg.sender] = true;
    }

    function addData(
        uint256[] memory cipher,
        string memory name,
        string memory description,
        uint256 price,
        string memory uri
    ) external isWhitelisted {
        IMedusa(MEDUSA).createListing(cipher, name, description, price, uri);
    }

    function buyData(uint256 cipherId, uint256[] memory buyerPublicKey) external {
        IMedusa(MEDUSA).buyListing(cipherId, buyerPublicKey);
    }

    function withdrawPayments() external {
        IMedusa(MEDUSA).withdrawPayments(TREASURY);
    }

    function addWhitelistAddress(address newAddress) external isWhitelisted {
        whitelistedAddresses[newAddress] = true;
    }

    function getIsWhiteListed(address _address) external view returns (bool _isWhitelisted) {
        _isWhitelisted = whitelistedAddresses[_address];
    }

    function getListing(uint256 cipherId)
        external
        view
        returns (
            address seller,
            uint256 price,
            string memory uri
        )
    {
        return IMedusa(MEDUSA).listings(cipherId);
    }

    receive() external payable {}
}
