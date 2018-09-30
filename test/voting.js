var Voting = artifacts.require('./Voting.sol')


contract('Voting', function (accounts) {

 it('should be able to buy tokens', function () {

  var instance

  var userTokens;

  var tokensSold;

  return Voting.deployed().then(function(i) {

   instance = i;

   return i.buyTokens({value: web3.toWei(1, 'ether')});

  }).then(function() {

   return instance.tokensSold.call();

  }).then(function(balance) {

   tokensSold = balance;

   return instance.voterDetails.call(web3.eth.accounts[0]);

  }).then(function(tokenDetails) {

   userTokens = tokenDetails[0].toNumber();

  });


  assertEqual(tokensSold, 100, "100 tokens were not sold");

  assertEqual(userTokens, 100, "100 tokens were not assigned to user");


 });


 it("should be able to vote for candidate", function() {

  var instance;

  var tokensUsedPerCandidate;

  return Voting.deployed().then(function(i) {

   instance = i;

   return i.buyTokens({value: web3.toWei(1, 'ether')});

  }).then(function() {

   return instance.voteForCandidate('Nick', 25);

  }).then(function() {

   return instance.voterDetails.call(web3.eth.accounts[0]);
  }).then(function(tokenDetails) {

   tokensUsedPerCandidate = tokenDetails[1];
  });


  assertEqual(tokensUsedPerCandidate[1], 25, "25 tokens were not voted for Nick");

 });


});
