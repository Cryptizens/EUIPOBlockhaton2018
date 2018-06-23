pragma solidity ^0.4.23;

contract MetaDatable {
  mapping(uint256 => string) internal tokenNames;
  mapping(string => address) internal nameOwners;

  function tokenName(uint256 _tokenId) public view returns (string _name) {
    return tokenNames[_tokenId];
  }

  function nameOwner(string _name) public view returns (address owner) {
    return nameOwners[_name];
  }
}
