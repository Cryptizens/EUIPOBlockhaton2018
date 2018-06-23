pragma solidity ^0.4.23;

import "../../ownership/Transferrable.sol";
import "../ERC721/ERC721Stripped.sol";
import "./MetaDatable.sol";

contract SKUToken is ERC721Stripped, Transferrable, MetaDatable {

  // Parent IDToken id (proves association with the brand)
  uint256 internal idTokenId_;
  // Origin country of the bundle of SKUs (ISO Alpha-2, like BE, FR...)
  string internal origin_;
  // Destination country of the bundle of SKUs (ISO Alpha-2, like BE, FR...)
  string internal destination_;
  // Can SKUs still be produced? Set to true by default at deployment
  bool internal productionAllowed_ = true;

  constructor (uint256 _idTokenId, string _origin, string _destination) {
    idTokenId_ = _idTokenId;
    origin_ = _origin;
    destination_ = _destination;
  }

  modifier onlyAtProduction() {
    require(productionAllowed_);
    _;
  }

  function getIDTokenId() public view returns (uint256 _tokenId) {
    return idTokenId_;
  }

  function getOrigin() public view returns (string _origin) {
    return origin_;
  }

  function getDestination() public view returns (string _destination) {
    return destination_;
  }

  function productionAllowed() public view returns (bool _productionAllowed) {
    return productionAllowed_;
  }

  function recordSKU(uint256 _skuId, string _barCode, string _description) public onlyProducer onlyAtProduction {
    super._mint(msg.sender, _skuId);

    allTokensIndex[_skuId] = allTokens.length;
    allTokens.push(_skuId);

    tokenBarCodes[_skuId] = _barCode;
    tokenDescriptions[_skuId] = _description;
  }

  function takeOwnership() public {
    super._takeOwnership();
    if (productionAllowed_) {
      productionAllowed_ = false;
    }
  }
}
