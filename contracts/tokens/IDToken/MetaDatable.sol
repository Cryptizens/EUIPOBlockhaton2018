pragma solidity ^0.4.23;

contract MetaDatable {
  mapping(uint256 => string) internal tokenNames;

  function tokenName(uint256 _tokenId) public view returns (string _name);
  function setTokenName(uint256 _tokenId, string _name) returns (bool _success);
}
