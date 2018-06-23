pragma solidity ^0.4.23;

import "./Ownable.sol";

/**
 * @title Transferrable
 * @dev Extend Ownable interface so that there is a real handshake process in
 * in the ownership transfer:
 * - The owner approves a new address to become the new owner
 * - The new address takes ownership
 * This thus explicitly requires an action from the new owner, whereas in Ownable
 * one can unilaterally force any address to become an owner
 */
contract Transferrable is Ownable {
  address public producer;
  address public candidateOwner;

  event OwnershipProposed(
    address indexed currentOwner,
    address indexed candidateOwner
  );

  // Record who the producer is at the time the contract is created. There is
  // no way to alter this afterwards.
  constructor() public {
    producer = msg.sender;
  }

  // Let only the producer execute functions. Used typically for the minting
  // of SKUTokens.
  modifier onlyProducer() {
    require(msg.sender == producer);
    _;
  }

  function proposeOwnership (address _candidateOwner) public onlyOwner {
    candidateOwner = _candidateOwner;
    emit OwnershipTransferred(owner, _candidateOwner);
  }

  function revokeOwnershipProposition() public onlyOwner {
    candidateOwner = address(0);
  }

  function _takeOwnership() internal {
    require(msg.sender == candidateOwner);
    owner = msg.sender;
    emit OwnershipTransferred(owner, msg.sender);
  }
}
