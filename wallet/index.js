const { INITIAL_BALANCE } = require('../config')
const ChainUtil = require('../chain-util')
class Wallet
{
  constructor()
  {
    this.balance = INITIAL_BALANCE;
    this.keypair = ChainUtil.genKeyPair() ;
    this.publickey = this.keypair.getPublic().encode('hex');
  }

  toString()
  {
    return `Wallet-
    Publickey : ${this.publickey.toString()}
    Balance   : ${this.balance}`
  }
}

module.exports = Wallet;
