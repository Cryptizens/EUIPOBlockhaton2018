pragma solidity ^0.4.23;

contract Endorsable {
  mapping(uint256 => address[]) public endorsments;

  address public EUIPO;

  event Endorsment(
    uint256 _tokenId,
    address indexed _endorser
  );

  function endorse(uint256 _tokenId) public returns (bool _success);
  function endorsedBy(uint256 _tokenId, address _endorser) public view returns (bool _endorsed);

  function getEndorserByIndex(uint256 _tokenId, uint256 _index) public view returns (address _endorser);
  function getEndorsersCount(uint256 _tokenId) public view returns (uint256 _endorsersCount);

  function endorsedByEUIPO(uint256 _tokenId) public returns (bool _success);
}
