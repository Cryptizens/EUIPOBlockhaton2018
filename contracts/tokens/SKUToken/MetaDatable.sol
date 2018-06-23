pragma solidity ^0.4.23;

contract MetaDatable {
  mapping(uint256 => string) internal tokenBarCodes;

  function tokenBarCode(uint256 _tokenId) public view returns (string _barCode) {
    return tokenBarCodes[_tokenId];
  }
}
