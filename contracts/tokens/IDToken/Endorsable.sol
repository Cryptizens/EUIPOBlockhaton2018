 pragma solidity ^0.4.23;

 contract Endorsable {
   mapping(uint256 => address[]) public endorsmentsForCount;
   mapping(uint256 => mapping(address=>bool)) public endorsments;

   event Endorsment(uint256 _tokenId,address indexed _endorser);

   address public EUIPO;

   function endorsedBy(uint256 _tokenId, address _endorser) public view returns (bool _endorsed){
     return endorsments[_tokenId][_endorser];
   }

   function getEndorserByIndex(uint256 _tokenId, uint256 _index) public view returns (address _endorser){
     require(_index>=endorsmentsForCount[_tokenId].length-1);
       return endorsmentsForCount[_tokenId][_index];
   }
   function getEndorsersCount(uint256 _tokenId) public view returns (uint256 _endorsersCount){
     return endorsmentsForCount[_tokenId].length;
   }

   function endorsedByEUIPO(uint256 _tokenId) public view returns (bool _success)
   {
     return endorsments[_tokenId][EUIPO];
   }

   function endorse(uint256 _tokenId) public {
     require(!endorsedBy(_tokenId,msg.sender));
     endorsments[_tokenId][msg.sender] = true;
     endorsmentsForCount[_tokenId].push(msg.sender);
     emit Endorsment(_tokenId,msg.sender);
   }
 }
