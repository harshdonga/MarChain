const { INITIAL_BALANCE } = require('../config');
const ChainUtil = require('../chain-util');
const Transaction = require('./transaction');
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

  sign(datahash)
  {
    return this.keypair.sign(datahash);
  }

  createTransaction(recipient , amount , transactionPool)
  {
    if(amount > this.balance)
    {
      console.log(`Amount : ${amount} exceeds current balance : ${this.balance}`);
      return;
    }
    let transaction = transactionPool.existingTransaction(this.publickey);

    if(transaction)
    {
      transaction.update(this , recipient , amount);
    }
    else
    {
      transaction = Transaction.newTransaction(this, recipient , amount);
      transactionPool.updateOrAddTransaction(transaction);
    }

    return transaction;
  }
}

module.exports = Wallet;
