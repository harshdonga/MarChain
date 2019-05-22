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

  createTransaction(recipient , amount,blockchain , transactionPool)
  {
    this.balance = this.calculatebalance(blockchain);

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

  calculatebalance(blockchain)
  {
    let balance = this.balance;
    let transactions = [];
    blockchain.chain.forEach(block => block.data.forEach(transaction => {
      transactions.push(transaction);
    }));

    const walletInputTs = transactions
      .filter(transaction => transaction.input.address === this.publickey);

    let startTime = 0;

    if(walletInputTs.length > 0)
    {
      const recentInputs = walletInputTs.reduce(
      (prev, current) => prev.input.timestamp > current.input.timestamp ? prev : current
      );

    balance = recentInputs.outputs.find(output => output.address === this.publickey).amount;
    startTime = recentInputs.input.timestamp;
    }

    transactions.forEach(transaction => {
      if(transaction.input.timestamp > startTime)
      {
        transaction.outputs.find(output => {
          if(output.address === this.publickey)
          {
            balance += output.amount;
          }
        });
      }
    });

    return balance;
  }

  static blockchainWallet()
  {
    const blockchainWallet = new this();
    blockchainWallet.address = 'blockchain-wallet';
    return blockchainWallet;
  }
}

module.exports = Wallet;
