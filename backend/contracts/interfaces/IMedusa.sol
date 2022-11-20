// SPDX-License-Identifier: MIT
pragma solidity 0.8.17;

 interface IMedusa{
  function buyListing (uint256 cipherId, uint256[] memory buyerPublicKey ) external returns ( uint256 );
  function createListing (uint256[] memory  cipher, string memory name, string memory description, uint256 price, string memory uri ) external returns ( uint256 );
  function listings ( uint256 ) external view returns ( address seller, uint256 price, string  memory uri );
  function oracle () external view returns (address );
  function oracleResult (uint256 requestId,  uint256[] memory  cipher ) external;
  function payments (address dest ) external view returns ( uint256 );
  function publicKey () external view returns (  uint256[] memory  );
  function withdrawPayments ( address payee ) external;
}
