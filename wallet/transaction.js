const ChainUtil = require('../chain-util');
const { MINING_REWARD } = require('../config');

class Transaction
{
  constructor()
  {
    this.id = ChainUtil.id();
    this.input = null;
    this.outputs = [];
  }

  update(senderWallet , recipient , amount)
  {
    const senderoutput = this.outputs.find(output => output.address === senderWallet.publickey);

    if(amount > senderoutput.amount)
    {
      console.log(`Amount: ${amount} exceeds balance.`);
      return;
    }
    senderoutput.amount = senderoutput.amount - amount;
    this.outputs.push({amount , address: recipient});
    Transaction.signtransaction(this , senderWallet);

    return this;
  }

  static transactionWithOutputs(senderWallet , outputs)
  {
    const transaction = new this();
    transaction.outputs.push(...outputs);
    Transaction.signtransaction(transaction , senderWallet);
    return transaction;
  }

  static newTransaction(senderWallet , recipient , amount)
  {
    const transaction = new this();

    if(amount > senderWallet.balance)
    {
      console.log(`Amount : ${amount} is exceeding wallet balance`);
      return;
    }

    return Transaction.transactionWithOutputs(senderWallet ,[
      {amount : senderWallet.balance - amount, address: senderWallet.publickey},
      {amount, address : recipient}
    ]);
  }

  static rewardTransaction(minerWallet , blockchainWallet)
  {
    return Transaction.transactionWithOutputs(blockchainWallet , [{
      amount:MINING_REWARD , address: minerWallet.publickey
    }]);
  }
  static signtransaction(transaction, senderWallet)
   {
     transaction.input = {
       timestamp : Date.now(),
       amount : senderWallet.balance,
       address : senderWallet.publickey,
       signature : senderWallet.sign(ChainUtil.hash(transaction.outputs))
     }
   }

   static verifytransaction(transaction)
   {
     return ChainUtil.verifysignature(
       transaction.input.address,
       transaction.input.signature,
       ChainUtil.hash(transaction.outputs)
     );
   }
}

module.exports = Transaction;
