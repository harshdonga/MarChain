const ChainUtil = require('../chain-util');

class Transaction
{
  constructor()
  {
    this.id = ChainUtil.id();
    this.input = null;
    this.outputs = [];
  }

  static newTransaction(senderWallet , recipient , amount)
  {
    const transaction = new this();

    if(amount > senderWallet.balance)
    {
      console.log(`Amount : ${amount} is exceeding wallet balance`);
      return;
    }

    transaction.outputs.push(...[
      {amount : senderWallet.balance - amount, address: senderWallet.publickey},
      {amount, address : recipient}
    ])

    Transaction.signtransaction(transaction , senderWallet);

    return transaction;
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
