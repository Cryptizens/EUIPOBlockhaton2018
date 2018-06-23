pragma solidity ^0.4.23;

contract MetaDatable {
  mapping(uint256 => string) internal tokenNames;

  function tokenName(uint256 _tokenId) public view returns (string _name) {
    return tokenNames[_tokenId];
  }
}
