pragma solidity ^0.4.23;

import "../../math/SafeMath.sol";

contract ERC721Stripped {
  using SafeMath for uint256;

  uint256[] internal allTokens;

  // Mapping from token id to position in the allTokens array
  mapping (uint256 => uint256) internal allTokensIndex;
  mapping (uint256 => address) internal tokenOwner;
  mapping (address => uint256) internal ownedTokensCount;

  event Transfer(
    address indexed _from,
    address indexed _to,
    uint256 _tokenId
  );

  function totalSupply() public view returns (uint256 _supply) {
    return allTokens.length;
  }

  function ownerOf(uint256 _tokenId) public view returns (address _owner) {
    return tokenOwner[_tokenId];
  }

  function exists(uint256 _tokenId) public view returns (bool _exists) {
    return (ownerOf(_tokenId) != address(0));
  }

  function _mint(address _to, uint256 _tokenId) internal {
    require(_to != address(0));
    addTokenTo(_to, _tokenId);
    emit Transfer(address(0), _to, _tokenId);
  }

  function addTokenTo(address _to, uint256 _tokenId) internal {
    require(tokenOwner[_tokenId] == address(0));
    tokenOwner[_tokenId] = _to;
    ownedTokensCount[_to] = ownedTokensCount[_to].add(1);
  }
}
