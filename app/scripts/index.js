// Import the page's CSS. Webpack will know what to do with it.
import '../styles/app.css'

// Import libraries we need.
import { default as Web3 } from 'web3'
import { default as contract } from 'truffle-contract'

// Import our contract artifacts and turn them into usable abstractions.
import votingArtifact from '../../build/contracts/Voting.json'

// MetaCoin is our usable abstraction, which we'll use through the code below.
const Voting = contract(votingArtifact)

// The following code is simple to show off interacting with your contracts.
// As your needs grow you will likely need to change its form and structure.
// For application bootstrapping, check out window.addEventListener below.
// let accounts
// let account
var candidates = {}
var tokenPrice = null
const App = {
  start: function () {
    const self = this

    // Bootstrap the MetaCoin abstraction for Use.
    Voting.setProvider(web3.currentProvider)

    // Get the initial account balance so it can be displayed.
    web3.eth.getAccounts(function (err, accs) {
      if (err != null) {
        alert('There was an error fetching your accounts.')
        return
      }

      if (accs.length === 0) {
        alert("Couldn't get any accounts! Make sure your Ethereum client is configured correctly.")
        return
      }

      // accounts = accs
      // account = accounts[0]
    })
    self.populateCandidates()
    self.populateTokenData()
  },
  buyTokens: function () {
    var self = this
    let tokensToBuy = $('#buy').val()
    let price = tokensToBuy * tokenPrice
    $('#buy-msg').html('Purchase order has been submitted. Please wait.')
    Voting.deployed().then(function (contractInstance) {
      contractInstance.buyTokens({ value: web3.toWei(price, 'ether'), from: web3.eth.accounts[0] }).then(function (v) {
        $('#buy-msg').html('')
      })
      self.populateTokenData()
    })
  },
  voteForCandidate: function() {
  let candidateName = $("#candidate").val();
  let voteTokens = $("#vote-tokens").val();
  $("#msg").html("Vote has been submitted. The vote count will increment as soon as the vote is recorded on the blockchain. Please wait.")
  $("#candidate").val("");
  $("#vote-tokens").val("");

  Voting.deployed().then(function(contractInstance) {
   contractInstance.voteForCandidate(candidateName, voteTokens, {gas: 140000, from: web3.eth.accounts[0]}).then(function() {
   let div_id = candidates[candidateName];
   return contractInstance.totalVotesFor.call(candidateName).then(function(v) {
    $("#" + div_id).html(v.toString());
    $("#msg").html("");
   });
   });
  });
},
lookupVoterInfo: function() {
  var address = $('#voter-info').val()
  Voting.deployed().then(function (contractInstance) {
    contractInstance.voterDetails.call(address).then(function(result) {
      $('#tokens-bought').html('Tokens bought : '+ result[0].toNumber())
      $('#votes-cast').html('Votes Cast : '+ "candidate-1 : "+result[1][0]+"candidate-2 : "+result[1][1]+"candidate-3 : "+result[1][2])
    })
  })
},
  populateCandidates: function () {
    const self = this
    Voting.deployed().then(function (i) {
      i.allCandidates.call().then(function (candidateArray) {
        for (let i = 0; i < candidateArray.length; i++) {
          candidates[web3.toUtf8(candidateArray[i])] = 'candidate-' + i
        }
        self.setupCandidateRows()
        self.populateCandidateVotes()
      })
    })
  },
  setupCandidateRows: function () {
    Object.keys(candidates).forEach(function (candidate) {
      $('#candidate-rows').append('<tr><td>' + candidate + "</td><td id='" + candidates[candidate] + "'></td></tr>")
    })
  },
  populateCandidateVotes: function () {
    Object.getOwnPropertyNames(candidates).forEach(function (candidate) {
      Voting.deployed().then(function (contractInstance) {
        contractInstance.totalVotesFor.call(candidate).then(function (v) {
          $('#' + candidates[candidate]).html(v.toString())
        })
      })
    })
  },

  populateTokenData: function () {
    Voting.deployed().then(function (contractInstance) {
      contractInstance.totalTokens.call().then(function (v) {
        $('#tokens-total').html(v.toString())
      })
      contractInstance.tokensSold.call().then(function (v) {
        $('#tokens-sold').html(v.toString())
      })
      contractInstance.tokenPrice.call().then(function (v) {
        tokenPrice = parseFloat(web3.fromWei(v.toString()))
        $('#token-cost').html(tokenPrice + ' Ether')
      })
      web3.eth.getBalance(contractInstance.address, function (error, result) {
        if (error) {
          console.log(error)
        } else {
          $('#contract-balance').html(web3.fromWei(result.toString()) + ' Ether')
        }
      })
    })
  }
}
window.App = App

window.addEventListener('load', function () {
  // Checking if Web3 has been injected by the browser (Mist/MetaMask)
  if (typeof web3 !== 'undefined') {
    console.warn(
      'Using web3 detected from external source.' +
      ' If you find that your accounts don\'t appear or you have 0 MetaCoin,' +
      ' ensure you\'ve configured that source properly.' +
      ' If using MetaMask, see the following link.' +
      ' Feel free to delete this warning. :)' +
      ' http://truffleframework.com/tutorials/truffle-and-metamask'
    )
    // Use Mist/MetaMask's provider
    window.web3 = new Web3(web3.currentProvider)
  } else {
    console.warn(
      'No web3 detected. Falling back to http://127.0.0.1:8545.' +
      ' You should remove this fallback when you deploy live, as it\'s inherently insecure.' +
      ' Consider switching to Metamask for development.' +
      ' More info here: http://truffleframework.com/tutorials/truffle-and-metamask'
    )
    // fallback - use your fallback strategy (local node / hosted node + in-dapp id mgmt / fail)
    window.web3 = new Web3(new Web3.providers.HttpProvider('http://127.0.0.1:8545'))
  }

  App.start()
})
