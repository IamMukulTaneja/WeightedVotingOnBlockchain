pragma solidity ^0.4.24;

import "truffle/DeployedAddresses.sol";
import "truffle/Assert.sol";
import "../contracts/Voting.sol";

contract TestVoting
{
  //Test to make sure 10000 tokens were initalized
  //Test to buy tokens
   uint public initialBalance = 2 ether;
  function testInitialTokenBalance() public {
    Voting voting = Voting(DeployedAddresses.Voting());

    Assert.equal(voting.balanceTokens(),10000,"Tokens were not initialized");
  }

  function testBuyTokens() public {

  Voting voting = Voting(DeployedAddresses.Voting());

  voting.buyTokens.value(1 ether)();

  Assert.equal(voting.balanceTokens(), 9900, "9900 is not the balance");

 }

  }
