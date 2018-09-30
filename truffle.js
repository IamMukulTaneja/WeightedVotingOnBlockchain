// Allows us to use ES6 in our migrations and tests.
require('babel-register')
var HDWalletProvider = require('truffle-hdwallet-provider')
var mnemonic = 'myself cargo live resource scheme moment rare vague promote boring street cement'
module.exports = {
  networks: {
    development: {
      host: '127.0.0.1',
      port: 8545,
      network_id: '*' // Match any network id
    },
    ropsten: {
      provider: function () {
        return new HDWalletProvider(mnemonic, 'https://ropsten.infura.io/bd550fac0e9e4e03ab994aefb68954d9')
      },
      network_id: 3,
      gas: 4700000
    }
  }
}
