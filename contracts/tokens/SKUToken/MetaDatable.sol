pragma solidity ^0.4.23;

contract MetaDatable {
  mapping(uint256 => string) internal tokenBarCodes;
  mapping(uint256 => string) internal tokenDescriptions;
  mapping(string => address) internal tokenOwnersByBarCodes;
  mapping(string => uint256) internal tokensByBarCodes;

  function tokenBarCode(uint256 _tokenId) public view returns (string _barCode) {
    return tokenBarCodes[_tokenId];
  }

  function tokenDescription(uint256 _tokenId) public view returns (string _tokenDescription) {
    return tokenDescriptions[_tokenId];
  }

  function ownerOfByBarCode(string _barCode) public view returns (address _owner) {
    return tokenOwnersByBarCodes[_barCode];
  }

  function tokenByBarCode(string _barCode) public view returns (uint256 _tokenId) {
    return tokensByBarCodes[_barCode];
  }
}
