pragma solidity ^0.4.24;

contract Voting {
  bytes32[] public candidateList;

  uint public totalTokens;
  uint public balanceTokens;
  uint public tokenPrice;

  // what is the voter address?
  // total tokens purchased
  // tokens voted per candidate

  struct voter {
    address voterAddress;
    uint tokensBought;
    uint[] tokensUsedPerCandidate;
  }

  mapping(address => voter) public voterInfo;

  mapping(bytes32 => uint) public votesReceived;

  constructor(uint _totalTokens, uint _tokenPrice, bytes32[] _candidateNames) public {
    totalTokens = _totalTokens;
    balanceTokens = _totalTokens;
    tokenPrice = _tokenPrice;
    candidateList = _candidateNames;
  }

  function buyTokens(uint _quantity) public payable
  {
    require((msg.value >= (tokenPrice * _quantity)) && (_quantity <= balanceTokens));
    voterInfo[msg.sender].voterAddress = msg.sender;
    voterInfo[msg.sender].tokensBought+=_quantity;
    balanceTokens-=_quantity;
  }

  function voteForCandidate(bytes32 candidate, uint tokens) public
  {
    uint availableTokens = voterInfo[msg.sender].tokensBought - totalTokensUsed(voterInfo[msg.sender].tokensUsedPerCandidate);
    require(tokens <= availableTokens, 'You dont have enough tokens');
    votesReceived[candidate] += tokens;
    if(voterInfo[msg.sender].tokensUsedPerCandidate.length==0)
    {
      for(uint i=0;i<candidateList.length;i++)
      {
          voterInfo[msg.sender].tokensUsedPerCandidate.push(0);
      }
    }
    uint index = indexOfCandidate(candidate);
    voterInfo[msg.sender].tokensUsedPerCandidate[index] += tokens;
  }
  function indexOfCandidate(bytes32 _candidate) private view returns(uint)
  {
       for(uint i=0;i<candidateList.length;i++)
       {
         if(_candidate == candidateList[i])
         {
           return i;
         }
       }
       return uint(-1);
  }
  function totalTokensUsed(uint[] _array) private pure returns (uint)
  {
      uint totalSum=0;
      for(uint i=0;i<_array.length;i++)
      {
        totalSum+=_array[i];
      }
      return totalSum;
  }
  function voterDetails(address user) view public returns (uint, uint[]) {
    return (voterInfo[user].tokensBought, voterInfo[user].tokensUsedPerCandidate);
  }

  function tokensSold() public view returns (uint) {
    return totalTokens - balanceTokens;
  }

  function allCandidates() public view returns (bytes32[]) {
    return candidateList;
  }

  function totalVotesFor(bytes32 candidate) public view returns (uint) {
    return votesReceived[candidate];
  }
  //1. Users should be able to purchase tokens
  //2. Users should be able to vote for candidates with tokens
  //3. Anyone should be able to lookup voter info

}
