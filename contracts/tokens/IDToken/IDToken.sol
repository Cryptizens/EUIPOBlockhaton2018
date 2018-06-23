pragma solidity ^0.4.23;

import "../ERC721/ERC721Stripped.sol";
/* import "./Endorsable.sol"; */
import "./MetaDatable.sol";

/**
 * @title ERC721 Non-Fungible Token Standard basic interface
 * @dev see https://github.com/ethereum/EIPs/blob/master/EIPS/eip-721.md
 */
contract IDToken is ERC721Stripped, MetaDatable {

  function recordID(uint256 _tokenId, string _name) public {
    super._mint(msg.sender, _tokenId);

    allTokensIndex[_tokenId] = allTokens.length;
    allTokens.push(_tokenId);

    tokenNames[_tokenId] = _name;
  }

}
